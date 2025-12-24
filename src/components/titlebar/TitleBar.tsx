import { useState, useEffect, useRef } from "react"
import { getCurrentWindow, Window } from "@tauri-apps/api/window"
import { Minus, X, Square, Copy } from "lucide-react"
import { cn } from "@/lib/utils"
import { isTauri, getOperatingSystem } from "@/lib/platform"
import Logo from "@/components/ui/Logo"

interface TitleBarProps {
  className?: string
}

// 在模块级别检测环境
const IS_TAURI = isTauri()
const IS_MAC = getOperatingSystem() === "macos"

/**
 * Apple Design System 标题栏组件
 * 
 * 设计特点:
 * - 毛玻璃背景效果
 * - 精致的窗口控制按钮
 * - 流畅的动画效果
 * - 跨平台适配
 */
export function TitleBar({ className }: TitleBarProps) {
  const [isMaximized, setIsMaximized] = useState(false)
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)
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
        "h-8 flex items-center select-none flex-shrink-0",
        "bg-titlebar/90 backdrop-blur-2xl backdrop-saturate-150",
        "border-b border-titlebar-border",
        "transition-colors duration-normal ease-apple",
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
      {/* macOS: 红绿灯按钮在左侧 (由系统渲染，留出空间) */}
      {IS_MAC && <div className="w-[70px] flex-shrink-0" />}

      {/* Logo - 左侧 */}
      {!IS_MAC && (
        <div className="flex items-center pl-2.5 pr-2 h-full">
          <Logo size={15} />
        </div>
      )}

      {/* 占位区域 */}
      <div className="flex-1" />

      {/* Windows/Linux: 窗口控制按钮在右侧 */}
      {!IS_MAC && (
        <div className="flex items-center flex-shrink-0 h-full">
          {/* 最小化 */}
          <WindowControlButton
            onClick={handleMinimize}
            isHovered={hoveredButton === "minimize"}
            onHoverChange={(h) => setHoveredButton(h ? "minimize" : null)}
            aria-label="最小化"
          >
            <Minus className="w-3.5 h-3.5" strokeWidth={1.5} />
          </WindowControlButton>
          
          {/* 最大化/还原 */}
          <WindowControlButton
            onClick={toggleMaximize}
            isHovered={hoveredButton === "maximize"}
            onHoverChange={(h) => setHoveredButton(h ? "maximize" : null)}
            aria-label={isMaximized ? "还原" : "最大化"}
          >
            {isMaximized ? (
              <Copy className="w-[11px] h-[11px] rotate-180" strokeWidth={1.5} />
            ) : (
              <Square className="w-2.5 h-2.5" strokeWidth={1.5} />
            )}
          </WindowControlButton>
          
          {/* 关闭 */}
          <WindowControlButton
            onClick={handleClose}
            variant="close"
            isHovered={hoveredButton === "close"}
            onHoverChange={(h) => setHoveredButton(h ? "close" : null)}
            aria-label="关闭"
          >
            <X className="w-3.5 h-3.5" strokeWidth={1.5} />
          </WindowControlButton>
        </div>
      )}
    </header>
  )
}

interface WindowControlButtonProps {
  onClick: () => void
  children: React.ReactNode
  "aria-label": string
  variant?: "default" | "close"
  isHovered?: boolean
  onHoverChange?: (hovering: boolean) => void
}

function WindowControlButton({ 
  onClick, 
  children, 
  "aria-label": ariaLabel,
  variant = "default",
  isHovered,
  onHoverChange
}: WindowControlButtonProps) {
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
        "w-11 h-full flex items-center justify-center",
        "transition-all duration-fast ease-apple",
        "text-muted-foreground/70",
        // 默认按钮
        variant === "default" && [
          "hover:bg-foreground/6 hover:text-foreground",
          isHovered && "bg-foreground/6 text-foreground",
        ],
        // 关闭按钮 - Apple 红色背景 + 白色图标
        variant === "close" && [
          "hover:bg-[#FF3B30] hover:text-white",
          isHovered && "bg-[#FF3B30] text-white",
          "[&>span]:hover:drop-shadow-sm",
        ],
        "active:opacity-80"
      )}
      aria-label={ariaLabel}
    >
      <span className={cn(
        "transition-transform duration-fast ease-apple",
        isHovered && "scale-105"
      )}>
        {children}
      </span>
    </button>
  )
}
