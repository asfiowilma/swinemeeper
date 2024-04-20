<script lang="ts">
	import { SHOP_DATA } from '$lib/constants/shop';
	import { coins, shopState } from '$stores/shop';
	import toast from 'svelte-french-toast';
	import { ChevronLeft, CircleDollarSign } from 'lucide-svelte';

	const purchase = (item: ShopItem) => {
		if (!$shopState[item.id] && $coins >= item.price) {
			$shopState[item.id] = true;
			$coins -= item.price;
			toast.success(`Unlocked ${item.group}: ${item.name}`);
		}
	};
</script>

<ul class="w-full min-h-full px-4 pt-0 menu max-w-96 bg-base-100 text-base-content">
	<label for="drawer" class="flex items-center gap-4 p-4 -mx-4 bg-base-300">
		<ChevronLeft size={24} />
		<h2 class="text-2xl font-bold grow">Shop</h2>
		<span class="btn no-animation btn-ghost hover:bg-transparent"
			><CircleDollarSign class="text-warning" /> {$coins}</span
		>
	</label>
	{#each SHOP_DATA as group}
		<div class="divider">{group.group}</div>
		{#each group.items as item (item.id)}
			<li class:disabled={$shopState[item.id]}>
				<a href="?" on:click={() => purchase(item)} class="justify-between">
					{item.name}
					<span class="badge" class:badge-success={$shopState[item.id]}>
						{#if $shopState[item.id]}
							Unlocked
						{:else}
							<CircleDollarSign size={16} class="mr-1 text-warning" /> {item.price}
						{/if}
					</span>
				</a>
			</li>
		{/each}
	{/each}
</ul>
