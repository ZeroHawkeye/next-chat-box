import { ReactNode } from "react"
import { useAppStore } from "@/store/useAppStore"
import { Sidebar } from "./Sidebar"
import { cn } from "@/lib/utils"

interface DesktopLayoutProps {
  children: ReactNode
}

/**
 * 桌面端布局
 * - 左侧固定侧边栏
 * - 右侧主内容区
 */
export function DesktopLayout({ children }: DesktopLayoutProps) {
  const { sidebarOpen } = useAppStore()

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "border-r border-border transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-64" : "w-0"
        )}
      >
        {sidebarOpen && <Sidebar className="w-64" />}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  )
}
