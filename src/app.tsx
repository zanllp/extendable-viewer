import { useWindowSize } from '@vueuse/core'
import { defineComponent, onMounted, ref } from 'vue'
import './registerServiceWorker'
import { ok } from 'assert'
import { Engine, Mesh, Scene } from '@babylonjs/core'
import {
  AdvancedDynamicTexture,
  Button,
  Control,
  RadioButton,
  Rectangle,
  StackPanel,
  TextBlock
} from '@babylonjs/gui'
import 'babylon-vrm-loader'
import { GltfPlayground } from './gltf'
import { ballTop } from './ballTop'
import { VrmPlayground } from './vrm'

export const App = defineComponent({
  setup () {
    const ele = ref<HTMLCanvasElement>()
    const { width, height } = useWindowSize()
    onMounted(async () => {
      const canvas = ele.value
      ok(canvas)
      const engine = new Engine(canvas, true, {
        preserveDrawingBuffer: true,
        stencil: true
      })
      type Target = 'pbr' | 'ball' | 'girl'
      const currTarget: { v: Target } = { v: 'girl' }
      const createScene = async (t: Target) => {
        let scene: Scene
        switch (t) {
          case 'ball':
            scene = ballTop(engine, canvas)
            break
          case 'girl':
            scene = await VrmPlayground.CreateScene(engine, canvas)
            break
          default:
            scene = GltfPlayground.CreateScene(engine, canvas)
        }
        const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI('UI')

        const panel = new StackPanel()
        advancedTexture.addControl(panel)

        panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP
        panel.top = '50px'

        const addRadio = (text: 'pbr' | 'ball' | 'girl') => {
          const button = Button.CreateSimpleButton('but' + text, text)
          button.width = 0.2
          button.height = '40px'
          button.color = 'white'
          button.background = 'green'
          panel.addControl(button)

          button.onPointerClickObservable.add(function (state) {
            currTarget.v = text
          })
        }

        addRadio('ball')
        addRadio('girl')
        addRadio('pbr')
        return scene
      }
      const scenes = {
        pbr: await createScene('pbr'),
        girl: await createScene('girl'),
        ball: await createScene('ball')
      }

      const getCurrScene = () => scenes[currTarget.v]

      engine.runRenderLoop(function () {
        getCurrScene().render()
      })
      window.addEventListener('resize', function () {
        engine.resize()
      })
    })
    return () => (
      <canvas ref={ele} height={height.value} width={width.value}></canvas>
    )
  }
})
