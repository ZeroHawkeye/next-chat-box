import { useAppStore } from "@/store/useAppStore"
import { 
  Plus,
  Sparkles,
  Code2,
  FileText,
  Lightbulb,
  ArrowRight
} from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import { cn } from "@/lib/utils"
import Logo from "@/components/ui/Logo"

export default function HomePage() {
  const { createChat, setCurrentChat, chats } = useAppStore()
  const navigate = useNavigate()

  const handleCreateChat = () => {
    const chatId = createChat()
    setCurrentChat(chatId)
    navigate({ to: "/chat" })
  }

  const quickActions = [
    { icon: Code2, label: "写代码", desc: "帮我编写程序" },
    { icon: FileText, label: "写文案", desc: "帮我创作内容" },
    { icon: Lightbulb, label: "想点子", desc: "头脑风暴创意" },
    { icon: Sparkles, label: "随便聊", desc: "闲聊或问问题" },
  ]

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 flex items-center justify-center overflow-y-auto scrollbar-apple">
        <div className="w-full max-w-lg px-6 py-8">
          
          {/* Hero */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-5">
              <Logo size={56} />
            </div>
            <h1 className="text-xl font-semibold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              有什么可以帮你？
            </h1>
            <p className="text-[13px] text-muted-foreground">
              开始新对话，或选择一个快捷方式
            </p>
          </div>

          {/* 快捷操作 */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={handleCreateChat}
                className={cn(
                  "group flex items-start gap-3 p-3 rounded-xl text-left",
                  "bg-foreground/[0.02] hover:bg-foreground/[0.05]",
                  "border border-border/50 hover:border-border",
                  "transition-all duration-200"
                )}
              >
                <div className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
                  "bg-primary/10 text-primary",
                  "group-hover:bg-primary group-hover:text-primary-foreground",
                  "transition-colors duration-200"
                )}>
                  <action.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-[13px] font-medium truncate">{action.label}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{action.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* 新对话按钮 - 柔和风格 */}
          <button
            onClick={handleCreateChat}
            className={cn(
              "w-full flex items-center justify-center gap-2 h-10 rounded-xl",
              "text-[13px] font-medium",
              "border border-border/60 hover:border-primary/50",
              "bg-transparent hover:bg-primary/5",
              "text-muted-foreground hover:text-primary",
              "transition-all duration-200"
            )}
          >
            <Plus className="w-4 h-4" />
            开始新对话
          </button>

          {/* 最近对话 */}
          {chats.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  最近对话
                </span>
                {chats.length > 3 && (
                  <button 
                    className="text-[11px] text-primary hover:text-primary/80 transition-colors"
                    onClick={() => {/* 可以展开更多 */}}
                  >
                    查看全部
                  </button>
                )}
              </div>
              
              <div className="space-y-1">
                {chats.slice(0, 3).map((chat) => (
                  <button
                    key={chat.id}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg",
                      "text-left transition-colors duration-100",
                      "hover:bg-foreground/[0.04] active:bg-foreground/[0.06]",
                      "group"
                    )}
                    onClick={() => {
                      setCurrentChat(chat.id)
                      navigate({ to: "/chat" })
                    }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-foreground/[0.05] flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] truncate font-medium">{chat.title}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {chat.messages.length} 条消息 · {formatTime(chat.updatedAt)}
                      </p>
                    </div>
                    <ArrowRight className={cn(
                      "w-4 h-4 text-muted-foreground/40",
                      "opacity-0 group-hover:opacity-100",
                      "transition-opacity duration-100"
                    )} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function formatTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  
  if (diff < 60000) return "刚刚"
  if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`
  if (diff < 604800000) return `${Math.floor(diff / 86400000)} 天前`
  
  return new Date(timestamp).toLocaleDateString("zh-CN", { 
    month: "short", 
    day: "numeric" 
  })
}
