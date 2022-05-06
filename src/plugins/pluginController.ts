import { useAnimationStore } from '@/store/animation'
import { videoRecordFromCanvas } from '@/videoRecorder'
import { allPose, PoseType } from '@/vrm/pose'
import { VRMSchema } from '@pixiv/three-vrm'
import { inject, Ref } from 'vue'

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

  free () {
    this.pluginController.freeActionController(this)
  }
}

export class PluginController {
  private poses = new Array<string>()
  private currActionController?: ActionController

  constructor (private animation = useAnimationStore()) {
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

  getVideoRecorder () {
    return videoRecordFromCanvas()
  }

  static readonly InjectKey = Symbol('PluginController-inject')

  static get () {
    return inject<PluginController>(this.InjectKey)
  }
}
