import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { App } from './app'
import './registerServiceWorker'
import './app.scss'
import 'ant-design-vue/dist/antd.variable.min.css'
import { ConfigProvider } from 'ant-design-vue'
ConfigProvider.config({
  theme: {
    primaryColor: '#1453ad'
  }
})
createApp(App).use(createPinia()).mount('#app')
