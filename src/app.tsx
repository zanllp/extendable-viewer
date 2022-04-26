import { useWindowSize } from '@vueuse/core'
import { defineComponent, onMounted, ref } from 'vue'
import './registerServiceWorker'
import {
    ACESFilmicToneMapping,
  AnimationClip,
  AnimationMixer,
  AnimationObjectGroup,
  AxesHelper,
  Camera,
  Clock,
  DirectionalLight,
  Euler,
  GridHelper,
  MathUtils,
  NumberKeyframeTrack,
  Object3D,
  PerspectiveCamera,
  Quaternion,
  QuaternionKeyframeTrack,
  Renderer,
  Scene,
  sRGBEncoding,
  Vector3,
  WebGLRenderer
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { VRM, VRMSchema, VRMUtils } from '@pixiv/three-vrm'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Sky } from "three/examples/jsm/objects/Sky";
import { GUI  } from 'dat.gui';
import { ok } from 'assert'
import gltf from '../asset/vrm/girl.vrm'

function initSky(scene: Scene, renderer: WebGLRenderer, camera: Camera) {

    // Add Sky
    const sky = new Sky();
    sky.scale.setScalar( 450000 );
    scene.add( sky );

    const sun = new Vector3();

    /// GUI

    const effectController = {
        turbidity: 10,
        rayleigh: 3,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.7,
        elevation: 2,
        azimuth: 180,
        exposure: renderer.toneMappingExposure
    };

    function guiChanged() {

        const uniforms = sky.material.uniforms;
        uniforms[ 'turbidity' ].value = effectController.turbidity;
        uniforms[ 'rayleigh' ].value = effectController.rayleigh;
        uniforms[ 'mieCoefficient' ].value = effectController.mieCoefficient;
        uniforms[ 'mieDirectionalG' ].value = effectController.mieDirectionalG;

        const phi = MathUtils.degToRad( 90 - effectController.elevation );
        const theta = MathUtils.degToRad( effectController.azimuth );

        sun.setFromSphericalCoords( 1, phi, theta );

        uniforms[ 'sunPosition' ].value.copy( sun );

        renderer.toneMappingExposure = effectController.exposure;
        renderer.render( scene, camera );

    }

    const gui = new GUI();

    gui.add( effectController, 'turbidity', 0.0, 20.0, 0.1 ).onChange( guiChanged );
    gui.add( effectController, 'rayleigh', 0.0, 4, 0.001 ).onChange( guiChanged );
    gui.add( effectController, 'mieCoefficient', 0.0, 0.1, 0.001 ).onChange( guiChanged );
    gui.add( effectController, 'mieDirectionalG', 0.0, 1, 0.001 ).onChange( guiChanged );
    gui.add( effectController, 'elevation', 0, 90, 0.1 ).onChange( guiChanged );
    gui.add( effectController, 'azimuth', - 180, 180, 0.1 ).onChange( guiChanged );
    gui.add( effectController, 'exposure', 0, 1, 0.0001 ).onChange( guiChanged );

    guiChanged();

}
export const App = defineComponent({
  setup () {
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

    

    camera.position.set(0.0, 1.0, 5.0)

    // camera controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.screenSpacePanning = true
    controls.target.set(0.0, 1.0, 0.0)
    controls.update()

    // scene
    const scene = new Scene()

    // light
    const light = new DirectionalLight(0xffffff)
    light.position.set(1.0, 1.0, 1.0).normalize()
    scene.add(light)

    // const helper = new GridHelper( 10000, 2, 0xffffff, 0xffffff );
    // scene.add( helper );
    initSky(scene, renderer, camera);
    // gltf and vrm
    let currentVrm: { update: (arg0: number) => void } | undefined
    let currentMixer: AnimationMixer | undefined
    const loader = new GLTFLoader()
    loader.crossOrigin = 'anonymous'
    loader.load(
      gltf,

      (gltf:any) => {
        VRMUtils.removeUnnecessaryVertices(gltf.scene)
        VRMUtils.removeUnnecessaryJoints(gltf.scene)

        VRM.from(gltf).then(
          (vrm: any) => {
            scene.add(vrm.scene)
            currentVrm = vrm

            vrm.humanoid.getBoneNode(
              VRMSchema.HumanoidBoneName.Hips
            ).rotation.y = Math.PI
            vrm.springBoneManager.reset()

            prepareAnimation(vrm)

            console.log(vrm)
          }
        )
      },

      (progress: { loaded: number; total: number }) =>
        console.log(
          'Loading model...',
          100.0 * (progress.loaded / progress.total),
          '%'
        ),

      (error: any) => console.error(error)
    )

    // animation
    function prepareAnimation (vrm: {
      scene: Object3D<Event> | AnimationObjectGroup
      humanoid: {
        getBoneNode: (arg0: any) => { (): any; new (): any; name: string }
      }
      blendShapeProxy: { getBlendShapeTrackName: (arg0: any) => string }
    }) {
      currentMixer = new AnimationMixer(vrm.scene)

      const quatA = new Quaternion(0.0, 0.0, 0.0, 1.0)
      const quatB = new Quaternion(0.0, 0.0, 0.0, 1.0)
      quatB.setFromEuler(new Euler(0.0, 0.0, 0.25 * Math.PI))

      const armTrack = new QuaternionKeyframeTrack(
        vrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.LeftUpperArm).name +
          '.quaternion', // name
        [0.0, 0.5, 1.0], // times
        [...quatA.toArray(), ...quatB.toArray(), ...quatA.toArray()] // values
      )

      const blinkTrack = new NumberKeyframeTrack(
        vrm.blendShapeProxy.getBlendShapeTrackName(
          VRMSchema.BlendShapePresetName.Blink
        ), // name
        [0.0, 0.5, 1.0], // times
        [0.0, 1.0, 0.0] // values
      )

      const clip = new AnimationClip('blink', 1.0, [armTrack, blinkTrack])
      const action = currentMixer.clipAction(clip)
      action.play()
    }

    // helpers
    const gridHelper = new GridHelper(10, 10)
    scene.add(gridHelper)

    const axesHelper = new AxesHelper(5)
    scene.add(axesHelper)

    // animate
    const clock = new Clock()

    function animate () {
      requestAnimationFrame(animate)

      const deltaTime = clock.getDelta()

      if (currentVrm) {
        currentVrm.update(deltaTime)
      }

      if (currentMixer) {
        currentMixer.update(deltaTime)
      }

      renderer.render(scene, camera)
    }

    animate()
  }
})
