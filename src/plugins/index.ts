import { usePluginStore } from '@/store/plugin'
import { AppLifecycle, events } from '@/util'
import { animationCreator } from './AnimationCreator'
export * from '@/store/plugin'

events.addListener(AppLifecycle.init, () => {
  const pluginStore = usePluginStore()
  pluginStore.regist(animationCreator)
})
