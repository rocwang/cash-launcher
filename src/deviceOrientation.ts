import { onUnmounted, readonly, ref } from "vue";
import { BehaviorSubject, fromEvent } from "rxjs";
import { map, share, take } from "rxjs/operators";

export interface DeviceOrientation {
  alpha: number | null;
  beta: number | null;
}

const _isDeviceOrientationGranted = ref<boolean>(
  typeof DeviceOrientationEvent.requestPermission !== "function"
);

export const isDeviceOrientationGranted = readonly(_isDeviceOrientationGranted);

export async function requestDeviceOrientation(): Promise<boolean> {
  if (typeof DeviceOrientationEvent.requestPermission !== "function") {
    return true;
  }

  const response = await DeviceOrientationEvent.requestPermission();
  _isDeviceOrientationGranted.value = response === "granted";

  return _isDeviceOrientationGranted.value;
}

export function getDeviceOrientationSubject(): BehaviorSubject<DeviceOrientation> {
  const deviceOrientationSubject = new BehaviorSubject<DeviceOrientation>({
    alpha: 0,
    beta: 0,
  });

  const deviceOrientation$ = fromEvent<DeviceOrientationEvent>(
    window,
    "deviceorientation"
  ).pipe(
    map(({ alpha, beta }) => ({
      alpha,
      beta,
    })),
    share()
  );

  const sub1 = deviceOrientation$.pipe(take(1)).subscribe(() => {
    _isDeviceOrientationGranted.value = true;
  });

  const sub2 = deviceOrientation$.subscribe(deviceOrientationSubject);

  onUnmounted(() => {
    sub1.unsubscribe();
    sub2.unsubscribe();
  });

  return deviceOrientationSubject;
}
