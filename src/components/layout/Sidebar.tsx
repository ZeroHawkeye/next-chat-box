import { useAppStore } from "@/store/useAppStore"
import { Button } from "@/components/ui/button"
import { SearchInput } from "@/components/ui/input"
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  X,
  Settings
} from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface SidebarProps {
  className?: string
  style?: React.CSSProperties
  onClose?: () => void
  showCloseButton?: boolean
}

export function Sidebar({ className, style, onClose, showCloseButton = false }: SidebarProps) {
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

  const handleOpenSettings = () => {
    navigate({ to: "/settings" })
    onClose?.()
  }

  // 过滤对话
  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div 
      className={cn(
        "flex flex-col h-full bg-sidebar",
        className
      )}
      style={style}
    >
      {/* Header */}
      <div className="flex-shrink-0 px-2 pt-2 pb-1.5 space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            对话
          </span>
          <div className="flex items-center">
            <Button 
              size="icon-sm" 
              variant="ghost" 
              onClick={handleCreateChat}
              className="h-6 w-6 rounded"
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
            {showCloseButton && (
              <Button 
                size="icon-sm" 
                variant="ghost" 
                onClick={onClose}
                className="h-6 w-6 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* 搜索框 */}
        <SearchInput
          placeholder="搜索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery("")}
          inputSize="sm"
          className="h-7 text-[13px] rounded-md"
        />
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-1.5 py-0.5 scrollbar-apple">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center px-2">
            <MessageSquare className="w-5 h-5 text-muted-foreground mb-2" />
            <p className="text-[12px] text-muted-foreground">
              {searchQuery ? "无结果" : "暂无对话"}
            </p>
          </div>
        ) : (
          <div className="space-y-px">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleSelectChat(chat.id)}
                className={cn(
                  "group flex items-center gap-2 px-2 py-1 rounded cursor-pointer",
                  "transition-colors duration-100",
                  currentChatId === chat.id
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-foreground/[0.04] active:bg-foreground/[0.06]"
                )}
              >
                <MessageSquare className={cn(
                  "w-3.5 h-3.5 flex-shrink-0",
                  currentChatId === chat.id
                    ? "text-primary"
                    : "text-muted-foreground"
                )} />
                <span className={cn(
                  "flex-1 truncate text-[13px]",
                  currentChatId === chat.id && "font-medium"
                )}>
                  {chat.title}
                </span>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className={cn(
                    "flex-shrink-0 h-5 w-5 rounded",
                    "opacity-0 group-hover:opacity-100",
                    "transition-opacity duration-100"
                  )}
                  onClick={(e) => handleDeleteChat(e, chat.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer - 设置按钮 */}
      <div className="flex-shrink-0 px-1.5 py-1.5 border-t border-border/50">
        <Button
          variant="ghost"
          size="icon-sm"
          className="h-7 w-7 rounded"
          onClick={handleOpenSettings}
        >
          <Settings className="w-4 h-4 text-muted-foreground" />
        </Button>
      </div>
    </div>
  )
}
