<template>
  <div
    :class="$style.root"
    :style="{ backgroundImage: `url('${src}')` }"
    ref="root"
  >
    <Paper
      :class="$style.banknote"
      v-for="style in banknoteStyles"
      :key="style.zIndex"
      :style="style"
      :src="src"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed, onMounted } from "vue";
import Paper from "../components/Paper.vue";
import cnyFrontPortrait from "@/assets/cny-front-portrait.webp";
import redEnvelope from "@/assets/red-envelope.svg";

export default defineComponent({
  name: "Stack",
  components: {
    Paper,
  },
  props: {
    type: {
      type: String as PropType<"cny" | "red-envelope">,
      required: true,
    },
  },
  setup(props) {
    interface Style {
      translateX: number;
      translateY: number;
      rotation: number;
      clientYStart: number;
      clientY: number;
      zIndex: number;
      state: "start" | "move" | "end";
    }

    const src = computed(
      () =>
        ({
          cny: cnyFrontPortrait,
          "red-envelope": redEnvelope,
        }[props.type])
    );

    function getTransforms(n: number = 100): Style[] {
      return new Array(n).fill(null).map((item, index, array) => {
        // 0 to 48 px
        const translateX = Math.floor(48 * Math.random());

        // -48 to 48 px
        const translateY = Math.floor(48 * (2 * Math.random() - 1));

        // -10 to 10 deg
        const rotation = 10 * (2 * Math.random() - 1);

        return {
          translateX,
          translateY,
          rotation,
          clientY: 0,
          clientYStart: 0,
          zIndex: array.length - index,
          state: "start",
        };
      });
    }

    const transforms = ref<Style[]>(getTransforms());

    const root = ref<Element | null>(null);
    onMounted(() => {
      if (root.value) {
        root.value.addEventListener("touchstart", ((e: TouchEvent) => {
          const target = transforms.value.find(
            ({ state }) => state === "start"
          );
          if (target) {
            target.clientYStart = e.touches[0].clientY;
            target.state = "move";
          }
        }) as EventListener);

        root.value.addEventListener("touchmove", ((e: TouchEvent) => {
          const target = transforms.value.find(({ state }) => state === "move");
          if (target) {
            target.clientY = e.touches[0].clientY;
          }
        }) as EventListener);

        root.value.addEventListener("touchend", (() => {
          const target = transforms.value.find(({ state }) => state === "move");
          if (target) {
            target.clientY = window.innerHeight * -1.2;
            target.state = "end";

            setTimeout(() => {
              transforms.value = transforms.value.filter(
                (item) => item != target
              );
            }, 1000);
          }
        }) as EventListener);

        root.value.addEventListener("touchcancel", (() => {
          const target = transforms.value.find(({ state }) => state === "move");
          if (target) {
            target.clientYStart = 0;
            target.clientY = 0;
            target.state = "start";
          }
        }) as EventListener);
      }
    });

    const banknoteStyles = computed(() =>
      transforms.value.map(
        ({
          translateX,
          translateY,
          rotation,
          zIndex,
          clientY,
          clientYStart,
        }) => ({
          transform: [
            `translateX(${translateX}px)`,
            `translateY(${translateY + clientY - clientYStart}px)`,
            `rotate(${rotation}deg)`,
          ].join(" "),
          zIndex,
        })
      )
    );

    return {
      src,
      banknoteStyles,
      root,
    };
  },
});
</script>

<style module>
.root {
  overflow: hidden;
  position: relative;
  display: block;
  height: 100vh;
  width: 50vh;
  min-width: 414px;
  margin-left: auto;
  margin-right: auto;
  background: top left/auto 100vh repeat;
}

.banknote {
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  transition: transform 300ms linear;
}
</style>
