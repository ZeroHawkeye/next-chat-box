import { useAppStore } from "@/store/useAppStore"
import { useThemeStore, themeColors, type ThemeMode, type ThemeColor } from "@/store/useThemeStore"
import { Button } from "@/components/ui/button"
import { Settings as SettingsIcon, Moon, Sun, Monitor, ArrowLeft, Menu, Check } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import { usePlatform } from "@/hooks/usePlatform"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
  const { toggleSidebar } = useAppStore()
  const { mode, color, setMode, setColor } = useThemeStore()
  const navigate = useNavigate()
  const { isDesktop, isMobileView } = usePlatform()

  const themeModes: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "浅色", icon: <Sun className="w-4 h-4" /> },
    { value: "dark", label: "深色", icon: <Moon className="w-4 h-4" /> },
    { value: "system", label: "跟随系统", icon: <Monitor className="w-4 h-4" /> },
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
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="border-b border-border px-4 py-3 sm:px-6 sm:py-4">
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
          <SettingsIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          <h1 className="text-lg sm:text-2xl font-bold">设置</h1>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Theme Settings */}
          <section className="space-y-6">
            <h2 className="text-base sm:text-lg font-semibold">外观设置</h2>
            
            {/* 主题模式 */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-muted-foreground">主题模式</label>
              <div className="flex flex-wrap gap-2">
                {themeModes.map((themeMode) => (
                  <Button
                    key={themeMode.value}
                    variant={mode === themeMode.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMode(themeMode.value)}
                    className="flex-1 sm:flex-none"
                  >
                    {themeMode.icon}
                    <span className="ml-2">{themeMode.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* 主题配色 */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-muted-foreground">主题配色</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {themeColorOptions.map((themeColor) => (
                  <button
                    key={themeColor.value}
                    onClick={() => setColor(themeColor.value)}
                    className={cn(
                      "relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all",
                      color === themeColor.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: themeColor.color }}
                    >
                      {color === themeColor.value && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="text-xs">{themeColor.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Model Settings */}
          <section className="space-y-4">
            <h2 className="text-base sm:text-lg font-semibold">模型设置</h2>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-sm sm:text-base">默认模型</span>
                <select className="px-3 py-2 border border-input rounded-md bg-background text-sm sm:text-base w-full sm:w-auto">
                  <option>GPT-4</option>
                  <option>GPT-3.5</option>
                  <option>Claude</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-sm sm:text-base">温度</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  defaultValue="0.7"
                  className="w-full sm:w-32"
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-sm sm:text-base">最大令牌数</span>
                <input
                  type="number"
                  defaultValue="2048"
                  className="px-3 py-2 border border-input rounded-md w-full sm:w-24 text-sm sm:text-base bg-background"
                />
              </div>
            </div>
          </section>

          {/* Data Management */}
          <section className="space-y-4">
            <h2 className="text-base sm:text-lg font-semibold">数据管理</h2>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-sm sm:text-base">导出对话历史</span>
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  导出
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-sm sm:text-base">清除所有数据</span>
                <Button variant="destructive" size="sm" className="w-full sm:w-auto">
                  清除
                </Button>
              </div>
            </div>
          </section>

          {/* About */}
          <section className="space-y-4">
            <h2 className="text-base sm:text-lg font-semibold">关于</h2>
            <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <p>Next AI v0.1.0</p>
              <p>基于 Tauri + React + TypeScript 构建的跨平台 AI 聊天应用</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
