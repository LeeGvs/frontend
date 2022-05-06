<script>
  export let value = '';
  export let group_name;
</script>

<input type="radio" name={group_name} id="cust" {value} checked={!!value} />
<input class="btn" on:change placeholder="Custom" bind:value />

<style>
  .btn {
    background-color: hsl(184, 14%, 56%);
    color: hsl(184, 14%, 56%);
    background-color: hsl(189, 41%, 97%);
    height: 48px;
    line-height: 48px;
    font-size: 24px;
    width: 120px;
    border-radius: 5px;
    text-align: right;
    border: none;
    cursor: pointer;
  }
  [type='radio'] {
    visibility: hidden;
    position: absolute;
  }

  /* Sibling label of the checked radio button */
  input[type='radio']:checked + input.btn {
    background: hsl(172, 67%, 45%);
    color: hsl(183, 100%, 15%);
  }
</style>
