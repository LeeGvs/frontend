<script>
  import { game } from '../store';
</script>

<div class="score">
  SCORE
  <div class="score-value">{$game.score}</div>
</div>

<style>
  .score {
    width: 10rem;
    background-color: white;
    border-radius: 0.5rem;
    color: blue;
    padding: 0.5rem;
  }
  .score-value {
    color: black;
    line-height: 4rem;
    font-size: 4rem;
    font-weight: 700;
  }
</style>
