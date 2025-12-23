import { useAppStore } from "@/store/useAppStore"
import { Button } from "@/components/ui/button"
import { 
  Send, 
  Plus, 
  Bot, 
  User,
  Copy,
  Check
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
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
    const chatId = createChat()
    setCurrentChat(chatId)
  }

  const handleCopy = async (content: string, messageId: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedId(messageId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <header className="flex-shrink-0 h-10 border-b border-border/50 flex items-center justify-between px-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[13px] font-medium truncate">
            {currentChat?.title || "新对话"}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {currentChat ? `${currentChat.messages.length} 条` : ""}
          </span>
        </div>
        
        <Button 
          size="icon-sm" 
          variant="ghost"
          onClick={handleNewChat}
          className="h-6 w-6 rounded"
        >
          <Plus className="w-3.5 h-3.5" />
        </Button>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto scrollbar-apple">
        <div className="max-w-2xl mx-auto px-4 py-4">
          {!currentChat || currentChat.messages.length === 0 ? (
            // 空状态
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Bot className="w-6 h-6 text-muted-foreground mb-3" />
              <p className="text-[13px] text-muted-foreground mb-4">
                开始新对话
              </p>
              
              {/* 快捷提示 */}
              <div className="flex flex-wrap justify-center gap-1.5">
                {["写一篇文章", "解释概念", "代码帮助"].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(prompt)}
                    className={cn(
                      "px-2.5 py-1 rounded text-[12px]",
                      "bg-secondary/50 text-muted-foreground",
                      "hover:bg-secondary hover:text-foreground",
                      "transition-colors duration-100"
                    )}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // 消息列表
            <div className="space-y-4">
              {currentChat.messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-2.5",
                    message.role === "user" ? "flex-row-reverse" : ""
                  )}
                >
                  {/* 头像 */}
                  <div className={cn(
                    "flex-shrink-0 w-6 h-6 rounded flex items-center justify-center",
                    message.role === "user" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-secondary text-muted-foreground"
                  )}>
                    {message.role === "user" ? (
                      <User className="w-3.5 h-3.5" />
                    ) : (
                      <Bot className="w-3.5 h-3.5" />
                    )}
                  </div>

                  {/* 消息内容 */}
                  <div className={cn(
                    "group relative max-w-[85%]",
                    message.role === "user" ? "items-end" : "items-start"
                  )}>
                    <div
                      className={cn(
                        "px-3 py-2 text-[13px] leading-relaxed rounded-lg",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground"
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
                        "absolute -bottom-5 p-1 rounded",
                        "opacity-0 group-hover:opacity-100",
                        "hover:bg-secondary transition-all duration-100",
                        message.role === "user" ? "right-0" : "left-0"
                      )}
                    >
                      {copiedId === message.id ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <Copy className="w-3 h-3 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
              ))}

              {/* 加载状态 */}
              {isProcessing && (
                <div className="flex gap-2.5">
                  <div className="w-6 h-6 rounded bg-secondary flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div className="bg-secondary rounded-lg px-3 py-2">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-pulse" />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-pulse [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-pulse [animation-delay:0.4s]" />
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
      <div className="flex-shrink-0 border-t border-border/50 p-2">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-end gap-2 bg-secondary/50 rounded-lg p-1.5">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入消息..."
              rows={1}
              className={cn(
                "flex-1 bg-transparent resize-none border-0",
                "px-2 py-1.5 text-[13px]",
                "placeholder:text-muted-foreground",
                "focus:outline-none",
                "max-h-[100px]",
                "scrollbar-none"
              )}
              disabled={isProcessing}
            />
            
            <Button 
              onClick={handleSend} 
              disabled={isProcessing || !input.trim()}
              size="icon-sm"
              variant={input.trim() ? "default" : "ghost"}
              className="h-7 w-7 rounded shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
