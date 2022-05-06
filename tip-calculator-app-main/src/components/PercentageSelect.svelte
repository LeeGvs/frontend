<script>
  import { tip_store } from '../store';

  import PercentageButton from './PercentageButton.svelte';
  import CustomPercentage from './CustomPercentage.svelte';
  const options = [5, 10, 15, 25, 50];
  let custom_amount = '';

  const changed = (e) => console.log(($tip_store.tip_percentage = e.target.value));
</script>

<h4>Select Tip %</h4>
<div class="pc-buttons">
  {#each options as amount}
    <PercentageButton on:change={changed} {amount} group_name="percent" />
  {/each}
  <CustomPercentage on:change={changed} bind:value={custom_amount} group_name="percent" />
</div>

<style>
  .pc-buttons {
    display: grid;
    grid-template-rows: repeat(2, 1fr);
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
  }
</style>
