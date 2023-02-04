/* eslint-disable @typescript-eslint/ban-ts-comment */
import { identity } from 'lodash'
import { defineComponent, ref, withModifiers } from 'vue'
import { deepComputed, delay, ok, SplitView, truthy } from 'vue3-ts-util'
import Draggable from 'vuedraggable'
import type { Plugin } from '../'
import { CameraParams, PluginController } from '../pluginController'
import styles from './index.module.scss'
import {
  HeartOutlined,
  HeartFilled,
  PlaySquareTwoTone,
  VideoCameraTwoTone
} from '@ant-design/icons-vue'
import { Form, FormItem, Input } from 'ant-design-vue'
import './custom-antd-form.scss'

const ControlPanel = defineComponent({
  setup () {
    const controller = truthy(PluginController.get())
    const poses = deepComputed({
      get: () => ({ v: controller.getAllPose().map((v) => ({ pose: v })) }),
      set: identity
    })
    interface KeyFrame extends Partial<CameraParams> {
      pose: string
      duration?: number
    }
    const animationKeyFrame = ref<KeyFrame[]>([
      { pose: 'ya' },
      { pose: 'kira' },
      { pose: 'standOnOneLeg' }
    ])
    const selectedKeyFrame = ref<KeyFrame | null>(animationKeyFrame.value[0])
    const currPoseIdx = ref(-1)
    const toSafeNum = (e?: string | number) => {
      switch (typeof e) {
        case 'undefined':
          return 0
        case 'number':
          return e
        case 'string':
          return +e
      }
      ok(false)
    }
    const play = async (record = false) => {
      const actionController = controller.getActionController()
      const recorder = record ? controller.getVideoRecorder() : null
      for (const iter of animationKeyFrame.value) {
        actionController.setPose(iter.pose)
        actionController.updateCamera((p) => {
          return {
            x: p.x + toSafeNum(iter.x),
            y: p.y + toSafeNum(iter.y),
            z: p.z + toSafeNum(iter.z),
            rotate: p.rotate + toSafeNum(iter.rotate)
          }
        })
        currPoseIdx.value++
        await delay(iter.duration ?? 1000)
      }
      actionController.setPose('stand')
      actionController.free()
      recorder?.mediaRecorder.stop()
      currPoseIdx.value = -1
    }
    return () => (
      <SplitView style={{ height: '100%' }} percent={60}>
        {{
          left: (
            <div
              style={{ marginRight: '16px' }}
              onClick={() => (selectedKeyFrame.value = null)}
            >
              <h4 class={[styles.title, styles.axis]}>Track</h4>
              <div class={styles['track-container']}>
                <Draggable
                  v-model:modelValue={animationKeyFrame.value}
                  class={styles['track-wrap']}
                  // @ts-ignore
                  group={{ name: 'people', put: true }}
                >
                  {{
                    item: ({
                      element,
                      index
                    }: {
                      element: KeyFrame
                      index: number
                    }) => (
                      <div
                        class={[
                          styles['animation-item'],
                          styles.card,
                          selectedKeyFrame.value === element && styles.selected
                        ]}
                        onClick={(e) => {
                          e.stopPropagation()
                          selectedKeyFrame.value = element
                        }}
                      >
                        <div>{element.pose}</div>
                        {currPoseIdx.value === index
                          ? (
                          <HeartFilled class={styles.icon} />
                            )
                          : (
                          <HeartOutlined class={styles.icon} />
                            )}
                      </div>
                    )
                  }}
                </Draggable>
                <div class={styles['btn-group']}>
                  <div class={styles.record} onClick={() => play()}>
                    <span> Play</span>
                    <PlaySquareTwoTone
                      class={styles.icon}
                      twoToneColor="#73d13d"
                    ></PlaySquareTwoTone>
                  </div>
                  <div class={styles.record} onClick={() => play(true)}>
                    <span> Record & play</span>
                    <VideoCameraTwoTone
                      class={styles.icon}
                      twoToneColor="#13c2c2"
                    ></VideoCameraTwoTone>
                  </div>
                </div>
              </div>
              <h4 class={styles.title}>Source pose</h4>
              <Draggable
                v-model:modelValue={poses.value.v}
                // @ts-ignore
                group={{ name: 'people', pull: 'clone', put: false }}
                class={styles['track-wrap']}
              >
                {{
                  item: ({ element }: { element: KeyFrame }) => (
                    <div class={[styles['animation-item'], styles.source]}>
                      {element.pose}
                    </div>
                  )
                }}
              </Draggable>
            </div>
          ),
          right: selectedKeyFrame.value
            ? (
            <div class={[styles['keyframe-editform'], 'custom-antd-form']}>
              <Form
                labelAlign="left"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                colon={false}
              >
                <FormItem label="duration (ms)">
                  <Input
                    v-model:value={selectedKeyFrame.value.duration}
                    type="number"
                  ></Input>
                </FormItem>
                <FormItem label="rotate (incr deg/60hz)">
                  <Input
                    v-model:value={selectedKeyFrame.value.rotate}
                    type="number"
                  ></Input>
                </FormItem>
                <FormItem label="x (incr/60hz)">
                  <Input
                    v-model:value={selectedKeyFrame.value.x}
                    type="number"
                  ></Input>
                </FormItem>
                <FormItem label="y (incr/60hz)">
                  <Input
                    v-model:value={selectedKeyFrame.value.y}
                    type="number"
                  ></Input>
                </FormItem>
                <FormItem label="z (incr/60hz)">
                  <Input
                    v-model:value={selectedKeyFrame.value.z}
                    type="number"
                  ></Input>
                </FormItem>
              </Form>
            </div>
              )
            : (
                ''
              )
        }}
      </SplitView>
    )
  }
})

export const animationCreator: Plugin = {
  ui: [
    {
      comp: ControlPanel,
      name: 'Animation Track'
    }
  ],
  name: 'Animation Creator'
}
