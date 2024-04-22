<script>
	import { gameState, flags, time, difficulty, paused } from '$stores/board';
	import { Play, Timer } from 'lucide-svelte';

	import { getBombs, getHeight, getWidth, resetGame, startGame, togglePause } from './Board';
	import Board from './Board.svelte';
</script>

{#if $gameState == 'NOT STARTED' || ($gameState === 'COOKING' && $paused)}
	<div
		class="absolute grid w-full z-[1] h-full rounded-md bg-neutral/50 backdrop-blur place-content-center"
	>
		<div class="flex flex-col items-center gap-4">
			{#if $gameState == 'NOT STARTED'}
				<div class="text-2xl font-bold">New Game</div>
				<button on:click={startGame} class="btn btn-lg btn-primary"
					><Play size={20} /> Play
				</button>
			{:else}
				<div class="text-xl font-bold">Paused</div>
				<button on:click={togglePause} class="btn btn-lg btn-primary"
					><Play size={20} /> Resume
				</button>
			{/if}
		</div>
	</div>
{:else if $gameState === 'LOST'}
	<div class="absolute grid w-full z-[1] h-full place-content-center">
		<div class="shadow-lg card bg-neutral">
			<div class="card-body">
				<div class="flex flex-col items-center gap-4">
					<div class="text-xl font-bold">Game Over</div>
					<button
						on:click={() => {
							resetGame();
							startGame();
						}}
						class="btn btn-lg btn-primary"
						><Play size={20} /> Replay
					</button>
				</div>
			</div>
		</div>
	</div>
{:else if $gameState === 'WON'}
	<div class="fixed grid w-full z-[1] h-full place-content-center">
		<div class="shadow-lg card bg-base-300">
			<div class="items-center card-body">
				<div class="text-2xl font-bold">Congratulations!</div>
				<p>
					You completed the <span class="font-bold uppercase text-success">{$difficulty}</span> board
					after
				</p>
				<p class="my-4 text-xl font-bold countdown">
					<Timer size={32} />
					<span style="--value:{Math.floor($time / 60)};"></span>:
					<span style="--value:{$time % 60};"></span>
				</p>
				<div
					class="grid gap-px mb-2 w-52"
					style:grid-template-columns="repeat({getHeight()}, minmax(0, 1fr))"
					style:grid-template-rows="repeat({getWidth()}, minmax(0, 1fr))"
				>
					<Board isThumbnail={true} />
				</div>
				<div class="flex gap-2">
					<div
						class="badge tooltip tooltip-bottom badge-neutral badge-lg"
						data-tip="{getBombs()} bombs to find"
					>
						💣 {getBombs()}
					</div>
					<div class="badge badge-neutral tooltip tooltip-bottom badge-lg" data-tip="Flags used">
						🚩 {$flags
							.flatMap((row) => row)
							.reduce((flagCount, flag) => flagCount + flag, 0)}/{getBombs()}
					</div>
				</div>

				<div class="mt-2 card-actions">
					<button
						on:click={() => {
							resetGame();
							startGame();
						}}
						class="btn btn-primary"
						><Play size={20} /> Replay
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
