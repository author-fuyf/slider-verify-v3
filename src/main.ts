import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import vplugin from './components/index';

createApp(App).use(store).use(router).use(vplugin).mount('#app')
