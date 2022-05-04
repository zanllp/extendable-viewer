import { PluginUI, usePluginStore } from '@/plugins'
import { TabPane, Tabs } from 'ant-design-vue'
import { computed, defineComponent, onMounted, ref } from 'vue'

import style from './index.module.scss'

export const BottomTabPanel = defineComponent({
  setup () {
    const plugin = usePluginStore()
    onMounted(() => plugin.plugins.forEach((item) => item.onInit?.()))
    const pluginUIs = computed(() =>
      plugin.plugins.reduce((p, c) => {
        return [...p, ...c.ui]
      }, [] as PluginUI[])
    )
    const activeKey = ref(0)

    return () => (
      <Tabs v-model:activeKey={activeKey}>
        {pluginUIs.value.map((item, i) => (
          <TabPane tabKey={i} key={i} tab={item.name}>
            <item.comp class={style['bottom-tab-panel']}></item.comp>
          </TabPane>
        ))}
      </Tabs>
    )
  }
})
