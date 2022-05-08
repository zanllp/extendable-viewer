import { defineStore } from 'pinia'
import { reactive, ref, toRefs } from 'vue'

export const useCameraStore = defineStore('camera', () => {
  const store = reactive({
    enable: true,
    rotate: 0,
    x: 0,
    y: 0,
    z: 0
  })
  return {
    ...toRefs(store)
  }
})
