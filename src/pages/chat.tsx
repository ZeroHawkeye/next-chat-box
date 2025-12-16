import { useAppStore } from "@/store/useAppStore"
import { Button } from "@/components/ui/button"
import { Send, Plus, Menu, ArrowLeft } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { usePlatform } from "@/hooks/usePlatform"

export default function ChatPage() {
  const { 
    currentChatId, 
    chats, 
    addMessage, 
    isProcessing, 
    createChat,
    setCurrentChat,
    toggleSidebar 
  } = useAppStore()
  const [input, setInput] = useState("")
  const navigate = useNavigate()
  const { isDesktop, isMobileView } = usePlatform()

  const currentChat = chats.find((chat) => chat.id === currentChatId)

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

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="border-b border-border px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isMobileView ? (
              <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/" })}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
            ) : isDesktop ? (
              <Button variant="ghost" size="sm" onClick={toggleSidebar}>
                <Menu className="w-5 h-5" />
              </Button>
            ) : null}
            <h1 className="text-lg sm:text-xl font-semibold truncate max-w-[200px] sm:max-w-none">
              {currentChat?.title || "新对话"}
            </h1>
          </div>
          <Button size="sm" onClick={handleNewChat}>
            <Plus className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">新对话</span>
          </Button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 space-y-4 scrollbar-thin">
        {!currentChat || currentChat.messages.length === 0 ? (
          <div className="text-center text-muted-foreground mt-20">
            <p>开始你的对话...</p>
          </div>
        ) : (
          currentChat.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] lg:max-w-[65%] rounded-lg px-4 py-2 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
              </div>
            </div>
          ))
        )}

        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border p-3 sm:p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息..."
            className="flex-1 px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-sm sm:text-base"
            disabled={isProcessing}
          />
          <Button onClick={handleSend} disabled={isProcessing || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
