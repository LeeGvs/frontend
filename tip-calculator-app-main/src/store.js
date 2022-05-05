import { writable } from 'svelte/store';

export const tip_store = writable({ bill: 0, people: 0, tip_percentage: 0 });
