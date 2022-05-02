import { defineComponent } from 'vue'
import { main } from './3d'

export const App = defineComponent({
  async setup () {
    main()
  }
})
