import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import type { App, Conversation, AppIcon, ChatTab, ChatPanel, PanelGroup, Workspace } from "@/types"

// 侧边栏宽度配置
export const SIDEBAR_MIN_WIDTH = 200
export const SIDEBAR_MAX_WIDTH = 400
export const SIDEBAR_DEFAULT_WIDTH = 280
export const SIDEBAR_COLLAPSE_THRESHOLD = 100

// App Rail 宽度 (紧凑设计)
export const APP_RAIL_WIDTH = 48

export interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: number
}

export interface Chat {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: number
  updatedAt: number
}

// 默认应用图标
const defaultAppIcon: AppIcon = {
  type: "emoji",
  value: "🤖",
  bgColor: "#3b82f6",
}

// 内置应用模板 (Mock 数据)
const builtinApps: App[] = [
  {
    id: "default-assistant",
    name: "通用助手",
    description: "一个通用的 AI 助手，可以回答各种问题",
    icon: { type: "emoji", value: "🤖", bgColor: "#3b82f6" },
    systemPrompt: "你是一个有帮助的 AI 助手。",
    welcomeMessage: "你好！有什么我可以帮助你的吗？",
    modelConfig: {},
    mcpConfig: { enabledServers: [], enabledTools: [] },
    type: "assistant",
    isBuiltin: true,
    isPinned: true,
    sortOrder: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "code-assistant",
    name: "代码助手",
    description: "专业的编程助手，帮助你编写和调试代码",
    icon: { type: "emoji", value: "👨‍💻", bgColor: "#10b981" },
    systemPrompt: "你是一个专业的编程助手，擅长多种编程语言。请提供清晰、可维护的代码，并解释你的实现思路。",
    welcomeMessage: "你好！我是你的代码助手，可以帮你编写代码、调试问题、代码审查等。有什么需要帮助的吗？",
    modelConfig: {},
    mcpConfig: { enabledServers: [], enabledTools: [] },
    type: "assistant",
    isBuiltin: true,
    isPinned: true,
    sortOrder: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "writer-assistant",
    name: "写作助手",
    description: "帮助你撰写、润色和优化各类文本",
    icon: { type: "emoji", value: "✍️", bgColor: "#8b5cf6" },
    systemPrompt: "你是一个专业的写作助手，擅长撰写各类文章、润色文本、优化表达。请根据用户需求提供高质量的文字内容。",
    welcomeMessage: "你好！我可以帮你写文章、润色文本、优化表达。告诉我你想写什么？",
    modelConfig: {},
    mcpConfig: { enabledServers: [], enabledTools: [] },
    type: "assistant",
    isBuiltin: true,
    isPinned: false,
    sortOrder: 2,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "translator",
    name: "翻译专家",
    description: "专业翻译，支持多语言互译",
    icon: { type: "emoji", value: "🌐", bgColor: "#f97316" },
    systemPrompt: "你是一个专业的翻译专家，精通中文、英文、日文等多种语言。请提供准确、自然的翻译结果。",
    welcomeMessage: "你好！我可以帮你进行多语言翻译。请输入需要翻译的内容。",
    modelConfig: {},
    mcpConfig: { enabledServers: [], enabledTools: [] },
    type: "assistant",
    isBuiltin: true,
    isPinned: false,
    sortOrder: 3,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
]

// Mock 对话数据
const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    appId: "default-assistant",
    title: "关于 React 的问题",
    messageCount: 5,
    isPinned: false,
    isArchived: false,
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 1800000,
  },
  {
    id: "conv-2",
    appId: "default-assistant",
    title: "帮我写一封邮件",
    messageCount: 3,
    isPinned: true,
    isArchived: false,
    createdAt: Date.now() - 7200000,
    updatedAt: Date.now() - 3600000,
  },
  {
    id: "conv-3",
    appId: "code-assistant",
    title: "TypeScript 类型问题",
    messageCount: 8,
    isPinned: false,
    isArchived: false,
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 43200000,
  },
]

// 创建默认面板
function createDefaultPanel(): ChatPanel {
  return {
    id: `panel-${Date.now()}`,
    tabs: [],
    activeTabId: null,
  }
}

// 创建默认工作区
function createDefaultWorkspace(): Workspace {
  return {
    id: "default-workspace",
    name: "默认工作区",
    root: createDefaultPanel(),
  }
}

// 辅助函数：判断是否是面板组
export function isPanelGroup(node: ChatPanel | PanelGroup): node is PanelGroup {
  return "children" in node && "direction" in node
}

// 辅助函数：在布局中查找面板
function findPanelInLayout(
  node: ChatPanel | PanelGroup,
  panelId: string
): ChatPanel | null {
  if (!isPanelGroup(node)) {
    return node.id === panelId ? node : null
  }
  for (const child of node.children) {
    const found = findPanelInLayout(child, panelId)
    if (found) return found
  }
  return null
}

// 辅助函数：更新布局中的面板
function updatePanelInLayout(
  node: ChatPanel | PanelGroup,
  panelId: string,
  updater: (panel: ChatPanel) => ChatPanel
): ChatPanel | PanelGroup {
  if (!isPanelGroup(node)) {
    return node.id === panelId ? updater(node) : node
  }
  return {
    ...node,
    children: node.children.map((child) =>
      updatePanelInLayout(child, panelId, updater)
    ),
  }
}

// 辅助函数：获取所有面板
function getAllPanels(node: ChatPanel | PanelGroup): ChatPanel[] {
  if (!isPanelGroup(node)) {
    return [node]
  }
  return node.children.flatMap((child) => getAllPanels(child))
}

// 辅助函数：获取所有打开的Tab
function getAllTabs(node: ChatPanel | PanelGroup): ChatTab[] {
  const panels = getAllPanels(node)
  return panels.flatMap((panel) => panel.tabs)
}

export interface AppState {
  // App 状态
  apps: App[]
  currentAppId: string | null
  
  // Conversation 状态
  conversations: Conversation[]
  currentConversationId: string | null
  
  // 多面板工作区状态
  workspace: Workspace
  activePanelId: string | null
  
  // Legacy Chat state (保持兼容)
  chats: Chat[]
  currentChatId: string | null
  isProcessing: boolean

  // UI state
  sidebarOpen: boolean
  sidebarWidth: number
  showAppRail: boolean
  theme: "light" | "dark" | "system"

  // App Actions
  setCurrentApp: (appId: string | null) => void
  createApp: (params: Partial<App>) => string
  updateApp: (appId: string, updates: Partial<App>) => void
  deleteApp: (appId: string) => void
  
  // Conversation Actions
  setCurrentConversation: (conversationId: string | null) => void
  createConversation: (appId: string, title?: string) => string
  deleteConversation: (conversationId: string) => void
  
  // Tab Actions
  openTab: (conversationId: string, panelId?: string) => void
  closeTab: (tabId: string, panelId: string) => void
  setActiveTab: (tabId: string, panelId: string) => void
  moveTab: (tabId: string, fromPanelId: string, toPanelId: string, index?: number) => void
  
  // Panel Actions
  setActivePanel: (panelId: string) => void
  splitPanel: (panelId: string, direction: "horizontal" | "vertical") => void
  closePanel: (panelId: string) => void
  updatePanelSizes: (panelGroupId: string, sizes: number[]) => void
  
  // 辅助方法
  getOpenTabs: () => ChatTab[]
  getPanel: (panelId: string) => ChatPanel | null
  
  // Legacy Actions (保持兼容)
  createChat: (title?: string) => string
  deleteChat: (chatId: string) => void
  updateChat: (chatId: string, updates: Partial<Chat>) => void
  addMessage: (chatId: string, message: Omit<ChatMessage, "id" | "timestamp">) => void
  setCurrentChat: (chatId: string | null) => void
  setProcessing: (processing: boolean) => void
  toggleSidebar: () => void
  setSidebarWidth: (width: number) => void
  setSidebarOpen: (open: boolean) => void
  setShowAppRail: (show: boolean) => void
  setTheme: (theme: "light" | "dark" | "system") => void
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        apps: builtinApps,
        currentAppId: "default-assistant",
        conversations: mockConversations,
        currentConversationId: null,
        workspace: createDefaultWorkspace(),
        activePanelId: null,
        chats: [],
        currentChatId: null,
        isProcessing: false,
        sidebarOpen: true,
        sidebarWidth: SIDEBAR_DEFAULT_WIDTH,
        showAppRail: true,
        theme: "system",

        // App Actions
        setCurrentApp: (appId) => set({ currentAppId: appId, currentConversationId: null }),
        
        createApp: (params) => {
          const appId = `app-${Date.now()}`
          const newApp: App = {
            id: appId,
            name: params.name || "新应用",
            description: params.description,
            icon: params.icon || defaultAppIcon,
            systemPrompt: params.systemPrompt || "",
            welcomeMessage: params.welcomeMessage,
            modelConfig: params.modelConfig || {},
            mcpConfig: params.mcpConfig || { enabledServers: [], enabledTools: [] },
            type: params.type || "assistant",
            isBuiltin: false,
            isPinned: false,
            sortOrder: 999,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          }
          set((state) => ({ apps: [...state.apps, newApp] }))
          return appId
        },
        
        updateApp: (appId, updates) => {
          set((state) => ({
            apps: state.apps.map((app) =>
              app.id === appId ? { ...app, ...updates, updatedAt: Date.now() } : app
            ),
          }))
        },
        
        deleteApp: (appId) => {
          set((state) => ({
            apps: state.apps.filter((app) => app.id !== appId),
            currentAppId: state.currentAppId === appId ? null : state.currentAppId,
          }))
        },
        
        // Conversation Actions
        setCurrentConversation: (conversationId) => set({ currentConversationId: conversationId }),
        
        createConversation: (appId, title = "新对话") => {
          const conversationId = `conv-${Date.now()}`
          const newConversation: Conversation = {
            id: conversationId,
            appId,
            title,
            messageCount: 0,
            isPinned: false,
            isArchived: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          }
          set((state) => ({
            conversations: [newConversation, ...state.conversations],
            currentConversationId: conversationId,
          }))
          return conversationId
        },
        
        deleteConversation: (conversationId) => {
          set((state) => ({
            conversations: state.conversations.filter((c) => c.id !== conversationId),
            currentConversationId:
              state.currentConversationId === conversationId ? null : state.currentConversationId,
          }))
        },

        // Tab Actions
        openTab: (conversationId, panelId) => {
          const state = get()
          const conversation = state.conversations.find((c) => c.id === conversationId)
          if (!conversation) return
          
          // 检查是否已经打开
          const allTabs = getAllTabs(state.workspace.root)
          const existingTab = allTabs.find((t) => t.conversationId === conversationId)
          
          if (existingTab) {
            // 如果已经打开，激活该 Tab
            const panels = getAllPanels(state.workspace.root)
            const panel = panels.find((p) => p.tabs.some((t) => t.id === existingTab.id))
            if (panel) {
              set({
                workspace: {
                  ...state.workspace,
                  root: updatePanelInLayout(state.workspace.root, panel.id, (p) => ({
                    ...p,
                    activeTabId: existingTab.id,
                  })),
                },
                activePanelId: panel.id,
                currentConversationId: conversationId,
              })
            }
            return
          }

          // 创建新 Tab
          const newTab: ChatTab = {
            id: `tab-${Date.now()}`,
            conversationId,
            title: conversation.title,
            appId: conversation.appId,
          }

          // 确定目标面板
          let targetPanelId = panelId || state.activePanelId
          if (!targetPanelId) {
            const panels = getAllPanels(state.workspace.root)
            targetPanelId = panels[0]?.id
          }

          if (!targetPanelId) {
            // 没有面板，创建一个
            const newPanel = createDefaultPanel()
            newPanel.tabs = [newTab]
            newPanel.activeTabId = newTab.id
            set({
              workspace: {
                ...state.workspace,
                root: newPanel,
              },
              activePanelId: newPanel.id,
              currentConversationId: conversationId,
            })
            return
          }

          set({
            workspace: {
              ...state.workspace,
              root: updatePanelInLayout(state.workspace.root, targetPanelId, (panel) => ({
                ...panel,
                tabs: [...panel.tabs, newTab],
                activeTabId: newTab.id,
              })),
            },
            activePanelId: targetPanelId,
            currentConversationId: conversationId,
          })
        },

        closeTab: (tabId, panelId) => {
          set((state) => {
            const newRoot = updatePanelInLayout(state.workspace.root, panelId, (panel) => {
              const newTabs = panel.tabs.filter((t) => t.id !== tabId)
              const wasActive = panel.activeTabId === tabId
              return {
                ...panel,
                tabs: newTabs,
                activeTabId: wasActive
                  ? newTabs[newTabs.length - 1]?.id || null
                  : panel.activeTabId,
              }
            })
            
            // 更新当前会话ID
            const panels = getAllPanels(newRoot)
            const activePanel = panels.find((p) => p.id === state.activePanelId)
            const activeTab = activePanel?.tabs.find((t) => t.id === activePanel.activeTabId)
            
            return {
              workspace: {
                ...state.workspace,
                root: newRoot,
              },
              currentConversationId: activeTab?.conversationId || null,
            }
          })
        },

        setActiveTab: (tabId, panelId) => {
          set((state) => {
            const panel = findPanelInLayout(state.workspace.root, panelId)
            const tab = panel?.tabs.find((t) => t.id === tabId)
            
            return {
              workspace: {
                ...state.workspace,
                root: updatePanelInLayout(state.workspace.root, panelId, (p) => ({
                  ...p,
                  activeTabId: tabId,
                })),
              },
              activePanelId: panelId,
              currentConversationId: tab?.conversationId || null,
            }
          })
        },

        moveTab: (tabId, fromPanelId, toPanelId, index) => {
          set((state) => {
            // 找到要移动的 Tab
            const fromPanel = findPanelInLayout(state.workspace.root, fromPanelId)
            const tab = fromPanel?.tabs.find((t) => t.id === tabId)
            if (!tab) return state

            // 从源面板移除
            let newRoot = updatePanelInLayout(state.workspace.root, fromPanelId, (panel) => {
              const newTabs = panel.tabs.filter((t) => t.id !== tabId)
              return {
                ...panel,
                tabs: newTabs,
                activeTabId: panel.activeTabId === tabId
                  ? newTabs[newTabs.length - 1]?.id || null
                  : panel.activeTabId,
              }
            })

            // 添加到目标面板
            newRoot = updatePanelInLayout(newRoot, toPanelId, (panel) => {
              const newTabs = [...panel.tabs]
              if (index !== undefined) {
                newTabs.splice(index, 0, tab)
              } else {
                newTabs.push(tab)
              }
              return {
                ...panel,
                tabs: newTabs,
                activeTabId: tab.id,
              }
            })

            return {
              workspace: {
                ...state.workspace,
                root: newRoot,
              },
              activePanelId: toPanelId,
              currentConversationId: tab.conversationId,
            }
          })
        },

        // Panel Actions
        setActivePanel: (panelId) => {
          set((state) => {
            const panel = findPanelInLayout(state.workspace.root, panelId)
            const activeTab = panel?.tabs.find((t) => t.id === panel.activeTabId)
            return {
              activePanelId: panelId,
              currentConversationId: activeTab?.conversationId || state.currentConversationId,
            }
          })
        },

        splitPanel: (panelId, direction) => {
          set((state) => {
            const currentPanel = findPanelInLayout(state.workspace.root, panelId)
            if (!currentPanel) return state

            const newPanel = createDefaultPanel()
            
            // 如果当前根节点就是这个面板
            if (!isPanelGroup(state.workspace.root) && state.workspace.root.id === panelId) {
              const newGroup: PanelGroup = {
                id: `group-${Date.now()}`,
                direction,
                sizes: [50, 50],
                children: [currentPanel, newPanel],
              }
              return {
                workspace: {
                  ...state.workspace,
                  root: newGroup,
                },
                activePanelId: newPanel.id,
              }
            }

            // 在面板组中查找并替换
            function splitInGroup(node: ChatPanel | PanelGroup): ChatPanel | PanelGroup {
              if (!isPanelGroup(node)) {
                if (node.id === panelId) {
                  const newGroup: PanelGroup = {
                    id: `group-${Date.now()}`,
                    direction,
                    sizes: [50, 50],
                    children: [node, newPanel],
                  }
                  return newGroup
                }
                return node
              }
              return {
                ...node,
                children: node.children.map((child) => splitInGroup(child)),
              }
            }

            return {
              workspace: {
                ...state.workspace,
                root: splitInGroup(state.workspace.root),
              },
              activePanelId: newPanel.id,
            }
          })
        },

        closePanel: (panelId) => {
          set((state) => {
            // 如果只有一个面板，不能关闭
            const allPanels = getAllPanels(state.workspace.root)
            if (allPanels.length <= 1) return state

            function removePanel(node: ChatPanel | PanelGroup): ChatPanel | PanelGroup | null {
              if (!isPanelGroup(node)) {
                return node.id === panelId ? null : node
              }

              const newChildren = node.children
                .map((child) => removePanel(child))
                .filter((child): child is ChatPanel | PanelGroup => child !== null)

              if (newChildren.length === 0) return null
              if (newChildren.length === 1) return newChildren[0]

              return {
                ...node,
                children: newChildren,
                sizes: newChildren.map(() => 100 / newChildren.length),
              }
            }

            const newRoot = removePanel(state.workspace.root)
            if (!newRoot) return state

            const remainingPanels = getAllPanels(newRoot)
            const newActivePanel = remainingPanels[0]

            return {
              workspace: {
                ...state.workspace,
                root: newRoot,
              },
              activePanelId: newActivePanel?.id || null,
              currentConversationId: newActivePanel?.tabs.find(
                (t) => t.id === newActivePanel.activeTabId
              )?.conversationId || null,
            }
          })
        },

        updatePanelSizes: (panelGroupId, sizes) => {
          set((state) => {
            function updateSizes(node: ChatPanel | PanelGroup): ChatPanel | PanelGroup {
              if (!isPanelGroup(node)) return node
              if (node.id === panelGroupId) {
                return { ...node, sizes }
              }
              return {
                ...node,
                children: node.children.map((child) => updateSizes(child)),
              }
            }
            return {
              workspace: {
                ...state.workspace,
                root: updateSizes(state.workspace.root),
              },
            }
          })
        },

        // 辅助方法
        getOpenTabs: () => {
          const state = get()
          return getAllTabs(state.workspace.root)
        },

        getPanel: (panelId) => {
          const state = get()
          return findPanelInLayout(state.workspace.root, panelId)
        },

        // Legacy Actions
        createChat: (title = "新对话") => {
          const chatId = Date.now().toString()
          const newChat: Chat = {
            id: chatId,
            title,
            messages: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          }

          set((state) => ({
            chats: [newChat, ...state.chats],
            currentChatId: chatId,
          }))

          return chatId
        },

        deleteChat: (chatId) => {
          set((state) => {
            const newChats = state.chats.filter((chat) => chat.id !== chatId)
            const newCurrentChatId =
              state.currentChatId === chatId
                ? newChats.length > 0
                  ? newChats[0].id
                  : null
                : state.currentChatId

            return {
              chats: newChats,
              currentChatId: newCurrentChatId,
            }
          })
        },

        updateChat: (chatId, updates) => {
          set((state) => ({
            chats: state.chats.map((chat) =>
              chat.id === chatId ? { ...chat, ...updates, updatedAt: Date.now() } : chat
            ),
          }))
        },

        addMessage: (chatId, message) => {
          const newMessage: ChatMessage = {
            ...message,
            id: Date.now().toString(),
            timestamp: Date.now(),
          }

          set((state) => ({
            chats: state.chats.map((chat) =>
              chat.id === chatId
                ? {
                    ...chat,
                    messages: [...chat.messages, newMessage],
                    updatedAt: Date.now(),
                  }
                : chat
            ),
          }))
        },

        setCurrentChat: (chatId) => set({ currentChatId: chatId }),

        setProcessing: (processing) => set({ isProcessing: processing }),

        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

        setSidebarWidth: (width) =>
          set({ sidebarWidth: Math.min(Math.max(width, SIDEBAR_MIN_WIDTH), SIDEBAR_MAX_WIDTH) }),

        setSidebarOpen: (open) => set({ sidebarOpen: open }),

        setShowAppRail: (show) => set({ showAppRail: show }),

        setTheme: (theme) => set({ theme }),
      }),
      {
        name: "app-store",
        partialize: (state) => ({
          apps: state.apps.filter((app) => !app.isBuiltin), // 只持久化非内置应用
          currentAppId: state.currentAppId,
          conversations: state.conversations,
          currentConversationId: state.currentConversationId,
          workspace: state.workspace,
          activePanelId: state.activePanelId,
          sidebarOpen: state.sidebarOpen,
          sidebarWidth: state.sidebarWidth,
          showAppRail: state.showAppRail,
          chats: state.chats,
          currentChatId: state.currentChatId,
        }),
        // 恢复时合并内置应用
        merge: (persistedState, currentState) => {
          const persisted = persistedState as Partial<AppState>
          return {
            ...currentState,
            ...persisted,
            // 确保内置应用始终存在，并合并用户创建的应用
            apps: [
              ...builtinApps,
              ...(persisted.apps || []).filter((app: App) => !app.isBuiltin),
            ],
            // 如果没有选中的应用，默认选择第一个内置应用
            currentAppId: persisted.currentAppId || "default-assistant",
            // 确保工作区存在
            workspace: persisted.workspace || createDefaultWorkspace(),
          }
        },
      }
    ),
    {
      name: "app-store",
    }
  )
)
