import { useState, useEffect, useRef } from "react"
import { getCurrentWindow, Window } from "@tauri-apps/api/window"
import { Minus, X, Copy, Maximize2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { isTauri, getOperatingSystem } from "@/lib/platform"

interface TitleBarProps {
  className?: string
  title?: string
}

// 在模块级别检测环境
const IS_TAURI = isTauri()
const IS_MAC = getOperatingSystem() === "macos"

/**
 * 2025 现代化标题栏组件
 * 
 * 设计特点:
 * - 毛玻璃背景效果
 * - 平滑的按钮动画
 * - 精细的悬浮效果
 * - 跨平台适配
 */
export function TitleBar({ className, title = "Next Chat Box" }: TitleBarProps) {
  const [isMaximized, setIsMaximized] = useState(false)
  const [isHovering, setIsHovering] = useState<string | null>(null)
  const appWindowRef = useRef<Window | null>(null)

  useEffect(() => {
    if (!IS_TAURI) return

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

  const startDrag = async () => {
    const win = appWindowRef.current
    if (!win) return
    try {
      await win.startDragging()
    } catch (e) {
      console.error("Failed to start dragging:", e)
    }
  }

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
        "h-10 flex items-center select-none flex-shrink-0",
        "bg-titlebar/80 backdrop-blur-xl",
        "border-b border-titlebar-border/30",
        "transition-colors duration-200",
        className
      )}
      onMouseDown={(e) => {
        if (e.button !== 0) return
        if (e.detail === 2) {
          toggleMaximize()
        } else {
          startDrag()
        }
      }}
    >
      {/* macOS: 按钮在左侧 */}
      {IS_MAC && <div className="w-[70px] flex-shrink-0" />}

      {/* 标题区域 */}
      <div className="flex-1 flex items-center px-4 h-full">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gradient-primary flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">N</span>
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            {title}
          </span>
        </div>
      </div>

      {/* Windows/Linux: 按钮在右侧 */}
      {!IS_MAC && (
        <div className="flex items-center flex-shrink-0 h-full">
          <WindowButton
            onClick={handleMinimize}
            isHovering={isHovering === "minimize"}
            onHoverChange={(hovering) => setIsHovering(hovering ? "minimize" : null)}
            aria-label="最小化"
          >
            <Minus className="w-4 h-4" strokeWidth={1.5} />
          </WindowButton>
          
          <WindowButton
            onClick={toggleMaximize}
            isHovering={isHovering === "maximize"}
            onHoverChange={(hovering) => setIsHovering(hovering ? "maximize" : null)}
            aria-label={isMaximized ? "还原" : "最大化"}
          >
            {isMaximized ? (
              <Copy className="w-3.5 h-3.5 rotate-180" strokeWidth={1.5} />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" strokeWidth={1.5} />
            )}
          </WindowButton>
          
          <WindowButton
            onClick={handleClose}
            variant="close"
            isHovering={isHovering === "close"}
            onHoverChange={(hovering) => setIsHovering(hovering ? "close" : null)}
            aria-label="关闭"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </WindowButton>
        </div>
      )}
    </header>
  )
}

interface WindowButtonProps {
  onClick: () => void
  children: React.ReactNode
  "aria-label": string
  variant?: "default" | "close"
  isHovering?: boolean
  onHoverChange?: (hovering: boolean) => void
}

function WindowButton({ 
  onClick, 
  children, 
  "aria-label": ariaLabel,
  variant = "default",
  isHovering,
  onHoverChange
}: WindowButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      onMouseDown={(e) => {
        e.stopPropagation()
      }}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      className={cn(
        "w-12 h-full flex items-center justify-center",
        "transition-all duration-150",
        "text-muted-foreground",
        // 默认按钮样式
        variant === "default" && [
          "hover:bg-secondary/80 hover:text-foreground",
          isHovering && "bg-secondary/80 text-foreground",
        ],
        // 关闭按钮样式
        variant === "close" && [
          "hover:bg-red-500 hover:text-white",
          isHovering && "bg-red-500 text-white",
        ],
        // 按下效果
        "active:opacity-70"
      )}
      aria-label={ariaLabel}
    >
      <span className={cn(
        "transition-transform duration-150",
        isHovering && "scale-110"
      )}>
        {children}
      </span>
    </button>
  )
}
