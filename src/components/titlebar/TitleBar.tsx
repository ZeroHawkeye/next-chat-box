import { useState, useEffect } from "react"
import { getCurrentWindow } from "@tauri-apps/api/window"
import { Minus, Square, X, Maximize2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePlatform } from "@/hooks/usePlatform"

interface TitleBarProps {
  className?: string
  title?: string
}

/**
 * 自定义标题栏组件
 * - 支持窗口拖拽
 * - 窗口控制按钮（最小化、最大化、关闭）
 * - 跨平台适配（Windows/macOS 按钮位置不同）
 */
export function TitleBar({ className, title = "Next AI" }: TitleBarProps) {
  const { isDesktop, isMacOS } = usePlatform()
  const [isMaximized, setIsMaximized] = useState(false)

  useEffect(() => {
    if (!isDesktop) return

    const checkMaximized = async () => {
      try {
        const win = getCurrentWindow()
        const maximized = await win.isMaximized()
        setIsMaximized(maximized)
      } catch {
        // 忽略非 Tauri 环境的错误
      }
    }

    checkMaximized()

    // 监听窗口状态变化
    let unlisten: (() => void) | undefined

    const setupListener = async () => {
      try {
        const win = getCurrentWindow()
        unlisten = await win.onResized(async () => {
          const maximized = await win.isMaximized()
          setIsMaximized(maximized)
        })
      } catch {
        // 忽略非 Tauri 环境的错误
      }
    }

    setupListener()

    return () => {
      unlisten?.()
    }
  }, [isDesktop])

  const handleMinimize = async () => {
    try {
      const win = getCurrentWindow()
      await win.minimize()
    } catch {
      // 忽略非 Tauri 环境的错误
    }
  }

  const handleMaximize = async () => {
    try {
      const win = getCurrentWindow()
      await win.toggleMaximize()
    } catch {
      // 忽略非 Tauri 环境的错误
    }
  }

  const handleClose = async () => {
    try {
      const win = getCurrentWindow()
      await win.close()
    } catch {
      // 忽略非 Tauri 环境的错误
    }
  }

  // 非桌面端不显示标题栏
  if (!isDesktop) {
    return null
  }

  return (
    <header
      data-tauri-drag-region
      className={cn(
        "h-8 flex items-center select-none bg-background/80 backdrop-blur-sm border-b border-border/50",
        "titlebar-drag",
        className
      )}
    >
      {/* macOS: 按钮在左侧，需要留出空间 */}
      {isMacOS && <div className="w-[70px]" />}

      {/* 标题 */}
      <div className="flex-1 flex items-center px-3">
        <span className="text-xs font-medium text-muted-foreground">{title}</span>
      </div>

      {/* Windows/Linux: 按钮在右侧 */}
      {!isMacOS && (
        <div className="flex items-center titlebar-no-drag">
          <WindowButton
            onClick={handleMinimize}
            className="hover:bg-muted"
            aria-label="最小化"
          >
            <Minus className="w-3.5 h-3.5" />
          </WindowButton>
          
          <WindowButton
            onClick={handleMaximize}
            className="hover:bg-muted"
            aria-label={isMaximized ? "还原" : "最大化"}
          >
            {isMaximized ? (
              <Maximize2 className="w-3 h-3" />
            ) : (
              <Square className="w-3 h-3" />
            )}
          </WindowButton>
          
          <WindowButton
            onClick={handleClose}
            className="hover:bg-destructive hover:text-destructive-foreground"
            aria-label="关闭"
          >
            <X className="w-3.5 h-3.5" />
          </WindowButton>
        </div>
      )}
    </header>
  )
}

interface WindowButtonProps {
  onClick: () => void
  className?: string
  children: React.ReactNode
  "aria-label": string
}

function WindowButton({ onClick, className, children, "aria-label": ariaLabel }: WindowButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-11 h-8 flex items-center justify-center transition-colors",
        "text-foreground/70 hover:text-foreground",
        className
      )}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}
