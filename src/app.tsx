import { defineComponent } from 'vue'
import './registerServiceWorker'
import {
  AnimationMixer,
  Camera,
  Clock,
  DirectionalLight,
  Euler,
  MathUtils,
  PerspectiveCamera,
  Quaternion,
  Scene,
  Vector3,
  WebGLRenderer
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { RawVector4, VRM, VRMPose, VRMSchema, VRMUtils } from '@pixiv/three-vrm'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Sky } from 'three/examples/jsm/objects/Sky'
import { GUI } from 'dat.gui'
import gltf from '../asset/vrm/girl.vrm'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { mixamoClipToVRMClip } from './clip'
import { VRMController } from './controller'
import idoljson from '../asset/idol.json'
import walkingfbx from '../asset/walking.fbx'

function initSky (scene: Scene, renderer: WebGLRenderer, camera: Camera) {
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
    exposure: renderer.toneMappingExposure
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
export const App = defineComponent({
  async setup () {
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

    // camera controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.screenSpacePanning = true
    controls.target.set(0.0, 1, 0.0)
    controls.update()

    // scene
    const scene = new Scene()

    // light
    const light = new DirectionalLight(0xffffff)
    light.position.set(1.0, 1.0, 1.0).normalize()
    scene.add(light)

    initSky(scene, renderer, camera)
    // gltf and vrm
    let currentMixer: AnimationMixer | undefined
    const loader = new GLTFLoader()
    loader.crossOrigin = 'anonymous'
    const gltfmodel = await loader.loadAsync(gltf)
    VRMUtils.removeUnnecessaryVertices(gltfmodel.scene)
    VRMUtils.removeUnnecessaryJoints(gltfmodel.scene)
    const vrm = await VRM.from(gltfmodel)

    scene.add(vrm.scene)
    vrm.scene.rotation.y += Math.PI
    const currentVrm = vrm

    vrm.humanoid!.getBoneNode(VRMSchema.HumanoidBoneName.Hips)!.rotation.y =
      Math.PI
    vrm.springBoneManager!.reset()

    vrm.humanoid!.setPose(idoljson)

    // animate
    const clock = new Clock()
    const fbxLoader = new FBXLoader()
    const walkFbx = await fbxLoader.loadAsync(walkingfbx)
    console.log(walkFbx)
    const walkClip = mixamoClipToVRMClip(walkFbx.animations[0], vrm, false)
    console.log(walkClip)
    walkClip.name = 'walk'
    const mixer: THREE.AnimationMixer = new AnimationMixer(vrm.scene)
    const walkFlug = false

    const walk = mixer.clipAction(walkClip).setEffectiveWeight(1.0)
    walk.clampWhenFinished = true

    const controller: VRMController = new VRMController(vrm, walk)
    let lastTime = new Date().getTime()
    // controller.forwardAnimation?.play()
    function animate () {
      requestAnimationFrame(animate)

      const deltaTime = clock.getDelta()

      if (currentVrm) {
        currentVrm.update(deltaTime)
        controller.forwardUpdate()
        controller.turnUpdate()
        const v = Math.sin(Math.PI * clock.elapsedTime)
        console.log(v)

        currentVrm.blendShapeProxy!.setValue(VRMSchema.BlendShapePresetName.Joy, 0.5 + 0.5 * v)
        const time = new Date().getTime()
        if (mixer) mixer.update(time - lastTime)
        lastTime = time
        renderer.setAnimationLoop(() => {
          renderer.render(scene, camera)
        })
        if (mixer) {
          mixer.update(clock.getDelta())
        }
      }

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
      }
      )
      renderer.render(scene, camera)
    }

    animate()
  }
})

export type Type = (elapsed: number) => VRMPose

export const sayHello: Type = (elapsed) => ({
  [VRMSchema.HumanoidBoneName.LeftUpperLeg]: {
    rotation: [0.0, 0.0, -0.1, 1]
  },
  [VRMSchema.HumanoidBoneName.LeftUpperArm]: {
    rotation: new Quaternion()
      .setFromEuler(
        new Euler(
          0,
          0,
          cosineRepeation(-Math.PI / 4, Math.PI / 4, Math.PI / 4)(elapsed),
          'XYZ'
        )
      )
      .toArray() as RawVector4
  },
  [VRMSchema.HumanoidBoneName.LeftLowerArm]: {
    rotation: new Quaternion()
      .setFromEuler(
        new Euler(
          cosineRepeation(0, Math.PI / 1.3)(elapsed),
          0,
          cosineRepeation(0, Math.PI / 8)(elapsed),
          'XYZ'
        )
      )
      .toArray() as RawVector4
  },
  [VRMSchema.HumanoidBoneName.RightUpperArm]: {
    rotation: new Quaternion()
      .setFromEuler(new Euler(0, 0, -Math.PI / 4, 'XYZ'))
      .toArray() as RawVector4
  },
  [VRMSchema.HumanoidBoneName.RightLowerArm]: {
    rotation: new Quaternion()
      .setFromEuler(new Euler(0, 0, -Math.PI / 2.3, 'XYZ'))
      .toArray() as RawVector4
  },
  [VRMSchema.HumanoidBoneName.LeftHand]: {
    rotation: new Quaternion()
      .setFromEuler(
        new Euler(cosineRepeation(-Math.PI / 6, 0, 0)(elapsed), 0, 0, 'XYZ')
      )
      .toArray() as RawVector4
  },
  [VRMSchema.HumanoidBoneName.LeftShoulder]: {
    rotation: new Quaternion()
      .setFromEuler(
        new Euler(0, 0, cosineRepeation(-Math.PI / 6, 0, 0)(elapsed), 'XYZ')
      )
      .toArray() as RawVector4,
    position: [
      cosineRepeation(-0.025, 0, 0)(elapsed),
      cosineRepeation(0, 0.08)(elapsed),
      0
    ]
  },
  [VRMSchema.HumanoidBoneName.UpperChest]: {
    position: [cosineRepeation(0, 0.02)(elapsed), 0, 0]
  },
  [VRMSchema.HumanoidBoneName.Neck]: {
    rotation: new Quaternion()
      .setFromEuler(
        new Euler(0, 0, cosineRepeation(-Math.PI / 24, 0, 0)(elapsed), 'XYZ')
      )
      .toArray() as RawVector4
  }
})

export const standOnOneLeg: Type = (elapsed) => ({
  [VRMSchema.HumanoidBoneName.LeftUpperLeg]: {
    rotation: new Quaternion()
      .setFromEuler(new Euler(-Math.PI / 6, 0, 0, 'XYZ'))
      .toArray() as RawVector4
  },
  [VRMSchema.HumanoidBoneName.LeftLowerLeg]: {
    rotation: new Quaternion()
      .setFromEuler(
        new Euler(cosineRepeation(-Math.PI / 2, 0, 0)(elapsed), 0, 0, 'XYZ')
      )
      .toArray() as RawVector4
  },
  [VRMSchema.HumanoidBoneName.LeftUpperArm]: {
    rotation: new Quaternion()
      .setFromEuler(
        new Euler(
          0,
          0,
          cosineRepeation(0, Math.PI / 15, Math.PI / 24, 1.5)(elapsed),
          'XYZ'
        )
      )
      .toArray() as RawVector4
  },
  [VRMSchema.HumanoidBoneName.RightUpperArm]: {
    rotation: new Quaternion()
      .setFromEuler(
        new Euler(
          0,
          0,
          cosineRepeation(-Math.PI / 15, 0, -Math.PI / 24, 1.5)(elapsed),
          'XYZ'
        )
      )
      .toArray() as RawVector4
  }
})
export function cosineRepeation (
  min: number,
  max: number,
  start: number = min,
  frequency = 1, // 2πf
  increasingInitially = true
) {
  const l = (max - min) / 2 // amplitude
  const k = -1 + (start - min) / l // relative y coordinate
  const xIntercept = Math.acos(k) * (increasingInitially ? -1 : 1)
  return (elapsed: number) =>
    l * Math.cos(frequency * (elapsed - xIntercept)) + min + l
}
