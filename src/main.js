import { createApp } from 'vue'
import router from './router'
import Homepage from './homepage.vue'
import './assets/main.css'

const app = createApp(Homepage)

app.use(router)

app.mount('#app')
