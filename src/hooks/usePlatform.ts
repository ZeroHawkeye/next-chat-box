import { useState, useEffect, useCallback } from "react"
import {
  getPlatformInfo,
  getBreakpoint,
  type PlatformInfo,
} from "@/lib/platform"

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
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo>(getPlatformInfo)

  const updatePlatformInfo = useCallback(() => {
    setPlatformInfo(getPlatformInfo())
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

  return {
    ...platformInfo,
    isDesktop: platformInfo.platform === "desktop",
    isWeb: platformInfo.platform === "web",
    isMobileView: platformInfo.isMobile || platformInfo.breakpoint === "xs" || platformInfo.breakpoint === "sm",
    isMacOS: platformInfo.isMacOS,
    isWindows: platformInfo.isWindows,
    isLinux: platformInfo.isLinux,
  }
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

  return {
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
  }
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
