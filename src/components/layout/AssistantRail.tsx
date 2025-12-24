import { useState } from "react"
import { useAssistantStore, ASSISTANT_RAIL_WIDTH } from "@/store/useAssistantStore"
import { cn } from "@/lib/utils"
import { Plus, Settings, LayoutGrid } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import type { Assistant } from "@/types"

interface AssistantRailProps {
  className?: string
}

// 简易 Tooltip 组件
function Tooltip({ 
  children, 
  content, 
  side = "right" 
}: { 
  children: React.ReactNode
  content: string
  side?: "right" | "left"
}) {
  const [show, setShow] = useState(false)

  return (
    <div 
      className="relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div 
          className={cn(
            "absolute top-1/2 -translate-y-1/2 z-50",
            "px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap",
            "bg-foreground text-background shadow-lg",
            "animate-fade-in pointer-events-none",
            side === "right" ? "left-full ml-2" : "right-full mr-2"
          )}
        >
          {content}
        </div>
      )}
    </div>
  )
}

// 渲染助手图标
function AssistantIconDisplay({ 
  assistant, 
  size = "md",
  isActive = false 
}: { 
  assistant: Assistant
  size?: "sm" | "md" | "lg"
  isActive?: boolean
}) {
  const sizeClasses = {
    sm: "w-7 h-7 text-sm",
    md: "w-8 h-8 text-base",
    lg: "w-10 h-10 text-lg",
  }

  const borderRadius = {
    sm: "rounded-lg",
    md: "rounded-[10px]",
    lg: "rounded-xl",
  }

  if (assistant.icon.type === "emoji") {
    return (
      <div
        className={cn(
          "flex items-center justify-center transition-all duration-200",
          sizeClasses[size],
          borderRadius[size],
          isActive && "shadow-md"
        )}
        style={{ 
          backgroundColor: assistant.icon.bgColor || "#6366f1",
        }}
      >
        <span className="select-none drop-shadow-sm">{assistant.icon.value}</span>
      </div>
    )
  }

  // 默认图标
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10",
        sizeClasses[size],
        borderRadius[size],
        isActive && "shadow-md"
      )}
    >
      <span className="select-none">🤖</span>
    </div>
  )
}

// 底部操作按钮
function ActionButton({ 
  icon: Icon, 
  label, 
  onClick 
}: { 
  icon: React.ElementType
  label: string
  onClick: () => void
}) {
  return (
    <Tooltip content={label}>
      <button
        onClick={onClick}
        className={cn(
          "w-8 h-8 flex items-center justify-center rounded-lg",
          "text-muted-foreground/70 hover:text-foreground",
          "hover:bg-foreground/5 active:bg-foreground/10",
          "transition-all duration-150 active:scale-95"
        )}
      >
        <Icon className="w-[18px] h-[18px]" />
      </button>
    </Tooltip>
  )
}

export function AssistantRail({ className }: AssistantRailProps) {
  const { assistants, currentAssistantId, setCurrentAssistant } = useAssistantStore()
  const navigate = useNavigate()

  // 只显示收藏的助手
  const pinnedAssistants = assistants.filter(assistant => assistant.isPinned).sort((a, b) => a.sortOrder - b.sortOrder)

  const handleAssistantClick = (assistantId: string) => {
    setCurrentAssistant(assistantId)
    navigate({ to: "/chat" })
  }

  const handleAssistantsPage = () => {
    navigate({ to: "/assistants" })
  }

  const handleSettings = () => {
    navigate({ to: "/settings" })
  }

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-background-secondary border-r border-border",
        className
      )}
      style={{ width: ASSISTANT_RAIL_WIDTH }}
    >
      {/* 助手列表 */}
      <div className="flex-1 overflow-y-auto py-3 px-1.5 scrollbar-none">
        <div className="flex flex-col items-center gap-1.5">
          {pinnedAssistants.map((assistant) => {
            const isActive = currentAssistantId === assistant.id
            return (
              <Tooltip key={assistant.id} content={assistant.name}>
                <button
                  onClick={() => handleAssistantClick(assistant.id)}
                  className={cn(
                    "relative p-1 rounded-xl transition-all duration-200",
                    "hover:bg-foreground/5 active:scale-95",
                    isActive && "bg-foreground/5"
                  )}
                >
                  <AssistantIconDisplay assistant={assistant} size="md" isActive={isActive} />
                  {/* 选中指示器 - 左侧小条 */}
                  <div 
                    className={cn(
                      "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[3px]",
                      "w-[3px] rounded-full bg-primary transition-all duration-200",
                      isActive ? "h-4 opacity-100" : "h-0 opacity-0"
                    )}
                  />
                </button>
              </Tooltip>
            )
          })}
          
          {/* 添加助手按钮 */}
          <Tooltip content="添加助手">
            <button
              onClick={handleAssistantsPage}
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-[10px]",
                "border border-dashed border-border hover:border-primary/60",
                "text-muted-foreground/60 hover:text-primary",
                "hover:bg-primary/5 transition-all duration-150 active:scale-95"
              )}
            >
              <Plus className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* 底部操作 */}
      <div className="flex-shrink-0 py-2 px-1.5 border-t border-border">
        <div className="flex flex-col items-center gap-1">
          <ActionButton icon={LayoutGrid} label="助手管理" onClick={handleAssistantsPage} />
          <ActionButton icon={Settings} label="设置" onClick={handleSettings} />
        </div>
      </div>
    </div>
  )
}

export { AssistantIconDisplay }

// 兼容层
/** @deprecated 使用 AssistantRail 替代 */
export const AppRail = AssistantRail
/** @deprecated 使用 AssistantIconDisplay 替代 */
export const AppIconDisplay = AssistantIconDisplay
