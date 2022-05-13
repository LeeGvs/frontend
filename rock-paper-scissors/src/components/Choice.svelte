<script>
  import Tile from './Tile.svelte';
  import { game } from '../store';

  const CHOICES = ['rock', 'paper', 'scissors'];
  const OUTCOMES = { rock: 'scissors', paper: 'rock', scissors: 'paper' };
  const NUM_CHOICES = CHOICES.length;

  let out = null;

  $: play_win = $game.result === 'player';
  $: house_win = $game.result === 'house';
  $: result = $game.result === 'player' ? 'YOU WIN' : $game.result === 'house' ? 'YOU LOSE' : 'DRAW';

  const reset = () => {
    $game.stage = 'selection';
    $game.player_current = null;
    $game.house_current = null;
    $game.reveal = false;
    $game.result = null;
  };
</script>

<div class="choices">
  <p class="title">YOU PICKED</p>
  <p />
  <p class="title">THE HOUSE PICKED</p>
  <div class="player"><Tile tile={$game.player_current} winner={play_win} size={150} /></div>
  {#if $game.result}
    <div class="result">
      {result}
      <button class="button" on:click={reset}>PLAY AGAIN</button>
    </div>
  {/if}
  <div class="house">
    {#if $game.reveal}
      <Tile tile={$game.house_current} winner={house_win} size={150} />
    {:else}
      <div class="spacer" />
    {/if}
  </div>
</div>

<style>
  .choices {
    height: 20rem;
    margin-top: 3rem;
    display: grid;
    grid-template-rows: auto 1fr;
    grid-template-columns: 1fr auto 1fr;
    gap: 20px 50px;
    align-items: center;
    justify-items: center;
  }
  .player {
    grid-column: 1/2;
  }
  .house {
    grid-column: 3/4;
  }
  .result {
    font-size: 3rem;
    font-weight: 800;
    width: 12rem;
    display: flex;
    flex-direction: column;
  }
  .button {
    margin-top: 2rem;
    height: 2.5rem;
    font-size: 1rem;
    letter-spacing: 0.1rem;
    border: none;
    border-radius: 10px;
  }
  .button:hover {
    color: red;
    cursor: pointer;
  }
  .spacer {
    width: 12rem;
    height: 12rem;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.15);
  }
</style>
