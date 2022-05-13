<script>
  import Tile from './Tile.svelte';
  import { game } from '../store';

  const CHOICES = ['rock', 'paper', 'scissors'];
  const OUTCOMES = { rock: 'scissors', paper: 'rock', scissors: 'paper' };
  const NUM_CHOICES = CHOICES.length;

  const select_item = () => {
    const item = Math.floor(Math.random() * NUM_CHOICES);
    return CHOICES[item];
  };

  $: play = (player) => {
    $game.stage = 'picked';
    $game.player_current = player;
    $game.house_current = select_item();

    const player_outcome = OUTCOMES[$game.player_current];
    const comp_outcome = OUTCOMES[$game.house_current];
    let outcome = null;

    if (player_outcome === $game.house_current) {
      outcome = 'player';
    } else if ($game.player_current === comp_outcome) {
      outcome = 'house';
    } else {
      outcome = 'draw';
    }
    setTimeout(() => {
      $game.reveal = true;
    }, 1500);
    setTimeout(() => {
      $game.result = outcome;
      if (outcome == 'player') $game.score += 1;
      if (outcome == 'house') $game.score -= 1;
    }, 3000);
  };
</script>

<div class="choices">
  <Tile tile="paper" on:click={play('paper')} />
  <Tile tile="scissors" on:click={play('scissors')} />
  <Tile tile="rock" last={true} on:click={play('rock')} />
</div>

<style>
  .choices {
    width: 30rem;
    height: 30rem;
    margin-top: 3rem;
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 1fr;
    gap: 20px 50px;
    align-items: center;
    justify-items: center;
    background-image: url('../images/bg-triangle.svg');
    background-position: center;
    background-repeat: no-repeat;
  }
</style>
