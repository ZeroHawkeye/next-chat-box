import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  rectIntersection,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core"
import { GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"

// Tab 拖拽数据类型
export interface TabDragData {
  type: "tab"
  tabId: string
  panelId: string
  conversationId: string
  appId: string
  title: string
  icon?: string
}

// 放置区域类型
export type DropZone = "left" | "right" | "top" | "bottom" | "center" | null

// 拖拽上下文值
interface DragContextValue {
  // 当前拖拽的数据
  activeData: TabDragData | null
  // 当前悬停的面板 ID
  overPanelId: string | null
  // 当前放置区域
  dropZone: DropZone
  // 设置放置区域
  setDropZone: (zone: DropZone) => void
  // 设置悬停面板
  setOverPanelId: (id: string | null) => void
}

const DragStateContext = createContext<DragContextValue | null>(null)

export function useDragState() {
  const context = useContext(DragStateContext)
  if (!context) {
    throw new Error("useDragState must be used within a TabDndProvider")
  }
  return context
}

// Tab 预览组件
function TabDragPreview({ data }: { data: TabDragData }) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 rounded-md",
        "bg-background text-foreground shadow-lg border border-border",
        "max-w-[180px] min-w-[100px]"
      )}
    >
      <GripVertical className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />
      {data.icon && (
        <span className="text-xs flex-shrink-0">{data.icon}</span>
      )}
      <span className="text-xs truncate flex-1">{data.title}</span>
    </div>
  )
}

interface TabDndProviderProps {
  children: ReactNode
  onTabMove: (
    tabId: string,
    fromPanelId: string,
    toPanelId: string,
    dropZone: DropZone,
    targetIndex?: number
  ) => void
}

export function TabDndProvider({ children, onTabMove }: TabDndProviderProps) {
  const [activeData, setActiveData] = useState<TabDragData | null>(null)
  const [overPanelId, setOverPanelId] = useState<string | null>(null)
  const [dropZone, setDropZone] = useState<DropZone>(null)

  // 配置传感器 - 需要移动一小段距离才开始拖拽
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const data = event.active.data.current as TabDragData | undefined
    if (data?.type === "tab") {
      setActiveData(data)
    }
  }, [])

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { over } = event
    if (over) {
      const overData = over.data.current
      if (overData?.type === "panel") {
        setOverPanelId(overData.panelId)
      } else if (overData?.type === "tab") {
        setOverPanelId(overData.panelId)
      }
    } else {
      setOverPanelId(null)
      setDropZone(null)
    }
  }, [])

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { over } = event

      if (activeData && over) {
        const overData = over.data.current
        let targetPanelId: string | null = null
        let targetIndex: number | undefined

        if (overData?.type === "panel") {
          targetPanelId = overData.panelId
        } else if (overData?.type === "tab") {
          targetPanelId = overData.panelId
          targetIndex = overData.index
        }

        if (targetPanelId) {
          onTabMove(
            activeData.tabId,
            activeData.panelId,
            targetPanelId,
            dropZone,
            targetIndex
          )
        }
      }

      // 重置状态
      setActiveData(null)
      setOverPanelId(null)
      setDropZone(null)
    },
    [activeData, dropZone, onTabMove]
  )

  const handleDragCancel = useCallback(() => {
    setActiveData(null)
    setOverPanelId(null)
    setDropZone(null)
  }, [])

  return (
    <DragStateContext.Provider
      value={{
        activeData,
        overPanelId,
        dropZone,
        setDropZone,
        setOverPanelId,
      }}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        accessibility={{
          announcements: {
            onDragStart: () => "",
            onDragOver: () => "",
            onDragEnd: () => "",
            onDragCancel: () => "",
          },
        }}
      >
        {children}
        <DragOverlay dropAnimation={null}>
          {activeData && <TabDragPreview data={activeData} />}
        </DragOverlay>
      </DndContext>
    </DragStateContext.Provider>
  )
}
