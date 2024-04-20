<script>
	import { CircleDollarSign } from 'lucide-svelte';
	import { coins } from '$stores/shop';
</script>

<header class="p-2">
	<div class="rounded-xl navbar bg-neutral text-neutral-content">
		<div class="navbar-start">
			<div class="text-3xl font-extrabold btn btn-square btn-ghost">S</div>
		</div>
		<div class="navbar-center"><a href="/" class="text-lg btn btn-ghost">SwineMeeper</a></div>
		<div class="navbar-end">
			<div class="btn">
				<CircleDollarSign />
				{$coins}
			</div>
		</div>
	</div>
</header>
