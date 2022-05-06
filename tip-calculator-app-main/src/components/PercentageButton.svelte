<script>
  export let amount;
  export let group_name;
</script>

<input type="radio" on:change name={group_name} value={amount} id={`per_${amount}`} />
<label for={`per_${amount}`} class="btn">{amount}%</label>

<style>
  .btn {
    background-color: hsl(183, 100%, 15%);
    color: #fff;
    height: 48px;
    line-height: 48px;
    font-size: 24px;
    width: 120px;
    border-radius: 5px;
    text-align: center;
    cursor: pointer;
  }
  .btn:active {
    background-color: hsl(185, 41%, 84%);
    color: hsl(183, 100%, 15%);
  }

  [type='radio'] {
    visibility: hidden;
    position: absolute;
  }

  /* Sibling label of the checked radio button */
  input[type='radio']:checked + label.btn {
    background: hsl(172, 67%, 45%);
    color: hsl(183, 100%, 15%);
  }
</style>
