import { App } from 'vue'

// import toast from './Toast/index';
// import Button from './Button/index.vue';
import SliderVerify from './SliderVerify/index.vue';

const install = function (app: App): void {
  // app.provide('$toast', toast)
  // app.component(Button.name, Button)
  app.component(SliderVerify.name, SliderVerify)
}

// 默认导出 install
export default {
  install,
};