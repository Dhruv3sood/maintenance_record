/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  // Add other env variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Also declare for vite/client module
declare module 'vite/client' {
  interface ImportMetaEnv {
    readonly VITE_API_URL?: string
  }
}
