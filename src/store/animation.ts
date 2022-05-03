import { VRM, VRMSchema } from '@pixiv/three-vrm'
import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { PoseType } from '@/vrm/pose'
import { blendShapes } from '@/vrm/blendshape'

export const useAnimationStore = defineStore('animation', () => {
  const pose = ref<PoseType>('kira')
  const vrm = ref<VRM>()
  const unknown = VRMSchema.BlendShapePresetName.Unknown
  const availableBlendShapes = computed(() => [...blendShapes.filter(
    (key) => key in (vrm.value?.blendShapeProxy?.blendShapePresetMap ?? {})
  ), unknown])
  const selectedBlendshape = reactive([VRMSchema.BlendShapePresetName.Joy])
  return {
    vrm,
    pose,
    availableBlendShapes,
    selectedBlendshape,
    unknown
  }
})
