import { useAppStore } from "@/store/useAppStore"
import { Button } from "@/components/ui/button"
import {
  Send,
  Plus,
  Bot,
  User,
  Copy,
  Check,
  Sparkles,
  Settings2,
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import type { App } from "@/types"

// 当前应用头部组件
function ChatHeader({ app, onSettings }: { app: App | null; onSettings?: () => void }) {
  if (!app) {
    return (
      <header className="flex-shrink-0 h-12 border-b border-border/50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm font-medium">请选择一个应用</span>
        </div>
      </header>
    )
  }

  return (
    <header className="flex-shrink-0 h-12 border-b border-border/50 flex items-center justify-between px-4">
      <div className="flex items-center gap-3 min-w-0">
        {/* 应用图标 */}
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
          style={{ backgroundColor: app.icon.bgColor || "#3b82f6" }}
        >
          {app.icon.value}
        </div>
        <div className="min-w-0">
          <h1 className="text-sm font-medium truncate">{app.name}</h1>
          {app.description && (
            <p className="text-[11px] text-muted-foreground truncate">
              {app.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={onSettings}
          className="h-7 w-7 rounded-lg"
          title="应用设置"
        >
          <Settings2 className="w-4 h-4" />
        </Button>
      </div>
    </header>
  )
}

// 欢迎界面组件
function WelcomeScreen({
  app,
  onQuickPrompt,
}: {
  app: App | null
  onQuickPrompt: (prompt: string) => void
}) {
  // 快捷提示
  const defaultQuickPrompts = ["写一篇文章", "解释一个概念", "帮我写代码", "翻译文本"]

  // 根据应用类型显示不同的快捷提示
  const getQuickPrompts = (app: App | null) => {
    if (!app) return defaultQuickPrompts

    switch (app.id) {
      case "code-assistant":
        return ["写一个函数", "解释代码", "调试问题", "代码优化"]
      case "writer-assistant":
        return ["写一篇博客", "润色文章", "扩写内容", "写邮件"]
      case "translator":
        return ["翻译成英文", "翻译成中文", "翻译成日文", "解释语法"]
      default:
        return defaultQuickPrompts
    }
  }

  const quickPrompts = getQuickPrompts(app)

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      {/* 应用图标 */}
      {app ? (
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg"
          style={{ backgroundColor: app.icon.bgColor || "#3b82f6" }}
        >
          {app.icon.value}
        </div>
      ) : (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
      )}

      {/* 欢迎语 */}
      <h2 className="text-lg font-semibold mb-2">
        {app?.welcomeMessage || app?.name || "有什么可以帮你？"}
      </h2>
      {app?.description && (
        <p className="text-sm text-muted-foreground mb-6 max-w-md">
          {app.description}
        </p>
      )}

      {/* 快捷提示 */}
      <div className="flex flex-wrap justify-center gap-2 max-w-lg">
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => onQuickPrompt(prompt)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-[13px]",
              "bg-secondary/70 text-muted-foreground",
              "hover:bg-secondary hover:text-foreground",
              "transition-colors duration-150",
              "border border-border/50"
            )}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function ChatPage() {
  const {
    apps,
    currentAppId,
    conversations,
    currentConversationId,
    createConversation,
    setCurrentConversation,
    // Legacy
    currentChatId,
    chats,
    addMessage,
    isProcessing,
    createChat,
    setCurrentChat,
  } = useAppStore()

  const [input, setInput] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 获取当前应用
  const currentApp = apps.find((app) => app.id === currentAppId) || null

  // 获取当前对话 (预留，后续实现)
  const _currentConversation = conversations.find(
    (conv) => conv.id === currentConversationId
  )
  void _currentConversation // 避免 unused 警告

  // Legacy: 获取当前聊天
  const currentChat = chats.find((chat) => chat.id === currentChatId)

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentChat?.messages])

  // 自动调整输入框高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [input])

  const handleSend = () => {
    if (!input.trim() || isProcessing) return

    let chatId = currentChatId
    if (!chatId) {
      chatId = createChat()
      setCurrentChat(chatId)
    }

    addMessage(chatId, {
      role: "user",
      content: input.trim(),
    })

    setInput("")

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleNewChat = () => {
    if (currentAppId) {
      const conversationId = createConversation(currentAppId)
      setCurrentConversation(conversationId)
    } else {
      const chatId = createChat()
      setCurrentChat(chatId)
    }
  }

  const handleCopy = async (content: string, messageId: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedId(messageId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt)
    textareaRef.current?.focus()
  }

  const handleAppSettings = () => {
    // TODO: 打开应用设置弹窗
    console.log("Open app settings")
  }

  const hasMessages = currentChat && currentChat.messages.length > 0

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <ChatHeader app={currentApp} onSettings={handleAppSettings} />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto scrollbar-apple">
        <div className="max-w-2xl mx-auto px-4 py-4">
          {!hasMessages ? (
            // 欢迎界面
            <WelcomeScreen app={currentApp} onQuickPrompt={handleQuickPrompt} />
          ) : (
            // 消息列表
            <div className="space-y-4">
              {currentChat?.messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "flex-row-reverse" : ""
                  )}
                >
                  {/* 头像 */}
                  <div
                    className={cn(
                      "flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : currentApp?.icon.bgColor
                          ? ""
                          : "bg-secondary text-muted-foreground"
                    )}
                    style={
                      message.role !== "user" && currentApp?.icon.bgColor
                        ? { backgroundColor: currentApp.icon.bgColor }
                        : undefined
                    }
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4" />
                    ) : currentApp ? (
                      <span className="text-sm">{currentApp.icon.value}</span>
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>

                  {/* 消息内容 */}
                  <div
                    className={cn(
                      "group relative max-w-[85%]",
                      message.role === "user" ? "items-end" : "items-start"
                    )}
                  >
                    <div
                      className={cn(
                        "px-3.5 py-2.5 text-[13px] leading-relaxed rounded-2xl",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-secondary text-foreground rounded-bl-md"
                      )}
                    >
                      <p className="whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                    </div>

                    {/* 复制按钮 */}
                    <button
                      onClick={() => handleCopy(message.content, message.id)}
                      className={cn(
                        "absolute -bottom-6 p-1.5 rounded-lg",
                        "opacity-0 group-hover:opacity-100",
                        "hover:bg-secondary transition-all duration-100",
                        message.role === "user" ? "right-0" : "left-0"
                      )}
                    >
                      {copiedId === message.id ? (
                        <Check className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
              ))}

              {/* 加载状态 */}
              {isProcessing && (
                <div className="flex gap-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={
                      currentApp?.icon.bgColor
                        ? { backgroundColor: currentApp.icon.bgColor }
                        : undefined
                    }
                  >
                    {currentApp ? (
                      <span className="text-sm">{currentApp.icon.value}</span>
                    ) : (
                      <Bot className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-pulse" />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-pulse [animation-delay:0.2s]" />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-pulse [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 border-t border-border/50 p-3">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-end gap-2 bg-secondary/50 rounded-xl p-2 border border-border/50">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                currentApp
                  ? `向 ${currentApp.name} 提问...`
                  : "输入消息..."
              }
              rows={1}
              className={cn(
                "flex-1 bg-transparent resize-none border-0",
                "px-2 py-1.5 text-[13px]",
                "placeholder:text-muted-foreground",
                "focus:outline-none",
                "max-h-[120px]",
                "scrollbar-none"
              )}
              disabled={isProcessing}
            />

            <div className="flex items-center gap-1">
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={handleNewChat}
                className="h-8 w-8 rounded-lg"
                title="新建对话"
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleSend}
                disabled={isProcessing || !input.trim()}
                size="icon-sm"
                variant={input.trim() ? "default" : "secondary"}
                className="h-8 w-8 rounded-lg"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
