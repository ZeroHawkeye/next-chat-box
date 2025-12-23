import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// 侧边栏宽度配置
export const SIDEBAR_MIN_WIDTH = 200
export const SIDEBAR_MAX_WIDTH = 400
export const SIDEBAR_DEFAULT_WIDTH = 256
export const SIDEBAR_COLLAPSE_THRESHOLD = 100

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
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

export interface AppState {
  // Chat state
  chats: Chat[]
  currentChatId: string | null
  isProcessing: boolean
  
  // UI state
  sidebarOpen: boolean
  sidebarWidth: number
  theme: 'light' | 'dark' | 'system'
  
  // Actions
  createChat: (title?: string) => string
  deleteChat: (chatId: string) => void
  updateChat: (chatId: string, updates: Partial<Chat>) => void
  addMessage: (chatId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  setCurrentChat: (chatId: string | null) => void
  setProcessing: (processing: boolean) => void
  toggleSidebar: () => void
  setSidebarWidth: (width: number) => void
  setSidebarOpen: (open: boolean) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        chats: [],
        currentChatId: null,
        isProcessing: false,
        sidebarOpen: true,
        sidebarWidth: SIDEBAR_DEFAULT_WIDTH,
        theme: 'system',
        
        // Actions
        createChat: (title = '新对话') => {
          const chatId = Date.now().toString()
          const newChat: Chat = {
            id: chatId,
            title,
            messages: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          }
          
          set(state => ({
            chats: [newChat, ...state.chats],
            currentChatId: chatId,
          }))
          
          return chatId
        },
        
        deleteChat: (chatId) => {
          set(state => {
            const newChats = state.chats.filter(chat => chat.id !== chatId)
            const newCurrentChatId = state.currentChatId === chatId 
              ? (newChats.length > 0 ? newChats[0].id : null)
              : state.currentChatId
            
            return {
              chats: newChats,
              currentChatId: newCurrentChatId,
            }
          })
        },
        
        updateChat: (chatId, updates) => {
          set(state => ({
            chats: state.chats.map(chat =>
              chat.id === chatId
                ? { ...chat, ...updates, updatedAt: Date.now() }
                : chat
            ),
          }))
        },
        
        addMessage: (chatId, message) => {
          const newMessage: ChatMessage = {
            ...message,
            id: Date.now().toString(),
            timestamp: Date.now(),
          }
          
          set(state => ({
            chats: state.chats.map(chat =>
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
        
        toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
        
        setSidebarWidth: (width) => set({ sidebarWidth: Math.min(Math.max(width, SIDEBAR_MIN_WIDTH), SIDEBAR_MAX_WIDTH) }),
        
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        
        setTheme: (theme) => set({ theme }),
      }),
      {
        name: 'app-store',
        partialize: (state) => ({
          sidebarOpen: state.sidebarOpen,
          sidebarWidth: state.sidebarWidth,
          chats: state.chats,
          currentChatId: state.currentChatId,
        }),
      }
    ),
    {
      name: 'app-store',
    }
  )
)