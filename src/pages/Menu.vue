<template>
  <div :class="$style.root">
    <router-link to="/stack/cny" :class="[$style.container, $style.bgBanknote]">
      <Paper
        :class="$style.banknote"
        v-for="(style, i) in banknoteStyles"
        :key="i"
        :style="style"
        :src="cnyFrontLandscape"
      />
    </router-link>

    <router-link
      to="/stack/red-envelope"
      :class="[$style.container, $style.bgRedEnvelope]"
    >
      <Paper
        :class="$style.redEnvelope"
        v-for="(style, i) in redEnvelopeStyles"
        :key="i"
        :style="style"
        :src="redEnvelope"
      />
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onUnmounted } from "vue";
import Paper from "../components/Paper.vue";
import cnyFrontLandscape from "@/assets/cny-front-landscape@3x.webp";
import redEnvelope from "@/assets/red-envelope.svg";

export default defineComponent({
  name: "Menu",
  components: {
    Paper,
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

    const numberOfItem = 20;
    const banknoteStyles = ref<Style[]>([]);
    const redEnvelopeStyles = ref<Style[]>([]);
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
      redEnvelopeStyles.value = getRandomStyle(
        numberOfItem,
        188,
        width,
        height
      );
    });

    observer.observe(document.body, { box: "border-box" });
    onUnmounted(() => {
      observer.disconnect();
    });

    return {
      banknoteStyles,
      redEnvelopeStyles,
      cnyFrontLandscape,
      redEnvelope,
    };
  },
});
</script>

<style module>
.root {
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
  display: block;
}

.bgBanknote {
  background: url("../assets/cny-front-landscape@3x.webp") top left/414px 206px
    repeat;
}

.banknote {
  width: 414px;
  position: absolute;
  top: 0;
  left: 0;
}

.bgRedEnvelope {
  background: url("../assets/red-envelope.svg") top left/188px 368px repeat;
}

.redEnvelope {
  height: 368px;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
