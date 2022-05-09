<script>
  import Input from './Input.svelte';
  import PercentageSelect from './PercentageSelect.svelte';
  import { tip_store } from '../store.js';

  let message = null;

  const checkInput = (e) => {
    if ($tip_store.people == 0) {
      message = `can't be zero`;
    } else {
      message = null;
      $tip_store.reset_disabled = false;
    }
    console.log(message);
  };
</script>

<div class="control">
  <Input title="Bill" icon="./images/icon-dollar.svg" on:input={checkInput} bind:value={$tip_store.bill} />
  <PercentageSelect />
  <Input
    title="Number of People"
    icon="./images/icon-person.svg"
    placeholder="0"
    bind:value={$tip_store.people}
    on:input={checkInput}
    {message}
  />
</div>

<style>
  .control {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
</style>
