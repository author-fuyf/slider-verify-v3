import { createVNode, render } from 'vue';
import ToastConstructor from './index.vue'

type optType = {
  [propName: string]: any
}

const body = document.body;
const Toast: any = function (options: optType = {}) {
  const modelDom = body.querySelector(`.uco-toast`)
  if (modelDom) {
    body.removeChild(modelDom)
  }
  const container = document.createElement('div')
  container.className = `uco-toast`
  //创建虚拟节点
  const vm = createVNode(
    ToastConstructor,
    {isShow: true, ...options},
  )
  //渲染虚拟节点
  render(vm, container)
  document.body.appendChild(container);
}
export default Toast