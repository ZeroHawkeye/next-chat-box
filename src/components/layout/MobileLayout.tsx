import { ReactNode, useState } from "react"
import { Sidebar } from "./Sidebar"
import { MobileNav } from "./MobileNav"
import { cn } from "@/lib/utils"

interface MobileLayoutProps {
  children: ReactNode
}

/**
 * 移动端布局
 * - 底部导航栏
 * - 可滑动的侧边栏 (Drawer)
 */
export function MobileLayout({ children }: MobileLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
       <main className="flex-1 flex flex-col overflow-auto pb-14">
         {children}
       </main>

      {/* Bottom Navigation */}
      <MobileNav />
    </div>
  )
}


