import { useAppStore } from "@/store/useAppStore"
import { cn } from "@/lib/utils"
import { X, Plus, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ChatPanel, ChatTab, App } from "@/types"
import { useDraggable, useDroppable } from "@dnd-kit/core"
import type { TabDragData } from "./DragContext"

interface ChatTabBarProps {
  panel: ChatPanel
  onClose?: () => void
  canClose?: boolean
}

// 单个可拖拽的 Tab
function DraggableTab({
  tab,
  index,
  panel,
  app,
  title,
  isActive,
  onSelect,
  onClose,
}: {
  tab: ChatTab
  index: number
  panel: ChatPanel
  app?: App
  title: string
  isActive: boolean
  onSelect: () => void
  onClose: () => void
}) {
  const dragData: TabDragData = {
    type: "tab",
    tabId: tab.id,
    panelId: panel.id,
    conversationId: tab.conversationId,
    appId: tab.appId,
    title,
    icon: app?.icon.value,
  }

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({
    id: `tab-${tab.id}`,
    data: dragData,
  })

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `tab-drop-${tab.id}`,
    data: {
      type: "tab",
      tabId: tab.id,
      panelId: panel.id,
      index,
    },
  })

  return (
    <div
      ref={(node) => {
        setDragRef(node)
        setDropRef(node)
      }}
      onClick={onSelect}
      className={cn(
        "group relative flex items-center gap-1.5 px-2.5 py-1 rounded-md cursor-pointer",
        "transition-colors duration-100 select-none",
        "max-w-[180px] min-w-[100px]",
        isActive
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-foreground/5",
        isDragging && "opacity-50",
        isOver && "ring-2 ring-primary ring-inset"
      )}
    >
      {/* 拖拽手柄 */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />
      </div>

      {/* 应用图标 */}
      {app && (
        <span
          className="text-xs flex-shrink-0 w-4 h-4 rounded flex items-center justify-center"
          style={{ backgroundColor: app.icon.bgColor }}
        >
          {app.icon.value}
        </span>
      )}

      {/* 标题 */}
      <span className="text-xs truncate flex-1">{title}</span>

      {/* 关闭按钮 */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        className={cn(
          "flex-shrink-0 p-0.5 rounded hover:bg-foreground/10",
          "opacity-0 group-hover:opacity-100 transition-opacity"
        )}
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  )
}

export function ChatTabBar({ panel, onClose, canClose }: ChatTabBarProps) {
  const {
    apps,
    conversations,
    setActiveTab,
    closeTab,
    createConversation,
    openTab,
    currentAppId,
  } = useAppStore()

  const handleNewTab = () => {
    if (!currentAppId) return
    const conversationId = createConversation(currentAppId)
    openTab(conversationId, panel.id)
  }

  const getAppForTab = (tab: ChatTab): App | undefined => {
    return apps.find((a) => a.id === tab.appId)
  }

  const getConversationTitle = (tab: ChatTab): string => {
    const conv = conversations.find((c) => c.id === tab.conversationId)
    return conv?.title || tab.title || "新对话"
  }

  return (
    <div className="flex items-center h-9 bg-background-secondary border-b border-border gap-0.5 px-1">
      {/* Tabs */}
      <div className="flex-1 flex items-center gap-0.5 overflow-x-auto scrollbar-none min-w-0">
        {panel.tabs.map((tab, index) => {
          const app = getAppForTab(tab)
          const isActive = tab.id === panel.activeTabId

          return (
            <DraggableTab
              key={tab.id}
              tab={tab}
              index={index}
              panel={panel}
              app={app}
              title={getConversationTitle(tab)}
              isActive={isActive}
              onSelect={() => setActiveTab(tab.id, panel.id)}
              onClose={() => closeTab(tab.id, panel.id)}
            />
          )
        })}

        {/* 新建 Tab 按钮 */}
        <Button
          size="icon-sm"
          variant="ghost"
          className="h-6 w-6 rounded flex-shrink-0"
          onClick={handleNewTab}
          title="新建标签"
        >
          <Plus className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* 关闭面板按钮 */}
      {canClose && (
        <div className="flex items-center gap-0.5 flex-shrink-0 ml-1">
          <Button
            size="icon-sm"
            variant="ghost"
            className="h-6 w-6 rounded"
            onClick={onClose}
            title="关闭面板"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}
    </div>
  )
}
