import { useAppStore } from "@/store/useAppStore"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  MessageSquare, 
  Plus, 
  Settings, 
  Sparkles, 
  Zap, 
  Shield, 
  Globe,
  ArrowRight,
  Bot
} from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import { usePlatform } from "@/hooks/usePlatform"
import { cn } from "@/lib/utils"

export default function HomePage() {
  const { createChat, setCurrentChat, chats } = useAppStore()
  const navigate = useNavigate()
  const { isMobileView } = usePlatform()

  const handleCreateChat = () => {
    const chatId = createChat()
    setCurrentChat(chatId)
    navigate({ to: "/chat" })
  }

  // 功能特性
  const features = [
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "智能对话",
      description: "先进的 AI 模型，自然流畅的对话体验",
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "极速响应",
      description: "优化的推理速度，即时获得回复",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "隐私安全",
      description: "本地优先，数据安全有保障",
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "跨平台",
      description: "桌面、网页、移动端无缝体验",
    },
  ]

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* 渐变背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-primary/5 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 px-4 py-3 sm:px-6 sm:py-4 glass-subtle">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/25">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold">Next Chat Box</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">AI 智能助手</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate({ to: "/settings" })}
            className="rounded-xl"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 scrollbar-thin">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Hero Section */}
          <section className="text-center space-y-6 py-8 sm:py-12">
            {/* 动态图标 */}
            <div className="relative inline-flex">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-primary flex items-center justify-center shadow-2xl shadow-primary/30 animate-float">
                <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
              {/* 装饰光点 */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-bounce-subtle" />
              <div className="absolute -bottom-1 -left-3 w-3 h-3 bg-pink-400 rounded-full animate-bounce-subtle" style={{ animationDelay: "0.5s" }} />
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-4xl font-bold">
                欢迎使用{" "}
                <span className="text-gradient">Next Chat Box</span>
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
                下一代 AI 对话助手，让智能触手可及
              </p>
            </div>

            {/* CTA 按钮 */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Button 
                onClick={handleCreateChat} 
                size="lg" 
                variant="gradient"
                className="w-full sm:w-auto min-w-[200px] group"
              >
                <Plus className="w-5 h-5" />
                开始新对话
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
              
              {chats.length > 0 && (
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setCurrentChat(chats[0].id)
                    navigate({ to: "/chat" })
                  }}
                  className="w-full sm:w-auto"
                >
                  继续上次对话
                </Button>
              )}
            </div>
          </section>

          {/* 最近对话 */}
          {chats.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  最近对话
                </h3>
                <span className="text-xs text-muted-foreground bg-secondary/80 px-2 py-1 rounded-full">
                  {chats.length} 个对话
                </span>
              </div>
              
              <div className="grid gap-3">
                {chats.slice(0, 3).map((chat, index) => (
                  <Card
                    key={chat.id}
                    variant="interactive"
                    padding="none"
                    className={cn(
                      "group animate-in fade-in slide-in-from-bottom",
                    )}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => {
                      setCurrentChat(chat.id)
                      navigate({ to: "/chat" })
                    }}
                  >
                    <div className="flex items-center gap-4 p-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate group-hover:text-primary transition-colors">
                          {chat.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {chat.messages.length} 条消息
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* 功能特性 */}
          <section className="space-y-4 pb-8">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider text-center">
              核心功能
            </h3>
            
            <div className={cn(
              "grid gap-4",
              isMobileView ? "grid-cols-2" : "grid-cols-4"
            )}>
              {features.map((feature, index) => (
                <Card
                  key={feature.title}
                  variant="bento"
                  padding="sm"
                  className={cn(
                    "text-center group animate-in fade-in scale-in",
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="space-y-3">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{feature.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
