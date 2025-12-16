/**
 * 平台检测工具
 * 用于检测当前运行环境: Tauri Desktop / Web / Mobile
 */

export type Platform = "desktop" | "web" | "mobile"
export type DeviceType = "phone" | "tablet" | "desktop"
export type OperatingSystem = "windows" | "macos" | "linux" | "ios" | "android" | "unknown"

/**
 * 检测是否在 Tauri 环境中运行
 */
export function isTauri(): boolean {
  return typeof window !== "undefined" && "__TAURI__" in window
}

/**
 * 检测是否为移动设备 (基于 User Agent)
 */
export function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

/**
 * 检测是否为平板设备
 */
export function isTablet(): boolean {
  if (typeof navigator === "undefined") return false
  const ua = navigator.userAgent
  return /iPad|Android(?!.*Mobile)|Tablet/i.test(ua)
}

/**
 * 检测是否为触摸设备
 */
export function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false
  return "ontouchstart" in window || navigator.maxTouchPoints > 0
}

/**
 * 检测操作系统
 */
export function getOperatingSystem(): OperatingSystem {
  if (typeof navigator === "undefined") return "unknown"
  
  const ua = navigator.userAgent.toLowerCase()
  const platform = navigator.platform?.toLowerCase() || ""
  
  // 检测 iOS
  if (/iphone|ipad|ipod/.test(ua) || (platform === "macintel" && navigator.maxTouchPoints > 1)) {
    return "ios"
  }
  
  // 检测 Android
  if (/android/.test(ua)) {
    return "android"
  }
  
  // 检测 macOS
  if (/macintosh|mac os x/.test(ua) || platform.startsWith("mac")) {
    return "macos"
  }
  
  // 检测 Windows
  if (/win32|win64|windows/.test(ua) || platform.startsWith("win")) {
    return "windows"
  }
  
  // 检测 Linux
  if (/linux/.test(ua) || platform.startsWith("linux")) {
    return "linux"
  }
  
  return "unknown"
}

/**
 * 获取当前平台类型
 */
export function getPlatform(): Platform {
  // Tauri 桌面应用
  if (isTauri()) {
    return "desktop"
  }

  // 移动设备 (Web 浏览器)
  if (isMobileDevice()) {
    return "mobile"
  }

  // 默认为 Web
  return "web"
}

/**
 * 获取设备类型
 */
export function getDeviceType(): DeviceType {
  if (isTablet()) return "tablet"
  if (isMobileDevice()) return "phone"
  return "desktop"
}

/**
 * 获取屏幕断点类型
 */
export function getBreakpoint(): "xs" | "sm" | "md" | "lg" | "xl" | "2xl" {
  if (typeof window === "undefined") return "lg"

  const width = window.innerWidth

  if (width < 480) return "xs"
  if (width < 640) return "sm"
  if (width < 768) return "md"
  if (width < 1024) return "lg"
  if (width < 1280) return "xl"
  return "2xl"
}

/**
 * 平台信息
 */
export interface PlatformInfo {
  platform: Platform
  deviceType: DeviceType
  os: OperatingSystem
  isTauri: boolean
  isMobile: boolean
  isTablet: boolean
  isTouch: boolean
  isMacOS: boolean
  isWindows: boolean
  isLinux: boolean
  breakpoint: "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
}

/**
 * 获取完整的平台信息
 */
export function getPlatformInfo(): PlatformInfo {
  const os = getOperatingSystem()
  return {
    platform: getPlatform(),
    deviceType: getDeviceType(),
    os,
    isTauri: isTauri(),
    isMobile: isMobileDevice(),
    isTablet: isTablet(),
    isTouch: isTouchDevice(),
    isMacOS: os === "macos",
    isWindows: os === "windows",
    isLinux: os === "linux",
    breakpoint: getBreakpoint(),
  }
}
