<template>
  <img :src="cnyFrontLandscape" alt="CNY Front" :class="$style.root" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import cnyFrontLandscape from "@/assets/cny-font-landscape@3x.webp";

export default defineComponent({
  name: "CnyLandscape",
  setup() {
    return {
      cnyFrontLandscape,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style module>
.root {
  display: block;
  box-shadow: #00000080 2px 2px 4px;
}
</style>
