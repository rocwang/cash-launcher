<template>
  <Head />

  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Head from "./components/Head.vue";

export default defineComponent({
  name: "App",
  components: {
    Head,
  },
});
</script>

<style src="./assets/reset.css" />
<style module>
:root {
  --color-black: #ddd;
  --color-white: #333;
}

body {
  background-color: var(--color-white);
  color: var(--color-black);
  font-family: system-ui, sans-serif;
  height: 100%;
  overflow: hidden;
}
</style>
