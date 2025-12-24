import { useAssistantStore } from "@/store/useAssistantStore"
import { Button } from "@/components/ui/button"
import { SearchInput } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Plus, Star, Pencil, Trash2, Bot, Code, FileText, Globe, Sparkles } from "lucide-react"
import { useState } from "react"
import type { Assistant } from "@/types"

// 助手图标显示组件
function AssistantIconDisplay({ assistant, size = "lg" }: { assistant: Assistant; size?: "sm" | "md" | "lg" | "xl" }) {
  const sizeClasses = {
    sm: "w-8 h-8 text-base",
    md: "w-10 h-10 text-lg",
    lg: "w-14 h-14 text-2xl",
    xl: "w-20 h-20 text-4xl",
  }

  if (assistant.icon.type === "emoji") {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-2xl shadow-sm",
          sizeClasses[size]
        )}
        style={{ backgroundColor: assistant.icon.bgColor || "#3b82f6" }}
      >
        <span className="select-none">{assistant.icon.value}</span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-2xl bg-primary/10 shadow-sm",
        sizeClasses[size]
      )}
    >
      <Bot className="w-1/2 h-1/2 text-primary" />
    </div>
  )
}

// 助手卡片组件
function AssistantCard({ 
  assistant, 
  onSelect, 
  onEdit, 
  onDelete,
  onTogglePinned 
}: { 
  assistant: Assistant
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
  onTogglePinned: () => void
}) {
  return (
    <Card
      className={cn(
        "group relative p-4 cursor-pointer transition-all duration-200",
        "hover:shadow-md hover:border-primary/20",
        "active:scale-[0.98]"
      )}
      onClick={onSelect}
    >
      {/* 操作按钮 */}
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon-sm"
          className="h-7 w-7"
          onClick={(e) => {
            e.stopPropagation()
            onTogglePinned()
          }}
          title={assistant.isPinned ? "取消收藏" : "收藏"}
        >
          <Star className={cn("w-3.5 h-3.5", assistant.isPinned && "fill-yellow-400 text-yellow-400")} />
        </Button>
        {!assistant.isBuiltin && (
          <>
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation()
                onEdit()
              }}
              title="编辑"
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              title="删除"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </>
        )}
      </div>

      {/* 收藏标记 */}
      {assistant.isPinned && (
        <div className="absolute top-2 left-2">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        </div>
      )}

      <div className="flex flex-col items-center text-center gap-3">
        <AssistantIconDisplay assistant={assistant} size="lg" />
        <div className="space-y-1">
          <h3 className="font-medium text-sm line-clamp-1">{assistant.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2.5em]">
            {assistant.description || "暂无描述"}
          </p>
        </div>
      </div>
    </Card>
  )
}

// 分类标签组件
function CategoryTabs({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const categories = [
    { id: "all", label: "全部", icon: Sparkles },
    { id: "assistant", label: "助手", icon: Bot },
    { id: "coding", label: "编程", icon: Code },
    { id: "writing", label: "写作", icon: FileText },
    { id: "translation", label: "翻译", icon: Globe },
  ]

  return (
    <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
            value === cat.id
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <cat.icon className="w-4 h-4" />
          {cat.label}
        </button>
      ))}
    </div>
  )
}

export default function AssistantsPage() {
  const { assistants, updateAssistant, deleteAssistant } = useAssistantStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [activeTab, setActiveTab] = useState<"market" | "my">("my")

  // 过滤助手
  const filteredAssistants = assistants.filter((assistant) => {
    const matchesSearch =
      assistant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assistant.description?.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (activeTab === "my") {
      return matchesSearch
    }
    
    // 市场页面只显示模板 (这里暂时使用内置助手作为示例)
    return matchesSearch && assistant.isBuiltin
  })

  // 按收藏和时间排序
  const sortedAssistants = [...filteredAssistants].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return b.updatedAt - a.updatedAt
  })

  const handleSelectAssistant = (assistant: Assistant) => {
    // TODO: 导航到聊天页面
    console.log("Select assistant:", assistant.id)
  }

  const handleEditAssistant = (assistant: Assistant) => {
    // TODO: 打开编辑弹窗
    console.log("Edit assistant:", assistant.id)
  }

  const handleDeleteAssistant = (assistant: Assistant) => {
    if (confirm(`确定要删除助手 "${assistant.name}" 吗？`)) {
      deleteAssistant(assistant.id)
    }
  }

  const handleTogglePinned = (assistant: Assistant) => {
    updateAssistant(assistant.id, { isPinned: !assistant.isPinned })
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">助手</h1>
          <Button size="sm" className="gap-1.5">
            <Plus className="w-4 h-4" />
            创建助手
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 mb-4">
          <button
            onClick={() => setActiveTab("my")}
            className={cn(
              "text-sm font-medium pb-2 border-b-2 transition-colors",
              activeTab === "my"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            我的助手
          </button>
          <button
            onClick={() => setActiveTab("market")}
            className={cn(
              "text-sm font-medium pb-2 border-b-2 transition-colors",
              activeTab === "market"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            助手市场
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-4">
          <SearchInput
            placeholder="搜索助手..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            className="max-w-xs"
          />
          <CategoryTabs value={category} onChange={setCategory} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-apple">
        {sortedAssistants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              {searchQuery ? "未找到匹配的助手" : "暂无助手"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery ? "尝试使用其他关键词搜索" : "创建你的第一个 AI 助手"}
            </p>
            {!searchQuery && (
              <Button size="sm" className="gap-1.5">
                <Plus className="w-4 h-4" />
                创建助手
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {sortedAssistants.map((assistant) => (
              <AssistantCard
                key={assistant.id}
                assistant={assistant}
                onSelect={() => handleSelectAssistant(assistant)}
                onEdit={() => handleEditAssistant(assistant)}
                onDelete={() => handleDeleteAssistant(assistant)}
                onTogglePinned={() => handleTogglePinned(assistant)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
