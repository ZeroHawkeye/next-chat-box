import { useState, useEffect, useRef } from "react"
import { getCurrentWindow, Window } from "@tauri-apps/api/window"
import { Minus, Square, X, Copy } from "lucide-react"
import { cn } from "@/lib/utils"
import { isTauri, getOperatingSystem } from "@/lib/platform"

interface TitleBarProps {
  className?: string
  title?: string
}

// 在模块级别检测环境，确保一致性
const IS_TAURI = isTauri()
const IS_MAC = getOperatingSystem() === "macos"

/**
 * 自定义标题栏组件
 * - 支持窗口拖拽（通过 startDragging API）
 * - 窗口控制按钮（最小化、最大化、关闭）
 * - 跨平台适配（Windows/macOS 按钮位置不同）
 */
export function TitleBar({ className, title = "Next AI" }: TitleBarProps) {
  const [isMaximized, setIsMaximized] = useState(false)
  const appWindowRef = useRef<Window | null>(null)

  useEffect(() => {
    if (!IS_TAURI) return

    // 获取窗口实例
    const win = getCurrentWindow()
    appWindowRef.current = win

    const checkMaximized = async () => {
      try {
        const maximized = await win.isMaximized()
        setIsMaximized(maximized)
      } catch {
        // 忽略错误
      }
    }

    checkMaximized()

    // 监听窗口状态变化
    let unlisten: (() => void) | undefined

    const setupListener = async () => {
      try {
        unlisten = await win.onResized(async () => {
          try {
            const maximized = await win.isMaximized()
            setIsMaximized(maximized)
          } catch {
            // 忽略错误
          }
        })
      } catch {
        // 忽略错误
      }
    }

    setupListener()

    return () => {
      unlisten?.()
    }
  }, [])

  // 开始拖拽窗口
  const startDrag = async () => {
    const win = appWindowRef.current
    if (!win) return
    try {
      await win.startDragging()
    } catch (e) {
      console.error("Failed to start dragging:", e)
    }
  }

  // 双击切换最大化
  const toggleMaximize = async () => {
    const win = appWindowRef.current
    if (!win) return
    try {
      await win.toggleMaximize()
    } catch (e) {
      console.error("Failed to toggle maximize:", e)
    }
  }

  const handleMinimize = async () => {
    const win = appWindowRef.current
    if (!win) return
    try {
      await win.minimize()
    } catch (e) {
      console.error("Failed to minimize:", e)
    }
  }

  const handleClose = async () => {
    const win = appWindowRef.current
    if (!win) return
    try {
      await win.close()
    } catch (e) {
      console.error("Failed to close:", e)
    }
  }

  // 非 Tauri 环境不显示标题栏
  if (!IS_TAURI) {
    return null
  }

  return (
    <header
      className={cn(
        "h-9 flex items-center select-none bg-background border-b border-border/50 flex-shrink-0",
        className
      )}
      onMouseDown={(e) => {
        // 只处理左键
        if (e.button !== 0) return
        // 双击最大化
        if (e.detail === 2) {
          toggleMaximize()
        } else {
          startDrag()
        }
      }}
    >
      {/* macOS: 按钮在左侧，需要留出空间给系统交通灯按钮 */}
      {IS_MAC && <div className="w-[70px] flex-shrink-0" />}

      {/* 标题 - 可拖拽区域 */}
      <div className="flex-1 flex items-center px-3 h-full">
        <span className="text-xs font-medium text-muted-foreground">
          {title}
        </span>
      </div>

      {/* Windows/Linux: 按钮在右侧 */}
      {!IS_MAC && (
        <div className="flex items-center flex-shrink-0 h-full">
          <WindowButton
            onClick={handleMinimize}
            hoverClass="hover:bg-secondary"
            aria-label="最小化"
          >
            <Minus className="w-4 h-4" />
          </WindowButton>
          
          <WindowButton
            onClick={toggleMaximize}
            hoverClass="hover:bg-secondary"
            aria-label={isMaximized ? "还原" : "最大化"}
          >
            {isMaximized ? (
              <Copy className="w-3.5 h-3.5 rotate-180" />
            ) : (
              <Square className="w-3.5 h-3.5" />
            )}
          </WindowButton>
          
          <WindowButton
            onClick={handleClose}
            hoverClass="hover:bg-red-500 hover:text-white"
            aria-label="关闭"
          >
            <X className="w-4 h-4" />
          </WindowButton>
        </div>
      )}
    </header>
  )
}

interface WindowButtonProps {
  onClick: () => void
  hoverClass?: string
  children: React.ReactNode
  "aria-label": string
}

function WindowButton({ onClick, hoverClass, children, "aria-label": ariaLabel }: WindowButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      onMouseDown={(e) => {
        e.stopPropagation()
      }}
      className={cn(
        "w-12 h-full flex items-center justify-center transition-colors",
        "text-foreground/70 hover:text-foreground",
        hoverClass
      )}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}
