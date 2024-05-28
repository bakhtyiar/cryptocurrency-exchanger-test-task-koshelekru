/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_BINANCE_URL_API_V3: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
