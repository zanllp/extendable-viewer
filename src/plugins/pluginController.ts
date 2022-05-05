import { useAnimationStore } from '@/store/animation'
import { allPose } from '@/vrm/pose'
import { inject, Ref } from 'vue'

export class PluginController {
  private blendShapes = new Array<string>()
  private poses = new Array<string>()
  constructor () {
    const animation = useAnimationStore()
    this.poses = Object.keys(allPose)
    animation.$subscribe(() => {
      this.blendShapes = animation.availableBlendShapes
    })
  }

  getAllPose () {
    return this.poses
  }

  getBlendShapes () {
    return this.blendShapes
  }

  static readonly InjectKey = Symbol('PluginController-inject')

  static get () {
    return inject<PluginController>(this.InjectKey)
  }
}
