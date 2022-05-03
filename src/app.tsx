import { defineComponent, onMounted, ref } from 'vue'
import { setup3d } from './3d'
import { ok } from 'assert'
import styles from './app.module.scss'
import { ControlPanel } from './ui/ControlPanel'

export const App = defineComponent({
  setup () {
    const canvas = ref<HTMLCanvasElement>()
    onMounted(async () => {
      const ele = canvas.value
      ok(ele)
      const { renderer, camera } = await setup3d(ele)
      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      })
    })

    return () => (
      <div>
        <div class={styles['left-fixed-area']}>
          <ControlPanel />
        </div>
        <canvas ref={canvas}></canvas>
      </div>
    )
  }
})
