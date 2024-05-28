/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'
import {createPinia} from "pinia";
import {router} from "./routing/router";

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

const app = createApp(App);
export const pinia = createPinia();
registerPlugins(app);
app.use(pinia);
app.use(router);
app.mount('#app');
