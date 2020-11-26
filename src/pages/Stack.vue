<template>
  <div
    :class="$style.root"
    ref="root"
    :style="{ backgroundImage: `url(${src})` }"
  ></div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref } from "vue";
import cnyFrontPortrait from "@/assets/cny-front-portrait.webp";
import redEnvelope from "@/assets/red-envelope.svg";
import Konva from "konva";

function getImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const imageObj = new Image();
    imageObj.onload = () => resolve(imageObj);
    imageObj.src = src;
  });
}

function createInitialImageConfig(stage: Konva.Stage): Konva.ShapeConfig {
  return {
    // -24 to 24 px from the center
    x: stage.width() / 2 + 24 * (2 * Math.random() - 1),
    y: stage.height() / 2 + 24 * (2 * Math.random() - 1),

    // -10 to 10 deg
    rotation: 10 * (2 * Math.random() - 1),

    draggable: true,
    listening: true,
  };
}

const debugText = new Konva.Text({
  x: 10,
  y: 10,
  fontFamily: "Calibri",
  fontSize: 24,
  text: "Velocity:",
  fill: "green",
  listening: false,
});
const debugLayer = new Konva.Layer();
debugLayer.add(debugText);

async function createImageStack(
  stage: Konva.Stage,
  imageSrc: string,
  n: number = 10
): Promise<Konva.Image[]> {
  const htmlImage = await getImage(imageSrc);
  const imageWidth =
    (stage.height() * htmlImage.naturalWidth) / htmlImage.naturalHeight;
  const imageHeight = stage.height();

  const image = new Konva.Image({
    image: htmlImage,
    offsetX: imageWidth / 2,
    offsetY: imageHeight / 2,
    width: imageWidth,
    height: imageHeight,
    draggable: true,
    shadowColor: "black",
    shadowBlur: 6,
    shadowOffset: { x: 3, y: 3 },
    shadowOpacity: 0.5,
    dragBoundFunc: function (pos) {
      return {
        x: this.absolutePosition().x,
        y: pos.y,
      };
    },
  });

  return new Array(n).fill(null).map(() => {
    const clone = image.clone(createInitialImageConfig(stage)) as Konva.Image;

    let justNow: number;
    let lastY: number;
    let velocity: number;

    clone.on("dragstart", (e) => {
      justNow = performance.now();
      lastY = e.target.y();
    });
    clone.on("dragmove", (e) => {
      const now = performance.now();
      const y = e.target.y();

      velocity = (y - lastY) / (now - justNow);

      justNow = now;
      lastY = y;
    });
    clone.on("dragend", () => {
      debugText.text(`Velocity: ${velocity.toFixed(4)} px/millisecond`);
      debugLayer.draw();

      // The image must have a large enough upward speed to fly out
      if (velocity > -1) {
        return;
      }

      clone.draggable(false);
      clone.listening(false);

      const targetY = -stage.height() * 1.2;
      const distance = targetY - clone.y();
      const duration = distance / velocity / 1000;

      clone.to({
        x: clone.x(),
        y: targetY,
        duration,
        easing: Konva.Easings.Linear,
        onFinish: () => {
          clone.setAttrs({
            ...createInitialImageConfig(stage),
            zIndex: 0,
          });
        },
      });
    });

    clone.cache();

    return clone;
  });
}

async function drawStack(container: HTMLDivElement, imageSrc: string) {
  const stage = new Konva.Stage({
    container,
    width: container.scrollWidth,
    height: container.scrollHeight,
  });
  const layer = new Konva.Layer();
  const imageStack = await createImageStack(stage, imageSrc);

  layer.add(...imageStack);
  stage.add(layer);
  stage.add(debugLayer);
}

export default defineComponent({
  name: "Stack",
  components: {},
  props: {
    type: {
      type: String as PropType<"cny" | "red-envelope">,
      required: true,
    },
  },
  setup(props) {
    const src = computed(
      () =>
        ({
          cny: cnyFrontPortrait,
          "red-envelope": redEnvelope,
        }[props.type])
    );
    const root = ref<HTMLDivElement | null>(null);

    onMounted(() => {
      drawStack(root.value as HTMLDivElement, src.value);
    });

    return {
      src,
      root,
    };
  },
});
</script>

<style module>
.root {
  background: top left/auto 100vh repeat;
  cursor: pointer;
  display: block;
  height: 100vh;
  margin-left: auto;
  margin-right: auto;
  min-width: 414px;
  overflow: hidden;
  position: relative;
  width: 50vh;
}
</style>
