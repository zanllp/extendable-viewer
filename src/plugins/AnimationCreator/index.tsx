/* eslint-disable @typescript-eslint/ban-ts-comment */
import { identity } from 'lodash'
import { defineComponent, reactive, ref, watch } from 'vue'
import { deepComputed, truthy } from 'vue3-ts-util-lite'
import Draggable from 'vuedraggable'
import type { Plugin } from '../'
import { PluginController } from '../pluginController'
import styles from './index.module.scss'
import { HeartOutlined, PlaySquareTwoTone } from '@ant-design/icons-vue'

const ControlPanel = defineComponent({
  setup () {
    const controller = truthy(PluginController.get())
    const poses = deepComputed({
      get: () => ({ v: controller.getAllPose().map((v) => ({ pose: v })) }),
      set: identity
    })
    interface KeyFrame {
      pose: string
    }
    const animationKeyFrame = ref<KeyFrame[]>([
      { pose: 'ya' },
      { pose: 'stand' },
      { pose: 'kira' }
    ])
    watch(animationKeyFrame, (v) => console.log(v))
    return () => (
      <div>
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
                <div class={[styles['animation-item'], styles.card]}>
                  <div>{element.pose}</div>
                  <HeartOutlined class={styles.icon} twoToneColor="#52c41a" />
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
