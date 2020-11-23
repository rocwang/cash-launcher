<template>
  <Head />

  <button :class="[$style.container, $style.bgBanknote]" type="button">
    <CnyLandscape
      :class="$style.banknote"
      v-for="n in numberOfItem"
      :key="n"
      :style="banknoteStyles[n]"
    />
  </button>

  <button :class="[$style.container, $style.bgRedEnvelope]" type="button">
    <RedEnvelope
      :class="$style.redEnvelope"
      v-for="n in numberOfItem"
      :key="n"
      :style="redEnvelopStyles[n]"
    />
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Head from "./components/Head.vue";
import RedEnvelope from "./components/RedEnvelope.vue";
import CnyLandscape from "./components/CnyLandscape.vue";

export default defineComponent({
  name: "App",
  components: {
    Head,
    RedEnvelope,
    CnyLandscape,
  },
  setup() {
    function getRandomStyle(n: number, minLength: number) {
      return new Array(n).fill(null).map((item, index) => {
        // -minLength to 100vw + minLength
        const x = Math.floor(
          (minLength + window.innerWidth) * Math.random() - minLength
        );

        // -minLength to 50vh + minLength
        const y = Math.floor(
          (minLength + window.innerHeight / 2) * Math.random() - minLength
        );

        // -90 to 90 deg
        const rotation = Math.random() * 180 - 90;

        return {
          transform: `translate(${x}px, ${y}px)  rotate(${rotation}deg)`,
          zIndex: index,
        };
      });
    }

    const numberOfItem = 100;

    return {
      numberOfItem,
      banknoteStyles: getRandomStyle(numberOfItem, 206),
      redEnvelopStyles: getRandomStyle(numberOfItem, 188),
    };
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
  display: grid;
  height: 100vh;
  grid-template:
    "top" 1fr
    "bottom" 1fr
    /100%;
  place-items: stretch;
}

.container {
  overflow: hidden;
  position: relative;
}

.bgBanknote {
  background: url("./assets/cny-font-landscape@3x.webp") top left/414px 206px
    repeat;
}

.banknote {
  width: 414px;
  position: absolute;
  top: 0;
  left: 0;
}

.bgRedEnvelope {
  background: url("./assets/red-envelope.svg") top left/188px 368px repeat;
}

.redEnvelope {
  height: 368px;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
