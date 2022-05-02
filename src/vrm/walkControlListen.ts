import { VRMController } from './controller'

export const listenWalkingKey = (controller: VRMController) => {
  window.addEventListener('keyup', (e) => {
    switch (e.code) {
      case 'ArrowUp':
      case 'KeyW':
        controller.forwardEnd()
        break
      case 'ArrowLeft':
      case 'KeyA':
      case 'ArrowRight':
      case 'KeyD':
        controller.turnEnd()
        break
    }
  })

  window.addEventListener('keydown', (e) => {
    switch (e.code) {
      case 'ArrowUp':
      case 'KeyW':
        controller.forwardBegin()
        break
      case 'ArrowLeft':
      case 'KeyA':
        controller.turnBegin('left')
        break
      case 'ArrowRight':
      case 'KeyD':
        controller.turnBegin('right')
        break
    }
  })
}
