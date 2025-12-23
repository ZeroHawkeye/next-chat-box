import { useThemeStore, themeColors, ZOOM_MIN, ZOOM_MAX, ZOOM_DEFAULT, type ThemeMode, type ThemeColor } from "@/store/useThemeStore"
import { Button } from "@/components/ui/button"
import { 
  Moon, 
  Sun, 
  Monitor, 
  ArrowLeft, 
  Check,
  Download,
  Trash2
} from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import { usePlatform } from "@/hooks/usePlatform"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
  const { mode, color, zoom, setMode, setColor, setZoom } = useThemeStore()
  const navigate = useNavigate()
  const { isMobileView } = usePlatform()

  const themeModes: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "浅色", icon: <Sun className="w-3.5 h-3.5" /> },
    { value: "dark", label: "深色", icon: <Moon className="w-3.5 h-3.5" /> },
    { value: "system", label: "系统", icon: <Monitor className="w-3.5 h-3.5" /> },
  ]

  const themeColorOptions: { value: ThemeColor; label: string; color: string }[] = [
    { value: "default", label: "蓝色", color: themeColors.default.primary },
    { value: "purple", label: "紫色", color: themeColors.purple.primary },
    { value: "green", label: "绿色", color: themeColors.green.primary },
    { value: "orange", label: "橙色", color: themeColors.orange.primary },
    { value: "rose", label: "粉色", color: themeColors.rose.primary },
    { value: "slate", label: "灰色", color: themeColors.slate.primary },
  ]

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <header className="flex-shrink-0 h-10 border-b border-border/50 flex items-center gap-2 px-3">
        {isMobileView && (
          <Button 
            variant="ghost" 
            size="icon-sm" 
            onClick={() => navigate({ to: "/" })}
            className="h-6 w-6 rounded -ml-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </Button>
        )}
        <span className="text-[13px] font-medium">设置</span>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-apple">
        <div className="max-w-md mx-auto px-4 py-4 space-y-6">
          
          {/* 外观 */}
          <section>
            <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2 px-1">
              外观
            </div>
            
            <div className="border border-border/50 rounded-lg overflow-hidden">
              {/* 主题模式 */}
              <div className="px-3 py-2.5 border-b border-border/50">
                <div className="text-[12px] text-muted-foreground mb-2">主题</div>
                <div className="flex gap-1">
                  {themeModes.map((themeMode) => (
                    <button
                      key={themeMode.value}
                      onClick={() => setMode(themeMode.value)}
                      className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[12px]",
                        "transition-colors duration-100",
                        mode === themeMode.value
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-foreground/[0.04] text-muted-foreground"
                      )}
                    >
                      {themeMode.icon}
                      {themeMode.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 强调色 */}
              <div className="px-3 py-2.5 border-b border-border/50">
                <div className="text-[12px] text-muted-foreground mb-2">强调色</div>
                <div className="flex gap-2">
                  {themeColorOptions.map((themeColor) => (
                    <button
                      key={themeColor.value}
                      onClick={() => setColor(themeColor.value)}
                      className={cn(
                        "relative w-6 h-6 rounded-full",
                        "transition-transform duration-100",
                        "hover:scale-110",
                        color === themeColor.value && "ring-2 ring-offset-2 ring-offset-background"
                      )}
                      style={{ 
                        backgroundColor: themeColor.color
                      }}
                      title={themeColor.label}
                    >
                      {color === themeColor.value && (
                        <Check className="w-3 h-3 text-white absolute inset-0 m-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* 界面缩放 */}
              <div className="px-3 py-2.5">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[12px] text-muted-foreground">界面缩放</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] font-medium tabular-nums min-w-[36px] text-right">
                      {zoom}%
                    </span>
                    {zoom !== ZOOM_DEFAULT && (
                      <button
                        onClick={() => setZoom(ZOOM_DEFAULT)}
                        className="text-[11px] text-primary hover:text-primary/80 transition-colors"
                      >
                        重置
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-muted-foreground/60 w-7">{ZOOM_MIN}%</span>
                  <div className="flex-1 relative">
                    <input
                      type="range"
                      min={ZOOM_MIN}
                      max={ZOOM_MAX}
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className={cn(
                        "w-full h-1 rounded-full appearance-none cursor-pointer",
                        "bg-foreground/10",
                        "[&::-webkit-slider-thumb]:appearance-none",
                        "[&::-webkit-slider-thumb]:w-3.5",
                        "[&::-webkit-slider-thumb]:h-3.5",
                        "[&::-webkit-slider-thumb]:rounded-full",
                        "[&::-webkit-slider-thumb]:bg-primary",
                        "[&::-webkit-slider-thumb]:shadow-sm",
                        "[&::-webkit-slider-thumb]:border-2",
                        "[&::-webkit-slider-thumb]:border-background",
                        "[&::-webkit-slider-thumb]:transition-transform",
                        "[&::-webkit-slider-thumb]:duration-100",
                        "[&::-webkit-slider-thumb]:hover:scale-110",
                        "[&::-webkit-slider-thumb]:active:scale-95",
                        "[&::-moz-range-thumb]:w-3.5",
                        "[&::-moz-range-thumb]:h-3.5",
                        "[&::-moz-range-thumb]:rounded-full",
                        "[&::-moz-range-thumb]:bg-primary",
                        "[&::-moz-range-thumb]:border-2",
                        "[&::-moz-range-thumb]:border-background",
                        "[&::-moz-range-thumb]:cursor-pointer"
                      )}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground/60 w-8">{ZOOM_MAX}%</span>
                </div>
              </div>
            </div>
          </section>

          {/* 数据 */}
          <section>
            <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2 px-1">
              数据
            </div>
            
            <div className="border border-border/50 rounded-lg overflow-hidden">
              <button
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-foreground/[0.03] transition-colors duration-100"
              >
                <Download className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[13px]">导出对话</span>
              </button>
              
              <button
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left border-t border-border/50 hover:bg-foreground/[0.03] transition-colors duration-100 text-red-500"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="text-[13px]">清除数据</span>
              </button>
            </div>
          </section>

          {/* 关于 */}
          <section>
            <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2 px-1">
              关于
            </div>
            
            <div className="border border-border/50 rounded-lg px-3 py-2.5">
              <div className="text-[13px] font-medium">Next Chat Box</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                v0.1.0 · Tauri + React
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
