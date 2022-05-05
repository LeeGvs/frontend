<script>
  import Input from './Input.svelte';
  import PercentageSelect from './PercentageSelect.svelte';
  import { tip_store } from '../store.js';

  let bill, people, tip_percentage;
</script>

<div class="control">
  <Input title="Bill" icon="./images/icon-dollar.svg" bind:value={$tip_store.bill} />
  <PercentageSelect />
  <Input title="Number of People" icon="./images/icon-person.svg" bind:value={$tip_store.people} />
</div>

<style>
  .control {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
</style>
