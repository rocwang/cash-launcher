import { onMounted, onUnmounted, reactive, ref } from "vue";

const orientation = reactive<{ alpha: number | null; beta: number | null }>({
  alpha: 0,
  beta: 0,
});

export const isDeviceOrientationGranted = ref<boolean>(
  typeof DeviceOrientationEvent.requestPermission !== "function"
);

export async function requestDeviceOrientation(): Promise<boolean> {
  if (typeof DeviceOrientationEvent.requestPermission !== "function") {
    return true;
  }

  const response = await DeviceOrientationEvent.requestPermission();
  if (response === "granted") {
    isDeviceOrientationGranted.value = true;
    return true;
  } else {
    return false;
  }
}

function onDeviceOrientation(e: DeviceOrientationEvent) {
  orientation.alpha = e.alpha;
  orientation.beta = e.beta;
}

function checkDeviceOrientationGranted() {
  isDeviceOrientationGranted.value = true;
}

export function useDeviceOrientation() {
  onMounted(() => {
    window.addEventListener("deviceorientation", onDeviceOrientation);
    window.addEventListener(
      "deviceorientation",
      checkDeviceOrientationGranted,
      {
        once: true,
      }
    );
  });
  onUnmounted(() => {
    window.removeEventListener("deviceorientation", onDeviceOrientation);
    window.removeEventListener(
      "deviceorientation",
      checkDeviceOrientationGranted
    );
  });

  return orientation;
}
