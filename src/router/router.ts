import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import layout from "@/layout/default.vue";
import home from "@/pages/home/home.vue";
import search from "@/pages/search/search.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: layout,
    redirect: "/home",
    children: [
      {
        path: "home",
        name: "home",
        component: home
      },
      {
        path: "search",
        name: "search",
        component: search
      },
    ]
  },

  // {
  //   path: '/Login',
  //   name: 'login',
  //   component: Login
  // }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
