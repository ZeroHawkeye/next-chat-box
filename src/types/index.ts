// ============================================================================
// AI Chat Application Types
// 参考 Cherry Studio 和 Dify 的设计模式
// ============================================================================

// ============================================================================
// MCP (Model Context Protocol) 工具相关类型
// ============================================================================

export interface MCPServer {
  id: string
  name: string
  description?: string
  type: "stdio" | "sse"
  command?: string
  args?: string[]
  env?: Record<string, string>
  url?: string
  enabled: boolean
}

export interface MCPTool {
  id: string
  serverId: string
  name: string
  description?: string
  inputSchema?: Record<string, unknown>
  enabled: boolean
}

export interface AppMCPConfig {
  enabledServers: string[]
  enabledTools: string[]
}

// ============================================================================
// 模型配置相关类型
// ============================================================================

export interface ModelConfig {
  modelId?: string
  providerId?: string
  temperature?: number
  topP?: number
  maxTokens?: number
  frequencyPenalty?: number
  presencePenalty?: number
  stopSequences?: string[]
  customParams?: Record<string, unknown>
}

// ============================================================================
// 应用 (App/Agent) 相关类型
// ============================================================================

export type AppIconType = "emoji" | "lucide" | "url"

export interface AppIcon {
  type: AppIconType
  value: string
  bgColor?: string
}

export interface App {
  id: string
  name: string
  description?: string
  icon: AppIcon
  systemPrompt: string
  welcomeMessage?: string
  modelConfig: ModelConfig
  mcpConfig: AppMCPConfig
  knowledgeBaseIds?: string[]
  type: "assistant" | "agent" | "workflow"
  isBuiltin: boolean
  isPinned: boolean
  sortOrder: number
  createdAt: number
  updatedAt: number
}

export interface CreateAppParams {
  name: string
  description?: string
  icon?: AppIcon
  systemPrompt?: string
  welcomeMessage?: string
  modelConfig?: ModelConfig
  mcpConfig?: AppMCPConfig
  type?: App["type"]
}

export interface UpdateAppParams extends Partial<CreateAppParams> {
  isPinned?: boolean
  sortOrder?: number
}

// ============================================================================
// 对话 (Conversation) 相关类型
// ============================================================================

export interface Conversation {
  id: string
  appId: string
  title: string
  summary?: string
  messageCount: number
  isPinned: boolean
  isArchived: boolean
  createdAt: number
  updatedAt: number
}

export interface CreateConversationParams {
  appId: string
  title?: string
}

// ============================================================================
// 消息 (Message) 相关类型
// ============================================================================

export type MessageRole = "system" | "user" | "assistant" | "tool"
export type MessageStatus = "pending" | "streaming" | "success" | "error"

export interface TextContentBlock {
  type: "text"
  text: string
}

export interface ImageContentBlock {
  type: "image"
  url: string
  alt?: string
}

export interface ToolUseContentBlock {
  type: "tool_use"
  toolId: string
  toolName: string
  input: Record<string, unknown>
}

export interface ToolResultContentBlock {
  type: "tool_result"
  toolId: string
  toolName: string
  output: string
  isError?: boolean
}

export type ContentBlock =
  | TextContentBlock
  | ImageContentBlock
  | ToolUseContentBlock
  | ToolResultContentBlock

export interface Message {
  id: string
  conversationId: string
  role: MessageRole
  content: ContentBlock[]
  textContent: string
  status: MessageStatus
  error?: string
  modelId?: string
  usage?: {
    promptTokens?: number
    completionTokens?: number
    totalTokens?: number
  }
  parentId?: string
  createdAt: number
}

// ============================================================================
// 预设应用模板
// ============================================================================

export type AppTemplateCategory =
  | "general"
  | "writing"
  | "coding"
  | "translation"
  | "creative"
  | "business"
  | "education"
  | "other"

export interface AppTemplate {
  id: string
  name: string
  description: string
  icon: AppIcon
  category: AppTemplateCategory
  systemPrompt: string
  welcomeMessage?: string
  suggestedQuestions?: string[]
  recommendedModelConfig?: Partial<ModelConfig>
  isPopular?: boolean
}

// ============================================================================
// 多 Tab 和多面板相关类型
// ============================================================================

/**
 * 单个 Tab 表示一个会话
 */
export interface ChatTab {
  id: string
  conversationId: string
  title: string
  appId: string
  isPinned?: boolean
}

/**
 * 面板 - 包含多个 Tab
 */
export interface ChatPanel {
  id: string
  tabs: ChatTab[]
  activeTabId: string | null
}

/**
 * 面板布局方向
 */
export type SplitDirection = "horizontal" | "vertical"

/**
 * 面板组 - 可嵌套的面板布局结构
 */
export interface PanelGroup {
  id: string
  direction: SplitDirection
  sizes: number[] // 各子项的大小比例
  children: (ChatPanel | PanelGroup)[]
}

/**
 * 工作区配置 - 管理整个多面板布局
 */
export interface Workspace {
  id: string
  name: string
  // 根节点可以是单个面板或面板组
  root: ChatPanel | PanelGroup
}

// ============================================================================
// 快捷键相关类型
// ============================================================================

/**
 * 快捷键动作标识
 */
export type ShortcutAction =
  | "newChat"
  | "newWindow"
  | "closeTab"
  | "nextTab"
  | "prevTab"
  | "toggleSidebar"
  | "openSettings"
  | "search"
  | "sendMessage"
  | "newLine"
  | "focusInput"
  | "switchToTab1"
  | "switchToTab2"
  | "switchToTab3"
  | "switchToTab4"
  | "switchToTab5"
  | "switchToTab6"
  | "switchToTab7"
  | "switchToTab8"
  | "switchToTab9"

/**
 * 快捷键配置
 */
export interface ShortcutConfig {
  action: ShortcutAction
  label: string
  description: string
  keys: string[] // 例如: ["Ctrl", "N"] 或 ["Meta", "Shift", "N"]
  enabled: boolean
  editable: boolean // 是否可由用户编辑
}

/**
 * 快捷键分组
 */
export interface ShortcutGroup {
  id: string
  label: string
  shortcuts: ShortcutConfig[]
}
