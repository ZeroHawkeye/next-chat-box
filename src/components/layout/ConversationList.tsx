import { useAppStore } from "@/store/useAppStore"
import { Button } from "@/components/ui/button"
import { SearchInput } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Plus, MessageSquare, Trash2, Pin, MoreHorizontal, ExternalLink } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import type { App } from "@/types"

interface ConversationListProps {
  className?: string
  style?: React.CSSProperties
}

// 时间格式化
function formatTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return "刚刚"
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`

  const date = new Date(timestamp)
  return `${date.getMonth() + 1}/${date.getDate()}`
}

export function ConversationList({ className, style }: ConversationListProps) {
  const {
    apps,
    currentAppId,
    conversations,
    currentConversationId,
    createConversation,
    deleteConversation,
    openTab,
    getOpenTabs,
  } = useAppStore()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")

  // 获取当前应用
  const currentApp = apps.find((app) => app.id === currentAppId)

  // 获取已打开的Tab
  const openTabs = getOpenTabs()
  const openConversationIds = new Set(openTabs.map((t) => t.conversationId))

  // 过滤当前应用的对话
  const appConversations = conversations.filter(
    (conv) => conv.appId === currentAppId
  )

  // 搜索过滤
  const filteredConversations = appConversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // 按置顶和时间排序
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return b.updatedAt - a.updatedAt
  })

  const handleNewConversation = () => {
    if (!currentAppId) return
    const conversationId = createConversation(currentAppId)
    openTab(conversationId)
    navigate({ to: "/chat" })
  }

  const handleSelectConversation = (conversationId: string) => {
    openTab(conversationId)
    navigate({ to: "/chat" })
  }

  const handleDeleteConversation = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation()
    deleteConversation(conversationId)
  }

  return (
    <div className={cn("flex flex-col h-full bg-sidebar", className)} style={style}>
      {/* 当前应用信息 */}
      {currentApp && (
        <div className="flex-shrink-0 px-3 pt-3 pb-2">
          <div className="flex items-center gap-2 px-1">
            <CurrentAppIcon app={currentApp} />
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-medium truncate">{currentApp.name}</h2>
              <p className="text-[11px] text-muted-foreground truncate">
                {appConversations.length} 个对话
              </p>
            </div>
            <Button
              size="icon-sm"
              variant="ghost"
              className="h-7 w-7 rounded-lg flex-shrink-0"
              onClick={handleNewConversation}
              title="新建对话"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* 搜索框 */}
      <div className="flex-shrink-0 px-3 pb-2">
        <SearchInput
          placeholder="搜索对话..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery("")}
          inputSize="sm"
          className="h-8 text-[13px] rounded-lg"
        />
      </div>

      {/* 对话列表 */}
      <div className="flex-1 overflow-y-auto px-2 pb-2 scrollbar-apple">
        {!currentAppId ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <MessageSquare className="w-8 h-8 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">请先选择一个应用</p>
          </div>
        ) : sortedConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <MessageSquare className="w-8 h-8 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground mb-3">
              {searchQuery ? "未找到匹配的对话" : "暂无对话"}
            </p>
            {!searchQuery && (
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={handleNewConversation}
              >
                <Plus className="w-3.5 h-3.5" />
                新建对话
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-0.5">
            {sortedConversations.map((conv) => {
              const isOpen = openConversationIds.has(conv.id)
              const isActive = currentConversationId === conv.id

              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={cn(
                    "group flex items-start gap-2 px-2.5 py-2 rounded-lg cursor-pointer",
                    "transition-colors duration-100",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : isOpen
                        ? "bg-foreground/[0.03] text-foreground"
                        : "hover:bg-foreground/[0.04] active:bg-foreground/[0.06]"
                  )}
                >
                  <MessageSquare
                    className={cn(
                      "w-4 h-4 flex-shrink-0 mt-0.5",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      {conv.isPinned && (
                        <Pin className="w-3 h-3 text-primary flex-shrink-0" />
                      )}
                      {isOpen && !isActive && (
                        <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                      )}
                      <span
                        className={cn(
                          "text-[13px] truncate",
                          isActive && "font-medium"
                        )}
                      >
                        {conv.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-muted-foreground">
                        {conv.messageCount} 条消息
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {formatTime(conv.updatedAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      className="h-6 w-6 rounded"
                      onClick={(e) => handleDeleteConversation(e, conv.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      className="h-6 w-6 rounded"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// 当前应用图标组件
function CurrentAppIcon({ app }: { app: App }) {
  if (app.icon.type === "emoji") {
    return (
      <div
        className="w-9 h-9 flex items-center justify-center rounded-xl text-lg"
        style={{ backgroundColor: app.icon.bgColor || "#3b82f6" }}
      >
        <span className="select-none">{app.icon.value}</span>
      </div>
    )
  }

  return (
    <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-primary/10 text-lg">
      <span className="select-none">🤖</span>
    </div>
  )
}
