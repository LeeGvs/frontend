<script>
  export let tile = 'paper';
  export let last = false;
  export let winner = false;
  export let size = 100;

  const tiles = {
    paper: {
      icon: '../images/icon-paper.svg',
      start_colour: 'hsl(230, 89%, 62%)',
      end_colour: 'hsl(230, 89%, 65%)',
    },
    scissors: {
      icon: '../images/icon-scissors.svg',
      start_colour: 'hsl(39, 89%, 49%)',
      end_colour: 'hsl(40, 84%, 53%)',
    },
    rock: {
      icon: '../images/icon-rock.svg',
      start_colour: 'hsl(349, 71%, 52%)',
      end_colour: 'hsl(349, 70%, 56%)',
    },
  };

  const { icon = null, start_colour = null, end_colour = null } = tiles[tile];
  $: css_var_style = `--start-colour:${start_colour};--end-colour:${end_colour};--icon:url('${icon}');--icon-size:${
    size / 100
  }`;
</script>

<div class="back" class:last class:winner style={css_var_style} on:click>
  <div class="icon" />
</div>

<style>
  .back {
    width: calc(var(--icon-size) * 12rem);
    height: calc(var(--icon-size) * 12rem);
    padding: 1rem;
    background: linear-gradient(0deg, var(--start-colour), var(--end-colour));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 calc(var(--icon-size) * 0.5rem) 0 0.1rem rgba(20, 19, 19, 0.25),
      0 calc(var(--icon-size) * 0.5rem) 0 0.1rem var(--start-colour);
  }
  .icon {
    width: calc(var(--icon-size) * 9.25rem);
    height: calc(var(--icon-size) * 9.25rem);
    border-radius: 50%;
    background-color: #fff;
    background-image: var(--icon);
    background-repeat: no-repeat;
    background-position: center;
    background-size: calc(var(--icon-size) * 4rem);
    box-shadow: inset 0 calc(var(--icon-size) * 0.5rem) 0 0.1rem #e0e0e0;
  }
  .last {
    grid-column: 1 / 3;
  }
  .winner {
    box-shadow: 0 0 0 60px rgba(255, 255, 255, 0.04), 0 0 0 120px rgba(255, 255, 255, 0.04),
      0 0 0 180px rgba(255, 255, 255, 0.02);
  }
</style>
