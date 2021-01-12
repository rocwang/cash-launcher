import { onUnmounted } from "vue";
import { BehaviorSubject } from "rxjs";
import { DeviceOrientation } from "./deviceOrientation";
import { webSocket } from "rxjs/webSocket";

export function pipeToPi(
  velocity: BehaviorSubject<number>,
  orientation: BehaviorSubject<DeviceOrientation>
) {
  const registry = [
    {
      url: `wss://${import.meta.env.VITE_SERVER_HOST}/velocity`,
      subject: velocity as BehaviorSubject<unknown>,
    },
    {
      url: `wss://${import.meta.env.VITE_SERVER_HOST}/orientation`,
      subject: orientation as BehaviorSubject<unknown>,
    },
  ].map(({ url, subject }) => {
    const socket = webSocket(url);

    subject.subscribe(socket);

    const subscription = socket.subscribe(
      () => {},
      (error) => console.log(error),
      () => console.log("Server closed the connection")
    );

    return {
      socket,
      subscription,
    };
  });

  onUnmounted(() => {
    registry.forEach(({ socket, subscription }) => {
      socket.error({ code: 1000, reason: "Stack.vue is unmounted" });
      subscription.unsubscribe();
    });
  });
}
