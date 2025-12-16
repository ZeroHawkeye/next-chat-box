import { ReactNode, useState } from "react"
import { useBreakpoint } from "@/hooks/usePlatform"
import { Sidebar } from "./Sidebar"
import { MobileNav } from "./MobileNav"
import { cn } from "@/lib/utils"

interface WebLayoutProps {
  children: ReactNode
}

/**
 * Web 端布局
 * - 响应式设计，自动适配不同屏幕尺寸
 * - 大屏幕显示侧边栏
 * - 小屏幕显示底部导航
 */
export function WebLayout({ children }: WebLayoutProps) {
  const { isMobile, isTablet } = useBreakpoint()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // 移动端和平板使用移动布局
  if (isMobile || isTablet) {
    return (
      <div className="flex flex-col h-screen bg-background">
        {/* Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar Drawer */}
        <aside
          className={cn(
            "fixed top-0 left-0 z-50 h-full w-72 bg-background transform transition-transform duration-300 ease-in-out",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <Sidebar
            showCloseButton
            onClose={() => setSidebarOpen(false)}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden pb-14">
          {children}
        </main>

        {/* Bottom Navigation */}
        <MobileNav />
      </div>
    )
  }

  // 桌面端使用侧边栏布局
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - 始终显示 */}
      <aside className="w-64 border-r border-border">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  )
}
