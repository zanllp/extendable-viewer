/* eslint-disable */
declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}
declare module '*.gltf' {
    const component: string
    export default component
}
declare module '*.dds' {
    const component: string
    export default component
}
declare module '*.vrm' {
    const component: string
    export default component
}declare module '*.glb' {
    const component: string
    export default component
}declare module '*.fbx' {
    const component: string
    export default component
}declare module '*.json' {
    const component: any
    export default component
}
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.less' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.styl' {
  const classes: { [key: string]: string };
  export default classes;
}
