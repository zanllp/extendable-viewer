import { defineComponent, onMounted, provide, ref, watch } from 'vue'
import { setup3d } from './3d'
import styles from './app.module.scss'
import { ControlPanel } from './ui/ControlPanel'
import { BottomTabPanel } from './ui/BottomTabPanel'
import { AppLifecycle, events } from './util'
import { SplitView, truthy, useDomRect } from 'vue3-ts-util-lite'
import { debounce } from 'lodash'
import { PluginController } from './plugins/pluginController'

export const App = defineComponent({
  setup () {
    const canvas = ref<HTMLCanvasElement>()
    const canvasWrap = ref<HTMLDivElement>()
    const canvasRect = useDomRect(canvasWrap)
    const pluginController = new PluginController()
    provide(PluginController.InjectKey, pluginController)
    onMounted(async () => {
      events.emit(AppLifecycle.init)
      const ele = truthy(canvas.value)
      const { renderer, camera } = await setup3d(ele)
      watch(
        () => canvasRect.rect.value,
        debounce((rect) => {
          if (rect) {
            renderer.setSize(rect.width, rect.height)
            renderer.setPixelRatio(window.devicePixelRatio)
            camera.aspect = rect.width / rect.height
            camera.updateProjectionMatrix()
          }
        }, 300),
        { immediate: true }
      )
    })
    return () => (
      <div class={styles.container}>
        <SplitView direction="horizontal" percent={15}>
          {{
            left: <ControlPanel class={styles['main-left-bar']} />,
            right: (
              <SplitView direction="vertical" percent={70}>
                {{
                  left: (
                    <div ref={canvasWrap} style={{ height: '100%' }}>
                      <canvas
                        class={styles['main-canvas']}
                        ref={canvas}
                      ></canvas>
                    </div>
                  ),
                  right: (
                    <div class={styles['bottom-Tab-panel']}>
                      <BottomTabPanel></BottomTabPanel>
                    </div>
                  )
                }}
              </SplitView>
            )
          }}
        </SplitView>
      </div>
    )
  }
})
