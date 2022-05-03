import {
  AnimationMixer,
  Camera,
  Clock,
  DirectionalLight,
  MathUtils,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { VRM, VRMUtils } from '@pixiv/three-vrm'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Sky } from 'three/examples/jsm/objects/Sky'
import gltf from '../../asset/vrm/girl.vrm'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { mixamoClipToVRMClip } from '../vrm/clip'
import { VRMController } from '../vrm/controller'
// import walkingfbx from '../../asset/np.fbx'
import { dumpObject } from '../util'
import { getPose } from '../vrm/pose'
import { useSkyboxStore } from '@/store/skybox'
import { useAnimationStore } from '@/store/animation'

export const setup3d = async (canvas: HTMLCanvasElement) => {
  const { scene, renderer, controls, camera, clock } = init(canvas)
  const loader = new GLTFLoader()
  loader.crossOrigin = 'anonymous'
  const gltfmodel = await loader.loadAsync(gltf)
  console.log(dumpObject(gltfmodel.scene).join('\n'))
  VRMUtils.removeUnnecessaryVertices(gltfmodel.scene)
  VRMUtils.removeUnnecessaryJoints(gltfmodel.scene)
  const vrm = await VRM.from(gltfmodel)
  initBlendShapeAndPoseWatch(vrm, clock)
  listenCameraPosKey(camera)

  scene.add(vrm.scene)
  vrm.scene.rotation.y += Math.PI
  const currentVrm = vrm
  console.log(currentVrm)
  vrm.springBoneManager?.reset()
  const render = () => {
    const deltaTime = clock.getDelta()
    requestAnimationFrame(render)
    controls.update()
    currentVrm.update(deltaTime)
    renderer.render(scene, camera)
  }
  render()
  return {
    renderer,
    camera
  }
  // animate
  // await initAnimation(vrm, renderer, clock, currentVrm, controls, scene, camera)
  // controls.addEventListener('change', requestRenderIfNotRequested)
}

function initSkyboxController (
  scene: Scene,
  renderer: WebGLRenderer,
  camera: Camera
) {
  // Add Sky
  const sky = new Sky()
  sky.scale.setScalar(450000)
  scene.add(sky)

  const sun = new Vector3()
  const skybox = useSkyboxStore()
  skybox.effect.exposure = renderer.toneMappingExposure
  skybox.$subscribe(guiChanged)
  function guiChanged () {
    const effectController = skybox.effect
    const uniforms = sky.material.uniforms
    uniforms.turbidity.value = effectController.turbidity
    uniforms.rayleigh.value = effectController.rayleigh
    uniforms.mieCoefficient.value = effectController.mieCoefficient
    uniforms.mieDirectionalG.value = effectController.mieDirectionalG

    const phi = MathUtils.degToRad(90 - effectController.elevation)
    const theta = MathUtils.degToRad(effectController.azimuth)

    sun.setFromSphericalCoords(1, phi, theta)

    uniforms.sunPosition.value.copy(sun)

    renderer.toneMappingExposure = effectController.exposure
    renderer.render(scene, camera)
  }
  guiChanged()
}

export const initBlendShapeAndPoseWatch = (vrm: VRM, clock: Clock) => {
  const animation = useAnimationStore()
  animation.vrm = vrm
  vrm.humanoid?.setPose(getPose(animation.pose)(0))
  animation.$subscribe(() => {
    vrm.humanoid?.resetPose()
    animation.availableBlendShapes.forEach((blendshape) => {
      vrm.blendShapeProxy?.setValue(blendshape, 0)
    })
  })
  const render = () => {
    requestAnimationFrame(render)
    const v = Math.sin(Math.PI * clock.elapsedTime) * 0.5 + 0.5
    vrm.humanoid?.setPose(getPose(animation.pose)(clock.elapsedTime))
    animation.selectedBlendshape
      .filter((v) => v !== animation.unknown)
      .forEach((item) => vrm.blendShapeProxy?.setValue(item, v))
  }
  render()
}
export const listenCameraPosKey = (camera: PerspectiveCamera) => {
  let isUp = false
  let isDown = false
  window.addEventListener('keydown', (e) => {
    switch (e.code) {
      case 'ArrowUp':
      case 'KeyW':
        isUp = true
        break
      case 'ArrowDown':
      case 'KeyS':
        isDown = true
        break
    }
  })
  window.addEventListener('keyup', (e) => {
    switch (e.code) {
      case 'ArrowUp':
      case 'KeyW':
        isUp = false
        break
      case 'ArrowDown':
      case 'KeyS':
        isDown = false
        break
    }
  })
  const render = () => {
    requestAnimationFrame(render)
    const step = 0.03
    if (isDown) {
      camera.position.y -= step
    }
    if (isUp) {
      camera.position.y += step
    }
  }
  render()
}

async function initAnimation (
  vrm: VRM,
  renderer: WebGLRenderer,
  clock: Clock,
  currentVrm: VRM,
  controls: OrbitControls,
  scene: Scene,
  camera: PerspectiveCamera
) {
  const mixer: AnimationMixer = await initFbxAnimation(vrm)

  let renderRequested = false

  renderer.setAnimationLoop(() => {
    requestRenderIfNotRequested()
    const deltaTime = clock.getDelta()
    if (currentVrm) {
      currentVrm.update(deltaTime)
      // controller.forwardUpdate()
      // controller.turnUpdate()
      // currentVrm.humanoid!.setPose(getPose('standOnOneLeg')(clock.elapsedTime))
      if (mixer) {
        mixer.update(clock.getDelta())
      }
    }
  })
  function animate () {
    renderRequested = false
    controls.update()
    renderer.render(scene, camera)
  }
  animate()
  function requestRenderIfNotRequested () {
    if (!renderRequested) {
      renderRequested = true
      requestAnimationFrame(animate)
    }
  }
}

async function initFbxAnimation (vrm: VRM) {
  const fbxLoader = new FBXLoader()
  const walkFbx = await fbxLoader.loadAsync('') // walkingfbx)
  const walkClip = mixamoClipToVRMClip(walkFbx.animations[0], vrm, false)
  walkClip.name = 'walk'
  const mixer: AnimationMixer = new AnimationMixer(vrm.scene)
  const walk = mixer.clipAction(walkClip).setEffectiveWeight(1.0)
  walk.clampWhenFinished = true
  const controller = new VRMController(vrm, walk)
  return mixer
}

function init (canvas: HTMLCanvasElement) {
  const renderer = new WebGLRenderer({ canvas })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  // camera
  const camera = new PerspectiveCamera(
    30.0,
    window.innerWidth / window.innerHeight,
    0.1,
    20.0
  )

  camera.position.set(0.0, 1.0, 4)

  // camera controls
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.target.set(0.0, 1, 0.0)
  controls.update()

  // scene
  const scene = new Scene()

  // light
  const light = new DirectionalLight(0xffffff)
  light.position.set(1.0, 1.0, 1.0).normalize()
  scene.add(light)

  initSkyboxController(scene, renderer, camera)
  const clock = new Clock()
  return { scene, renderer, controls, camera, clock }
}
