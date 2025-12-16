import { useAppStore } from "@/store/useAppStore"
import { Button } from "@/components/ui/button"
import { Plus, MessageSquare, Trash2, X } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import { cn } from "@/lib/utils"

interface SidebarProps {
  className?: string
  onClose?: () => void
  showCloseButton?: boolean
}

export function Sidebar({ className, onClose, showCloseButton = false }: SidebarProps) {
  const { chats, currentChatId, createChat, setCurrentChat, deleteChat } = useAppStore()
  const navigate = useNavigate()

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

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold">对话列表</h2>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={handleCreateChat}>
            <Plus className="w-4 h-4" />
          </Button>
          {showCloseButton && (
            <Button size="sm" variant="ghost" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-2">
        {chats.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">暂无对话</p>
          </div>
        ) : (
          <div className="space-y-1">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleSelectChat(chat.id)}
                className={cn(
                  "group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors",
                  currentChatId === chat.id
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted"
                )}
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{chat.title}</h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {chat.messages.length} 条消息
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => handleDeleteChat(e, chat.id)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
