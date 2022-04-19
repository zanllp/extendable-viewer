import { useWindowSize } from '@vueuse/core'
import { defineComponent, onMounted, ref } from 'vue'
import './registerServiceWorker'
import { ok } from 'assert'
import {
  Scene,
  Engine,
  FreeCamera,
  HemisphericLight,
  Vector3,
  SceneLoader
} from 'babylonjs'
import { GLTFFileLoader } from 'babylonjs-loaders'
import gltfa from '../asset/box/Box.gltf'
import gltfb from '../asset/DamagedHelmet/DamagedHelmet.gltf'
SceneLoader.RegisterPlugin(new GLTFFileLoader())
console.log(gltfa)
class Playground {
  public static CreateScene (engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine)

    // This creates and positions a free camera (non-mesh)
    const camera = new FreeCamera('camera1', new Vector3(0, 5, -10), scene)

    // This targets the camera to scene origin
    camera.setTarget(Vector3.Zero())

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true)

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene)

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7
    SceneLoader.Append('', (gltfb as string).slice(1), scene, function (scene) {
      // Create a default arc rotate camera and light.
      scene.createDefaultCameraOrLight(true, true, true)

      // The default camera looks at the back of the asset.
      // Rotate the camera by 180 degrees to the front of the asset.
      // scene.activeCamera!.alpha += Math.PI;
    })
    return scene
  }
}
export const App = defineComponent({
  setup () {
    const ele = ref<HTMLCanvasElement>()
    const { width, height } = useWindowSize()
    onMounted(() => {
      const canvas = ele.value
      ok(canvas)
      const engine = new Engine(canvas, true, {
        preserveDrawingBuffer: true,
        stencil: true
      })
      const scene = Playground.CreateScene(engine, canvas)
      engine.runRenderLoop(function () {
        scene.render()
      })
      // the canvas/window resize event handler
      window.addEventListener('resize', function () {
        engine.resize()
      })
    })

    return () => (
      <canvas ref={ele} height={height.value} width={width.value}></canvas>
    )
  }
})
