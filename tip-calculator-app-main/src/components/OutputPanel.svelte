<script>
  import { tip_store } from '../store.js';

  $: tip_per_person =
    '$' +
    ($tip_store.people != 0 ? ($tip_store.bill * $tip_store.tip_percentage) / 100 / $tip_store.people : 0).toFixed(2);
  $: total_per_person =
    '$' +
    ($tip_store.people != 0
      ? ($tip_store.bill * (1 + $tip_store.tip_percentage / 100)) / $tip_store.people
      : 0
    ).toFixed(2);

  const reset = () => {
    tip_store.set({ bill: 0, people: 0, tip_percentage: 0 });
  };
</script>

<div class="panel">
  <div class="amount-outputs">
    <div class="amount-line">
      <div class="label">
        <div class="label-title">Tip Amount</div>
        <div class="label-person">/ person</div>
      </div>
      <span class="amount">{tip_per_person}</span><br />
    </div>
    <div class="amount-line">
      <div class="label">
        <div class="label-title">Total</div>
        <div class="label-person">/ person</div>
      </div>
      <span class="amount">{total_per_person}</span><br />
    </div>
  </div>
  <button class="reset" on:click={reset}>RESET</button>
</div>

<style>
  .panel {
    width: 413px;
    background-color: hsl(183, 100%, 15%);
    border-radius: 30px;
    padding: 40px;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .amount-line {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  .label-title {
    font-size: 15px;
  }
  .label-person {
    font-size: 13px;
    color: hsl(184, 14%, 56%);
  }
  .amount {
    flex-grow: 2;
    font-size: 48px;
    color: hsl(172, 67%, 45%);
    text-align: right;
  }
  .reset {
    height: 50px;
    background-color: hsl(172, 67%, 45%);
    color: hsl(183, 100%, 15%);
    font-size: 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  .reset:active {
    background-color: hsl(185, 41%, 84%);
  }
</style>
