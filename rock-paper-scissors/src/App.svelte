<script>
  import Selection from './components/Selection.svelte';
  import Score from './components/Score.svelte';
  import Choice from './components/Choice.svelte';
  import { game } from './store';
</script>

<main class="container">
  <div class="heading">
    <img src="../images/logo.svg" alt="RPS-logo" />
    <Score />
  </div>
  <!-- Heading -->
  {#if $game.stage === 'selection'}
    <Selection />
  {:else if $game.stage === 'picked'}
    <Choice />
  {/if}

  <!-- Outcome
	rules / 	rules button -->
</main>
<footer>
  <div class="attribution">
    Challenge by <a href="https://www.frontendmentor.io?ref=challenge" target="_blank">Frontend Mentor</a>. Coded by
    <a href="https://github.com/LeeGvs">Lee Greaves</a>.
  </div>
</footer>

<style>
  .container {
    text-align: center;
    display: flex;
    flex-direction: column;
    padding: 1em;
    width: 1200px;
    margin: 100px auto;
    align-items: center;
    justify-items: center;
  }
  .heading {
    width: 45rem;
    height: 9.5rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border: 2px solid hsl(217, 16%, 45%);
    border-radius: 1rem;
    padding: 1rem 1.5rem;
  }
  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
