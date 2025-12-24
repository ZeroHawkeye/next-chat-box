import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input, Textarea } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  X,
  Bot,
  Sparkles,
  Wrench,
  Database,
  ChevronRight,
  Save,
  Trash2,
} from "lucide-react"
import type { Assistant, AssistantIcon } from "@/types"

interface AssistantEditDialogProps {
  assistant?: Assistant | null
  open: boolean
  onClose: () => void
  onSave: (data: Partial<Assistant>) => void
  onDelete?: () => void
}

// 预设的 Emoji 图标
const presetEmojis = [
  "🤖", "💬", "✨", "🎯", "📝", "💡", "🔍", "📊",
  "🎨", "🎵", "📸", "🎮", "📚", "🔧", "🚀", "💻",
  "👨‍💻", "👩‍💼", "🧑‍🏫", "👨‍⚕️", "✍️", "🌐", "📧", "📱",
]

// 预设的背景颜色
const presetColors = [
  "#3b82f6", "#8b5cf6", "#10b981", "#f97316", "#ef4444",
  "#ec4899", "#06b6d4", "#84cc16", "#f59e0b", "#6366f1",
]

// 图标选择器
function IconPicker({
  value,
  onChange,
}: {
  value: AssistantIcon
  onChange: (icon: AssistantIcon) => void
}) {
  const [showPicker, setShowPicker] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/50 transition-colors"
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{ backgroundColor: value.bgColor || "#3b82f6" }}
        >
          {value.value}
        </div>
        <div className="text-left">
          <p className="text-sm font-medium">助手图标</p>
          <p className="text-xs text-muted-foreground">点击更换</p>
        </div>
      </button>

      {showPicker && (
        <Card className="absolute top-full left-0 mt-2 p-4 z-50 w-72 shadow-lg">
          <div className="space-y-4">
            {/* Emoji 选择 */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">选择图标</p>
              <div className="grid grid-cols-8 gap-1">
                {presetEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => onChange({ ...value, value: emoji })}
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center text-lg",
                      "hover:bg-muted transition-colors",
                      value.value === emoji && "bg-primary/10 ring-2 ring-primary"
                    )}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* 颜色选择 */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">背景颜色</p>
              <div className="flex flex-wrap gap-2">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => onChange({ ...value, bgColor: color })}
                    className={cn(
                      "w-7 h-7 rounded-full transition-transform",
                      "hover:scale-110",
                      value.bgColor === color && "ring-2 ring-offset-2 ring-primary"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => setShowPicker(false)}
            >
              完成
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

// 配置区块组件
function ConfigSection({
  icon: Icon,
  title,
  description,
  children,
  collapsible = false,
  defaultOpen = true,
}: {
  icon: React.ElementType
  title: string
  description?: string
  children: React.ReactNode
  collapsible?: boolean
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => collapsible && setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center gap-3 p-4",
          collapsible && "hover:bg-muted/50 cursor-pointer"
        )}
      >
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 text-left">
          <h3 className="text-sm font-medium">{title}</h3>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {collapsible && (
          <ChevronRight
            className={cn(
              "w-5 h-5 text-muted-foreground transition-transform",
              isOpen && "rotate-90"
            )}
          />
        )}
      </button>
      {(!collapsible || isOpen) && (
        <div className="px-4 pb-4 pt-0">{children}</div>
      )}
    </div>
  )
}

export function AssistantEditDialog({
  assistant,
  open,
  onClose,
  onSave,
  onDelete,
}: AssistantEditDialogProps) {
  const isNew = !assistant
  const [formData, setFormData] = useState<Partial<Assistant>>({
    name: assistant?.name || "",
    description: assistant?.description || "",
    icon: assistant?.icon || { type: "emoji", value: "🤖", bgColor: "#3b82f6" },
    systemPrompt: assistant?.systemPrompt || "",
    welcomeMessage: assistant?.welcomeMessage || "",
  })

  if (!open) return null

  const handleSave = () => {
    onSave(formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-2xl max-h-[90vh] mx-4 bg-background rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold">
            {isNew ? "创建助手" : "编辑助手"}
          </h2>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-apple">
          {/* 基本信息 */}
          <ConfigSection icon={Bot} title="基本信息" description="设置助手名称和图标">
            <div className="space-y-4">
              <IconPicker
                value={formData.icon as AssistantIcon}
                onChange={(icon) => setFormData({ ...formData, icon })}
              />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">助手名称</label>
                  <Input
                    placeholder="例如：代码助手"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">助手描述</label>
                  <Input
                    placeholder="简短描述助手功能"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </ConfigSection>

          {/* System Prompt */}
          <ConfigSection
            icon={Sparkles}
            title="系统提示词"
            description="定义 AI 的角色和行为"
          >
            <div className="space-y-1.5">
              <Textarea
                placeholder="你是一个专业的 AI 助手..."
                value={formData.systemPrompt}
                onChange={(e) =>
                  setFormData({ ...formData, systemPrompt: e.target.value })
                }
                className="min-h-[120px] resize-none"
              />
              <p className="text-xs text-muted-foreground">
                提示：详细描述 AI 的角色、专长、回复风格等
              </p>
            </div>
          </ConfigSection>

          {/* 欢迎语 */}
          <ConfigSection
            icon={Sparkles}
            title="欢迎语"
            description="用户开始对话时显示的消息"
            collapsible
            defaultOpen={false}
          >
            <Textarea
              placeholder="你好！我可以帮你..."
              value={formData.welcomeMessage}
              onChange={(e) =>
                setFormData({ ...formData, welcomeMessage: e.target.value })
              }
              className="min-h-[80px] resize-none"
            />
          </ConfigSection>

          {/* MCP 工具 */}
          <ConfigSection
            icon={Wrench}
            title="MCP 工具"
            description="配置助手可使用的工具能力"
            collapsible
            defaultOpen={false}
          >
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Wrench className="w-10 h-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground mb-2">暂无可用工具</p>
              <Button variant="outline" size="sm">
                配置 MCP 服务器
              </Button>
            </div>
          </ConfigSection>

          {/* 知识库 */}
          <ConfigSection
            icon={Database}
            title="知识库"
            description="关联知识库以增强回答能力"
            collapsible
            defaultOpen={false}
          >
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Database className="w-10 h-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground mb-2">暂无知识库</p>
              <Button variant="outline" size="sm">
                添加知识库
              </Button>
            </div>
          </ConfigSection>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-t border-border bg-muted/30">
          <div>
            {!isNew && onDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={onDelete}
              >
                <Trash2 className="w-4 h-4 mr-1.5" />
                删除助手
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              取消
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-1.5" />
              {isNew ? "创建" : "保存"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
