import { writable } from 'svelte/store';

export const game = writable({
  stage: 'selection',
  player_current: null,
  house_current: null,
  reveal: false,
  result: null,
  score: 0,
});
