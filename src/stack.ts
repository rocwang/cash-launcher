import Konva from "konva";
import { onMounted, onUnmounted, Ref, watchEffect } from "vue";
import { BehaviorSubject, fromEventPattern, merge, Observable } from "rxjs";
import { filter, map, scan, share, tap, withLatestFrom } from "rxjs/operators";

interface PaperState {
  t: number;
  y: number;
  v: number;
}

export function makeStack(
  src: Ref,
  containerRef: Ref<HTMLDivElement | null>
): BehaviorSubject<number> {
  const velocitySubject = new BehaviorSubject<number>(0);

  onMounted(async () => {
    const container = containerRef.value as HTMLDivElement;
    const stage = new Konva.Stage({
      container,
      width: container.scrollWidth,
      height: container.scrollHeight,
    });

    const layer = new Konva.Layer();

    const velocity$ = getVelocity$FromDrag(layer, stage);
    const subscription = velocity$.subscribe(velocitySubject);

    stage.add(layer);

    watchEffect(async () => {
      layer.destroyChildren();
      const imageStack = await createImageStack(
        stage as Konva.Stage,
        src.value
      );
      layer.add(...imageStack);
      layer.draw();
    });

    onUnmounted(() => {
      subscription.unsubscribe();
      stage.destroy();
    });
  });

  return velocitySubject;
}

function getVelocity$FromDrag(
  layer: Konva.Layer,
  stage: Konva.Stage
): Observable<number> {
  const state$ = merge(
    fromEventPattern(
      (handler) => layer.on("dragstart", handler),
      (handler) => layer.off("dragstart", handler)
    ),
    fromEventPattern(
      (handler) => layer.on("dragmove", handler),
      (handler) => layer.off("dragmove", handler)
    )
  ).pipe(
    scan(
      (last: PaperState, e: unknown) => {
        const t = performance.now();
        const y = (e as Konva.KonvaEventObject<DragEvent>).target.y();

        const v = t === 0 ? 0 : (y - last.y) / (t - last.t);

        return { t, y, v };
      },
      { t: 0, y: 0, v: 0 }
    )
  );

  return fromEventPattern(
    (handler) => layer.on("dragend", handler),
    (handler) => layer.off("dragend", handler)
  ).pipe(
    withLatestFrom(state$, (e: unknown, state) => ({
      e: e as Konva.KonvaEventObject<DragEvent>,
      state,
    })),
    // The image must have a large enough upward speed to fly out
    filter(({ state }) => state.v < -1),
    tap(({ state, e }) => {
      const target = e.target as Konva.Image;

      target.draggable(false);
      target.listening(false);

      const targetY = -stage.height() * 1.2;
      const distance = targetY - target.y();
      const duration = distance / state.v / 1000;

      target.to({
        x: target.x(),
        y: targetY,
        duration,
        easing: Konva.Easings.Linear,
        onFinish: () => {
          target.setAttrs({
            ...createInitialImageConfig(stage),
            zIndex: 0,
          });
        },
      });
    }),
    map(({ state }) => state.v),
    share()
  );
}

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

    clone.cache();

    return clone;
  });
}
