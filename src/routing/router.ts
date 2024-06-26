import { createMemoryHistory, createRouter } from 'vue-router'

const HomePage = () => import("../pages/HomePage.vue");
const OrderBookPage = () => import("../pages/OrderBookPage.vue");
const SettingsPage = () => import("../pages/SettingsPage.vue");
import {indexRoute, orderBookRoute, settingsRoute} from "./routes";

export const routes = [
  { path: indexRoute, component: HomePage },
  { path: orderBookRoute, component: OrderBookPage, meta: {} },
  { path: settingsRoute, component: SettingsPage },
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})
