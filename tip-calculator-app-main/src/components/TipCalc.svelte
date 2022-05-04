<script>
  import ControlPanel from './ControlPanel.svelte';
  import OutputPanel from './OutputPanel.svelte';
</script>

<div class="calc">
  <ControlPanel />
  <OutputPanel />
</div>

<style>
  .calc {
    height: 500px;
    background-color: #fff;
    border-radius: 20px;
    padding: 50px;
    display: flex;
    justify-content: space-between;
  }
</style>
