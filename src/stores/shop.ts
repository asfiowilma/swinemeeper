import { persisted } from 'svelte-persisted-store';
import { writable } from 'svelte/store';

export const shopOpen = writable(false);
export const coins = persisted('swinemeeper-coins', 0);
export const shopState = persisted<ShopState>('swinemeeper-shop', {
	beginner: true,
	'flag-basic': true,
	'bomb-basic': true
});
