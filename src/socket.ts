import { onUnmounted } from "vue";
import { BehaviorSubject, merge } from "rxjs";
import { DeviceOrientation } from "@/deviceOrientation";
import { webSocket } from "rxjs/webSocket";
import { map } from "rxjs/operators";

export function pipeToPi(
  velocity: BehaviorSubject<number>,
  orientation: BehaviorSubject<DeviceOrientation>
) {
  const socketSubject = webSocket("wss://localhost:7777");

  merge(
    velocity.pipe(
      map((velocity) => ({
        velocity,
      }))
    ),
    orientation.pipe(
      map((orientation) => ({
        orientation,
      }))
    )
  ).subscribe(socketSubject);

  const subscription = socketSubject.subscribe(
    () => {},
    (error) => {
      console.log(error);
    }
  );

  onUnmounted(() => {
    socketSubject.error({ code: 1000, reason: "Stack.vue is unmounted" });
    subscription.unsubscribe();
  });
}
