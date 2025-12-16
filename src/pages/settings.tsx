import { useThemeStore, themeColors, type ThemeMode, type ThemeColor } from "@/store/useThemeStore"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Moon, 
  Sun, 
  Monitor, 
  ArrowLeft, 
  Check,
  Palette,
  Bot,
  Database,
  Download,
  Trash2,
  Info,
  ChevronRight,
  Sparkles,
  Gauge
} from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import { usePlatform } from "@/hooks/usePlatform"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
  const { mode, color, setMode, setColor } = useThemeStore()
  const navigate = useNavigate()
  const { isMobileView } = usePlatform()

  const themeModes: { value: ThemeMode; label: string; icon: React.ReactNode; description: string }[] = [
    { value: "light", label: "浅色", icon: <Sun className="w-5 h-5" />, description: "明亮清新" },
    { value: "dark", label: "深色", icon: <Moon className="w-5 h-5" />, description: "护眼舒适" },
    { value: "system", label: "跟随系统", icon: <Monitor className="w-5 h-5" />, description: "自动切换" },
  ]

  const themeColorOptions: { value: ThemeColor; label: string; color: string }[] = [
    { value: "default", label: "默认蓝", color: themeColors.default.primary },
    { value: "purple", label: "活力紫", color: themeColors.purple.primary },
    { value: "green", label: "清新绿", color: themeColors.green.primary },
    { value: "orange", label: "活力橙", color: themeColors.orange.primary },
    { value: "rose", label: "浪漫玫瑰", color: themeColors.rose.primary },
    { value: "slate", label: "商务灰", color: themeColors.slate.primary },
  ]

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background to-background/95">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-border/50 px-4 py-3 sm:px-6 glass-subtle z-10">
        <div className="flex items-center gap-3 max-w-3xl mx-auto">
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
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-semibold">设置</h1>
              <p className="text-xs text-muted-foreground">个性化你的体验</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="max-w-3xl mx-auto px-4 py-6 sm:px-6 sm:py-8 space-y-6">
          
          {/* 外观设置 */}
          <Card variant="default" padding="none" className="overflow-hidden">
            <CardHeader className="p-5 pb-4 border-b border-border/50 bg-secondary/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base">外观设置</CardTitle>
                  <CardDescription>自定义应用的视觉风格</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-5 space-y-6">
              {/* 主题模式 */}
              <div className="space-y-3">
                <label className="text-sm font-medium">主题模式</label>
                <div className="grid grid-cols-3 gap-3">
                  {themeModes.map((themeMode) => (
                    <button
                      key={themeMode.value}
                      onClick={() => setMode(themeMode.value)}
                      className={cn(
                        "relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                        "hover:border-primary/50 hover:bg-primary/5",
                        mode === themeMode.value
                          ? "border-primary bg-primary/10"
                          : "border-border/50 bg-secondary/30"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                        mode === themeMode.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      )}>
                        {themeMode.icon}
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-medium block">{themeMode.label}</span>
                        <span className="text-xs text-muted-foreground">{themeMode.description}</span>
                      </div>
                      {mode === themeMode.value && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* 主题配色 */}
              <div className="space-y-3">
                <label className="text-sm font-medium">主题配色</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {themeColorOptions.map((themeColor) => (
                    <button
                      key={themeColor.value}
                      onClick={() => setColor(themeColor.value)}
                      className={cn(
                        "group relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200",
                        "hover:scale-105",
                        color === themeColor.value
                          ? "border-primary shadow-lg"
                          : "border-transparent hover:border-border"
                      )}
                    >
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-transform",
                          "shadow-lg group-hover:scale-110",
                        )}
                        style={{ 
                          backgroundColor: themeColor.color,
                          boxShadow: `0 8px 20px ${themeColor.color}40`
                        }}
                      >
                        {color === themeColor.value && (
                          <Check className="w-5 h-5 text-white drop-shadow-md" />
                        )}
                      </div>
                      <span className="text-xs font-medium">{themeColor.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 模型设置 */}
          <Card variant="default" padding="none" className="overflow-hidden">
            <CardHeader className="p-5 pb-4 border-b border-border/50 bg-secondary/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base">模型设置</CardTitle>
                  <CardDescription>配置 AI 模型参数</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              {/* 默认模型 */}
              <div className="flex items-center justify-between p-4 border-b border-border/30 hover:bg-secondary/20 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <span className="text-sm font-medium">默认模型</span>
                    <p className="text-xs text-muted-foreground">选择 AI 对话模型</p>
                  </div>
                </div>
                <select className="px-3 py-2 rounded-xl bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 cursor-pointer">
                  <option>GPT-4</option>
                  <option>GPT-3.5</option>
                  <option>Claude</option>
                </select>
              </div>

              {/* 温度 */}
              <div className="flex items-center justify-between p-4 border-b border-border/30 hover:bg-secondary/20 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                    <Gauge className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <span className="text-sm font-medium">创造性温度</span>
                    <p className="text-xs text-muted-foreground">值越高回复越有创意</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    defaultValue="0.7"
                    className="w-24 sm:w-32 accent-primary cursor-pointer"
                  />
                  <span className="text-sm text-muted-foreground w-8">0.7</span>
                </div>
              </div>

              {/* 最大令牌 */}
              <div className="flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                    <Database className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <span className="text-sm font-medium">最大令牌数</span>
                    <p className="text-xs text-muted-foreground">单次回复的最大长度</p>
                  </div>
                </div>
                <Input
                  type="number"
                  defaultValue="2048"
                  className="w-24 text-center"
                  inputSize="sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* 数据管理 */}
          <Card variant="default" padding="none" className="overflow-hidden">
            <CardHeader className="p-5 pb-4 border-b border-border/50 bg-secondary/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base">数据管理</CardTitle>
                  <CardDescription>管理你的对话数据</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              {/* 导出数据 */}
              <button className="w-full flex items-center justify-between p-4 border-b border-border/30 hover:bg-secondary/20 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-medium">导出对话历史</span>
                    <p className="text-xs text-muted-foreground">下载所有对话数据</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </button>

              {/* 清除数据 */}
              <button className="w-full flex items-center justify-between p-4 hover:bg-destructive/5 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-destructive/10 transition-colors">
                    <Trash2 className="w-4 h-4 text-muted-foreground group-hover:text-destructive transition-colors" />
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-medium group-hover:text-destructive transition-colors">清除所有数据</span>
                    <p className="text-xs text-muted-foreground">删除所有对话和设置</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-destructive transition-all" />
              </button>
            </CardContent>
          </Card>

          {/* 关于 */}
          <Card variant="gradient-fill" padding="default">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/25 flex-shrink-0">
                <Info className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Next Chat Box</h3>
                <p className="text-sm text-muted-foreground">
                  版本 0.1.0
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  基于 Tauri + React + TypeScript 构建的跨平台 AI 聊天应用。
                  采用 2025 年最新设计趋势，提供极致的用户体验。
                </p>
                <div className="flex items-center gap-2 pt-2">
                  <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                    Tauri v2
                  </span>
                  <span className="px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium">
                    React 19
                  </span>
                  <span className="px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium">
                    TypeScript
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* 底部留白 */}
          <div className="h-6" />
        </div>
      </div>
    </div>
  )
}
