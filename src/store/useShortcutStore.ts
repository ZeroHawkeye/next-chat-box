import { create } from "zustand"
import { devtools } from "zustand/middleware"
import type { ShortcutAction, ShortcutConfig, ShortcutGroup } from "@/types"
import { isTauri } from "@/lib/platform"

// ============================================================================
// 快捷键配置
// ============================================================================

// 默认快捷键配置
const defaultShortcuts: ShortcutConfig[] = [
  // 通用 - 暂时禁用未实现的（不可编辑）
  {
    action: "newChat",
    label: "新建对话",
    description: "创建一个新的对话",
    keys: ["Ctrl", "N"],
    enabled: false, // 暂未实现
    editable: false, // 未实现的功能不可编辑
  },
  {
    action: "newWindow",
    label: "新建窗口",
    description: "打开一个新窗口",
    keys: ["Ctrl", "Shift", "N"],
    enabled: false, // 暂未实现
    editable: false, // 未实现的功能不可编辑
  },
  {
    action: "search",
    label: "搜索",
    description: "打开搜索面板",
    keys: ["Ctrl", "K"],
    enabled: false, // 暂未实现
    editable: false, // 未实现的功能不可编辑
  },
  {
    action: "openSettings",
    label: "打开设置",
    description: "打开设置页面",
    keys: ["Ctrl", ","],
    enabled: false, // 暂未实现
    editable: false, // 未实现的功能不可编辑
  },
  // 标签页 - 已实现
  {
    action: "closeTab",
    label: "关闭标签页",
    description: "关闭当前标签页",
    keys: ["Ctrl", "W"],
    enabled: true,
    editable: true, // 已实现，可编辑
  },
  {
    action: "nextTab",
    label: "下一个标签页",
    description: "切换到下一个标签页",
    keys: ["Ctrl", "Tab"],
    enabled: false, // 系统快捷键冲突，暂时禁用
    editable: false, // 未实现的功能不可编辑
  },
  {
    action: "prevTab",
    label: "上一个标签页",
    description: "切换到上一个标签页",
    keys: ["Ctrl", "Shift", "Tab"],
    enabled: false, // 系统快捷键冲突，暂时禁用
    editable: false, // 未实现的功能不可编辑
  },
  // Alt + 数字切换标签页 - 已实现（可编辑）
  {
    action: "switchToTab1",
    label: "切换到标签页 1",
    description: "快速切换到第 1 个标签页",
    keys: ["Alt", "1"],
    enabled: true,
    editable: true, // 已实现，可编辑
  },
  {
    action: "switchToTab2",
    label: "切换到标签页 2",
    description: "快速切换到第 2 个标签页",
    keys: ["Alt", "2"],
    enabled: true,
    editable: true, // 已实现，可编辑
  },
  {
    action: "switchToTab3",
    label: "切换到标签页 3",
    description: "快速切换到第 3 个标签页",
    keys: ["Alt", "3"],
    enabled: true,
    editable: true, // 已实现，可编辑
  },
  {
    action: "switchToTab4",
    label: "切换到标签页 4",
    description: "快速切换到第 4 个标签页",
    keys: ["Alt", "4"],
    enabled: true,
    editable: true, // 已实现，可编辑
  },
  {
    action: "switchToTab5",
    label: "切换到标签页 5",
    description: "快速切换到第 5 个标签页",
    keys: ["Alt", "5"],
    enabled: true,
    editable: true, // 已实现，可编辑
  },
  {
    action: "switchToTab6",
    label: "切换到标签页 6",
    description: "快速切换到第 6 个标签页",
    keys: ["Alt", "6"],
    enabled: true,
    editable: true, // 已实现，可编辑
  },
  {
    action: "switchToTab7",
    label: "切换到标签页 7",
    description: "快速切换到第 7 个标签页",
    keys: ["Alt", "7"],
    enabled: true,
    editable: true, // 已实现，可编辑
  },
  {
    action: "switchToTab8",
    label: "切换到标签页 8",
    description: "快速切换到第 8 个标签页",
    keys: ["Alt", "8"],
    enabled: true,
    editable: true, // 已实现，可编辑
  },
  {
    action: "switchToTab9",
    label: "切换到标签页 9",
    description: "快速切换到最后一个标签页",
    keys: ["Alt", "9"],
    enabled: true,
    editable: true, // 已实现，可编辑
  },
  // 导航 - 暂时禁用未实现的（不可编辑）
  {
    action: "toggleSidebar",
    label: "切换侧边栏",
    description: "显示或隐藏侧边栏",
    keys: ["Ctrl", "B"],
    enabled: false, // 暂未实现
    editable: false, // 未实现的功能不可编辑
  },
  {
    action: "focusInput",
    label: "聚焦输入框",
    description: "将焦点移到输入框",
    keys: ["Ctrl", "L"],
    enabled: false, // 暂未实现
    editable: false, // 未实现的功能不可编辑
  },
  // 聊天 - 核心功能（不可编辑）
  {
    action: "sendMessage",
    label: "发送消息",
    description: "发送当前输入的消息",
    keys: ["Enter"],
    enabled: true,
    editable: false, // 核心功能不可编辑
  },
  {
    action: "newLine",
    label: "换行",
    description: "在输入框中换行",
    keys: ["Shift", "Enter"],
    enabled: true,
    editable: false, // 核心功能不可编辑
  },
]

// 快捷键分组定义
function createShortcutGroups(shortcuts: ShortcutConfig[]): ShortcutGroup[] {
  return [
    {
      id: "general",
      label: "通用",
      shortcuts: shortcuts.filter((s) =>
        ["newChat", "newWindow", "search", "openSettings"].includes(s.action)
      ),
    },
    {
      id: "tabs",
      label: "标签页",
      shortcuts: shortcuts.filter((s) =>
        ["closeTab", "nextTab", "prevTab"].includes(s.action)
      ),
    },
    {
      id: "tabSwitch",
      label: "快速切换标签",
      shortcuts: shortcuts.filter((s) =>
        s.action.startsWith("switchToTab")
      ),
    },
    {
      id: "navigation",
      label: "导航",
      shortcuts: shortcuts.filter((s) =>
        ["toggleSidebar", "focusInput"].includes(s.action)
      ),
    },
    {
      id: "chat",
      label: "聊天",
      shortcuts: shortcuts.filter((s) =>
        ["sendMessage", "newLine"].includes(s.action)
      ),
    },
  ]
}

// ============================================================================
// 快捷键存储类 (类似 configStorage)
// ============================================================================

interface ShortcutStorageData {
  shortcuts: Record<string, { keys: string[]; enabled: boolean }>
}

const STORAGE_KEY = "shortcut-config"

class ShortcutStorage {
  private tauriInvoke = async <T>(cmd: string, args?: Record<string, unknown>): Promise<T> => {
    if (!isTauri()) {
      throw new Error("Not in Tauri environment")
    }
    const { invoke } = await import("@tauri-apps/api/core")
    return invoke(cmd, args) as Promise<T>
  }

  private loadFromLocalStorage(): ShortcutStorageData | null {
    if (typeof window === "undefined") return null
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        return JSON.parse(data)
      }
    } catch (e) {
      console.error("Failed to load shortcuts from localStorage:", e)
    }
    return null
  }

  private saveToLocalStorage(data: ShortcutStorageData): void {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (e) {
      console.error("Failed to save shortcuts to localStorage:", e)
    }
  }

  async load(): Promise<ShortcutStorageData | null> {
    if (isTauri()) {
      try {
        return await this.tauriInvoke<ShortcutStorageData>("get_shortcuts")
      } catch {
        // Tauri 命令可能未实现，回退到 localStorage
        return this.loadFromLocalStorage()
      }
    }
    return this.loadFromLocalStorage()
  }

  async save(data: ShortcutStorageData): Promise<void> {
    if (isTauri()) {
      try {
        await this.tauriInvoke("set_shortcuts", { shortcuts: data })
        return
      } catch {
        // Tauri 命令可能未实现，回退到 localStorage
      }
    }
    this.saveToLocalStorage(data)
  }

  async clear(): Promise<void> {
    if (isTauri()) {
      try {
        await this.tauriInvoke("clear_shortcuts")
        return
      } catch {
        // 回退到 localStorage
      }
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY)
    }
  }
}

const shortcutStorage = new ShortcutStorage()

// ============================================================================
// Zustand Store
// ============================================================================

export interface ShortcutState {
  shortcuts: ShortcutConfig[]
  groups: ShortcutGroup[]
  isLoaded: boolean

  // Actions
  loadShortcuts: () => Promise<void>
  updateShortcut: (action: ShortcutAction, keys: string[]) => Promise<void>
  toggleShortcut: (action: ShortcutAction, enabled: boolean) => Promise<void>
  resetShortcut: (action: ShortcutAction) => Promise<void>
  resetAllShortcuts: () => Promise<void>
  getShortcut: (action: ShortcutAction) => ShortcutConfig | undefined
  getShortcutByKeys: (keys: string[]) => ShortcutConfig | undefined
  formatShortcut: (keys: string[]) => string
}

// 辅助函数：比较两个按键数组是否相同
function areKeysEqual(keys1: string[], keys2: string[]): boolean {
  if (keys1.length !== keys2.length) return false
  const sorted1 = [...keys1].sort()
  const sorted2 = [...keys2].sort()
  return sorted1.every((key, index) => key === sorted2[index])
}

// 辅助函数：格式化快捷键显示
function formatShortcutKeys(keys: string[]): string {
  const isMac = typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent)
  
  const keyMap: Record<string, string> = isMac
    ? {
        Ctrl: "⌘",
        Control: "⌃",
        Alt: "⌥",
        Shift: "⇧",
        Meta: "⌘",
        Enter: "↵",
        Backspace: "⌫",
        Delete: "⌦",
        Escape: "⎋",
        Tab: "⇥",
        ArrowUp: "↑",
        ArrowDown: "↓",
        ArrowLeft: "←",
        ArrowRight: "→",
      }
    : {
        Meta: "Win",
        Enter: "Enter",
        Backspace: "Backspace",
        Delete: "Delete",
        Escape: "Esc",
        Tab: "Tab",
        ArrowUp: "↑",
        ArrowDown: "↓",
        ArrowLeft: "←",
        ArrowRight: "→",
      }

  return keys
    .map((key) => keyMap[key] || key)
    .join(isMac ? "" : " + ")
}

export const useShortcutStore = create<ShortcutState>()(
  devtools(
    (set, get) => ({
      shortcuts: defaultShortcuts,
      groups: createShortcutGroups(defaultShortcuts),
      isLoaded: false,

      loadShortcuts: async () => {
        const stored = await shortcutStorage.load()
        if (stored?.shortcuts) {
          const mergedShortcuts = defaultShortcuts.map((defaultShortcut) => {
            const storedConfig = stored.shortcuts[defaultShortcut.action]
            if (storedConfig && defaultShortcut.editable) {
              return {
                ...defaultShortcut,
                keys: storedConfig.keys,
                enabled: storedConfig.enabled,
              }
            }
            return defaultShortcut
          })
          set({
            shortcuts: mergedShortcuts,
            groups: createShortcutGroups(mergedShortcuts),
            isLoaded: true,
          })
        } else {
          set({ isLoaded: true })
        }
      },

      updateShortcut: async (action, keys) => {
        const state = get()
        const shortcut = state.shortcuts.find((s) => s.action === action)
        
        // 检查是否可编辑
        if (!shortcut?.editable) {
          console.warn(`Shortcut "${action}" is not editable`)
          return
        }

        const updatedShortcuts = state.shortcuts.map((s) =>
          s.action === action ? { ...s, keys } : s
        )

        set({
          shortcuts: updatedShortcuts,
          groups: createShortcutGroups(updatedShortcuts),
        })

        // 持久化存储
        const storageData: ShortcutStorageData = {
          shortcuts: {},
        }
        updatedShortcuts
          .filter((s) => s.editable)
          .forEach((s) => {
            storageData.shortcuts[s.action] = {
              keys: s.keys,
              enabled: s.enabled,
            }
          })
        await shortcutStorage.save(storageData)
      },

      toggleShortcut: async (action, enabled) => {
        const state = get()
        const shortcut = state.shortcuts.find((s) => s.action === action)
        
        if (!shortcut?.editable) {
          console.warn(`Shortcut "${action}" is not editable`)
          return
        }

        const updatedShortcuts = state.shortcuts.map((s) =>
          s.action === action ? { ...s, enabled } : s
        )

        set({
          shortcuts: updatedShortcuts,
          groups: createShortcutGroups(updatedShortcuts),
        })

        // 持久化存储
        const storageData: ShortcutStorageData = {
          shortcuts: {},
        }
        updatedShortcuts
          .filter((s) => s.editable)
          .forEach((s) => {
            storageData.shortcuts[s.action] = {
              keys: s.keys,
              enabled: s.enabled,
            }
          })
        await shortcutStorage.save(storageData)
      },

      resetShortcut: async (action) => {
        const defaultShortcut = defaultShortcuts.find((s) => s.action === action)
        if (!defaultShortcut || !defaultShortcut.editable) return

        const state = get()
        const updatedShortcuts = state.shortcuts.map((s) =>
          s.action === action ? { ...defaultShortcut } : s
        )

        set({
          shortcuts: updatedShortcuts,
          groups: createShortcutGroups(updatedShortcuts),
        })

        // 持久化存储
        const storageData: ShortcutStorageData = {
          shortcuts: {},
        }
        updatedShortcuts
          .filter((s) => s.editable)
          .forEach((s) => {
            storageData.shortcuts[s.action] = {
              keys: s.keys,
              enabled: s.enabled,
            }
          })
        await shortcutStorage.save(storageData)
      },

      resetAllShortcuts: async () => {
        set({
          shortcuts: defaultShortcuts,
          groups: createShortcutGroups(defaultShortcuts),
        })
        await shortcutStorage.clear()
      },

      getShortcut: (action) => {
        return get().shortcuts.find((s) => s.action === action)
      },

      getShortcutByKeys: (keys) => {
        return get().shortcuts.find(
          (s) => s.enabled && areKeysEqual(s.keys, keys)
        )
      },

      formatShortcut: (keys) => {
        return formatShortcutKeys(keys)
      },
    }),
    {
      name: "shortcut-store",
    }
  )
)

// 导出
export { defaultShortcuts, shortcutStorage, formatShortcutKeys }
