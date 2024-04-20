import { persisted } from 'svelte-persisted-store';

export const coins = persisted('swinemeeper-coins', 0);
