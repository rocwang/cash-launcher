import Konva from "konva";
import { onMounted, onUnmounted, ref, Ref, watch } from "vue";

export function useStack(
  src: Ref,
  containerRef: Ref<HTMLDivElement | null>
): Ref<number> {
  let stage: null | Konva.Stage = null;
  onMounted(async () => {
    const container = containerRef.value as HTMLDivElement;
    stage = new Konva.Stage({
      container,
      width: container.scrollWidth,
      height: container.scrollHeight,
    });
    const layer = new Konva.Layer();
    stage.add(layer);

    watch(
      src,
      async () => {
        layer.destroyChildren();
        const imageStack = await createImageStack(
          stage as Konva.Stage,
          src.value
        );
        layer.add(...imageStack);
        layer.draw();
      },
      { immediate: true }
    );
  });
  onUnmounted(() => stage && stage.destroy());

  return velocityRef;
}

const velocityRef = ref<number>(0);

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
      velocityRef.value = velocity;

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
