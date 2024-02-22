import * as VueRouter from "vue-router";

const routes = [
  {
    path: "/",
    name: "calendar",
    component: () => import("@pages/Calendar.vue"),
  },
];

export const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});
