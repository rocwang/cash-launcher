<template>
  <Head />

  <button :class="[$style.container, $style.bgBanknote]" type="button">
    <CnyLandscape
      :class="$style.banknote"
      v-for="(style, i) in redEnvelopStyles"
      :key="i"
      :style="style"
    />
  </button>

  <button :class="[$style.container, $style.bgRedEnvelope]" type="button">
    <RedEnvelope
      :class="$style.redEnvelope"
      v-for="(style, i) in redEnvelopStyles"
      :key="i"
      :style="style"
    />
  </button>
</template>

<script lang="ts">
import { defineComponent, ref, onUnmounted } from "vue";
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
    interface Style {
      transform: string;
      zIndex: number;
    }

    function getRandomStyle(
      n: number,
      minLength: number,
      viewportWidth: number,
      viewportHeight: number
    ): Style[] {
      return new Array(n).fill(null).map((item, index) => {
        // -minLength to 100vw + minLength
        const x = Math.floor(
          (minLength + viewportWidth) * Math.random() - minLength
        );

        // -minLength to 50vh + minLength
        const y = Math.floor(
          (minLength + viewportHeight / 2) * Math.random() - minLength
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
    const banknoteStyles = ref<Style[]>([]);
    const redEnvelopStyles = ref<Style[]>([]);
    const observer = new ResizeObserver((entries) => {
      let width = window.innerWidth;
      let height = window.innerHeight;

      if (entries[0].borderBoxSize) {
        const { inlineSize, blockSize } = entries[0].borderBoxSize[0]
          ? entries[0].borderBoxSize[0]
          : ((entries[0].borderBoxSize as unknown) as ResizeObserverSize);
        width = inlineSize;
        height = blockSize;
      } else if (entries[0].contentRect) {
        width = entries[0].contentRect.width;
        height = entries[0].contentRect.height;
      }

      banknoteStyles.value = getRandomStyle(numberOfItem, 206, width, height);
      redEnvelopStyles.value = getRandomStyle(numberOfItem, 188, width, height);
    });

    observer.observe(document.body, { box: "border-box" });
    onUnmounted(() => {
      observer.disconnect();
    });

    return {
      numberOfItem,
      banknoteStyles,
      redEnvelopStyles,
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
