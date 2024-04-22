<script lang="ts">
	import { gameState, paused, time } from '$stores/board';
	import { Pause, Play } from 'lucide-svelte';
	import { onDestroy, onMount } from 'svelte';
	import { togglePause } from './Board';

	let interval: number;
	$: minutes = Math.floor($time / 60);
	$: seconds = $time % 60;

	onMount(() => {
		interval = setInterval(() => {
			if ($paused) {
				return;
			}
			$time += 1;
		}, 1000);
	});

	onDestroy(() => {
		clearInterval(interval);
	});

	gameState.subscribe((value) => {
		if (value !== 'COOKING') {
			$paused = true;
			clearInterval(interval);
		} else if (value === 'COOKING' && !interval) {
			interval = setInterval(() => {
				if ($paused) {
					return;
				}
				$time += 1;
			}, 1000);
		}
	});
</script>

<button
	on:click={togglePause}
	class="btn btn-sm w-full"
	class:btn-primary={$gameState === 'COOKING'}
	class:btn-error={$gameState === 'LOST'}
	class:btn-success={$gameState === 'WON'}
>
	{#if $gameState === 'COOKING'}
		{#if $paused}
			<Play size={16} />
		{:else}
			<Pause size={16} />
		{/if}
	{/if}
	<span class="countdown">
		<span style="--value:{minutes};"></span>:
		<span style="--value:{seconds};"></span>
	</span>
</button>
