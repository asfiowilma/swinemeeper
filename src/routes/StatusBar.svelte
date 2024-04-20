<script lang="ts">
	import { LEVELS } from '$lib/constants';
	import { capitalize, create2dArray, getSurroundingCoordinates } from '$lib/utils';
	import { board, difficulty, boardState, flags, gameState, time } from '$stores/board';
	import { ChevronDown, Lock, Play, RefreshCcw } from 'lucide-svelte';
	import Timer from './Timer.svelte';

	const BOARD_WIDTH = LEVELS[$difficulty].width;
	const BOARD_HEIGHT = LEVELS[$difficulty].height;
	const BOMBS = LEVELS[$difficulty].bombs;

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
</script>

<div class="flex items-center gap-4 p-2 mx-auto rounded-lg bg-base-300 w-max">
	<details class="dropdown">
		<summary class="m-1 btn btn-sm btn-neutral"
			>Difficulty: {capitalize($difficulty)} <ChevronDown /></summary
		>
		<ul class="p-2 shadow menu dropdown-content z-[1] bg-base-200 rounded-box w-52">
			<li><span>Beginner</span></li>
			<li>
				<span class="bg-base-300 hover:bg-base-300 text-neutral-content/50"
					><Lock size={16} /> Intermediate</span
				>
			</li>
			<li>
				<span class="bg-base-300 hover:bg-base-300 text-neutral-content/50"
					><Lock size={16} /> Expert</span
				>
			</li>
		</ul>
	</details>
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
			<!-- {:else if $gameState == 'WON' || $gameState == 'LOST'}
			<button on:click={startGame} class="btn btn-sm btn-primary">
				<Play size={16} />
				Restart
			</button> -->
		{:else}
			<Timer />
		{/if}
	</div>
</div>
