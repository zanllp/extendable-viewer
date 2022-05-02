import { VRMPose, VRMSchema, RawVector4, VRM } from '@pixiv/three-vrm'
import { Quaternion, Euler, MathUtils } from 'three'
import idolJson from '../../asset/idol.json'

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

export const stand: VRMPose = {
  [VRMSchema.HumanoidBoneName.LeftUpperArm]: {
    rotation: [0, 0, Math.PI / 2 - 1, 0.8]
  },
  [VRMSchema.HumanoidBoneName.LeftHand]: {
    rotation: [0, 0, 0.1, 0]
  },
  [VRMSchema.HumanoidBoneName.RightUpperArm]: {
    rotation: [0, 0, -(Math.PI / 2 - 1), 0.8]
  },
  [VRMSchema.HumanoidBoneName.RightHand]: {
    rotation: [0, 0, -0.1, 0]
  }
}
export const ya: VRMPose = {
  [VRMSchema.HumanoidBoneName.Chest]: {
    rotation: [
      0.013312335656517259,
      0,
      0,
      0.9999113869335464
    ]
  },
  [VRMSchema.HumanoidBoneName.Head]: {
    rotation: [
      0.08603210708144307,
      0,
      0,
      0.9962923649969055
    ]
  },
  [VRMSchema.HumanoidBoneName.Hips]: {
    rotation: [
      -0.1787955102350469,
      -0.0006303832762068233,
      -0.00965300399150735,
      0.983838700016753
    ]
  },
  [VRMSchema.HumanoidBoneName.Jaw]: {
    rotation: [
      0,
      0,
      0,
      1
    ]
  },
  [VRMSchema.HumanoidBoneName.LeftEye]: {
    rotation: [
      -0.0037995237082412664,
      0.0006996440932298325,
      0.0000026583341586324724,
      0.9999925370274854
    ]
  },
  [VRMSchema.HumanoidBoneName.LeftFoot]: {
    rotation: [
      -0.0719891841574704,
      -0.00011644688831157979,
      0.09214837874308693,
      0.993139577350276
    ]
  },
  [VRMSchema.HumanoidBoneName.LeftHand]: {
    rotation: [
      -0.48262051769102926,
      -0.23455124243260098,
      -0.33804179564770753,
      0.7731693831058236
    ]
  },
  [VRMSchema.HumanoidBoneName.LeftIndexDistal]: {
    rotation: [
      0,
      0,
      -0.06199846955623789,
      0.99807624446867
    ]
  },
  [VRMSchema.HumanoidBoneName.LeftIndexIntermediate]: {
    rotation: [
      0,
      0,
      -0.022327864296377356,
      0.9997507021632758
    ]
  },
  [VRMSchema.HumanoidBoneName.LeftIndexProximal]: {
    rotation: [
      0.019577435593636682,
      -0.22062120482851355,
      -0.08619510260816965,
      0.9713461856011787
    ]
  },
  [VRMSchema.HumanoidBoneName.LeftLittleDistal]: {
    rotation: [
      0.1568558064757093,
      0.21174499192527432,
      0.6914503730233792,
      0.6726490139851915
    ]
  },
  [VRMSchema.HumanoidBoneName.LeftLittleIntermediate]: {
    rotation: [
      0,
      0,
      0.7071067811865476,
      0.7071067811865476
    ]
  },
  [VRMSchema.HumanoidBoneName.LeftLittleProximal]: {
    rotation: [
      0,
      0,
      0.7071067811865476,
      0.7071067811865476
    ]
  },
  [VRMSchema.HumanoidBoneName.LeftLowerArm]: {
    rotation: [
      0.15014114940567497,
      -0.8816663724971838,
      -0.17114475186643008,
      0.41331769472329405
    ]
  },
  [VRMSchema.HumanoidBoneName.LeftLowerLeg]: {
    rotation: [
      0.101996813833097,
      -0.06073768097746058,
      0.04548069263383802,
      0.9918866319670424
    ]
  },
  [VRMSchema.HumanoidBoneName.LeftMiddleDistal]: {
    rotation: [
      0,
      0,
      -0.1027875159593063,
      0.9947033359564627
    ]
  },
  [VRMSchema.HumanoidBoneName.LeftMiddleIntermediate]: {
    rotation: [
      0,
      0,
      -0.03560914475372165,
      0.9993657932958825
    ]
  },
  [VRMSchema.HumanoidBoneName.LeftMiddleProximal]: {
    rotation: [
      -0.0025998890083756806,
      0.026237604050329804,
      -0.05001800865324346,
      0.9984002341351922
    ]
  },
  [VRMSchema.HumanoidBoneName.LeftRingDistal]: {
    rotation: [
      0.020109773358269148,
      -0.04606801784897169,
      0.7056045193530629,
      0.7068207672497173
    ]
  },
  [VRMSchema.HumanoidBoneName.LeftRingIntermediate]: {
    rotation: [
      0,
      0,
      0.7071067811865476,
      0.7071067811865476
    ]
  },
  [VRMSchema.HumanoidBoneName.LeftRingProximal]: {
    rotation: [
      0,
      0,
      0.7071067811865476,
      0.7071067811865476
    ]
  },
  [VRMSchema.HumanoidBoneName.LeftShoulder]: {
    rotation: [
      0.1416311442987345,
      0.0904641108365223,
      -0.08532359812541815,
      0.9820777704530943
    ]
  },
  [VRMSchema.HumanoidBoneName.LeftThumbDistal]: {
    rotation: [
      -0.2352667891960039,
      0.5120312942050936,
      -0.08042272363114115,
      0.8221956441017001
    ]
  },
  [VRMSchema.HumanoidBoneName.LeftThumbIntermediate]: {
    rotation: [
      -0.19526587838834705,
      0.19936097888560989,
      0.05132514215627221,
      0.9589015416702786
    ]
  },
  [VRMSchema.HumanoidBoneName.LeftThumbProximal]: {
    rotation: [
      0.015117549045717915,
      0.2785812214774047,
      0.05203494511926526,
      0.9588828537613147
    ]
  },
  [VRMSchema.HumanoidBoneName.LeftToes]: {
    rotation: [
      0,
      0,
      0,
      1
    ]
  },
  [VRMSchema.HumanoidBoneName.LeftUpperArm]: {
    rotation: [
      -0.054249922679614884,
      -0.0065674090566263405,
      0.2014869041030883,
      0.9779656652983743
    ]
  },
  [VRMSchema.HumanoidBoneName.LeftUpperLeg]: {
    rotation: [
      0.14315069053414078,
      -0.03734612774500221,
      -0.12229065543455768,
      0.9814062064891576
    ]
  },
  [VRMSchema.HumanoidBoneName.Neck]: {
    rotation: [
      0.03285559817912266,
      0,
      0,
      0.9994601090930505
    ]
  },
  [VRMSchema.HumanoidBoneName.RightEye]: {
    rotation: [
      -0.0037995237082412664,
      0.0006996440932298325,
      0.0000026583341586324724,
      0.9999925370274854
    ]
  },
  [VRMSchema.HumanoidBoneName.RightFoot]: {
    rotation: [
      -0.03907695905255129,
      -0.0008255420430454642,
      -0.11766650914369643,
      0.9922836803946122
    ]
  },
  [VRMSchema.HumanoidBoneName.RightHand]: {
    rotation: [
      -0.3648952912507807,
      0.22209242565390008,
      0.34572205926338695,
      0.8354655221066025
    ]
  },
  [VRMSchema.HumanoidBoneName.RightIndexDistal]: {
    rotation: [
      0.05330036017931064,
      -0.003294151309216382,
      0.06159782908638367,
      0.9966714241031256
    ]
  },
  [VRMSchema.HumanoidBoneName.RightIndexIntermediate]: {
    rotation: [
      0,
      0,
      0.032965166168983304,
      0.9994565012142607
    ]
  },
  [VRMSchema.HumanoidBoneName.RightIndexProximal]: {
    rotation: [
      0.026816887596401728,
      0.2260805294594699,
      0.11469751744390717,
      0.9669606652967703
    ]
  },
  [VRMSchema.HumanoidBoneName.RightLittleDistal]: {
    rotation: [
      0,
      0,
      -0.7071067811865476,
      0.7071067811865476
    ]
  },
  [VRMSchema.HumanoidBoneName.RightLittleIntermediate]: {
    rotation: [
      0,
      0,
      -0.7071067811865476,
      0.7071067811865476
    ]
  },
  [VRMSchema.HumanoidBoneName.RightLittleProximal]: {
    rotation: [
      0,
      0,
      -0.7071067811865476,
      0.7071067811865476
    ]
  },
  [VRMSchema.HumanoidBoneName.RightLowerArm]: {
    rotation: [
      0.0980385223202602,
      0.8576360056190542,
      0.24170309142555277,
      0.4432026010780897
    ]
  },
  [VRMSchema.HumanoidBoneName.RightLowerLeg]: {
    rotation: [
      0.0783724729201963,
      0.08769430161608016,
      -0.051711596735022056,
      0.9917123452471263
    ]
  },
  [VRMSchema.HumanoidBoneName.RightMiddleDistal]: {
    rotation: [
      0,
      0,
      0.08026455767348724,
      0.9967735955478955
    ]
  },
  [VRMSchema.HumanoidBoneName.RightMiddleIntermediate]: {
    rotation: [
      0,
      0,
      0.025254406039762072,
      0.9996810566253513
    ]
  },
  [VRMSchema.HumanoidBoneName.RightMiddleProximal]: {
    rotation: [
      0.0015431107204760663,
      -0.01552789257243461,
      0.09887755580983747,
      0.9949772521613929
    ]
  },
  [VRMSchema.HumanoidBoneName.RightRingDistal]: {
    rotation: [
      -0.03493325772154775,
      0.02278703462818298,
      -0.699902223950215,
      0.7130198422676309
    ]
  },
  [VRMSchema.HumanoidBoneName.RightRingIntermediate]: {
    rotation: [
      0,
      0,
      -0.7071067811865476,
      0.7071067811865476
    ]
  },
  [VRMSchema.HumanoidBoneName.RightRingProximal]: {
    rotation: [
      0,
      0,
      -0.7071067811865476,
      0.7071067811865476
    ]
  },
  [VRMSchema.HumanoidBoneName.RightShoulder]: {
    rotation: [
      0.13194869733304632,
      -0.06703368359244954,
      0.0969867894052314,
      0.984220295064578
    ]
  },
  [VRMSchema.HumanoidBoneName.RightThumbDistal]: {
    rotation: [
      -0.2641501833322756,
      -0.27212364333005323,
      -0.11376620464754332,
      0.9182759139095377
    ]
  },
  [VRMSchema.HumanoidBoneName.RightThumbIntermediate]: {
    rotation: [
      -0.26279511809487904,
      -0.2786395210745717,
      0.0077608225630609925,
      0.9237091061768182
    ]
  },
  [VRMSchema.HumanoidBoneName.RightThumbProximal]: {
    rotation: [
      -0.0005566764027957766,
      -0.204426535127855,
      -0.12281526488418068,
      0.9711466895162806
    ]
  },
  [VRMSchema.HumanoidBoneName.RightToes]: {
    rotation: [
      0,
      0,
      0,
      1
    ]
  },
  [VRMSchema.HumanoidBoneName.RightUpperArm]: {
    rotation: [
      -0.002887290224523551,
      0.020920173916083078,
      -0.19892652980644696,
      0.9797868368260746
    ]
  },
  [VRMSchema.HumanoidBoneName.RightUpperLeg]: {
    rotation: [
      0.15993408243472299,
      0.04378077515654895,
      0.16933006858020277,
      0.9715099901066786
    ]
  },
  [VRMSchema.HumanoidBoneName.Spine]: {
    rotation: [
      0.003995954348490826,
      0,
      0,
      0.9999920161425515
    ]
  },
  [VRMSchema.HumanoidBoneName.UpperChest]: {
    rotation: [
      0.07135642314924895,
      0,
      0,
      0.9974508814349433
    ]
  }
}

export const kira: VRMPose = {
  ...stand,
  [VRMSchema.HumanoidBoneName.LeftThumbProximal]: {
    rotation: new Quaternion().setFromEuler(new Euler(0, MathUtils.degToRad(20), 0)).toArray() as RawVector4
  },
  [VRMSchema.HumanoidBoneName.Chest]: {
    rotation: [
      0.013312335656517259,
      0,
      0,
      0.9999113869335464
    ]
  },
  [VRMSchema.HumanoidBoneName.Head]: {
    rotation: [
      0.08603210708144307,
      0,
      0,
      0.9962923649969055
    ]
  },
  [VRMSchema.HumanoidBoneName.Hips]: {
    rotation: [
      -0.1787955102350469,
      -0.0006303832762068233,
      -0.00965300399150735,
      0.983838700016753
    ]
  },
  [VRMSchema.HumanoidBoneName.Jaw]: {
    rotation: [
      0,
      0,
      0,
      1
    ]
  },
  [VRMSchema.HumanoidBoneName.LeftEye]: {
    rotation: [
      -0.0037995237082412664,
      0.0006996440932298325,
      0.0000026583341586324724,
      0.9999925370274854
    ]
  },
  [VRMSchema.HumanoidBoneName.LeftFoot]: {
    rotation: [
      -0.0719891841574704,
      -0.00011644688831157979,
      0.09214837874308693,
      0.993139577350276
    ]
  },

  [VRMSchema.HumanoidBoneName.LeftToes]: {
    rotation: [
      0,
      0,
      0,
      1
    ]
  },
  [VRMSchema.HumanoidBoneName.LeftUpperLeg]: {
    rotation: [
      0.14315069053414078,
      -0.03734612774500221,
      -0.12229065543455768,
      0.9814062064891576
    ]
  },
  [VRMSchema.HumanoidBoneName.Neck]: {
    rotation: [
      0.03285559817912266,
      0,
      0,
      0.9994601090930505
    ]
  },
  [VRMSchema.HumanoidBoneName.RightEye]: {
    rotation: [
      -0.0037995237082412664,
      0.0006996440932298325,
      0.0000026583341586324724,
      0.9999925370274854
    ]
  },
  [VRMSchema.HumanoidBoneName.RightFoot]: {
    rotation: [
      -0.03907695905255129,
      -0.0008255420430454642,
      -0.11766650914369643,
      0.9922836803946122
    ]
  },
  [VRMSchema.HumanoidBoneName.RightHand]: {
    rotation: [
      -0.3648952912507807,
      0.22209242565390008,
      0.34572205926338695,
      0.8354655221066025
    ]
  },
  [VRMSchema.HumanoidBoneName.RightIndexDistal]: {
    rotation: [
      0.05330036017931064,
      -0.003294151309216382,
      0.06159782908638367,
      0.9966714241031256
    ]
  },
  [VRMSchema.HumanoidBoneName.RightIndexIntermediate]: {
    rotation: [
      0,
      0,
      0.032965166168983304,
      0.9994565012142607
    ]
  },
  [VRMSchema.HumanoidBoneName.RightIndexProximal]: {
    rotation: [
      0.026816887596401728,
      0.2260805294594699,
      0.11469751744390717,
      0.9669606652967703
    ]
  },
  [VRMSchema.HumanoidBoneName.RightLittleDistal]: {
    rotation: [
      0,
      0,
      -0.7071067811865476,
      0.7071067811865476
    ]
  },
  [VRMSchema.HumanoidBoneName.RightLittleIntermediate]: {
    rotation: [
      0,
      0,
      -0.7071067811865476,
      0.7071067811865476
    ]
  },
  [VRMSchema.HumanoidBoneName.RightLittleProximal]: {
    rotation: [
      0,
      0,
      -0.7071067811865476,
      0.7071067811865476
    ]
  },
  [VRMSchema.HumanoidBoneName.RightLowerArm]: {
    rotation: [
      0.0980385223202602,
      0.8576360056190542,
      0.24170309142555277,
      0.4432026010780897
    ]
  },
  [VRMSchema.HumanoidBoneName.RightLowerLeg]: {
    rotation: [
      0.0783724729201963,
      0.08769430161608016,
      -0.051711596735022056,
      0.9917123452471263
    ]
  },
  [VRMSchema.HumanoidBoneName.RightMiddleDistal]: {
    rotation: [
      0,
      0,
      0.08026455767348724,
      0.9967735955478955
    ]
  },
  [VRMSchema.HumanoidBoneName.RightMiddleIntermediate]: {
    rotation: [
      0,
      0,
      0.025254406039762072,
      0.9996810566253513
    ]
  },
  [VRMSchema.HumanoidBoneName.RightMiddleProximal]: {
    rotation: [
      0.0015431107204760663,
      -0.01552789257243461,
      0.09887755580983747,
      0.9949772521613929
    ]
  },
  [VRMSchema.HumanoidBoneName.RightRingDistal]: {
    rotation: [
      -0.03493325772154775,
      0.02278703462818298,
      -0.699902223950215,
      0.7130198422676309
    ]
  },
  [VRMSchema.HumanoidBoneName.RightRingIntermediate]: {
    rotation: [
      0,
      0,
      -0.7071067811865476,
      0.7071067811865476
    ]
  },
  [VRMSchema.HumanoidBoneName.RightRingProximal]: {
    rotation: [
      0,
      0,
      -0.7071067811865476,
      0.7071067811865476
    ]
  },
  [VRMSchema.HumanoidBoneName.RightShoulder]: {
    rotation: [
      0.13194869733304632,
      -0.06703368359244954,
      0.0969867894052314,
      0.984220295064578
    ]
  },
  [VRMSchema.HumanoidBoneName.RightThumbDistal]: {
    rotation: [
      -0.2641501833322756,
      -0.27212364333005323,
      -0.11376620464754332,
      0.9182759139095377
    ]
  },
  [VRMSchema.HumanoidBoneName.RightThumbIntermediate]: {
    rotation: [
      -0.26279511809487904,
      -0.2786395210745717,
      0.0077608225630609925,
      0.9237091061768182
    ]
  },
  [VRMSchema.HumanoidBoneName.RightThumbProximal]: {
    rotation: [
      -0.0005566764027957766,
      -0.204426535127855,
      -0.12281526488418068,
      0.9711466895162806
    ]
  },
  [VRMSchema.HumanoidBoneName.RightToes]: {
    rotation: [
      0,
      0,
      0,
      1
    ]
  },
  [VRMSchema.HumanoidBoneName.RightUpperArm]: {
    rotation: [
      -0.002887290224523551,
      0.020920173916083078,
      -0.19892652980644696,
      0.9797868368260746
    ]
  },
  [VRMSchema.HumanoidBoneName.RightUpperLeg]: {
    rotation: [
      0.15993408243472299,
      0.04378077515654895,
      0.16933006858020277,
      0.9715099901066786
    ]
  },
  [VRMSchema.HumanoidBoneName.Spine]: {
    rotation: [
      0.003995954348490826,
      0,
      0,
      0.9999920161425515
    ]
  },
  [VRMSchema.HumanoidBoneName.UpperChest]: {
    rotation: [
      0.07135642314924895,
      0,
      0,
      0.9974508814349433
    ]
  },
  [VRMSchema.HumanoidBoneName.LeftUpperArm]: {
    rotation: [0, 0, Math.PI / 2 - 1, 0.8]
  },
  [VRMSchema.HumanoidBoneName.LeftHand]: {
    rotation: [0, 0, 0.1, 0]
  }
}
export const allPose = {
  stand,
  sayHello,
  standOnOneLeg,
  ya,
  kira,
  stand2: idolJson
}
export const getPose = (targetName: keyof typeof allPose) => {
  const pose = allPose[targetName]
  return typeof pose === 'function' ? pose : () => pose
}
