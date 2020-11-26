<template>
  <teleport to="head" v-if="!serverRendered">
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width,initial-scale=1.0,user-scalable=no"
    />
    <meta name="theme-color" content="#D22F27" />
    <meta
      name="description"
      content="Physical cash launcher controlled by mobile"
    />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta
      name="apple-mobile-web-app-status-bar-style"
      content="black-translucent"
    />
    <title>Cash Launcher</title>
    <link
      rel="icon"
      href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💸</text></svg>"
      type="image/svg+xml"
    />
    <link rel="author" href="https://kiwiberry.nz/" />
  </teleport>
</template>

<script>
export default {
  name: "HtmlHead",
  setup() {
    return {
      serverRendered: document.body.dataset.serverRendered === "true",
    };
  },
};
</script>
