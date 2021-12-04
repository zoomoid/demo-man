import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import { Buffer } from "buffer";

(<any>window).Buffer = Buffer;

createApp(App).mount('#app')
