import { useAppStore } from "@/store/useAppStore"
import { Button } from "@/components/ui/button"
import { 
  Send, 
  Plus, 
  ArrowLeft, 
  Bot, 
  User,
  Copy,
  Check,
  MoreHorizontal,
  Sparkles
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "@tanstack/react-router"
import { usePlatform } from "@/hooks/usePlatform"
import { cn } from "@/lib/utils"

export default function ChatPage() {
  const { 
    currentChatId, 
    chats, 
    addMessage, 
    isProcessing, 
    createChat,
    setCurrentChat,
  } = useAppStore()
  const [input, setInput] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const navigate = useNavigate()
  const { isMobileView } = usePlatform()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const currentChat = chats.find((chat) => chat.id === currentChatId)

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentChat?.messages])

  // 自动调整输入框高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`
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
    
    // 重置输入框高度
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
    const chatId = createChat()
    setCurrentChat(chatId)
  }

  const handleCopy = async (content: string, messageId: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedId(messageId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background to-background/95">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-border/50 px-4 py-3 sm:px-6 glass-subtle z-10">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            {isMobileView && (
              <Button 
                variant="ghost" 
                size="icon-sm" 
                onClick={() => navigate({ to: "/" })}
                className="rounded-xl"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md shadow-primary/20">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="font-semibold truncate max-w-[180px] sm:max-w-[300px]">
                  {currentChat?.title || "新对话"}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {currentChat ? `${currentChat.messages.length} 条消息` : "开始你的对话"}
                </p>
              </div>
            </div>
          </div>
          
          <Button 
            size="sm" 
            variant="soft-primary"
            onClick={handleNewChat}
            className="rounded-xl"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline ml-2">新对话</span>
          </Button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 space-y-6">
          {!currentChat || currentChat.messages.length === 0 ? (
            // 空状态
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-xl shadow-primary/25 mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-semibold mb-2">开始新的对话</h2>
              <p className="text-muted-foreground text-sm max-w-sm">
                在下方输入你的问题，AI 助手将为你提供帮助
              </p>
              
              {/* 快捷提示 */}
              <div className="mt-8 grid gap-2 w-full max-w-md">
                {[
                  "帮我写一篇文章",
                  "解释一下量子计算",
                  "推荐一些学习资源",
                ].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(prompt)}
                    className="text-left px-4 py-3 rounded-xl bg-secondary/50 hover:bg-secondary border border-border/50 hover:border-primary/30 transition-all text-sm group"
                  >
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                      {prompt}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // 消息列表
            <>
              {currentChat.messages.map((message, index) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3 animate-in fade-in slide-in-from-bottom-2",
                    message.role === "user" ? "flex-row-reverse" : ""
                  )}
                  style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
                >
                  {/* 头像 */}
                  <div className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center",
                    message.role === "user" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-secondary text-secondary-foreground"
                  )}>
                    {message.role === "user" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>

                  {/* 消息内容 */}
                  <div className={cn(
                    "group relative max-w-[80%] sm:max-w-[70%]",
                    message.role === "user" ? "items-end" : "items-start"
                  )}>
                    <div
                      className={cn(
                        "relative px-4 py-3 rounded-2xl",
                        message.role === "user"
                          ? "bg-gradient-primary text-white rounded-br-md shadow-lg shadow-primary/20"
                          : "bg-card border border-border/50 rounded-bl-md shadow-sm"
                      )}
                    >
                      <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                    
                    {/* 消息操作 */}
                    <div className={cn(
                      "absolute -bottom-6 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
                      message.role === "user" ? "right-0" : "left-0"
                    )}>
                      <button
                        onClick={() => handleCopy(message.content, message.id)}
                        className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                        title="复制"
                      >
                        {copiedId === message.id ? (
                          <Check className="w-3.5 h-3.5 text-green-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                        )}
                      </button>
                      <button
                        className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                        title="更多"
                      >
                        <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* 加载状态 */}
              {isProcessing && (
                <div className="flex gap-3 animate-in fade-in">
                  <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-card border border-border/50 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 border-t border-border/50 p-3 sm:p-4 glass-subtle">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-end gap-2 bg-secondary/30 rounded-2xl border border-border/50 p-2 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入消息... (Shift + Enter 换行)"
              rows={1}
              className={cn(
                "flex-1 bg-transparent resize-none border-0",
                "px-3 py-2.5 text-sm",
                "placeholder:text-muted-foreground",
                "focus:outline-none",
                "max-h-[150px]",
                "scrollbar-thin"
              )}
              disabled={isProcessing}
            />
            
            <Button 
              onClick={handleSend} 
              disabled={isProcessing || !input.trim()}
              size="icon"
              variant={input.trim() ? "gradient" : "secondary"}
              className="rounded-xl flex-shrink-0 transition-all"
            >
              <Send className={cn(
                "w-4 h-4 transition-transform",
                input.trim() && "rotate-0",
                !input.trim() && "-rotate-45 opacity-50"
              )} />
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center mt-2">
            AI 可能会产生不准确的信息，请注意甄别
          </p>
        </div>
      </div>
    </div>
  )
}
