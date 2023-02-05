import { createRouter, createWebHistory } from "vue-router";
import Daily from "../components/DailyForecast.vue";
import Hourly from "../components/HourlyForecast.vue";

const routerHistory = createWebHistory("/dope-weather");

const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: "/",
      component: Daily,
    },
    {
      path: "/hourly",
      component: Hourly,
    },
    {
      path: "/daily",
      component: Daily,
    },
  ],
});

export default router;
