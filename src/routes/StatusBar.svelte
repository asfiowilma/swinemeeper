<script lang="ts">
	import { LEVELS } from '$lib/constants';
	import { capitalize } from '$lib/utils';
	import { difficulty, flags, gameState } from '$stores/board';
	import { ChevronDown, Lock, Play, RefreshCcw } from 'lucide-svelte';
	import Timer from './Timer.svelte';
	import { shopOpen, shopState } from '$stores/shop';
	import { resetGame, startGame } from './Board';

	$: BOMBS = LEVELS[$difficulty].bombs;

	const selectDifficulty = (selected: string) => {
		if ($shopState[selected]) {
			$difficulty = selected as Difficulty;
			resetGame();
		} else {
			$shopOpen = true;
		}
	};
</script>

<div
	class="flex flex-col items-center w-full gap-2 p-2 mx-auto mb-2 rounded-lg sm:w-max sm:flex-row bg-base-300"
>
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
	<div
		class="grid w-full gap-2 sm:w-max place-items-center"
		class:grid-cols-2={$gameState === 'NOT STARTED'}
		class:grid-cols-3={$gameState !== 'NOT STARTED'}
	>
		<div>
			💣 {$flags.flatMap((row) => row).reduce((flagCount, flag) => flagCount + flag, 0)}/<span
				class="font-bold">{BOMBS}</span
			>
		</div>
		{#if $gameState !== 'NOT STARTED'}
			<button class="btn btn-sm btn-neutral w-full" on:click={resetGame}
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
