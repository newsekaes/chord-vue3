import { createApp } from 'vue'
import store from "./store"
import router from './router'
import components from './components'
import App from './App'
import '@/style/index.scss'

const app = createApp(App)
app.use(store)
app.use(router)
components(app)
app.mount('#app')
