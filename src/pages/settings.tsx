import { useState, useEffect, useCallback, useRef } from "react"
import { useThemeStore, themeColors, ZOOM_MIN, ZOOM_MAX, ZOOM_DEFAULT, type ThemeMode, type ThemeColor } from "@/store/useThemeStore"
import { useAssistantStore } from "@/store/useAssistantStore"
import { useShortcutStore } from "@/store/useShortcutStore"
import { Button } from "@/components/ui/button"
import {
  Moon,
  Sun,
  Monitor,
  ArrowLeft,
  Check,
  Download,
  Trash2,
  LayoutGrid,
  Palette,
  Keyboard,
  Database,
  Info,
  RotateCcw,
} from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import { usePlatform } from "@/hooks/usePlatform"
import { cn } from "@/lib/utils"
import { configStorage } from "@/lib/config"
import type { ShortcutConfig, ShortcutAction } from "@/types"

// ============================================================================
// 设置菜单项类型
// ============================================================================

type SettingsSection = "appearance" | "shortcuts" | "data" | "about"

interface SettingsMenuItem {
  id: SettingsSection
  label: string
  icon: React.ReactNode
}

const settingsMenuItems: SettingsMenuItem[] = [
  { id: "appearance", label: "外观", icon: <Palette className="w-4 h-4" /> },
  { id: "shortcuts", label: "快捷键", icon: <Keyboard className="w-4 h-4" /> },
  { id: "data", label: "数据", icon: <Database className="w-4 h-4" /> },
  { id: "about", label: "关于", icon: <Info className="w-4 h-4" /> },
]

// ============================================================================
// 开关组件
// ============================================================================

function Switch({ 
  checked, 
  onChange,
  disabled = false,
}: { 
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full",
        "transition-colors duration-200",
        checked ? "bg-primary" : "bg-foreground/20",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <span
        className={cn(
          "block h-4 w-4 rounded-full bg-white shadow-sm",
          "transition-transform duration-200",
          checked ? "translate-x-[18px]" : "translate-x-[2px]"
        )}
      />
    </button>
  )
}

// ============================================================================
// 快捷键录制组件
// ============================================================================

interface ShortcutRecorderProps {
  shortcut: ShortcutConfig
  onUpdate: (action: ShortcutAction, keys: string[]) => Promise<void>
  onReset: (action: ShortcutAction) => Promise<void>
  existingShortcuts: ShortcutConfig[]
}

function ShortcutRecorder({ shortcut, onUpdate, onReset, existingShortcuts }: ShortcutRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordedKeys, setRecordedKeys] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLButtonElement>(null)

  // 格式化按键显示
  const formatKeys = useShortcutStore((state) => state.formatShortcut)

  // 检查快捷键冲突
  const checkConflict = useCallback((keys: string[]): ShortcutConfig | null => {
    const normalizedKeys = [...keys].sort().join("+")
    return existingShortcuts.find((s) => {
      if (s.action === shortcut.action) return false
      const otherKeys = [...s.keys].sort().join("+")
      return otherKeys === normalizedKeys && s.enabled
    }) || null
  }, [existingShortcuts, shortcut.action])

  // 处理按键事件
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isRecording) return
    
    e.preventDefault()
    e.stopPropagation()

    const keys: string[] = []
    
    // 修饰键
    if (e.ctrlKey || e.metaKey) keys.push("Ctrl")
    if (e.altKey) keys.push("Alt")
    if (e.shiftKey) keys.push("Shift")
    
    // 主键
    const key = e.key
    if (key === "Escape") {
      setIsRecording(false)
      setRecordedKeys([])
      setError(null)
      return
    }

    // 忽略单独的修饰键
    if (["Control", "Alt", "Shift", "Meta"].includes(key)) {
      setRecordedKeys(keys)
      return
    }

    // 格式化主键
    let mainKey = key
    if (key === " ") mainKey = "Space"
    else if (key.length === 1) mainKey = key.toUpperCase()
    else if (key === "ArrowUp") mainKey = "ArrowUp"
    else if (key === "ArrowDown") mainKey = "ArrowDown"
    else if (key === "ArrowLeft") mainKey = "ArrowLeft"
    else if (key === "ArrowRight") mainKey = "ArrowRight"

    keys.push(mainKey)
    setRecordedKeys(keys)

    // 检查冲突
    const conflict = checkConflict(keys)
    if (conflict) {
      setError(`与 "${conflict.label}" 冲突`)
      return
    }

    // 保存快捷键
    setError(null)
    onUpdate(shortcut.action, keys)
    setIsRecording(false)
    setRecordedKeys([])
  }, [isRecording, checkConflict, onUpdate, shortcut.action])

  // 处理按键释放
  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (!isRecording) return
    
    // 如果只剩修饰键，更新显示
    const keys: string[] = []
    if (e.ctrlKey || e.metaKey) keys.push("Ctrl")
    if (e.altKey) keys.push("Alt")
    if (e.shiftKey) keys.push("Shift")
    
    if (keys.length > 0 && recordedKeys.length > keys.length) {
      setRecordedKeys(keys)
    }
  }, [isRecording, recordedKeys])

  // 绑定事件
  useEffect(() => {
    if (isRecording) {
      window.addEventListener("keydown", handleKeyDown)
      window.addEventListener("keyup", handleKeyUp)
      return () => {
        window.removeEventListener("keydown", handleKeyDown)
        window.removeEventListener("keyup", handleKeyUp)
      }
    }
  }, [isRecording, handleKeyDown, handleKeyUp])

  // 点击外部取消录制
  useEffect(() => {
    if (isRecording) {
      const handleClickOutside = (e: MouseEvent) => {
        if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
          setIsRecording(false)
          setRecordedKeys([])
          setError(null)
        }
      }
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isRecording])

  const displayKeys = isRecording && recordedKeys.length > 0 
    ? formatKeys(recordedKeys) 
    : formatKeys(shortcut.keys)

  return (
    <div className="flex items-center gap-2">
      <button
        ref={inputRef}
        onClick={() => {
          if (shortcut.editable) {
            setIsRecording(true)
            setRecordedKeys([])
            setError(null)
          }
        }}
        disabled={!shortcut.editable}
        className={cn(
          "min-w-[120px] px-3 py-1.5 rounded-md text-[12px] font-mono",
          "border transition-all duration-150",
          isRecording
            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
            : "border-border bg-secondary/50 hover:bg-secondary",
          !shortcut.editable && "opacity-60 cursor-not-allowed",
          error && "border-destructive bg-destructive/5"
        )}
      >
        {isRecording ? (
          recordedKeys.length > 0 ? displayKeys : "按下快捷键..."
        ) : (
          displayKeys
        )}
      </button>
      
      {shortcut.editable && (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onReset(shortcut.action)}
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          title="重置为默认"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </Button>
      )}
      
      {error && (
        <span className="text-[11px] text-destructive">{error}</span>
      )}
    </div>
  )
}

// ============================================================================
// 外观设置
// ============================================================================

function AppearanceSettings() {
  const { mode, color, zoom, setMode, setColor, setZoom } = useThemeStore()
  const { showAssistantRail, setShowAssistantRail } = useAssistantStore()

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
    <div className="space-y-6">
      {/* 主题设置 */}
      <section>
        <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2 px-1">
          主题
        </div>
        
        <div className="border border-border/50 rounded-lg overflow-hidden">
          {/* 主题模式 */}
          <div className="px-3 py-2.5 border-b border-border/50">
            <div className="text-[12px] text-muted-foreground mb-2">外观模式</div>
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

      {/* 布局 */}
      <section>
        <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2 px-1">
          布局
        </div>
        
        <div className="border border-border/50 rounded-lg overflow-hidden">
          {/* 助手栏开关 */}
          <div className="flex items-center justify-between px-3 py-2.5">
            <div className="flex items-center gap-2.5">
              <LayoutGrid className="w-3.5 h-3.5 text-muted-foreground" />
              <div>
                <div className="text-[13px]">显示助手栏</div>
                <div className="text-[11px] text-muted-foreground">
                  左侧快速切换不同助手
                </div>
              </div>
            </div>
            <Switch checked={showAssistantRail} onChange={setShowAssistantRail} />
          </div>
        </div>
      </section>
    </div>
  )
}

// ============================================================================
// 快捷键设置
// ============================================================================

function ShortcutsSettings() {
  const { groups, shortcuts, loadShortcuts, updateShortcut, resetShortcut, resetAllShortcuts, isLoaded } = useShortcutStore()

  useEffect(() => {
    if (!isLoaded) {
      loadShortcuts()
    }
  }, [isLoaded, loadShortcuts])

  return (
    <div className="space-y-6">
      {/* 重置所有 */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[13px] font-medium">键盘快捷键</div>
          <div className="text-[11px] text-muted-foreground">
            点击快捷键可以重新录制，按 Esc 取消
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={resetAllShortcuts}
          className="h-7 text-[12px]"
        >
          <RotateCcw className="w-3 h-3 mr-1.5" />
          重置全部
        </Button>
      </div>

      {/* 快捷键分组 */}
      {groups.map((group) => (
        <section key={group.id}>
          <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2 px-1">
            {group.label}
          </div>
          
          <div className="border border-border/50 rounded-lg overflow-hidden divide-y divide-border/50">
            {group.shortcuts.map((shortcut) => (
              <div 
                key={shortcut.action}
                className="flex items-center justify-between px-3 py-2.5"
              >
                <div className="flex-1 min-w-0 mr-4">
                  <div className="text-[13px]">{shortcut.label}</div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {shortcut.description}
                    {!shortcut.editable && (
                      <span className="ml-1.5 text-muted-foreground/60">(不可修改)</span>
                    )}
                  </div>
                </div>
                <ShortcutRecorder
                  shortcut={shortcut}
                  onUpdate={updateShortcut}
                  onReset={resetShortcut}
                  existingShortcuts={shortcuts}
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

// ============================================================================
// 数据设置
// ============================================================================

function DataSettings() {
  const handleClearData = async () => {
    if (confirm("确定要清除所有数据吗？这将重置所有设置和对话记录。")) {
      await configStorage.delete()
      localStorage.clear()
      location.reload()
    }
  }

  return (
    <div className="space-y-6">
      <section>
        <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2 px-1">
          数据管理
        </div>
        
        <div className="border border-border/50 rounded-lg overflow-hidden">
          <button
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-foreground/[0.03] transition-colors duration-100"
          >
            <Download className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="text-[13px]">导出对话</div>
              <div className="text-[11px] text-muted-foreground">
                将所有对话导出为 JSON 文件
              </div>
            </div>
          </button>
          
          <button
            onClick={handleClearData}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left border-t border-border/50 hover:bg-destructive/5 transition-colors duration-100"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
            <div>
              <div className="text-[13px] text-destructive">清除所有数据</div>
              <div className="text-[11px] text-muted-foreground">
                删除所有设置和对话记录
              </div>
            </div>
          </button>
        </div>
      </section>
    </div>
  )
}

// ============================================================================
// 关于设置
// ============================================================================

function AboutSettings() {
  return (
    <div className="space-y-6">
      <section>
        <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2 px-1">
          应用信息
        </div>
        
        <div className="border border-border/50 rounded-lg px-3 py-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">💬</span>
            </div>
            <div>
              <div className="text-[15px] font-semibold">Next Chat Box</div>
              <div className="text-[12px] text-muted-foreground mt-0.5">
                v0.1.0
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-border/50 space-y-2">
            <div className="flex justify-between text-[12px]">
              <span className="text-muted-foreground">技术栈</span>
              <span>Tauri + React</span>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="text-muted-foreground">React</span>
              <span>19.x</span>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="text-muted-foreground">Tauri</span>
              <span>2.x</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// ============================================================================
// 主设置页面
// ============================================================================

export default function SettingsPage() {
  const navigate = useNavigate()
  const { isMobileView } = usePlatform()
  const [activeSection, setActiveSection] = useState<SettingsSection>("appearance")

  // 返回上一页
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      navigate({ to: "/" })
    }
  }

  // 渲染当前设置内容
  const renderSettingsContent = () => {
    switch (activeSection) {
      case "appearance":
        return <AppearanceSettings />
      case "shortcuts":
        return <ShortcutsSettings />
      case "data":
        return <DataSettings />
      case "about":
        return <AboutSettings />
      default:
        return <AppearanceSettings />
    }
  }

  return (
    <div className="flex flex-col h-full min-h-0 bg-background">
      {/* Header */}
      <header className="flex-shrink-0 h-10 border-b border-border/50 flex items-center gap-2 px-3">
        <Button 
          variant="ghost" 
          size="icon-sm" 
          onClick={handleBack}
          className="h-6 w-6 rounded -ml-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </Button>
        <span className="text-[13px] font-medium">设置</span>
      </header>

      {/* Content */}
      <div className="flex-1 min-h-0 flex">
        {/* 侧边菜单 - 非移动端显示 */}
        {!isMobileView && (
          <aside className="w-48 flex-shrink-0 border-r border-border/50 p-2">
            <nav className="space-y-0.5">
              {settingsMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left",
                    "text-[13px] transition-colors duration-100",
                    activeSection === item.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground"
                  )}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>
        )}

        {/* 移动端标签栏 */}
        {isMobileView && (
          <div className="absolute top-10 left-0 right-0 border-b border-border/50 bg-background z-10">
            <div className="flex overflow-x-auto scrollbar-none px-2 py-1.5 gap-1">
              {settingsMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] whitespace-nowrap",
                    "transition-colors duration-100",
                    activeSection === item.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-foreground/[0.04]"
                  )}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 设置内容区域 */}
        <div 
          className={cn(
            "flex-1 min-h-0 overflow-y-auto scrollbar-apple",
            isMobileView && "pt-12" // 为移动端标签栏留出空间
          )}
        >
          <div className="max-w-lg mx-auto px-4 py-4">
            {renderSettingsContent()}
          </div>
        </div>
      </div>
    </div>
  )
}
