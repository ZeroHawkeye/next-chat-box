import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { AppRail } from "./AppRail"
import { ConversationList } from "./ConversationList"
import { useAppStore } from "@/store/useAppStore"

interface SidebarProps {
  className?: string
  style?: React.CSSProperties
  onClose?: () => void
  showCloseButton?: boolean
}

export function Sidebar({ className, style, onClose, showCloseButton = false }: SidebarProps) {
  const { showAppRail } = useAppStore()

  return (
    <div
      className={cn("flex h-full bg-sidebar", className)}
      style={style}
    >
      {/* 左侧应用图标栏 (可隐藏) */}
      {showAppRail && <AppRail />}

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
