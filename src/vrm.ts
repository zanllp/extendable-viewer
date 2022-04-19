import './registerServiceWorker'
import {
  Scene,
  Engine,
  HemisphericLight,
  Vector3,
  SceneLoader,
  ArcRotateCamera
} from '@babylonjs/core'
import 'babylon-vrm-loader'
import girl from '../asset/vrm/girl.vrm'

export class VrmPlayground {
  public static async CreateScene (engine: Engine, canvas: HTMLCanvasElement) {
    const scene = new Scene(engine)
    const camera = new ArcRotateCamera('MainCamera1', 0, 0, 3, new Vector3(0, 1.2, 0), scene)
    camera.lowerRadiusLimit = 0.1
    camera.upperRadiusLimit = 20
    camera.wheelDeltaPercentage = 0.01
    camera.minZ = 0.3
    camera.position = new Vector3(0, 1.2, -3)
    camera.attachControl(canvas, true)
    const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene)
    await SceneLoader.AppendAsync('', girl.slice(1), scene)
    return scene
  }
}
