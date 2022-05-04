/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia'
import { DefineComponent, reactive } from 'vue'

export interface PluginUI {
  position?:string
  name?: string
  comp: DefineComponent<any, any, any, any, any, any>
}

export interface Plugin {
  ui: PluginUI[]
  onInit?: () => void
  name: string
}

export const usePluginStore = defineStore('plugin', () => {
  const plugins = reactive<Plugin[]>([])
  const regist = (plugin: Plugin) => {
    plugins.push(plugin)
  }
  return {
    regist,
    plugins
  }
})
