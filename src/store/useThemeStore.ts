import { create } from "zustand"
import { persist, devtools } from "zustand/middleware"

/**
 * 主题模式
 */
export type ThemeMode = "light" | "dark" | "system"

/**
 * 主题配色方案
 * - default: 默认蓝色主题
 * - purple: 紫色主题
 * - green: 绿色主题
 * - orange: 橙色主题
 * - rose: 玫瑰色主题
 * - slate: 石板灰主题
 */
export type ThemeColor = "default" | "purple" | "green" | "orange" | "rose" | "slate"

/**
 * 主题配色定义
 */
export interface ThemeColors {
  name: string
  label: string
  primary: string
  primaryForeground: string
  // HSL 值用于 CSS 变量
  primaryHsl: string
}

/**
 * 预设主题配色
 */
export const themeColors: Record<ThemeColor, ThemeColors> = {
  default: {
    name: "default",
    label: "默认蓝",
    primary: "#3b82f6",
    primaryForeground: "#ffffff",
    primaryHsl: "221.2 83.2% 53.3%",
  },
  purple: {
    name: "purple",
    label: "活力紫",
    primary: "#8b5cf6",
    primaryForeground: "#ffffff",
    primaryHsl: "262.1 83.3% 57.8%",
  },
  green: {
    name: "green",
    label: "清新绿",
    primary: "#10b981",
    primaryForeground: "#ffffff",
    primaryHsl: "160.1 84.1% 39.4%",
  },
  orange: {
    name: "orange",
    label: "活力橙",
    primary: "#f97316",
    primaryForeground: "#ffffff",
    primaryHsl: "24.6 95% 53.1%",
  },
  rose: {
    name: "rose",
    label: "浪漫玫瑰",
    primary: "#f43f5e",
    primaryForeground: "#ffffff",
    primaryHsl: "350.4 89.2% 60.2%",
  },
  slate: {
    name: "slate",
    label: "商务灰",
    primary: "#64748b",
    primaryForeground: "#ffffff",
    primaryHsl: "215.4 16.3% 46.9%",
  },
}

/**
 * 缩放配置
 */
export const ZOOM_MIN = 50
export const ZOOM_MAX = 250
export const ZOOM_DEFAULT = 100

/**
 * 主题 Store 状态
 */
export interface ThemeState {
  // 当前主题模式
  mode: ThemeMode
  // 当前主题配色
  color: ThemeColor
  // 实际应用的主题（light/dark）
  resolvedTheme: "light" | "dark"
  // 是否已初始化
  initialized: boolean
  // 界面缩放比例 (50-250)
  zoom: number
}

/**
 * 主题 Store 操作
 */
export interface ThemeActions {
  // 设置主题模式
  setMode: (mode: ThemeMode) => void
  // 设置主题配色
  setColor: (color: ThemeColor) => void
  // 设置缩放比例 (50-250)
  setZoom: (zoom: number) => void
  // 初始化主题（在应用启动时调用）
  initializeTheme: () => void
  // 获取当前主题配色信息
  getThemeColors: () => ThemeColors
}

/**
 * 解析主题模式为实际主题
 */
function resolveTheme(mode: ThemeMode): "light" | "dark" {
  if (mode === "system") {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }
    return "light"
  }
  return mode
}

/**
 * 应用缩放比例到 DOM（类似浏览器的缩放效果）
 * @param zoom 缩放百分比 (50-250)
 * 
 * 使用 CSS zoom 属性实现整体缩放，保持滚动正常工作
 * zoom 属性会影响布局尺寸，因此滚动容器可以正确计算高度
 */
function applyZoom(zoom: number) {
  if (typeof document === "undefined") return
  
  // 限制范围
  const clampedZoom = Math.min(Math.max(zoom, ZOOM_MIN), ZOOM_MAX)
  const scaleValue = clampedZoom / 100
  
  // 清除之前的 transform 方案（如果有）
  const root = document.documentElement
  root.style.transform = ''
  root.style.transformOrigin = ''
  root.style.width = ''
  
  // 使用 zoom 属性实现缩放
  // zoom 会改变布局尺寸，保持滚动正常工作
  document.body.style.zoom = String(scaleValue)
  
  // 调整 html 高度以适应缩放后的 body
  // 这确保垂直滚动在放大时正常工作
  root.style.height = `${100 / scaleValue}%`
}

/**
 * 应用主题到 DOM
 */
function applyTheme(resolvedTheme: "light" | "dark", color: ThemeColor) {
  if (typeof document === "undefined") return

  const root = document.documentElement

  // 移除所有主题类
  root.classList.remove("light", "dark")
  // 移除所有配色类
  Object.keys(themeColors).forEach((c) => {
    root.classList.remove(`theme-${c}`)
  })

  // 添加当前主题类
  root.classList.add(resolvedTheme)
  // 添加当前配色类
  root.classList.add(`theme-${color}`)

  // 更新 meta theme-color
  const metaThemeColor = document.querySelector('meta[name="theme-color"]')
  if (metaThemeColor) {
    metaThemeColor.setAttribute(
      "content",
      resolvedTheme === "dark" ? "#0a0a0f" : "#ffffff"
    )
  }
}

/**
 * 主题 Store
 */
export const useThemeStore = create<ThemeState & ThemeActions>()(
  devtools(
    persist(
      (set, get) => ({
        // 初始状态
        mode: "system",
        color: "default",
        resolvedTheme: "light",
        initialized: false,
        zoom: ZOOM_DEFAULT,

        // 设置主题模式
        setMode: (mode) => {
          const resolvedTheme = resolveTheme(mode)
          set({ mode, resolvedTheme })
          applyTheme(resolvedTheme, get().color)
        },

        // 设置主题配色
        setColor: (color) => {
          set({ color })
          applyTheme(get().resolvedTheme, color)
        },

        // 设置缩放比例
        setZoom: (zoom) => {
          set({ zoom })
          applyZoom(zoom)
        },

        // 初始化主题
        initializeTheme: () => {
          const state = get()
          if (state.initialized) return

          const resolvedTheme = resolveTheme(state.mode)
          set({ resolvedTheme, initialized: true })
          applyTheme(resolvedTheme, state.color)
          applyZoom(state.zoom)

          // 监听系统主题变化
          if (typeof window !== "undefined" && state.mode === "system") {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
            const handler = (e: MediaQueryListEvent) => {
              if (get().mode === "system") {
                const newResolvedTheme = e.matches ? "dark" : "light"
                set({ resolvedTheme: newResolvedTheme })
                applyTheme(newResolvedTheme, get().color)
              }
            }
            mediaQuery.addEventListener("change", handler)
          }

          // 隐藏骨架屏
          if (typeof window !== "undefined" && window.__hideSplashScreen) {
            // 稍微延迟以确保 React 已渲染
            requestAnimationFrame(() => {
              window.__hideSplashScreen?.()
            })
          }
        },

        // 获取当前主题配色信息
        getThemeColors: () => {
          return themeColors[get().color]
        },
      }),
      {
        name: "theme-store",
        partialize: (state) => ({
          mode: state.mode,
          color: state.color,
          zoom: state.zoom,
        }),
      }
    ),
    {
      name: "theme-store",
    }
  )
)

// 扩展 Window 类型
declare global {
  interface Window {
    __hideSplashScreen?: () => void
  }
}
