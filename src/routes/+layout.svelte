<script>
	import Header from './Header.svelte';
	import '../app.css';
	import Shop from './Shop.svelte';
	import { shopOpen } from '$stores/shop';
	import { Toaster } from 'svelte-french-toast';
</script>

<div class="app drawer lg:drawer-open drawer-end">
	<input id="drawer" type="checkbox" bind:checked={$shopOpen} class="drawer-toggle" />
	<div class="drawer-content">
		<Header />
		<main class="max-w-screen-lg px-4 mx-auto md:px-8 lg:px-12">
			<slot />
		</main>
	</div>

	<div class="drawer-side">
		<label for="drawer" aria-label="close sidebar" class="drawer-overlay"></label>
		<Shop />
	</div>
	<Toaster position="bottom-right" />

	<footer>
		<p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p>
	</footer>
</div>

<style>
</style>
