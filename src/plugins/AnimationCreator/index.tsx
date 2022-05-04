import { defineComponent } from 'vue'
import type { Plugin } from '../'

const ControlPanel = defineComponent({
  setup () {
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
