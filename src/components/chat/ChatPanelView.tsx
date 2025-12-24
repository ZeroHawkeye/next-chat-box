import { useAssistantStore } from "@/store/useAssistantStore"
import { Button } from "@/components/ui/button"
import {
  Send,
  Plus,
  Bot,
  User,
  Copy,
  Check,
  Sparkles,
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import type { ChatPanel as ChatPanelType, Assistant } from "@/types"
import { ChatTabBar } from "./ChatTabBar"

interface ChatPanelProps {
  panel: ChatPanelType
  isActive: boolean
  canClose: boolean
}

// 欢迎界面组件
function WelcomeScreen({
  assistant,
  onQuickPrompt,
}: {
  assistant: Assistant | null
  onQuickPrompt: (prompt: string) => void
}) {
  // 快捷提示
  const defaultQuickPrompts = ["写一篇文章", "解释一个概念", "帮我写代码", "翻译文本"]

  // 根据助手类型显示不同的快捷提示
  const getQuickPrompts = (assistant: Assistant | null) => {
    if (!assistant) return defaultQuickPrompts

    switch (assistant.id) {
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

  const quickPrompts = getQuickPrompts(assistant)

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      {/* 助手图标 */}
      {assistant ? (
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg"
          style={{ backgroundColor: assistant.icon.bgColor || "#3b82f6" }}
        >
          {assistant.icon.value}
        </div>
      ) : (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
      )}

      {/* 欢迎语 */}
      <h2 className="text-lg font-semibold mb-2">
        {assistant?.welcomeMessage || assistant?.name || "有什么可以帮你？"}
      </h2>
      {assistant?.description && (
        <p className="text-sm text-muted-foreground mb-6 max-w-md">
          {assistant.description}
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
              "bg-secondary text-muted-foreground",
              "hover:bg-secondary/80 hover:text-foreground",
              "transition-colors duration-150",
              "border border-border"
            )}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  )
}

export function ChatPanelView({ panel, isActive, canClose }: ChatPanelProps) {
  const {
    assistants,
    chats,
    currentChatId,
    addMessage,
    isProcessing,
    createChat,
    setCurrentChat,
    setActivePanel,
    closePanel,
    openTab,
    currentAssistantId,
    createConversation,
  } = useAssistantStore()

  const [input, setInput] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 获取当前 Tab 对应的会话
  const activeTab = panel.tabs.find((t) => t.id === panel.activeTabId)
  // 预留：后续用于显示会话详情
  void activeTab

  // 获取当前助手
  const currentAssistant = activeTab
    ? assistants.find((a) => a.id === activeTab.assistantId)
    : assistants.find((a) => a.id === currentAssistantId)

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
    if (currentAssistantId) {
      const conversationId = createConversation(currentAssistantId)
      openTab(conversationId, panel.id)
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

  const handlePanelClick = () => {
    if (!isActive) {
      setActivePanel(panel.id)
    }
  }

  const handleClosePanel = () => {
    closePanel(panel.id)
  }

  const hasMessages = currentChat && currentChat.messages.length > 0
  const hasTabs = panel.tabs.length > 0

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-background",
        isActive && "ring-1 ring-primary/30"
      )}
      onClick={handlePanelClick}
    >
      {/* Tab 栏 */}
      <ChatTabBar
        panel={panel}
        onClose={handleClosePanel}
        canClose={canClose}
      />

      {/* 没有 Tab 时显示空状态 */}
      {!hasTabs ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <Sparkles className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <p className="text-sm text-muted-foreground mb-4">
            在左侧选择一个对话开始聊天
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNewChat}
            className="gap-1.5"
          >
            <Plus className="w-4 h-4" />
            新建对话
          </Button>
        </div>
      ) : (
        <>
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto scrollbar-apple">
            <div className="max-w-2xl mx-auto px-4 py-4">
              {!hasMessages ? (
                // 欢迎界面
                <WelcomeScreen assistant={currentAssistant || null} onQuickPrompt={handleQuickPrompt} />
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
                            : currentAssistant?.icon.bgColor
                              ? ""
                              : "bg-secondary text-muted-foreground"
                        )}
                        style={
                          message.role !== "user" && currentAssistant?.icon.bgColor
                            ? { backgroundColor: currentAssistant.icon.bgColor }
                            : undefined
                        }
                      >
                        {message.role === "user" ? (
                          <User className="w-4 h-4" />
                        ) : currentAssistant ? (
                          <span className="text-sm">{currentAssistant.icon.value}</span>
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
                          currentAssistant?.icon.bgColor
                            ? { backgroundColor: currentAssistant.icon.bgColor }
                            : undefined
                        }
                      >
                        {currentAssistant ? (
                          <span className="text-sm">{currentAssistant.icon.value}</span>
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
          <div className="flex-shrink-0 border-t border-border bg-background p-3">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-end gap-2 bg-secondary rounded-xl p-2 border border-border">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    currentAssistant
                      ? `向 ${currentAssistant.name} 提问...`
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
        </>
      )}
    </div>
  )
}
