<template>
  <div class="about">
    <!--  :imgUrl="'https://portal.fuyunfeng.top/files/images/SliderVerify-3.jpg'" -->
    <div class="opreation">
      <span @click="imgUrl = 'https://portal.fuyunfeng.top/files/images/SliderVerify-31.jpg'">imgUrl</span>
      <span @click="isShowSelf = !isShowSelf">isShowSelf</span>
      <span @click="width = 400">width 400</span>
      <span @click="height = 200">height 220</span>
      <span @click="isBorder = !isBorder">isBorder 取反</span>
      <span @click="isParentNode = !isParentNode">isParentNode 取反</span>
      <span @click="isCloseBtn = !isCloseBtn">isCloseBtn 取反</span>
      <span @click="isReloadBtn = !isReloadBtn">isReloadBtn 取反</span>
    </div>
    <SliderVerify 
        v-model:isShowSelf="isShowSelf"
        :width="width"
        :height="height"
        :isBorder="isBorder"
        :imgUrl="imgUrl"
        :isCloseBtn="isCloseBtn"
        :isReloadBtn="isReloadBtn"
        :isParentNode="isParentNode"
        @reload="reload"
        @show="show"
        @hide="hide"
        @close="close"
        @success="success"
        @fail="fail"></SliderVerify>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
} from 'vue'
export default defineComponent({
  setup() {
    const state = reactive({
      isShowSelf: true,
      width: 300,
      height: 180,
      isBorder: true,
      imgUrl: '',
      isCloseBtn: true,
      isReloadBtn: true,
      isParentNode: false
    })

    const show = () => {
      console.log('show')
    }
    const hide = () => {
      console.log('hide')
    }
    const close = () => {
      console.log('close')
    }
    const success = () => {
      console.log('success')
    }
    const fail = () => {
      console.log('fail')
    }
    const reload = () => {
      console.log('reload')
    }
    return {
      ...toRefs(state),
      show,
      hide,
      close,
      success,
      fail,
      reload
    }
  }
})
</script>
<style lang="stylus">
.opreation {
  display: flex;

  span {
    margin-left: 20px;
  }
}
</style>
