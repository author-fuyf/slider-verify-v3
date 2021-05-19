<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <v-button type="test" @eclick="showToast">toast</v-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'

export default defineComponent({
  name: 'Home',
  components: {
  },
  setup() {
    const $toast = inject('$toast') as any
    const showToast = () => {
      $toast({
        msg: 'toast',
      })
    }

    return {
      showToast
    }
  },
})
</script>
