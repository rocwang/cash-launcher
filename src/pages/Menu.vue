<template>
  <ul :class="$style.root">
    <li
      v-for="(item, i) in imageTypes"
      :key="item"
      :class="$style.item"
      :style="{ zIndex: i }"
    >
      <router-link
        :to="`/stack/${item}`"
        :class="$style.link"
        custom
        v-slot="{ href, navigate }"
      >
        <a
          :href="href"
          @click="requestDeviceOrientationBeforeNavigate($event, navigate)"
        >
          <img
            :src="type2LandscapeImageUrl(item)"
            alt="Banknote or red envelopes"
            :class="$style.image"
          />
        </a>
      </router-link>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { NavigationFailure } from "vue-router";
import { requestDeviceOrientation } from "@/deviceOrientation.ts";
import { ImageType, type2LandscapeImageUrl } from "@/images.ts";

export default defineComponent({
  name: "Menu",
  setup() {
    const imageTypes: ImageType[] = [
      "usd",
      "nzd100",
      "nzd5",
      "cny",
      "gbp",
      "red-envelope",
    ];

    async function requestDeviceOrientationBeforeNavigate(
      event: MouseEvent,
      navigate: (e?: MouseEvent) => Promise<void | NavigationFailure>
    ) {
      event.preventDefault();

      if (await requestDeviceOrientation()) {
        await navigate();
      } else {
        alert("This app can't work without device orientation data.");
      }
    }

    return {
      imageTypes,
      type2LandscapeImageUrl,
      requestDeviceOrientationBeforeNavigate,
    };
  },
});
</script>

<style module>
.root {
  display: grid;
  grid-template-columns: 100%;
  grid-auto-rows: calc(100% / 6);
  place-items: stretch;
  width: 50vh;
  min-width: 414px;
  height: 100vh;
  margin-left: auto;
  margin-right: auto;
}

.item {
  position: relative;
}

.link {
  display: block;
  overflow: hidden;
  box-shadow: #000000 3px 3px 4px;
}
</style>
