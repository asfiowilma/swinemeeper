<script>
	import Board from './Board.svelte';
	import StatusBar from './StatusBar.svelte';
</script>

<svelte:head>
	<title>Swinemeeper</title>
	<meta name="description" content="A spin off the classic game Minesweeper" />
</svelte:head>

<section>
	<StatusBar />
	<Board />
</section>

<style>
</style>
