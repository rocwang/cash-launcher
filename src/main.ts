import { createApp } from "vue";
import App from "./App.vue";
import Menu from "./pages/Menu.vue";
import Stack from "./pages/Stack.vue";
import { createRouter, createWebHistory } from "vue-router";

const app = createApp(App);

app.use(
  createRouter({
    history: createWebHistory(),
    routes: [
      { path: "/", component: Menu },
      { path: "/stack/:type", component: Stack, props: true },
    ],
  })
);

document.addEventListener("DOMContentLoaded", () => app.mount(document.body));
