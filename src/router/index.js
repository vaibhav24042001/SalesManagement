/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from "vue-router";
import index from "@/pages/index.vue";
import Home from "@/pages/Home.vue";
import Addlead from "@/components/Addlead.vue";

const routes = [
  {
    path: "/",
    name: "index",
    component: index,
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/Addlead",
    name: "Addlead",
    component: Addlead,
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
