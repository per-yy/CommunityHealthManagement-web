import './assets/main.css'

import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-persistedstate-plugin'
import router from '@/router'
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'


const app=createApp(App);
const pinia = createPinia();
const persist = createPersistedState();
app.use(pinia);
pinia.use(persist);
app.use(ElementPlus);
app.use(router);
app.mount('#app');
