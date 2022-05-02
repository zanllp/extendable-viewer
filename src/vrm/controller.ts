import * as THREE from 'three'
import { VRM } from '@pixiv/three-vrm'

export enum TurnDirection {
  Right,
  Left,
  None
}

export class VRMController {
  vrm: VRM

  forwardFlug = false
  forwardAnimation: THREE.AnimationAction | null = null

  turnDirection: TurnDirection = TurnDirection.None

  constructor (vrm: VRM, forwardAnimation: THREE.AnimationAction | null = null) {
    this.vrm = vrm
    this.forwardAnimation = forwardAnimation
  }

  get forwardVector (): {x: number, z: number} {
    const vec = { x: -Math.sin(this.vrm.scene.rotation.y), z: -Math.cos(this.vrm.scene.rotation.y) }
    return vec
  }

  forwardUpdate (speed = 0.025) {
    if (this.forwardFlug) {
      const vec = this.forwardVector
      const xMove = vec.x * speed
      const zMove = vec.z * speed
      this.vrm.scene.position.x += xMove
      this.vrm.scene.position.z += zMove
    }
  }

  forwardBegin () {
    this.forwardFlug = true
    if (this.forwardAnimation) this.forwardAnimation.play()
  }

  forwardEnd () {
    this.forwardFlug = false
    if (this.forwardAnimation) this.forwardAnimation.stop()
  }

  turnUpdate (radian: number = 1 * Math.PI / 180) {
    if (this.turnDirection !== TurnDirection.None) {
      const isRight = this.turnDirection === TurnDirection.Right
      let rotY = this.vrm.scene.rotation.y + (isRight ? -radian : radian)
      if (rotY > 2 * Math.PI) rotY = rotY - 2 * Math.PI
      this.vrm.scene.rotation.y = rotY
    }
  }

  turnBegin (direction: TurnDirection.Right | TurnDirection.Left | 'right' | 'left') {
    if (typeof direction !== 'string') { this.turnDirection = direction } else {
      switch (direction) {
        case 'right':
          this.turnDirection = TurnDirection.Right
          break
        case 'left':
          this.turnDirection = TurnDirection.Left
          break
      }
    }
  }

  turnEnd () {
    this.turnDirection = TurnDirection.None
  }
}
