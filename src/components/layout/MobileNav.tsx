import { useNavigate, useLocation } from "@tanstack/react-router"
import { MessageSquare, Home, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  path: string
  label: string
  icon: React.ReactNode
  activeIcon?: React.ReactNode
}

const navItems: NavItem[] = [
  { 
    path: "/", 
    label: "首页", 
    icon: <Home className="w-5 h-5" strokeWidth={1.5} />,
    activeIcon: <Home className="w-5 h-5" strokeWidth={2} />
  },
  { 
    path: "/chat", 
    label: "对话", 
    icon: <MessageSquare className="w-5 h-5" strokeWidth={1.5} />,
    activeIcon: <MessageSquare className="w-5 h-5" strokeWidth={2} />
  },
  { 
    path: "/settings", 
    label: "设置", 
    icon: <Settings className="w-5 h-5" strokeWidth={1.5} />,
    activeIcon: <Settings className="w-5 h-5" strokeWidth={2} />
  },
]

export function MobileNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-50",
      "bg-background/80 backdrop-blur-xl",
      "border-t border-border/30",
      "safe-area-bottom"
    )}>
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          
          return (
            <button
              key={item.path}
              onClick={() => navigate({ to: item.path })}
              className={cn(
                "relative flex flex-col items-center justify-center",
                "flex-1 h-full",
                "transition-all duration-200",
                "group"
              )}
            >
              {/* 活跃指示器背景 */}
              <div className={cn(
                "absolute inset-x-3 top-1 h-10 rounded-xl transition-all duration-300",
                isActive 
                  ? "bg-primary/10 scale-100" 
                  : "bg-transparent scale-90 group-hover:bg-secondary/50 group-hover:scale-100"
              )} />

              {/* 图标容器 */}
              <div className={cn(
                "relative z-10 flex items-center justify-center",
                "w-10 h-10 rounded-xl",
                "transition-all duration-200",
                isActive && "transform -translate-y-0.5"
              )}>
                {/* 图标 */}
                <span className={cn(
                  "transition-all duration-200",
                  isActive 
                    ? "text-primary scale-110" 
                    : "text-muted-foreground group-hover:text-foreground group-hover:scale-105"
                )}>
                  {isActive ? (item.activeIcon || item.icon) : item.icon}
                </span>

                {/* 活跃点指示器 */}
                {isActive && (
                  <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-primary animate-in fade-in zoom-in duration-300" />
                )}
              </div>

              {/* 标签 */}
              <span className={cn(
                "relative z-10 text-[10px] font-medium mt-0.5",
                "transition-all duration-200",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground group-hover:text-foreground"
              )}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
