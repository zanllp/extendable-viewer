import { defineComponent } from 'vue'
import { truthy } from 'vue3-ts-util-lite'
import type { Plugin } from '../'
import { PluginController } from '../pluginController'

const ControlPanel = defineComponent({
  setup () {
    const contoller = truthy(PluginController.get())
    return () => <div>hello world</div>
  }
})

export const animationCreator: Plugin = {
  ui: [{
    comp: ControlPanel,
    name: 'Animation Track'
  }],
  name: 'Animation Creator'
}
