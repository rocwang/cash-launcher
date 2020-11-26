<template>
  <HtmlHead />

  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HtmlHead from "./components/HtmlHead.vue";

export default defineComponent({
  name: "App",
  components: {
    HtmlHead,
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
