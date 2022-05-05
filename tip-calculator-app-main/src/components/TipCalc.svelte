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
    width: 100%;
    height: 480px;
    background-color: #fff;
    border-radius: 20px;
    padding: 32px;
    padding-left: 50px;
    display: flex;
    justify-content: space-between;
    box-shadow: hsl(186, 14%, 43%) 50px 50px 50px -50px;
  }
</style>
