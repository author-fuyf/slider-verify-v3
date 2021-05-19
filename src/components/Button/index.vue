<template>
  <span :class="type" style="padding: 5px 10px; border-radius: 5px; background: #41B883; color: white;" :style="type === 'warning' ? 'color: yellow;' : ''" @click="click">
    <slot>{{ text }}</slot>
  </span>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'v-button',
  props: {
    type: {
      type: String,
      default: 'error'
    }
  },
  setup(props, context) {
    const text = ref('确定')
    const click = () => {
      context.emit('eclick')
    }
    return {
      text,
      click
    }
  }
})
</script>

<style lang="stylus" scoped>
</style>
