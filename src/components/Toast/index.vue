<template>
  <transition name="fade">
    <div class="uco-toast" v-if="isShow">
      <span>{{ msg }}</span>
    </div>
  </transition>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
export default defineComponent({
  props: {
    msg: {
      type: String,
      default: '成功'
    }
  },
  setup() {
    const isShow = ref(true)
    onMounted(() => {
      setTimeout(() => {
        isShow.value = false
      }, 2000)
    })
    return {
      isShow
    }
  }
});
</script>

<style lang="stylus" scoped></style>
