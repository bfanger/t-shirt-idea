<script lang="ts">
  import Shirt from "./components/Shirt.svelte";

  let name = "Frans";
</script>

<Shirt {name} />
<div>
  <input bind:value={name} autofocus />
</div>
