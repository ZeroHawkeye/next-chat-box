import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { AppRail } from "./AppRail"
import { ConversationList } from "./ConversationList"
import { useAppStore } from "@/store/useAppStore"
import { useState } from "react"

interface SidebarProps {
  className?: string
  style?: React.CSSProperties
  onClose?: () => void
  showCloseButton?: boolean
}

export function Sidebar({ className, style, onClose, showCloseButton = false }: SidebarProps) {
  const { showAppRail } = useAppStore()
  const [hoverRail, setHoverRail] = useState(false)

  return (
    <div
      className={cn("flex h-full bg-sidebar", className)}
      style={style}
    >
      {/* 左侧应用图标栏 (可隐藏，悬浮时显示) */}
      {showAppRail ? (
        <AppRail />
      ) : (
        <div
          className="relative group"
          onMouseEnter={() => setHoverRail(true)}
          onMouseLeave={() => setHoverRail(false)}
        >
          {/* 悬浮区 - 占位触发区 */}
          <div className="w-4 h-full cursor-pointer" />
          
          {/* 悬浮显示的 AppRail */}
          <div
            className={cn(
              "absolute top-0 left-0 h-full",
              "transition-opacity duration-200",
              hoverRail ? "opacity-100 z-50 shadow-xl" : "opacity-0 pointer-events-none"
            )}
          >
            <AppRail />
          </div>
        </div>
      )}

      {/* 右侧对话列表 */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* 关闭按钮 (移动端) */}
        {showCloseButton && (
          <div className="absolute top-2 right-2 z-10">
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={onClose}
              className="h-7 w-7 rounded-lg"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        <ConversationList className="flex-1" />
      </div>
    </div>
  )
}
