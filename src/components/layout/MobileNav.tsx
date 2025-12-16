import { useNavigate, useLocation } from "@tanstack/react-router"
import { MessageSquare, Home, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  path: string
  label: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { path: "/", label: "首页", icon: <Home className="w-5 h-5" /> },
  { path: "/chat", label: "对话", icon: <MessageSquare className="w-5 h-5" /> },
  { path: "/settings", label: "设置", icon: <Settings className="w-5 h-5" /> },
]

export function MobileNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate({ to: item.path })}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
