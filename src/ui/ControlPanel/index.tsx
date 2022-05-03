import { useAnimationStore } from '@/store/animation'
import { useSkyboxStore } from '@/store/skybox'
import { allPose } from '@/vrm/pose'
import {
  Button,
  Form,
  FormItem,
  Select,
  SelectOption,
  Slider
} from 'ant-design-vue'
import { defineComponent } from 'vue'
import style from './index.module.scss'
import { PlusOutlined, DeleteFilled } from '@ant-design/icons-vue'

export const ControlPanel = defineComponent({
  setup () {
    const skybox = useSkyboxStore()
    const animation = useAnimationStore()
    type EffectType = keyof typeof skybox.effect
    const formkeys = Object.keys(skybox.effect) as EffectType[]
    type EffectConf = Record<
      EffectType,
      { max?: number; min?: number; step?: number }
    >
    const confs: EffectConf = {
      turbidity: { min: 0, max: 20, step: 0.1 },
      rayleigh: { min: 0, max: 4, step: 0.001 },
      mieCoefficient: { min: 0, max: 0.1, step: 0.001 },
      mieDirectionalG: { min: 0, max: 1, step: 0.001 },
      elevation: { min: 0, max: 90, step: 0.1 },
      azimuth: { min: -180, max: 180, step: 0.1 },
      exposure: { min: 0, max: 1, step: 0.001 }
    }
    return () => (
      <div class={style['control-panel']}>
        <h3>Blend Shape</h3>
        <Form layout="vertical">
          {animation.selectedBlendshape.map((_, idx) => (
            <FormItem class={style['form-item']}>
              <div class={style['select-wrap']}>
                <Select v-model:value={animation.selectedBlendshape[idx]}>
                  {animation.availableBlendShapes.map((item) => (
                    <SelectOption value={item} key={item}>
                      {item}
                    </SelectOption>
                  ))}
                </Select>
                <DeleteFilled onClick={() => animation.selectedBlendshape.splice(idx, 1)}/>
              </div>
            </FormItem>
          ))}
          <Button
            icon={<PlusOutlined> </PlusOutlined>}
            onClick={() => animation.selectedBlendshape.push(animation.unknown)}
          >
            Add new item
          </Button>
        </Form>
        <h3>Pose</h3>
        <Form layout="vertical">
          <FormItem
            label={<span style={{ color: 'white' }}>Slected Pose</span>}
            class={style['form-item']}
          >
            <Select v-model:value={animation.pose}>
              {Object.keys(allPose).map((item) => (
                <SelectOption value={item} key={item}>
                  {item}
                </SelectOption>
              ))}
            </Select>
          </FormItem>
        </Form>
        <h3>Skybox</h3>
        <Form layout="vertical">
          {formkeys.map((key) => (
            <FormItem
              label={<span style={{ color: 'white' }}>{key}</span>}
              class={style['form-item']}
              key={key}
            >
              <Slider
                v-model:value={skybox.effect[key]}
                step={confs[key]?.step}
                max={confs[key]?.max}
                min={confs[key]?.min}
              ></Slider>
            </FormItem>
          ))}
        </Form>
      </div>
    )
  }
})
