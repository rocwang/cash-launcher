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
  --color-white: #ddd;
  --color-black: #333;
}

body {
  background-color: var(--color-black);
  color: var(--color-white);
  height: 100%;
  overflow: hidden;
}
</style>
