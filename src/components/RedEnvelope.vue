<template>
  <img :src="redEnvelope" alt="Red Envelope" :class="$style.root" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import redEnvelope from "@/assets/red-envelope.svg";

export default defineComponent({
  name: "RedEnvelope",
  setup() {
    return { redEnvelope };
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
