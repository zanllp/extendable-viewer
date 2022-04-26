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
}