import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import type { App, Conversation, AppIcon } from "@/types"

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

export interface AppState {
  // App 状态
  apps: App[]
  currentAppId: string | null
  
  // Conversation 状态
  conversations: Conversation[]
  currentConversationId: string | null
  
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
      (set) => ({
        // Initial state
        apps: builtinApps,
        currentAppId: "default-assistant",
        conversations: mockConversations,
        currentConversationId: null,
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
          }
        },
      }
    ),
    {
      name: "app-store",
    }
  )
)
