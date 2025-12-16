import { ReactNode } from "react"
import { useAppStore } from "@/store/useAppStore"
import { Sidebar } from "./Sidebar"
import { TitleBar } from "@/components/titlebar"
import { cn } from "@/lib/utils"

interface DesktopLayoutProps {
  children: ReactNode
}

/**
 * 桌面端布局
 * - 自定义标题栏
 * - 左侧固定侧边栏
 * - 右侧主内容区
 */
export function DesktopLayout({ children }: DesktopLayoutProps) {
  const { sidebarOpen } = useAppStore()

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* 自定义标题栏 */}
      <TitleBar />

      {/* 主体内容 */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={cn(
            "border-r border-border transition-all duration-300 ease-in-out flex-shrink-0",
            sidebarOpen ? "w-64" : "w-0"
          )}
        >
          {sidebarOpen && <Sidebar className="w-64" />}
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}
