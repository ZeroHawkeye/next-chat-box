import { useAppStore } from "@/store/useAppStore"
import { Button } from "@/components/ui/button"
import { MessageSquare, Plus, Settings, Menu } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import { usePlatform } from "@/hooks/usePlatform"

export default function HomePage() {
  const { createChat, setCurrentChat, toggleSidebar } = useAppStore()
  const navigate = useNavigate()
  const { isDesktop } = usePlatform()

  const handleCreateChat = () => {
    const chatId = createChat()
    setCurrentChat(chatId)
    navigate({ to: "/chat" })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="border-b border-border px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isDesktop && (
              <Button variant="ghost" size="sm" onClick={toggleSidebar}>
                <Menu className="w-5 h-5" />
              </Button>
            )}
            <h1 className="text-lg sm:text-xl font-semibold">Next Chat Box</h1>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate({ to: "/settings" })}
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-sm">
          <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground" />
          <h2 className="text-xl sm:text-2xl font-bold">欢迎使用 Next Chat Box</h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            开始新的对话或选择现有对话
          </p>
          <Button onClick={handleCreateChat} size="lg" className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            开始新对话
          </Button>
        </div>
      </main>
    </div>
  )
}
