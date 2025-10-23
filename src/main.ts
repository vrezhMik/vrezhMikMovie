import { createApp } from 'vue'
import App from './App.vue'
import { router } from './app/router'
import './assets/tailwind.css'
import './main.css'

createApp(App).use(router).mount('#app')
