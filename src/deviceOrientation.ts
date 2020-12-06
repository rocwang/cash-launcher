import { onUnmounted } from "vue";
import { BehaviorSubject, fromEvent } from "rxjs";
import { map, share, take } from "rxjs/operators";
import { behaviorSubjectToRef } from "@/utilities";

export interface DeviceOrientation {
  alpha: number | null;
  beta: number | null;
}

const deviceOrientationGrantedSubject = new BehaviorSubject(
  typeof DeviceOrientationEvent.requestPermission !== "function"
);

export const isDeviceOrientationGranted = behaviorSubjectToRef(
  deviceOrientationGrantedSubject
);

export async function requestDeviceOrientation(): Promise<boolean> {
  let granted;

  if (typeof DeviceOrientationEvent.requestPermission !== "function") {
    granted = true;
  } else {
    const response = await DeviceOrientationEvent.requestPermission();
    granted = response === "granted";
  }

  deviceOrientationGrantedSubject.next(granted);
  return granted;
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

  const sub1 = deviceOrientation$
    .pipe(
      take(1),
      map(() => true)
    )
    .subscribe(deviceOrientationGrantedSubject);

  const sub2 = deviceOrientation$.subscribe(deviceOrientationSubject);

  onUnmounted(() => {
    sub1.unsubscribe();
    sub2.unsubscribe();
  });

  return deviceOrientationSubject;
}
