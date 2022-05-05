<script>
  import PercentageButton from './PercentageButton.svelte';
  import CustomPercentage from './CustomPercentage.svelte';
  const options = [5, 10, 15, 20, 25];
  let custom_amount = 0;
</script>

<h4>Select Tip %</h4>
<div class="pc-buttons">
  {#each options as amount}
    <PercentageButton {amount} />
  {/each}
  <CustomPercentage bind:value={custom_amount} />
</div>

<style>
  .pc-buttons {
    display: grid;
    grid-template-rows: repeat(2, 1fr);
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
  }
</style>
