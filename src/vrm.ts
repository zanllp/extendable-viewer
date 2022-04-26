import './registerServiceWorker'
import {
  Scene,
  Engine,
  HemisphericLight,
  Vector3,
  SceneLoader,
  ArcRotateCamera,
  Animation,
  MeshBuilder,
  ActionManager,
  AnimationGroup,
  ExecuteCodeAction,
  Quaternion,
  CascadedShadowGenerator,
  ShadowGenerator,
  Mesh,
  DirectionalLight
} from '@babylonjs/core'
import 'babylon-vrm-loader'
import girl from '../asset/vrm/green.vrm'
function createCamera (scene: Scene) {
  const camera = new ArcRotateCamera('camera1', 0, Math.PI / 4, 20, new Vector3(0, 1, 0), scene, true)
  camera.panningSensibility = 0
  camera.wheelPrecision = 10
  camera.upperBetaLimit = Math.PI / 2.2
  camera.lowerRadiusLimit = 1
  camera.upperRadiusLimit = 10
  camera.minZ = 0.5
  camera.maxZ = 1000;
  (window as any).camera = camera
  return camera
}
export class VrmPlayground {
  public static async CreateScene (engine: Engine, canvas: HTMLCanvasElement) {
    const scene = new Scene(engine)
    const camera = createCamera(scene)
    camera.lowerRadiusLimit = 0.1
    camera.upperRadiusLimit = 20
    camera.wheelDeltaPercentage = 0.01
    camera.minZ = 0.3
    camera.position = new Vector3(0, 1.2, -3)
    camera.attachControl(canvas, true)
    const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene)
    await SceneLoader.AppendAsync('', girl.slice(1))
    console.log(scene)
    // const box = MeshBuilder.CreateBox('box', {})
    // box.position.x = 2

    const startFrame = 0
    const endFrame = 10
    const frameRate = 3

    const xSlide = new Animation('xSlide', 'position.x', frameRate, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE)

    const keyFrames = []

    keyFrames.push({
      frame: startFrame,
      value: 2
    })

    keyFrames.push({
      frame: endFrame,
      value: -2
    })

    xSlide.setKeys(keyFrames)

    // model.animations.push(xSlide)

    // forward animation
    // scene.beginAnimation(model, startFrame, endFrame, false)

    const vrmManager = scene.metadata.vrmManagers[0]

    const vrmMesh = vrmManager.rootMesh as Mesh
    
    camera.setTarget(vrmMesh)
    // Update secondary animation
    scene.onBeforeRenderObservable.add(() => {
      // vrmManager.update(scene.getEngine().getDeltaTime())
    })
    console.log(vrmManager)
    // Model Transformation
    //  vrmManager.rootMesh.translate(new Vector3(1, 0, 0), 1)

    // Work with HumanoidBone
    // vrmManager.humanoidBone.leftUpperArm.addRotation(0, 1, 0)

    // Work with BlendShape(MorphTarget)
    // const light2 = new DirectionalLight('light1', new Vector3(0, -100, 80), scene)
    vrmManager.morphing('Fun', 2.0)
    // const shadowGenerator = new CascadedShadowGenerator(2048, light2)
    // createObstacles(scene, shadowGenerator)
    createActionManager(
      scene,
      (delta) => {
        // Forward(W)
        walkAnimation.start(true, 1, 0, 60)
        vrmMesh.movePOV(0, 0, delta / 1300)
      },
      (delta) => {
        // Backward(S)
        walkAnimation.start(true, 1, 0, 60)
        vrmMesh.movePOV(0, 0, -delta / 2200)
      },
      (delta) => {
        // Left rotate(A)
        walkAnimation.start(true, 1, 0, 60)
        vrmMesh.rotate(Vector3.Up(), -delta / 1000)
      },
      (delta) => {
        // Right rotate(D)
        walkAnimation.start(true, 1, 0, 60)
        vrmMesh.rotate(Vector3.Up(), delta / 1000)
      },
      () => {
        // idle
        walkAnimation.stop()
        walkAnimation.reset()
      }
    )
    const walkAnimation = createWalkAnimationGroup(vrmManager, scene)

    ;(window as any).vrmManager = vrmManager
    return scene
  }
}

/**
 * Create wasd action manager
 */
function createActionManager (
  scene: Scene,
  onForward: (delta: number) => void,
  onBackward: (delta: number) => void,
  onLeft: (delta: number) => void,
  onRight: (delta: number) => void,
  onStop: () => void
) {
  const inputMap = {
    65: false, // A
    83: false, // S
    68: false, // D
    87: false // W
  }
  scene.actionManager = new ActionManager(scene)
  scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, function (evt) {
    inputMap[evt.sourceEvent.keyCode as keyof typeof inputMap] = evt.sourceEvent.type === 'keydown'
  }))
  scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, function (evt) {
    inputMap[evt.sourceEvent.keyCode as keyof typeof inputMap] = evt.sourceEvent.type === 'keydown'
  }))

  scene.onBeforeRenderObservable.add(() => {
    const speed = scene.getEngine().getDeltaTime()
    let moveCount = 0
    if (inputMap[65]) {
      onLeft(speed)
      moveCount++
    }
    if (inputMap[83]) {
      onBackward(speed)
      moveCount++
    }
    if (inputMap[68]) {
      onRight(speed)
      moveCount++
    }
    if (inputMap[87]) {
      onForward(speed)
      moveCount++
    }
    if (moveCount === 0) {
      onStop()
    }
  })
}

/**
 * Create animation from keys
 * @param {any} animation
 * @return {Animation}
 */
function createAnimation (animation: any): Animation {
  const anim = new Animation(
    animation.name,
    'rotationQuaternion',
    60, // fps
    Animation.ANIMATIONTYPE_QUATERNION,
    Animation.ANIMATIONLOOPMODE_CYCLE
  )
  const keys = []
  for (const key of animation.keys) {
    keys.push({
      frame: key[0],
      value: Quaternion.RotationYawPitchRoll(key[1], key[2], key[3])
    })
  }
  anim.setKeys(keys)

  return anim
}

/**
 * Create WALK animation group
 */
function createWalkAnimationGroup (vrmManager: any, scene: Scene): AnimationGroup {
  const leftUpperLegAnim = {
    name: 'leftUpperLegAnim',
    keys: [
      [0, 0, 0, 0],
      [15, 0, Math.PI / 10, 0],
      [45, 0, -Math.PI / 15, 0],
      [60, 0, 0, 0]
    ]
  }

  const rightUpperLegAnim = {
    name: 'rightUpperLegAnim',
    keys: [
      [0, 0, 0, 0],
      [15, 0, -Math.PI / 10, 0],
      [45, 0, Math.PI / 15, 0],
      [60, 0, 0, 0]
    ]
  }

  const leftUpperArmAnim = {
    name: 'leftUpperArmAnim',
    keys: [
      [0, 0, 0, Math.PI / 2.5],
      [15, 0, -Math.PI / 6, Math.PI / 2.5],
      [45, 0, Math.PI / 4, Math.PI / 2.5],
      [60, 0, 0, Math.PI / 2.5]
    ]
  }

  const rightUpperArmAnim = {
    name: 'rightUpperArmAnim',
    keys: [
      [0, 0, 0, -Math.PI / 2.5],
      [15, 0, Math.PI / 4, -Math.PI / 2.5],
      [45, 0, -Math.PI / 6, -Math.PI / 2.5],
      [60, 0, 0, -Math.PI / 2.5]
    ]
  }
  const ag = new AnimationGroup('Walk', scene)
  ag.loopAnimation = true
  ag.addTargetedAnimation(
    createAnimation(leftUpperLegAnim),
    vrmManager.humanoidBone.leftUpperLeg
  )
  ag.addTargetedAnimation(
    createAnimation(rightUpperLegAnim),
    vrmManager.humanoidBone.rightUpperLeg
  )
  ag.addTargetedAnimation(
    createAnimation(leftUpperArmAnim),
    vrmManager.humanoidBone.leftUpperArm
  )
  ag.addTargetedAnimation(
    createAnimation(rightUpperArmAnim),
    vrmManager.humanoidBone.rightUpperArm
  )

  return ag
}
