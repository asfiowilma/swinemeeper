<script lang="ts">
	import { LEVELS } from '$lib/constants';
	import { capitalize, create2dArray, getSurroundingCoordinates } from '$lib/utils';
	import { board, difficulty, boardState, flags, gameState, time } from '$stores/board';
	import { ChevronDown, Lock, Play, RefreshCcw } from 'lucide-svelte';
	import Timer from './Timer.svelte';
	import { shopOpen, shopState } from '$stores/shop';

	$: BOARD_WIDTH = LEVELS[$difficulty].width;
	$: BOARD_HEIGHT = LEVELS[$difficulty].height;
	$: BOMBS = LEVELS[$difficulty].bombs;

	const generateBoard = () => {
		let bombs = BOMBS;
		const TOTAL_CELLS = BOARD_WIDTH * BOARD_HEIGHT;

		$board = create2dArray(BOARD_WIDTH, BOARD_HEIGHT);
		$boardState = create2dArray(BOARD_WIDTH, BOARD_HEIGHT);
		$flags = create2dArray(BOARD_WIDTH, BOARD_HEIGHT);

		// init everything with 0
		for (let index = 0; index < BOARD_HEIGHT; index++) $board[index].fill(0);

		// populate
		for (let index = 0; index < BOARD_HEIGHT; index++) {
			const row = $board[index];

			for (let cell = 0; cell < BOARD_WIDTH; cell++) {
				if (bombs == 0) {
					continue;
				}

				const odds = bombs / (TOTAL_CELLS - (index * BOARD_HEIGHT + cell + 1));
				const isBomb = Math.random() < odds;

				if (bombs > 0 && isBomb) {
					bombs -= 1;
					row[cell] = '💣';

					const surroundingCoordinates = getSurroundingCoordinates(cell, index);
					for (const coord of Object.values(surroundingCoordinates)) {
						const [y, x] = coord;
						if (
							!coord.some((x) => x < 0) &&
							y < BOARD_HEIGHT &&
							x < BOARD_WIDTH &&
							$board[y][x] != '💣'
						) {
							$board[y][x] = ($board[y][x] as number) + 1;
						}
					}
				}
			}
		}
	};

	const startGame = () => {
		$time = 0;
		$gameState = 'COOKING';
		generateBoard();
	};

	const resetGame = () => {
		$gameState = 'NOT STARTED';
	};

	const selectDifficulty = (selected: string) => {
		if ($shopState[selected]) {
			$difficulty = selected as Difficulty;
			resetGame();
		} else {
			$shopOpen = true;
		}
	};
</script>

<div class="flex items-center gap-4 p-2 mx-auto rounded-lg bg-base-300 w-max">
	<div class="dropdown">
		<div tabIndex={0} role="button" class="m-1 btn btn-sm btn-neutral">
			Difficulty: {capitalize($difficulty)}
			<ChevronDown />
		</div>
		<ul tabIndex={0} class="p-2 shadow menu dropdown-content z-[1] bg-base-200 rounded-box w-64">
			{#each Object.keys(LEVELS) as level}
				<li class:disabled={!$shopState[level]}>
					<a href="?" role="button" on:click={() => selectDifficulty(level)} class="flex">
						{#if !$shopState[level]}
							<Lock size={16} />
						{/if}
						<div class="grow">{capitalize(level)}</div>
						<span>{LEVELS[level].width}x{LEVELS[level].height} 💣{LEVELS[level].bombs}</span></a
					>
				</li>
			{/each}
		</ul>
	</div>
	<div>
		💣 {$flags.flatMap((row) => row).reduce((flagCount, flag) => flagCount + flag, 0)}/<span
			class="font-bold">{BOMBS}</span
		>
	</div>
	<div class="flex gap-2">
		{#if $gameState !== 'NOT STARTED'}
			<button class="btn btn-sm btn-neutral" on:click={resetGame}
				><RefreshCcw size={16} /> Reset</button
			>
		{/if}
		{#if $gameState == 'NOT STARTED'}
			<button on:click={startGame} class="btn btn-sm btn-primary">
				<Play size={16} />
				Start
			</button>
		{:else}
			<Timer />
		{/if}
	</div>
</div>
