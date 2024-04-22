<script lang="ts">
	import { LEVELS } from '$lib/constants';
	import { board, boardState, flags, difficulty, gameState } from '$stores/board';
	import { tick } from 'svelte';
	import { checkLostCondition, checkWinCondition, openZero } from './Board';

	$: BOARD_WIDTH = LEVELS[$difficulty].width;
	$: BOARD_HEIGHT = LEVELS[$difficulty].height;

	export let isThumbnail: boolean = false;

	const initGame = async () => {
		await tick();
		if ($gameState == 'INITIALIZING') $gameState = 'NOT STARTED';
	};

	initGame();
</script>

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
				class="w-full aspect-square swap place-content-stretch s wap-flip md:w-max"
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
					class="grid w-full h-full font-bold aspect-square md:w-10 lg:w-8 swap-on place-items-center {isThumbnail
						? 'rounded text-xs'
						: 'rounded-md text-lg'}"
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
				<div
					class="aspect-square md:w-10 lg:w-8 swap-off {isThumbnail
						? 'bg-neutral/50'
						: 'bg-base-300 rounded-md '}"
				></div>
			</button>
		{/each}
	{/each}
{/if}

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
