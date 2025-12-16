/// <reference types="vite/client" />

// 构建平台常量类型声明
declare const __BUILD_PLATFORM__: "tauri" | "web"

// Tauri 全局对象类型声明
interface Window {
  __TAURI__?: {
    [key: string]: unknown
  }
}
