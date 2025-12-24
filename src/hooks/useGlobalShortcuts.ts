import { useEffect, useCallback } from "react"
import { useShortcutStore } from "@/store/useShortcutStore"
import { useAppStore, isPanelGroup } from "@/store/useAppStore"
import type { ShortcutAction } from "@/types"
import type { ChatPanel, PanelGroup } from "@/types"

/**
 * 全局快捷键 Hook
 * 监听键盘事件并执行相应的动作
 */
export function useGlobalShortcuts() {
  const { shortcuts, isLoaded, loadShortcuts } = useShortcutStore()
  const {
    workspace,
    activePanelId,
    closeTab,
    setActiveTab,
  } = useAppStore()

  // 加载快捷键配置
  useEffect(() => {
    if (!isLoaded) {
      loadShortcuts()
    }
  }, [isLoaded, loadShortcuts])

  // 获取当前活动面板
  const getActivePanel = useCallback((): ChatPanel | null => {
    if (!activePanelId) return null

    const findPanel = (node: ChatPanel | PanelGroup): ChatPanel | null => {
      if (!isPanelGroup(node)) {
        return node.id === activePanelId ? node : null
      }
      for (const child of node.children) {
        const found = findPanel(child)
        if (found) return found
      }
      return null
    }

    return findPanel(workspace.root)
  }, [workspace.root, activePanelId])



  // 切换到指定索引的标签页
  const switchToTabByIndex = useCallback((index: number) => {
    const panel = getActivePanel()
    if (!panel || panel.tabs.length === 0) return

    // Alt+9 切换到最后一个标签页
    const targetIndex = index === 9 ? panel.tabs.length - 1 : index - 1

    if (targetIndex >= 0 && targetIndex < panel.tabs.length) {
      const tab = panel.tabs[targetIndex]
      setActiveTab(tab.id, panel.id)
    }
  }, [getActivePanel, setActiveTab])

  // 关闭当前标签页
  const closeCurrentTab = useCallback(() => {
    const panel = getActivePanel()
    if (!panel || !panel.activeTabId) return

    closeTab(panel.activeTabId, panel.id)
  }, [getActivePanel, closeTab])

  // 执行快捷键动作
  const executeAction = useCallback((action: ShortcutAction) => {
    switch (action) {
      case "closeTab":
        closeCurrentTab()
        break
      case "switchToTab1":
        switchToTabByIndex(1)
        break
      case "switchToTab2":
        switchToTabByIndex(2)
        break
      case "switchToTab3":
        switchToTabByIndex(3)
        break
      case "switchToTab4":
        switchToTabByIndex(4)
        break
      case "switchToTab5":
        switchToTabByIndex(5)
        break
      case "switchToTab6":
        switchToTabByIndex(6)
        break
      case "switchToTab7":
        switchToTabByIndex(7)
        break
      case "switchToTab8":
        switchToTabByIndex(8)
        break
      case "switchToTab9":
        switchToTabByIndex(9)
        break
      // 其他快捷键暂未实现
      default:
        break
    }
  }, [closeCurrentTab, switchToTabByIndex])

  // 键盘事件处理
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // 忽略输入框中的快捷键（除了特定的）
    const target = e.target as HTMLElement
    const isInput = target.tagName === "INPUT" || 
                   target.tagName === "TEXTAREA" || 
                   target.isContentEditable

    // 构建当前按键组合
    const keys: string[] = []
    if (e.ctrlKey || e.metaKey) keys.push("Ctrl")
    if (e.altKey) keys.push("Alt")
    if (e.shiftKey) keys.push("Shift")

    // 获取主键
    let mainKey = e.key
    if (mainKey === " ") mainKey = "Space"
    else if (mainKey.length === 1) mainKey = mainKey.toUpperCase()
    
    // 忽略单独的修饰键
    if (["Control", "Alt", "Shift", "Meta"].includes(mainKey)) {
      return
    }

    keys.push(mainKey)

    // 查找匹配的快捷键
    const sortedKeys = [...keys].sort()
    const matchedShortcut = shortcuts.find((s) => {
      if (!s.enabled) return false
      const sortedShortcutKeys = [...s.keys].sort()
      if (sortedKeys.length !== sortedShortcutKeys.length) return false
      return sortedKeys.every((key, index) => key === sortedShortcutKeys[index])
    })

    if (!matchedShortcut) return

    // 在输入框中允许的快捷键
    const allowedInInput: ShortcutAction[] = [
      "sendMessage", 
      "newLine",
      "closeTab",
      "switchToTab1",
      "switchToTab2",
      "switchToTab3",
      "switchToTab4",
      "switchToTab5",
      "switchToTab6",
      "switchToTab7",
      "switchToTab8",
      "switchToTab9",
    ]

    if (isInput) {
      if (!allowedInInput.includes(matchedShortcut.action)) {
        return
      }
      // sendMessage 和 newLine 由组件自己处理，这里不处理
      if (matchedShortcut.action === "sendMessage" || matchedShortcut.action === "newLine") {
        return
      }
    }

    // 阻止默认行为并执行动作
    e.preventDefault()
    e.stopPropagation()
    executeAction(matchedShortcut.action)
  }, [shortcuts, executeAction])

  // 绑定全局键盘事件
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])
}
