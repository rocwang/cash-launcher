<template>
  <img :src="src" :alt="alt" :class="$style.root" />
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "Paper",
  props: {
    src: {
      type: String as PropType<string>,
      required: true,
    },
    alt: {
      type: String as PropType<string>,
      default: "Paper",
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style module>
.root {
  display: block;
  box-shadow: #00000080 3px 3px 6px;
}
</style>
