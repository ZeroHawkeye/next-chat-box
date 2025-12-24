import { useAppStore, isPanelGroup } from "@/store/useAppStore"
import { ChatPanelView } from "./ChatPanelView"
import { cn } from "@/lib/utils"
import { useState, useCallback, useEffect, useRef } from "react"
import type { ChatPanel, PanelGroup } from "@/types"
import { useDroppable } from "@dnd-kit/core"
import { useDragState, type DropZone } from "./DragContext"

interface PanelLayoutProps {
  className?: string
}

// 面板分隔条
function PanelDivider({
  direction,
  onResize,
}: {
  direction: "horizontal" | "vertical"
  onResize: (delta: number) => void
}) {
  const [isDragging, setIsDragging] = useState(false)
  const startPosRef = useRef(0)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(true)
      startPosRef.current = direction === "horizontal" ? e.clientX : e.clientY
    },
    [direction]
  )

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const currentPos = direction === "horizontal" ? e.clientX : e.clientY
      const delta = currentPos - startPosRef.current
      onResize(delta)
      startPosRef.current = currentPos
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
    document.body.style.cursor = direction === "horizontal" ? "col-resize" : "row-resize"
    document.body.style.userSelect = "none"

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
  }, [isDragging, direction, onResize])

  return (
    <div
      className={cn(
        "flex-shrink-0 z-20 transition-colors",
        direction === "horizontal"
          ? "w-1.5 cursor-col-resize hover:bg-primary/40 active:bg-primary/60"
          : "h-1.5 cursor-row-resize hover:bg-primary/40 active:bg-primary/60",
        isDragging && "bg-primary/60"
      )}
      onMouseDown={handleMouseDown}
    />
  )
}

// 拖拽放置指示器
function DropZoneIndicator({ zone }: { zone: DropZone }) {
  if (!zone || zone === "center") return null

  const positionClasses: Record<Exclude<DropZone, null | "center">, string> = {
    left: "left-0 top-0 w-1/2 h-full",
    right: "right-0 top-0 w-1/2 h-full",
    top: "left-0 top-0 w-full h-1/2",
    bottom: "left-0 bottom-0 w-full h-1/2",
  }

  return (
    <div
      className={cn(
        "absolute pointer-events-none z-50 bg-primary/20 border-2 border-primary border-dashed rounded-lg",
        positionClasses[zone]
      )}
    />
  )
}

// 单个面板容器 - 处理拖拽放置
function PanelContainer({
  panel,
  isActive,
  canClose,
}: {
  panel: ChatPanel
  isActive: boolean
  canClose: boolean
}) {
  const { activeData, overPanelId, dropZone, setDropZone } = useDragState()
  const containerRef = useRef<HTMLDivElement>(null)

  const { setNodeRef } = useDroppable({
    id: `panel-${panel.id}`,
    data: {
      type: "panel",
      panelId: panel.id,
    },
  })

  // 计算放置区域
  const calculateDropZone = useCallback((clientX: number, clientY: number): DropZone => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return "center"

    const x = clientX - rect.left
    const y = clientY - rect.top
    const width = rect.width
    const height = rect.height

    // 边缘区域阈值 (25%)
    const edgeThreshold = 0.25

    const leftEdge = width * edgeThreshold
    const rightEdge = width * (1 - edgeThreshold)
    const topEdge = height * edgeThreshold
    const bottomEdge = height * (1 - edgeThreshold)

    if (x < leftEdge) return "left"
    if (x > rightEdge) return "right"
    if (y < topEdge) return "top"
    if (y > bottomEdge) return "bottom"
    return "center"
  }, [])

  // 监听鼠标移动来更新 drop zone
  useEffect(() => {
    if (!activeData || overPanelId !== panel.id) {
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      const zone = calculateDropZone(e.clientX, e.clientY)
      setDropZone(zone)
    }

    document.addEventListener("mousemove", handleMouseMove)
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
    }
  }, [activeData, overPanelId, panel.id, calculateDropZone, setDropZone])

  const isDropTarget = activeData && overPanelId === panel.id

  return (
    <div
      ref={(node) => {
        setNodeRef(node)
        if (node) {
          containerRef.current = node
        }
      }}
      className="relative h-full w-full"
    >
      <ChatPanelView panel={panel} isActive={isActive} canClose={canClose} />

      {/* 拖拽放置指示器 */}
      {isDropTarget && dropZone && dropZone !== "center" && (
        <DropZoneIndicator zone={dropZone} />
      )}

      {/* 中心区域指示器 */}
      {isDropTarget && dropZone === "center" && (
        <div className="absolute inset-0 pointer-events-none z-50 border-2 border-primary border-dashed rounded-lg bg-primary/10" />
      )}
    </div>
  )
}

// 递归渲染面板组件
function RenderPanelNode({
  node,
  activePanelId,
  totalPanelCount,
  onResizePanel,
}: {
  node: ChatPanel | PanelGroup
  activePanelId: string | null
  totalPanelCount: number
  onResizePanel: (groupId: string, index: number, delta: number) => void
}) {
  if (!isPanelGroup(node)) {
    // 渲染单个面板
    return (
      <PanelContainer
        panel={node}
        isActive={node.id === activePanelId}
        canClose={totalPanelCount > 1}
      />
    )
  }

  // 渲染面板组
  return (
    <div
      className={cn(
        "flex h-full w-full",
        node.direction === "horizontal" ? "flex-row" : "flex-col"
      )}
    >
      {node.children.map((child, childIndex) => {
        const size = node.sizes[childIndex] || 100 / node.children.length
        const isLast = childIndex === node.children.length - 1
        const childId = isPanelGroup(child) ? child.id : child.id

        return (
          <div
            key={childId}
            className={cn(
              "min-h-0 min-w-0 flex",
              node.direction === "horizontal" ? "flex-row" : "flex-col"
            )}
            style={{
              [node.direction === "horizontal" ? "width" : "height"]: `${size}%`,
              flexShrink: 0,
              flexGrow: 0,
            }}
          >
            <div className="flex-1 min-h-0 min-w-0 overflow-hidden">
              <RenderPanelNode
                node={child}
                activePanelId={activePanelId}
                totalPanelCount={totalPanelCount}
                onResizePanel={onResizePanel}
              />
            </div>

            {/* 分隔条放在元素后面 */}
            {!isLast && (
              <PanelDivider
                direction={node.direction}
                onResize={(delta) => onResizePanel(node.id, childIndex, delta)}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// 获取所有面板数量
function countPanels(node: ChatPanel | PanelGroup): number {
  if (!isPanelGroup(node)) {
    return 1
  }
  return node.children.reduce((sum, child) => sum + countPanels(child), 0)
}

export function PanelLayout({ className }: PanelLayoutProps) {
  const { workspace, activePanelId, updatePanelSizes } = useAppStore()
  const containerRef = useRef<HTMLDivElement>(null)

  const totalPanelCount = countPanels(workspace.root)

  const handleResizePanel = useCallback(
    (groupId: string, index: number, delta: number) => {
      const container = containerRef.current
      if (!container) return

      // 查找面板组
      function findGroup(node: ChatPanel | PanelGroup): PanelGroup | null {
        if (!isPanelGroup(node)) return null
        if (node.id === groupId) return node
        for (const child of node.children) {
          const found = findGroup(child)
          if (found) return found
        }
        return null
      }

      const group = findGroup(workspace.root)
      if (!group) return

      const isHorizontal = group.direction === "horizontal"
      const containerSize = isHorizontal
        ? container.offsetWidth
        : container.offsetHeight
      const deltaPercent = (delta / containerSize) * 100

      const newSizes = [...group.sizes]
      const minSize = 15

      const newSize1 = newSizes[index] + deltaPercent
      const newSize2 = newSizes[index + 1] - deltaPercent

      if (newSize1 >= minSize && newSize2 >= minSize) {
        newSizes[index] = newSize1
        newSizes[index + 1] = newSize2
        updatePanelSizes(groupId, newSizes)
      }
    },
    [workspace.root, updatePanelSizes]
  )

  return (
    <div ref={containerRef} className={cn("h-full w-full", className)}>
      <RenderPanelNode
        node={workspace.root}
        activePanelId={activePanelId}
        totalPanelCount={totalPanelCount}
        onResizePanel={handleResizePanel}
      />
    </div>
  )
}
