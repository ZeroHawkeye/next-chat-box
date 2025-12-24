import { ReactNode, useState, useCallback, useEffect, useRef } from "react"
import { useAssistantStore, SIDEBAR_MIN_WIDTH, SIDEBAR_COLLAPSE_THRESHOLD } from "@/store/useAssistantStore"
import { Sidebar } from "./Sidebar"
import { TitleBar } from "@/components/titlebar"
import { cn } from "@/lib/utils"
import { PanelLeftOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DesktopLayoutProps {
  children: ReactNode
}

/**
 * 桌面端布局
 * - 自定义标题栏
 * - 左侧可拖拽调整宽度的侧边栏
 * - 右侧主内容区
 * - 自定义窗口边框
 */
export function DesktopLayout({ children }: DesktopLayoutProps) {
  const { sidebarOpen, sidebarWidth, setSidebarWidth, setSidebarOpen } = useAssistantStore()
  const [isResizing, setIsResizing] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }, [])

  const stopResizing = useCallback(() => {
    setIsResizing(false)
  }, [])

  const resize = useCallback((e: MouseEvent) => {
    if (!isResizing) return
    
    const newWidth = e.clientX
    
    // 如果拖拽到阈值以下，折叠侧边栏
    if (newWidth < SIDEBAR_COLLAPSE_THRESHOLD) {
      setSidebarOpen(false)
    } else {
      if (!sidebarOpen) {
        setSidebarOpen(true)
      }
      setSidebarWidth(Math.max(newWidth, SIDEBAR_MIN_WIDTH))
    }
  }, [isResizing, sidebarOpen, setSidebarWidth, setSidebarOpen])

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', resize)
      document.addEventListener('mouseup', stopResizing)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', resize)
      document.removeEventListener('mouseup', stopResizing)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing, resize, stopResizing])

  const handleExpandSidebar = () => {
    setSidebarOpen(true)
  }

  return (
    <div className="flex flex-col h-screen bg-background border border-border rounded-sm overflow-hidden">
      {/* 自定义标题栏 */}
      <TitleBar />

      {/* 主体内容 */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside
          ref={sidebarRef}
          className={cn(
            "relative flex-shrink-0 border-r border-border",
            "transition-[width] ease-out",
            isResizing ? "duration-0" : "duration-200"
          )}
          style={{ width: sidebarOpen ? sidebarWidth : 0 }}
        >
          {sidebarOpen && (
            <>
              <Sidebar className="h-full" style={{ width: sidebarWidth }} />
              {/* 拖拽手柄 */}
              <div
                className={cn(
                  "absolute top-0 right-0 w-1 h-full cursor-col-resize z-10",
                  "hover:bg-primary/20 active:bg-primary/30",
                  "transition-colors duration-100",
                  isResizing && "bg-primary/30"
                )}
                onMouseDown={startResizing}
              />
            </>
          )}
        </aside>

        {/* 展开侧边栏按钮 */}
        {!sidebarOpen && (
          <div className="flex-shrink-0 flex items-start pt-2 pl-1.5">
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-7 w-7 rounded"
              onClick={handleExpandSidebar}
              title="展开侧边栏"
            >
              <PanelLeftOpen className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>
        )}

         {/* Main Content - 让子组件自己控制滚动 */}
         <main className="flex-1 flex flex-col min-w-0 min-h-0">
           {children}
         </main>
      </div>
    </div>
  )
}
