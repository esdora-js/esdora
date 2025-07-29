<script setup lang="ts">
import { isFirefox, isSafari } from '@esdora/kit/web'
import { onMounted, ref } from 'vue'

const userAgent = ref('')
const platform = ref('')

onMounted(() => {
  const ua = navigator.userAgent
  userAgent.value = ua

  if (isSafari(ua)) {
    platform.value = 'isSafari'
  }
  else if (isFirefox(ua)) {
    platform.value = 'isFirefox'
  }
  else {
    platform.value = 'isChrome'
  }
})
</script>

<template>
  <div>
    <p>当前ua：{{ userAgent }}</p>
    <p>当前平台：{{ platform }}</p>
  </div>
</template>
