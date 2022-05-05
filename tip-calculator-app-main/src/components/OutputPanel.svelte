<script>
  import { tip_store } from '../store.js';

  $: tip_per_person =
    $tip_store.people != 0 ? ($tip_store.bill * $tip_store.tip_percentage) / 100 / $tip_store.people : 0;
  $: total_per_person =
    $tip_store.people != 0 ? ($tip_store.bill * (1 + $tip_store.tip_percentage / 100)) / $tip_store.people : 0;
</script>

<div class="panel">
  Tip Amount / person:<span>{tip_per_person}</span><br />
  Total / person:<span>{total_per_person}</span><br />
  <button>Reset</button>
</div>

<style>
  .panel {
    width: 415px;
    background-color: hsl(183, 100%, 15%);
    border-radius: 30px;
    padding: 50px;
    color: #fff;
  }
</style>
