<script lang="ts">
	import { LEVELS } from '$lib/constants';
	import { getSurroundingCoordinates, mod } from '$lib/utils';
	import { board, time, boardState, flags, difficulty, gameState } from '$stores/board';
	import { coins } from '$stores/shop';
	import { tick } from 'svelte';

	$: BOARD_WIDTH = LEVELS[$difficulty].width;
	$: BOARD_HEIGHT = LEVELS[$difficulty].height;
	$: BOMBS = LEVELS[$difficulty].bombs;

	const initGame = async () => {
		await tick();
		if ($gameState == 'INITIALIZING') $gameState = 'NOT STARTED';
	};

	const checkWinCondition = () => {
		const flatBoard = $board.flatMap((row) => row);
		const flatFlags = $flags.toString().split(',');

		const isWin = flatBoard.every((cell, i) => (cell == '💣' ? parseInt(flatFlags[i]) : true));
		if (isWin) {
			$gameState = 'WON';
			$coins += BOMBS;
			if ($time < 60) $coins += 5;
			else if ($time < 60 * 2) $coins += 3;
			else if ($time < 60 * 3) $coins += 1;
		}
	};

	const checkLostCondition = (x: number, y: number) => {
		const isLost = $board[y][x] == '💣';
		if (isLost) {
			$gameState = 'LOST';

			// reveal all bombs
			let correctFlags = 0;
			const flatBoard = $board.flatMap((row) => row);
			flatBoard.forEach((cell, i) => {
				if (cell == '💣') {
					const [x, y] = [mod(i, BOARD_HEIGHT), Math.floor(i / BOARD_HEIGHT)];
					$boardState[y][x] = 1;
					if ($flags[y][x]) correctFlags += 1;
				}
			});

			// reward coins if flags not abused
			const flatFlags = $flags.toString().split(',');
			const isEligible =
				flatFlags.reduce((count, current) => (current == '1' ? count + 1 : count), 0) <= BOMBS + 1;
			if (isEligible) $coins += correctFlags;
		}
	};

	const openZero = (x_: number, y_: number) => {
		const surroundingCoordinates = getSurroundingCoordinates(x_, y_);
		for (const coord of Object.values(surroundingCoordinates)) {
			const [y, x] = coord;
			if (
				!coord.some((z) => z < 0) &&
				coord[0] < BOARD_HEIGHT &&
				coord[1] < BOARD_WIDTH &&
				!$boardState[y][x]
			) {
				$boardState[y][x] = 1;
				if ($board[y][x] == 0) openZero(x, y);
			}
		}
	};

	initGame();
</script>

<div
	class="grid w-full gap-0.5 py-4 mx-auto md:w-max"
	style:grid-template-columns="repeat({BOARD_HEIGHT}, minmax(0, 1fr))"
	style:grid-template-rows="repeat({BOARD_WIDTH}, minmax(0, 1fr))"
>
	{#if $gameState == 'INITIALIZING'}
		<span class="loading loading-spinner loading-xs"></span>
	{:else if $gameState == 'NOT STARTED'}
		{#each Array(BOARD_HEIGHT * BOARD_WIDTH) as _}
			<div class="w-full rounded-md aspect-square md:w-10 lg:w-8 bg-base-300"></div>
		{/each}
	{:else}
		{#each $board as row, y}
			{#each row as cell, x}
				<button
					class="w-full aspect-square swap place-content-stretch swap-flip md:w-max"
					class:swap-active={!!$boardState[y][x] || $flags[y][x]}
					on:contextmenu={(e) => e.preventDefault()}
					on:mousedown={(event) => {
						if ($gameState !== 'COOKING') return;
						if (event.button == 0) {
							// left click
							if (!$boardState[y][x]) {
								$boardState[y][x] = 1;
								$flags[y][x] = 0;
							}
							if ($board[y][x] == 0) openZero(x, y);
							checkLostCondition(x, y);
						} else if (event.button == 2) {
							// right click
							if ($flags[y][x]) $flags[y][x] = 0;
							else if (!$boardState[y][x] && !$flags[y][x]) $flags[y][x] = 1;
						}
						checkWinCondition();
					}}
				>
					<div
						class="grid w-full h-full text-lg font-bold rounded-md aspect-square md:w-10 lg:w-8 swap-on place-items-center"
						class:unopened={!$boardState[y][x]}
						class:opened={$boardState[y][x]}
						class:flag={$flags[y][x]}
						class:bomb={$board[y][x] == '💣' && $boardState[y][x]}
						class:text-blue-500={cell == 1}
						class:text-emerald-500={cell == 2}
						class:text-rose-500={cell == 3}
						class:text-indigo-500={cell == 4}
						class:text-rose-700={cell == 5}
						class:text-teal-600={cell == 6}
						class:text-violet-600={cell == 7}
						class:text-lime-600={cell == 8}
					>
						{#if $flags[y][x] && $board[y][x] !== '💣' && $gameState == 'LOST'}
							❌
						{:else if $boardState[y][x]}
							{cell ? cell : ''}
						{:else if $flags[y][x]}
							🚩
						{/if}
					</div>
					<div class="rounded-md aspect-square md:w-10 lg:w-8 swap-off bg-base-300"></div>
				</button>
			{/each}
		{/each}
	{/if}
</div>

<style lang="postcss">
	.unopened {
		@apply bg-base-300;
	}
	.opened {
		@apply bg-neutral;
	}
	.bomb {
		@apply bg-error/60;
	}
	.flag {
		@apply bg-warning/40;
	}
</style>
