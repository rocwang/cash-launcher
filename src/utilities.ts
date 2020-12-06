import { BehaviorSubject, Subject } from "rxjs";
import { onUnmounted, ref, Ref, readonly } from "vue";
import { DeepReadonly, UnwrapRef } from "@vue/reactivity";

export function behaviorSubjectToRef<T>(
  s: BehaviorSubject<T>
): DeepReadonly<Ref<UnwrapRef<T>>> {
  const reference = ref<T>(s.value);

  const subscription = s.subscribe((v: T) => {
    reference.value = v as UnwrapRef<T>;
  });
  onUnmounted(() => subscription.unsubscribe());

  return readonly(reference);
}

export function EventSubjectToEventHandler(s: Subject<Event>) {
  return (e: Event) => {
    s.next(e);
  };
}
