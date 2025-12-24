import { useCallback } from "react"
import { PanelLayout, TabDndProvider } from "@/components/chat"
import type { DropZone } from "@/components/chat"
import { useAssistantStore, isPanelGroup } from "@/store/useAssistantStore"
import type { ChatPanel, PanelGroup } from "@/types"

// 辅助函数：获取所有面板
function getAllPanelsFromNode(node: ChatPanel | PanelGroup): ChatPanel[] {
  if (!isPanelGroup(node)) {
    return [node]
  }
  return node.children.flatMap((child) => getAllPanelsFromNode(child))
}

export default function ChatPage() {
  const { moveTab, splitPanel } = useAssistantStore()

  const handleTabMove = useCallback(
    (
      tabId: string,
      fromPanelId: string,
      toPanelId: string,
      dropZone: DropZone,
      targetIndex?: number
    ) => {
      if (!dropZone) return

      if (dropZone === "center") {
        // 移动到面板的标签栏
        if (fromPanelId !== toPanelId) {
          moveTab(tabId, fromPanelId, toPanelId, targetIndex)
        } else if (targetIndex !== undefined) {
          // 同一面板内重新排序
          moveTab(tabId, fromPanelId, toPanelId, targetIndex)
        }
      } else {
        // 分割面板
        const direction: "horizontal" | "vertical" =
          dropZone === "left" || dropZone === "right" ? "horizontal" : "vertical"

        // 先分割面板
        splitPanel(toPanelId, direction)

        // 分割后需要等待状态更新，然后移动tab
        setTimeout(() => {
          const state = useAssistantStore.getState()
          const allPanels = getAllPanelsFromNode(state.workspace.root)

          // 根据 dropZone 决定目标面板
          // 新面板总是添加在后面，所以：
          // - left/top: 移动到原面板（因为新面板在右/下）
          // - right/bottom: 移动到新面板
          if (dropZone === "right" || dropZone === "bottom") {
            // 找到新创建的面板（最后一个）
            const newPanel = allPanels[allPanels.length - 1]
            if (newPanel && newPanel.id !== toPanelId) {
              moveTab(tabId, fromPanelId, newPanel.id)
            }
          } else {
            // left/top - tab 应该移动到新面板，原内容保持
            const newPanel = allPanels[allPanels.length - 1]
            if (newPanel && newPanel.id !== toPanelId) {
              moveTab(tabId, fromPanelId, newPanel.id)
            }
          }
        }, 50)
      }
    },
    [moveTab, splitPanel]
  )

  return (
    <TabDndProvider onTabMove={handleTabMove}>
      <div className="flex flex-col h-full bg-background">
        <PanelLayout className="flex-1" />
      </div>
    </TabDndProvider>
  )
}
