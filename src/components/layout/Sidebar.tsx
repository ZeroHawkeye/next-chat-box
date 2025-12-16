import { useAppStore } from "@/store/useAppStore"
import { Button } from "@/components/ui/button"
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  X, 
  Search,
  Clock,
  Sparkles
} from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface SidebarProps {
  className?: string
  onClose?: () => void
  showCloseButton?: boolean
}

export function Sidebar({ className, onClose, showCloseButton = false }: SidebarProps) {
  const { chats, currentChatId, createChat, setCurrentChat, deleteChat } = useAppStore()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")

  const handleCreateChat = () => {
    const chatId = createChat()
    setCurrentChat(chatId)
    navigate({ to: "/chat" })
    onClose?.()
  }

  const handleSelectChat = (chatId: string) => {
    setCurrentChat(chatId)
    navigate({ to: "/chat" })
    onClose?.()
  }

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation()
    deleteChat(chatId)
  }

  // 过滤对话
  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={cn(
      "flex flex-col h-full",
      "bg-gradient-to-b from-sidebar to-sidebar/95",
      className
    )}>
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-sidebar-border/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-md shadow-primary/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">对话列表</span>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              size="icon-sm" 
              variant="ghost" 
              onClick={handleCreateChat}
              className="rounded-lg hover:bg-primary/10 hover:text-primary"
            >
              <Plus className="w-4 h-4" />
            </Button>
            {showCloseButton && (
              <Button 
                size="icon-sm" 
                variant="ghost" 
                onClick={onClose}
                className="rounded-lg"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* 搜索框 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索对话..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-full pl-9 pr-4 py-2 rounded-xl",
              "bg-sidebar-accent/50 border border-sidebar-border/50",
              "text-sm placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50",
              "transition-all duration-200"
            )}
          />
        </div>
      </div>

      {/* New Chat Button */}
      <div className="flex-shrink-0 p-3">
        <Button 
          variant="gradient"
          className="w-full justify-start gap-3 h-11"
          onClick={handleCreateChat}
        >
          <Plus className="w-4 h-4" />
          新建对话
        </Button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 scrollbar-thin">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-sidebar-accent flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? "未找到匹配的对话" : "暂无对话"}
            </p>
            {!searchQuery && (
              <p className="text-xs text-muted-foreground mt-1">
                点击上方按钮开始新对话
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            {/* 今天的对话 */}
            {filteredChats.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center gap-2 px-2 py-2">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    最近对话
                  </span>
                </div>
                <div className="space-y-1">
                  {filteredChats.map((chat, index) => (
                    <div
                      key={chat.id}
                      onClick={() => handleSelectChat(chat.id)}
                      className={cn(
                        "group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer",
                        "transition-all duration-200",
                        "animate-in fade-in slide-in-from-left-2",
                        currentChatId === chat.id
                          ? "bg-primary/10 shadow-sm"
                          : "hover:bg-sidebar-accent/70"
                      )}
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      {/* 左侧指示条 */}
                      <div className={cn(
                        "absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-full transition-all duration-200",
                        currentChatId === chat.id
                          ? "h-8 bg-primary"
                          : "h-0 bg-primary group-hover:h-4"
                      )} />

                      {/* 图标 */}
                      <div className={cn(
                        "flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                        currentChatId === chat.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-sidebar-accent text-muted-foreground group-hover:text-foreground"
                      )}>
                        <MessageSquare className="w-4 h-4" />
                      </div>

                      {/* 内容 */}
                      <div className="flex-1 min-w-0">
                        <h3 className={cn(
                          "font-medium text-sm truncate transition-colors",
                          currentChatId === chat.id && "text-primary"
                        )}>
                          {chat.title}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {chat.messages.length} 条消息
                        </p>
                      </div>

                      {/* 删除按钮 */}
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        className={cn(
                          "flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all",
                          "hover:bg-destructive/10 hover:text-destructive",
                          "rounded-lg"
                        )}
                        onClick={(e) => handleDeleteChat(e, chat.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 p-4 border-t border-sidebar-border/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center shadow-sm">
            <span className="text-xs font-bold text-white">AI</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Next Chat Box</p>
            <p className="text-xs text-muted-foreground">v0.1.0</p>
          </div>
        </div>
      </div>
    </div>
  )
}
