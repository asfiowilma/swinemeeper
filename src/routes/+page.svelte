<script>
	import Board from './Board.svelte';
	import BoardContainer from './BoardContainer.svelte';
	import StatusBar from './StatusBar.svelte';
</script>

<svelte:head>
	<title>Swinemeeper</title>
	<meta name="description" content="A spin off the classic game Minesweeper" />
</svelte:head>

<section class="flex flex-col">
	<StatusBar />
	<BoardContainer>
		<Board />
	</BoardContainer>
</section>

<style>
</style>
