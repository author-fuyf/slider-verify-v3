一个基于vue3.js和canvas的滑块拼图校验插件, 支持PC、移动端.
<p>
  <a href="https://github.com/author-fuyf/slider-verify-v2/stargazers" target="_black">
    <img src="https://img.shields.io/github/stars/author-fuyf/slider-verify-v2?color=%23ffca28&logo=github&style=flat-square" alt="stars" />
  </a>
  <a href="https://github.com/author-fuyf/slider-verify-v2/network/members" target="_black">
    <img src="https://img.shields.io/github/forks/author-fuyf/slider-verify-v2?color=%23ffca28&logo=github&style=flat-square" alt="forks" />
  </a>
  <a href="https://www.npmjs.com/package/slider-verify-v2" target="_black">
    <img src="https://img.shields.io/npm/v/slider-verify-v2?color=%23ffca28&logo=npm&style=flat-square" alt="version" />
  </a>
<!--   <a href="https://www.npmjs.com/package/slider-verify-v2" target="_black">
    <img src="https://img.shields.io/npm/dm/slider-verify-v2?color=%23ffca28&logo=npm&style=flat-square" alt="downloads" />
  </a> -->
</p>

## Demo演示

> **plugins_v2**：[https://portal.fuyunfeng.top/plugins_v2/index.html](https://portal.fuyunfeng.top/plugins_v2/index.html)  

## 使用

### vue-cli
> vue-cli 中使用

1. 首先安装插件

```shell
# npm 安装：
npm install slider-verify-v2 -S
```

2. `main.js` 中引入

```js
import SliderVerify from 'slider-verify-v2'
import 'slider-verify-v2/lib/SliderVerify.css'
Vue.use(SliderVerify)
```

3. 组件中声明

```vue
<template>
  <div>
    <SliderVerify
      :imgUrl="sliderVConf.imgUrl"
      :sText="sliderVConf.sText"
      :eText="sliderVConf.eText"
      :isShowSelf.sync="sliderVConf.isShowSelf"
      :isBorder="sliderVConf.isBorder"
      :isParentNode="sliderVConf.isParentNode"
      :isCloseBtn="sliderVConf.isCloseBtn"
      :isReloadBtn="sliderVConf.isReloadBtn"
      :width="sliderVConf.width"
      :height="sliderVConf.height"
    ></SliderVerify>
  </div>
</template>
```

### script标签
> 实际使用建议**下载到本地或服务器**

- **引入样式：** [https://portal.fuyunfeng.top/api/files/download_file?file_name=SliderVerify.css](https://portal.fuyunfeng.top/api/files/download_file?file_name=SliderVerify.css)

- **引入JS：** [https://portal.fuyunfeng.top/api/files/download_file?file_name=SliderVerify.umd.js](https://portal.fuyunfeng.top/api/files/download_file?file_name=SliderVerify.umd.js)


```html
<meta charset="utf-8">
<title>SliderVerify demo</title>
<link rel="stylesheet" href="./SliderVerify.css">
<body>
  <div id="app">
    <slider-verify :is-show-self.sync="isShowSelf"></slider-verify>
  </div>
</body>
<script src="./vue.min.js"></script>
<script src="./SliderVerify.umd.js"></script>

<script>
  new Vue({
    data() {
      return {
        isShowSelf: true
      }
    }
  }).$mount('#app')
</script>
```
## 更详细的
### 参数

- __isShowSelf__: 显隐控制，组件自身提供关闭功能按钮，建议与.sync修饰符绑定，否则需要在`close`回调事件中自行处理, 默认 `false`.
- __width__: 图片宽度 默认 `300`.
- __height__: 图片高度 默认 `180`.
- __imgUrl__: 自定义图片地址, 如https://...的绝对路径, 需要设置资源允许跨域, `默认图片随机切换`.
- __sText__: 校验成功的提示, 默认 `验证通过`.
- __eText__: 校验失败的提示, 默认 `请正确拼合图像`.
- __isBorder__: 自带的外层边框, 默认 `true`.
- __isCloseBtn__: 底部操作栏 - 关闭按钮, 默认 `true`.
- __isReloadBtn__: 底部操作栏 - 刷新按钮, 默认 `true`.
- __isParentNode__: 是否以父级宽度控制, 在类似其他外部弹窗中调用时很有用, 无需指定宽度, 以父级宽度为准, 默认 `false`

### 事件
- __show__: 展现时触发.
- __hide__: 隐藏时触发.
- __close__: 主动关闭时触发.
- __success__: 校验成功时触发.
- __fail__: 校验失败时触发.
- __reload__: 刷新时触发.


## 参考链接

- [https://juejin.cn/post/6844903940262199303](https://juejin.cn/post/6844903940262199303)
- [https://www.jb51.net/article/137129.htm](https://www.jb51.net/article/137129.htm)


