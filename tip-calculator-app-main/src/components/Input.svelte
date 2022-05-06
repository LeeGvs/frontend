<script>
  export let title;
  export let icon;
  export let value;
  export let message = null;
</script>

<div class="input-group">
  <div class="title">
    <h4>{title}</h4>
    {#if message}<p class="msg-text">{message}</p>{/if}
  </div>
  <input type="text" class="inp{message ? ' msg' : ''}" bind:value on:input style="background-image: url({icon})" />
</div>

<style>
  .title {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }
  .inp {
    width: 100%;
    text-align: right;
    border: none;
    font-size: 24px;
    outline: none;
    height: 50px;
    padding: 10px;
    /* color: hsl(184, 14%, 56%); */
    color: hsl(183, 100%, 15%);
    background-color: hsl(189, 41%, 97%);
    background-position: 20px 50%;
    background-repeat: no-repeat;
    border-radius: 5px;
  }
  .inp:active,
  .inp:focus {
    border: hsl(172, 67%, 45%) 2px solid;
  }
  .msg,
  .msg:focus {
    color: rgb(255, 136, 0);
    border: rgb(255, 136, 0) 2px solid;
  }
  .msg-text {
    color: rgb(255, 136, 0);
    margin: 0;
    padding: 0;
  }
  h4 {
    margin-bottom: 0;
    color: hsl(184, 14%, 56%);
  }
</style>
