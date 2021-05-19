<template>
  <div id="plugin-slider-verify_containe">
    <!-- <div style="display: none">
      <img ref="bgImgRef" crossOrigin :src="imgUrl" v-if="imgUrl" />
      <img ref="bgImgRef" :src="require(`./images/bg${bgRandom}.jpg`)" v-else />
    </div> -->
    <div
      id="slider-verify"
      :class="{ 'is-border': isBorder }"
      v-show="isShowSelf"
    >
      <div
        id="verify_containe"
        :class="{ 'is-opt': isCloseBtn || isReloadBtn }"
      >
        <div id="canvas_containe">
          <div
            class="loading"
            :style="{ width: `${width}px`, height: `${height}px` }"
            v-if="loading"
          >
            <loading type="circular" vertical>
              <span>加载中...</span>
            </loading>
          </div>
          <canvas id="bg_canvas" v-show="!loading"></canvas>
          <canvas
            v-show="!loading"
            id="block_canvas"
            @mousedown.prevent="(e) => drag(e, 'block_canvas', 'circle')"
            @touchstart="
              (e) => {
                terminal = 'mobile'
                drag(e, 'block_canvas', 'circle')
              }
            "
          ></canvas>
        </div>
        <div class="slide-box">
          <div
            id="circle"
            @mousedown.prevent="(e) => drag(e, 'circle', 'block_canvas')"
            @touchstart="
              (e) => {
                terminal = 'mobile'
                drag(e, 'circle', 'block_canvas')
              }
            "
          >
            <div class="verticals" v-show="!isTouch">
              <img src="./images/vertical_line.png" alt="" />
              <img src="./images/vertical_line.png" alt="" />
              <img src="./images/vertical_line.png" alt="" />
            </div>
            <div class="arrow" v-show="isTouch">
              <img src="./images/arrow_left.png" alt="" />
              <img src="./images/circle.png" class="circle" alt="" />
              <img src="./images/arrow_right.png" alt="" />
            </div>
          </div>
          <span id="placehold">拖动滑块完成拼图</span>
        </div>

        <div class="operational" v-if="isCloseBtn || isReloadBtn">
          <img
            src="./images/close.png"
            alt=""
            @click="close"
            v-if="isCloseBtn"
          />
          <img
            src="./images/reload.png"
            alt=""
            @click="reload"
            v-if="isReloadBtn"
          />
        </div>
      </div>
    </div>
    <popup
      v-model:show="popupShow"
      position="bottom"
      :overlay="false"
      :teleport="getContainer()"
      class="result-popup"
      :class="{ 'popup-success': verifyResult }"
    >
      {{ verifyResult ? sText : eText }}
    </popup>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  watch,
  watchEffect,
  onMounted,
  toRefs,
} from 'vue'
import { Popup, Loading, Toast } from 'vant'

const l = 42 // 滑块边长
const r = 9 // 滑块圆半径
const PI = Math.PI
const L = l + r * 2 + 3 // 滑块实际边长
const Y = 70 // 滑块Y轴距离

export default defineComponent({
  name: 'SliderVerify',
  props: {
    // .sync
    isShowSelf: {
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
      default: 300,
    },
    height: {
      type: Number,
      default: 180,
    },
    isBorder: {
      type: Boolean,
      default: true,
    },
    imgUrl: {
      type: String,
      default: '',
    },
    sText: {
      type: String,
      default: '验证通过',
    },
    eText: {
      type: String,
      default: '请正确拼合图像',
    },
    isCloseBtn: {
      type: Boolean,
      default: true,
    },
    isReloadBtn: {
      type: Boolean,
      default: true,
    },
    isParentNode: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Popup,
    Loading,
  },
  emits: ['update:isShowSelf', 'hide', 'show', 'fail', 'success', 'close', 'reload'],
  setup(props, context) {
    const state = reactive({
      popupShow: false,
      verifyResult: false,
      terminal: 'pc',
      blkTilesW: 0,
      bgWidth: 0,
      isTouch: false,
      bgRandom: 0,
      loading: false,
      isLoad: false,
    })

    const reload = () => {
      initCanvas();
      context.emit('reload')
    }

    const close = () => {
      context.emit('update:isShowSelf', false)
      context.emit('close')
    }

    const getContainer = () => {
      return document.getElementById('canvas_containe')
    }

    const drag = (event: any, targetId: string, linkageId: string) => {
      // console.log("clickE => ", event);
      state.isTouch = true
      const targetDom = document.querySelector(
        `#${targetId}`
      ) as HTMLCanvasElement
      const linkageDom = document.querySelector(
        `#${linkageId}`
      ) as HTMLCanvasElement
      const placehold = document.querySelector(
        '#placehold'
      ) as HTMLCanvasElement
      const terminal = state.terminal

      let x = 0
      const move = (moveEV: any) => {
        // console.log("moveE => ", moveEV);
        if (terminal === 'pc') {
          x = moveEV.x - event.x
        } else {
          x = moveEV.changedTouches[0].clientX - event.changedTouches[0].clientX
        }
        // console.log('x', x)
        /**
         * 滑块拖动限定
         *
         */
        if (x < 8) {
          placehold.style.opacity = '1'
        }
        if (x >= state.bgWidth - L || x <= -2) return false
        targetDom.style.left = x + 'px'
        linkageDom.style.left = x + 'px'
        placehold.style.opacity = '0'
      }

      const up = () => {
        state.isTouch = false
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)

        document.removeEventListener('touchmove', move)
        document.removeEventListener('touchend', up)

        // console.log('x', x)

        // 图块契合度 左右5 偏差
        const intervalMax = state.blkTilesW + 5
        const intervalMin = state.blkTilesW - 5
        if (x >= intervalMin && x <= intervalMax) {
          state.verifyResult = true
          context.emit('success')
        } else {
          state.verifyResult = false
          context.emit('fail')
        }

        state.popupShow = true
        setTimeout(() => {
          state.popupShow = false
        }, 500)
        targetDom.style.left = '0'
        linkageDom.style.left = '0'
        initCanvas()
      }

      if (terminal === 'pc') {
        document.addEventListener('mousemove', move)
        document.addEventListener('mouseup', up)
      } else {
        document.addEventListener('touchmove', move)
        document.addEventListener('touchend', up)
      }
    }

    const draw = (ctx: any, xy: { x: number; y: number, r: number }, type: string) => {
      const x = xy.x,
        y = xy.y
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.arc(x + l / 2, y - r + 2, r, 0.72 * PI, 2.26 * PI)
      ctx.lineTo(x + l, y)
      ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI)
      ctx.lineTo(x + l, y + l)
      ctx.lineTo(x, y + l)
      ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true)
      ctx.lineTo(x, y)
      ctx.lineWidth = 1
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'
      ctx.stroke()
      ctx.globalCompositeOperation = 'destination-over'
      type === 'fill' ? ctx.fill() : ctx.clip()
    }

    const initCanvas = () => {
      state.loading = true

      const bg_canvas = document.getElementById(
        'bg_canvas'
      ) as HTMLCanvasElement
      const bg_ctx = bg_canvas.getContext('2d')

      const block_canvas = document.getElementById(
        'block_canvas'
      ) as HTMLCanvasElement
      const block_ctx = block_canvas.getContext('2d')

      const placehold = document.getElementById(
        'placehold'
      ) as HTMLCanvasElement
      placehold.style.opacity = '1'

      const random = (max: number, min: number): number => {
        // return Math.floor(Math.random() * (max - min) + min)
        return Math.floor(Math.random() * (min - max) + max)
      }

      // const img = state.$refs.bgImgRef
      // img.src = require(`./images/bg${bgRandom}.jpg`)
      const bgRandom = random(3, 0)
      const img = new Image()
      img.crossOrigin = 'Anonymous'
      img.src = props.imgUrl
        ? props.imgUrl
        : `https://portal.fuyunfeng.top/files/images/SliderVerify-${bgRandom}.jpg`
      img.onerror = () => {
        Toast({
          message: '图片加载失败',
          position: 'top',
        })
        img.src =
          'https://portal.fuyunfeng.top/files/images/SliderVerify-error.png'
      }

      /**
       * 默认width
       * isParentNode 父级宽度100%
       * -20 为两边10px的padding
       * -2  默认border线框时
       *
       */
      let width = props.width

      if (props.isParentNode) {
        const sliderVerify = document.getElementById(
          'plugin-slider-verify_containe'
        ) as HTMLCanvasElement
        // const s_verify_width = sliderVerify.parentNode.clientWidth
        const s_verify_width = sliderVerify.parentElement?.getBoundingClientRect()
          .width
        // sliderVerify.style.width = s_verify_width

        s_verify_width ? (width = s_verify_width - 20) : null
        if (props.isBorder) {
          width = width - 2
        }
      }

      const height = props.height

      /**
       * 滑块随机受控图形区间内 x轴
       * L + 10 滑块边长 + 10px间隙
       */
      state.bgWidth = width
      const blkTilesW = random(L + 10, width - (L + 10))
      state.blkTilesW = blkTilesW

      bg_canvas.width = width
      bg_canvas.height = height
      block_canvas.width = width
      block_canvas.height = height

      img.onload = () => {
        state.loading = false
        // console.log('onload')

        draw(bg_ctx, { x: blkTilesW, y: Y, r: r }, 'fill')
        draw(block_ctx, { x: blkTilesW, y: Y, r: r }, 'clip')

        bg_ctx?.drawImage(img, 0, 0, width, height)
        block_ctx?.drawImage(img, 0, 0, width, height)

        // 提取滑块放至左侧 并重置滑块画布宽度
        const y = Y - r * 2 - 1
        const ImageData = block_ctx?.getImageData(blkTilesW - 3, y, L, L)
        block_canvas.width = L
        ImageData ? block_ctx?.putImageData(ImageData, 0, y) : null
        state.isLoad = true
      }
    }

    watch(
      () => props.isShowSelf,
      (newVal) => {
        if (newVal) {
          return context.emit('show')
        }
        context.emit('hide')
      }
    )

    watchEffect(() => {
      const width = props.width
      const height = props.height
      const isBorder = props.isBorder
      const imgUrl = props.imgUrl
      const isParentNode = props.isParentNode
      console.log(width, height, isBorder, imgUrl, isParentNode)
      if (state.isLoad) initCanvas()
    })

    onMounted(() => {
      console.log('SliderVerify init')
      initCanvas()
    })

    return {
      context,
      ...toRefs(state),
      drag,
      close,
      reload,
      getContainer,
    }
  },
})
</script>

<style lang="stylus" scoped>
::v-deep .van-overlay {
  position: absolute;
}

::v-deep .van-popup {
  position: absolute;
}

/deep/ .result-popup {
  height: 30px;
  line-height: 30px;
  color: white;
  background: #DE715B;
  text-align: center;
}

/deep/ .popup-success {
  background: #41B883;
}

.is-border {
  border: 1px solid rgb(199, 198, 198);
}

#slider-verify {
  width: auto;
  height: auto;
  display: inline-block;
  // margin: 20px auto 0;
  padding: 10px;
  border-radius: 5px;
  overflow: hidden;

  .is-opt {
    padding-bottom: 45px;
  }

  #verify_containe {
    position: relative;

    #canvas_containe {
      position: relative;
      line-height: 0;

      .result-popup {
        height: 30px;
        line-height: 30px;
        color: white;
        background: #DE715B;
        text-align: center;
      }

      .popup-success {
        background: #41B883;
      }

      .is-border {
        border: 1px solid rgb(199, 198, 198);
      }

      #block_canvas {
        position: absolute;
        left: 0px;
        cursor: pointer;
      }

      .loading {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .slide-box {
      width: 100%;
      height: 40px;
      margin-top: 15px;
      border-radius: 20px;
      background: #DFE0E1;
      position: relative;
      color: #A3ABB3;
      display: flex;
      align-items: center;
      justify-content: center;

      #circle {
        width: 50px;
        height: 50px;
        top: -8px;
        left: 0;
        border-radius: 50px;
        position: absolute;
        background: white;
        border: 1px solid #D0D0D0;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;

        .verticals {
          display: flex;
          align-item: center;

          img {
            width: 8px;
            height: 16px;
          }
        }

        .arrow {
          display: flex;
          align-items: center;

          img {
            width: 13px;
            height: 16px;
          }

          img.circle {
            width: 13px;
            height: 13px;
          }
        }
      }

      #placehold {
        transition: opacity 0.3s;
        user-select: none;
      }
    }

    .operational {
      position: absolute;
      width: 100%;
      height: 32px;
      left: -10px;
      bottom: 0;
      border-top: 1px solid #EAE8E8;
      padding: 0 10px;
      display: flex;
      align-items: flex-end;

      img:first-child {
        margin-left: 0;
      }

      img {
        width: 22px;
        height: 22px;
        margin-left: 10px;
        cursor: pointer;
      }
    }
  }
}
</style>
