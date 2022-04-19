import {
  Scene,
  Engine,
  FreeCamera,
  HemisphericLight,
  Vector3,
  SceneLoader,
  ArcFollowCamera,
  CubeTexture
} from '@babylonjs/core'
// import gltfa from '../asset/box/Box.gltf'
import gltfb from '../asset/DamagedHelmet/DamagedHelmet.gltf'
import hdrEnv from '../asset/texture/environment.dds'

export class GltfPlayground {
  public static CreateScene (engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine)
    console.log(hdrEnv)
    const hdrTexture = CubeTexture.CreateFromPrefilteredData(hdrEnv, scene)
    scene.createDefaultSkybox(hdrTexture, true)
    // This creates and positions a free camera (non-mesh)
    const camera = new FreeCamera('camera1', new Vector3(0, 0, -0), scene)

    // This targets the camera to scene origin
    camera.setTarget(Vector3.Zero())

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true)

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene)

    // Default intensity is 1. Let's dim the light a small amount
    // light.intensity = 0.7
    SceneLoader.Append('', (gltfb as string).slice(1), scene, function (scene) {
      // Create a default arc rotate camera and light.
      scene.createDefaultCameraOrLight(true, true, true)
      // The default camera looks at the back of the asset.
      // Rotate the camera by 180 degrees to the front of the asset.
      // scene.activeCamera!.alpha += Math.PI
      const camera = scene.activeCamera as ArcFollowCamera
      camera.alpha += (4 * Math.PI) / 5
      camera.beta -= Math.PI / 16
    })
    return scene
  }
}
