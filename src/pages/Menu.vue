<template>
  <ul :class="$style.root">
    <li
      v-for="(item, i) in items"
      :key="item.src"
      :class="$style.item"
      :style="{ zIndex: items.length - i }"
    >
      <router-link :to="item.to" :class="$style.link">
        <img :src="item.src" alt="Banknote or red envelopes" :class="$style.image"/>
      </router-link>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import cny from "@/assets/cny-landscape.webp";
import gbp from "@/assets/gbp-landscape.webp";
import nzd from "@/assets/nzd-landscape.webp";
import usd from "@/assets/usd-landscape.webp";
import redEnvelope from "@/assets/red-envelope-landscape.svg";

export default defineComponent({
  name: "Menu",
  setup() {
    const items = [
      {
        src: usd,
        to : "/stack/usd",
      },
      {
        src: nzd,
        to : "/stack/nzd",
      },
      {
        src: cny,
        to: "/stack/cny",
      },
      {
        src: gbp,
        to : "/stack/gbp",
      },
      {
        src: redEnvelope,
        to: "/stack/red-envelope",
      },
    ];

    return {
      items,
    };
  },
});
</script>

<style module>
.root {
  display: grid;
  grid-template-columns: 100%;
  grid-auto-rows: 20%;
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
