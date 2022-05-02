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
import { VRM, VRMSchema, VRMUtils } from '@pixiv/three-vrm'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Sky } from 'three/examples/jsm/objects/Sky'
import { GUI } from 'dat.gui'
import gltf from '../../asset/vrm/girl.vrm'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { mixamoClipToVRMClip } from '../vrm/clip'
import { VRMController } from '../vrm/controller'
// import walkingfbx from '../../asset/np.fbx'
import { dumpObject } from '../util'
import { allPose, getPose } from '../vrm/pose'
import { blendShapes } from '@/vrm/blendshape'

export const main = async () => {
  const { scene, renderer, controls, camera, clock } = init()
  const loader = new GLTFLoader()
  loader.crossOrigin = 'anonymous'
  const gltfmodel = await loader.loadAsync(gltf)
  console.log(dumpObject(gltfmodel.scene).join('\n'))
  VRMUtils.removeUnnecessaryVertices(gltfmodel.scene)
  VRMUtils.removeUnnecessaryJoints(gltfmodel.scene)
  const vrm = await VRM.from(gltfmodel)
  initBlendShapeController(vrm, clock)
  initPoseController(vrm, clock)
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
  // animate
  // await initAnimation(vrm, renderer, clock, currentVrm, controls, scene, camera)
  // controls.addEventListener('change', requestRenderIfNotRequested)
}

function initSkyboxController (scene: Scene, renderer: WebGLRenderer, camera: Camera) {
  // Add Sky
  const sky = new Sky()
  sky.scale.setScalar(450000)
  scene.add(sky)

  const sun = new Vector3()

  /// GUI

  const effectController = {
    turbidity: 10,
    rayleigh: 3,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.7,
    elevation: 2,
    azimuth: 180,
    exposure: renderer.toneMappingExposure,
    blendShape: VRMSchema.BlendShapePresetName.Fun
  }

  function guiChanged () {
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

  const gui = new GUI()

  gui.add(effectController, 'turbidity', 0.0, 20.0, 0.1).onChange(guiChanged)
  gui.add(effectController, 'rayleigh', 0.0, 4, 0.001).onChange(guiChanged)
  gui
    .add(effectController, 'mieCoefficient', 0.0, 0.1, 0.001)
    .onChange(guiChanged)
  gui
    .add(effectController, 'mieDirectionalG', 0.0, 1, 0.001)
    .onChange(guiChanged)
  gui.add(effectController, 'elevation', 0, 90, 0.1).onChange(guiChanged)
  gui.add(effectController, 'azimuth', -180, 180, 0.1).onChange(guiChanged)
  gui.add(effectController, 'exposure', 0, 1, 0.0001).onChange(guiChanged)
  guiChanged()
}

export const initBlendShapeController = (vrm: VRM, clock: Clock) => {
  const unknown = VRMSchema.BlendShapePresetName.Unknown
  const store = {
    blendShape: VRMSchema.BlendShapePresetName.Joy,
    blendShape2: unknown
  }

  const gui = new GUI()
  const availableBlendShapes = blendShapes.filter(key => key in (vrm.blendShapeProxy?.blendShapePresetMap ?? {}))
  availableBlendShapes.push(unknown)
  const onchange = () => {
    availableBlendShapes.forEach(blendshape => {
      vrm.blendShapeProxy?.setValue(blendshape, 0)
    })
  }
  gui.add(store, 'blendShape', availableBlendShapes).onChange(onchange)
  gui.add(store, 'blendShape2', availableBlendShapes).onChange(onchange)
  const render = () => {
    requestAnimationFrame(render)
    const v = Math.sin(Math.PI * clock.elapsedTime) * 0.5 + 0.5;
    [store.blendShape, store.blendShape2]
      .filter(v => v !== unknown)
      .forEach(item => vrm.blendShapeProxy?.setValue(item, v))
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

export const initPoseController = (vrm: VRM, clock: Clock) => {
  const store: { pose: keyof typeof allPose } = {
    pose: 'kira'
  }

  vrm.humanoid?.setPose(getPose(store.pose)(0))
  const gui = new GUI()
  gui.add(store, 'pose', Object.keys(allPose)).onChange(() => vrm.humanoid?.resetPose())
  const render = () => {
    requestAnimationFrame(render)
    vrm.humanoid?.setPose(getPose(store.pose)(clock.elapsedTime))
  }
  render()
}

async function initAnimation (vrm: VRM, renderer: WebGLRenderer, clock: Clock, currentVrm: VRM, controls: OrbitControls, scene: Scene, camera: PerspectiveCamera) {
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
  const walkFbx = await fbxLoader.loadAsync('')// walkingfbx)
  const walkClip = mixamoClipToVRMClip(walkFbx.animations[0], vrm, false)
  walkClip.name = 'walk'
  const mixer: AnimationMixer = new AnimationMixer(vrm.scene)
  const walk = mixer.clipAction(walkClip).setEffectiveWeight(1.0)
  walk.clampWhenFinished = true
  const controller = new VRMController(vrm, walk)
  return mixer
}

function init () {
  const renderer = new WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  document.body.appendChild(renderer.domElement)

  // camera
  const camera = new PerspectiveCamera(
    30.0,
    window.innerWidth / window.innerHeight,
    0.1,
    20.0
  )

  camera.position.set(0.0, 1.0, 4)

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
  })

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
