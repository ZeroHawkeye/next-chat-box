import { useState, useEffect, useCallback, useMemo } from "react"
import {
  getPlatformInfo,
  getBreakpoint,
  isTauri,
  getOperatingSystem,
  type PlatformInfo,
} from "@/lib/platform"

// 在模块级别缓存平台检测结果，确保一致性
const CACHED_IS_TAURI = isTauri()
const CACHED_OS = getOperatingSystem()

/**
 * 平台检测 Hook
 * 提供响应式的平台信息，自动监听窗口大小变化
 */
export function usePlatform(): PlatformInfo & {
  isDesktop: boolean
  isWeb: boolean
  isMobileView: boolean
  isMacOS: boolean
  isWindows: boolean
  isLinux: boolean
} {
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo>(() => {
    const info = getPlatformInfo()
    // 确保使用缓存的 Tauri 检测结果
    return {
      ...info,
      isTauri: CACHED_IS_TAURI,
      platform: CACHED_IS_TAURI ? "desktop" : info.platform,
    }
  })

  const updatePlatformInfo = useCallback(() => {
    const info = getPlatformInfo()
    setPlatformInfo({
      ...info,
      // 保持 Tauri 检测结果一致
      isTauri: CACHED_IS_TAURI,
      platform: CACHED_IS_TAURI ? "desktop" : info.platform,
    })
  }, [])

  useEffect(() => {
    // 监听窗口大小变化
    window.addEventListener("resize", updatePlatformInfo)

    // 监听媒体查询变化 (用于检测系统主题等)
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    mediaQuery.addEventListener("change", updatePlatformInfo)

    return () => {
      window.removeEventListener("resize", updatePlatformInfo)
      mediaQuery.removeEventListener("change", updatePlatformInfo)
    }
  }, [updatePlatformInfo])

  // 使用 useMemo 确保返回值稳定
  return useMemo(() => ({
    ...platformInfo,
    isDesktop: platformInfo.platform === "desktop",
    isWeb: platformInfo.platform === "web",
    isMobileView: platformInfo.isMobile || platformInfo.breakpoint === "xs" || platformInfo.breakpoint === "sm",
    isMacOS: CACHED_OS === "macos",
    isWindows: CACHED_OS === "windows",
    isLinux: CACHED_OS === "linux",
  }), [platformInfo])
}

/**
 * 断点检测 Hook
 * 用于响应式布局
 */
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState(getBreakpoint)

  useEffect(() => {
    const handleResize = () => {
      setBreakpoint(getBreakpoint())
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return useMemo(() => ({
    breakpoint,
    isXs: breakpoint === "xs",
    isSm: breakpoint === "sm",
    isMd: breakpoint === "md",
    isLg: breakpoint === "lg",
    isXl: breakpoint === "xl",
    is2xl: breakpoint === "2xl",
    // 便捷方法
    isMobile: breakpoint === "xs" || breakpoint === "sm",
    isTablet: breakpoint === "md",
    isDesktop: breakpoint === "lg" || breakpoint === "xl" || breakpoint === "2xl",
  }), [breakpoint])
}

/**
 * 媒体查询 Hook
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches)

    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [query])

  return matches
}

/**
 * 简单的 Tauri 环境检测 Hook
 * 使用缓存值，确保一致性
 */
export function useIsTauri(): boolean {
  return CACHED_IS_TAURI
}
