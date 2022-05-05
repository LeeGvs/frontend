<script>
  export let title;
  export let icon;
  export let value;
</script>

<h4>{title}</h4>
<div class="input-group">
  <img class="icon" src={icon} alt="icon" />
  <input class="inp" bind:value type="text" />
</div>

<style>
  .input-group {
    display: flex;
    align-items: center;
    justify-items: right;
    border: 1px solid hsl(184, 14%, 56%);
    height: 50px;
  }
  .icon {
    height: auto;
    width: auto;
  }
  .inp {
    flex-grow: 2;
    text-align: right;
    border: none;
    font-size: 24px;
  }
  .input-group:focus {
    border: red 5px solid;
    outline: none;
  }
  h4 {
    margin-bottom: 0;
  }
</style>
