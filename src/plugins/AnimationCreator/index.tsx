/* eslint-disable @typescript-eslint/ban-ts-comment */
import { identity } from 'lodash'
import { defineComponent, ref, withModifiers } from 'vue'
import { deepComputed, SplitView, truthy } from 'vue3-ts-util-lite'
import Draggable from 'vuedraggable'
import type { Plugin } from '../'
import { PluginController } from '../pluginController'
import styles from './index.module.scss'
import { HeartOutlined, PlaySquareTwoTone } from '@ant-design/icons-vue'
import { Form, FormItem, Input } from 'ant-design-vue'
import './custom-antd-form.scss'

const ControlPanel = defineComponent({
  setup () {
    const controller = truthy(PluginController.get())
    const poses = deepComputed({
      get: () => ({ v: controller.getAllPose().map((v) => ({ pose: v })) }),
      set: identity
    })
    interface KeyFrame {
      pose: string
      duration?: number
    }
    const animationKeyFrame = ref<KeyFrame[]>([
      { pose: 'ya' },
      { pose: 'stand' },
      { pose: 'kira' }
    ])
    const selectedKeyFrame = ref<KeyFrame>()
    return () => (
      <SplitView style={{ height: '100%' }} percent={70}>
        {{
          left: (
            <div
              style={{ marginRight: '16px' }}
              onClick={() => (selectedKeyFrame.value = undefined)}
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
                    item: ({ element }: { element: KeyFrame }) => (
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
                        <HeartOutlined
                          class={styles.icon}
                          twoToneColor="#52c41a"
                        />
                      </div>
                    )
                  }}
                </Draggable>
                <div class={styles.record}>
                  <span> Record & Replay</span>
                  <PlaySquareTwoTone
                    class={styles.icon}
                    twoToneColor="#73d13d"
                  ></PlaySquareTwoTone>
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
            ?
            <div class={[styles['keyframe-editform'], 'custom-antd-form']}>
              <Form
                labelAlign="left"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                colon={false}
              >
                <FormItem label="duration(ms)">
                  <Input
                    v-model:value={selectedKeyFrame.value.duration}
                    type="number"
                  ></Input>
                </FormItem>
              </Form>
            </div>
              : ''
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
