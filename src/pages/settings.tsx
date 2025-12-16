import { useAppStore } from "@/store/useAppStore"
import { Button } from "@/components/ui/button"
import { Settings as SettingsIcon, Moon, Sun, Monitor, ArrowLeft, Menu } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import { usePlatform } from "@/hooks/usePlatform"

export default function SettingsPage() {
  const { theme, setTheme, toggleSidebar } = useAppStore()
  const navigate = useNavigate()
  const { isDesktop, isMobileView } = usePlatform()

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
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Theme Settings */}
          <section className="space-y-4">
            <h2 className="text-base sm:text-lg font-semibold">外观设置</h2>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <span className="text-sm sm:text-base">主题</span>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("light")}
                    className="flex-1 sm:flex-none"
                  >
                    <Sun className="w-4 h-4 mr-2" />
                    浅色
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("dark")}
                    className="flex-1 sm:flex-none"
                  >
                    <Moon className="w-4 h-4 mr-2" />
                    深色
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("system")}
                    className="flex-1 sm:flex-none"
                  >
                    <Monitor className="w-4 h-4 mr-2" />
                    跟随系统
                  </Button>
                </div>
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
              <p>Next Chat Box v1.0.0</p>
              <p>基于 Tauri + React + TypeScript 构建的跨平台聊天应用</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
