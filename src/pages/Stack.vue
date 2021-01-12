<template>
  <div
    :class="$style.root"
    ref="root"
    :style="{ backgroundImage: `url(${src})` }"
  ></div>

  <p :class="$style.debug" v-if="isDebug">
    Velocity: {{ velocity.toFixed(4) }} px/ms<br />
    Alpha (Pan): {{ orientation.alpha.toFixed(0) }} degree<br />
    Beta (Tilt): {{ orientation.beta.toFixed(0) }} degree<br />
  </p>

  <button
    v-if="!isDeviceOrientationGranted"
    :class="$style.calibrate"
    type="button"
    @click.once="requestDeviceOrientationOrAlert"
  >
    <Compass :class="$style.compass" />
  </button>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from "vue";
import Compass from "../components/Compass.vue";
import { makeStack } from "../stack";
import {
  getDeviceOrientationSubject,
  deviceOrientationGrantedSubject,
  requestDeviceOrientation,
} from "../deviceOrientation";
import { type2PortraitImageUrl, ImageType } from "../images";
import { behaviorSubjectToRef } from "../utilities";
import { pipeToPi } from "../socket";

export default defineComponent({
  name: "Stack",
  components: { Compass },
  props: {
    type: {
      type: String as PropType<ImageType>,
      required: true,
    },
  },
  setup(props) {
    const src = computed(() => type2PortraitImageUrl(props.type));
    const root = ref<HTMLDivElement | null>(null);

    const velocitySubject = makeStack(src, root);
    const velocity = behaviorSubjectToRef(velocitySubject);

    const orientationSubject = getDeviceOrientationSubject();
    const orientation = behaviorSubjectToRef(orientationSubject);
    const isDeviceOrientationGranted = behaviorSubjectToRef(
      deviceOrientationGrantedSubject
    );

    async function requestDeviceOrientationOrAlert() {
      if (!(await requestDeviceOrientation())) {
        alert("This app can't work without device orientation data.");
      }
    }

    pipeToPi(velocitySubject, orientationSubject);

    return {
      src,
      root,
      velocity,
      orientation,
      isDebug: process.env.NODE_ENV === "development",
      requestDeviceOrientationOrAlert,
      isDeviceOrientationGranted,
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

.debug {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  line-height: 1.2;
  color: var(--color-white);
  background-color: #333333c0;
  font-size: 1.4rem;
  pointer-events: none;
  padding: 5px;
}

.calibrate {
  position: absolute;
  bottom: 0;
  padding: 5px;
  right: 0;
}

.compass {
  width: 50px;
  color: var(--color-white);
  background-color: #333333c0;
}
</style>
