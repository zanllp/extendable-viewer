/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAnimationStore } from '@/store/animation'
import { useCameraStore } from '@/store/camera'
import { videoRecordFromCanvas } from '@/videoRecorder'
import { allPose, PoseType } from '@/vrm/pose'
import { VRMSchema } from '@pixiv/three-vrm'
import { inject, Ref } from 'vue'

export type CameraParams = Pick<ReturnType<typeof useCameraStore>, 'x' | 'y' | 'z' | 'rotate'>

export class ActionController {
  // eslint-disable-next-line no-useless-constructor
  constructor (private pluginController: PluginController) {

  }

  setPose (pose: string) {
    this.pluginController.setPose(this, pose)
  }

  setBlendShape (blendShape:string[]) {
    this.pluginController.setBlendShape(this, blendShape)
  }

  updateCamera (params: Partial<CameraParams> | ((v: CameraParams) => Partial<CameraParams>)) {
    this.pluginController.updateCamera(this, params)
  }

  free () {
    this.pluginController.freeActionController(this)
  }
}

export class PluginController {
  private poses = new Array<string>()
  private currActionController?: ActionController

  constructor (private animation = useAnimationStore(), private camera = useCameraStore()) {
    this.poses = Object.keys(allPose)
  }

  getAllPose () {
    return this.poses
  }

  getBlendShapes () {
    return this.animation.availableBlendShapes
  }

  getActionController () {
    if (this.currActionController) {
      throw new Error('exists unfree ActionController')
    }
    this.currActionController = new ActionController(this)
    return this.currActionController
  }

  freeActionController (controller: ActionController) {
    if (controller === this.currActionController) {
      this.currActionController = undefined
    }
    return !!this.currActionController
  }

  setPose (controller: ActionController, pose: string) {
    if (controller !== this.currActionController) {
      return
    }
    this.animation.pose = pose as PoseType
  }

  setBlendShape (controller: ActionController, blendShape:string[]) {
    if (controller !== this.currActionController) {
      return
    }
    this.animation.selectedBlendshape = [...blendShape] as VRMSchema.BlendShapePresetName[]
  }

  updateCamera (controller: ActionController, params: Partial<CameraParams> | ((v: CameraParams) => Partial<CameraParams>)) {
    if (controller !== this.currActionController) {
      return
    }
    const res = typeof params === 'function' ? params(this.camera) : params
    console.log(res)
    for (const iter of Object.entries(res)) {
      (this.camera as any)[iter[0]] = iter[1]
    }
  }

  getVideoRecorder () {
    return videoRecordFromCanvas()
  }

  static readonly InjectKey = Symbol('PluginController-inject')

  static get () {
    return inject<PluginController>(this.InjectKey)
  }
}
