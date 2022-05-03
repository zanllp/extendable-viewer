import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useSkyboxStore = defineStore('skybox', () => {
  const effect = reactive({
    turbidity: 10,
    rayleigh: 3,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.7,
    elevation: 2,
    azimuth: 180,
    exposure: 0.5
  })
  return {
    effect
  }
})
