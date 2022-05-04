import { EventEmitter } from 'events'
export const events = new EventEmitter()
export const AppLifecycle = {
  init: Symbol('app init')
} as const
