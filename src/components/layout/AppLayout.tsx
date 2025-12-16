import { ReactNode } from "react"
import { usePlatform } from "@/hooks/usePlatform"
import { DesktopLayout } from "./DesktopLayout"
import { MobileLayout } from "./MobileLayout"
import { WebLayout } from "./WebLayout"

interface AppLayoutProps {
  children: ReactNode
}

/**
 * 应用主布局
 * 根据平台自动选择合适的布局组件
 */
export function AppLayout({ children }: AppLayoutProps) {
  const { platform, isMobileView } = usePlatform()

  // Tauri 桌面应用
  if (platform === "desktop") {
    return <DesktopLayout>{children}</DesktopLayout>
  }

  // 移动设备或小屏幕
  if (platform === "mobile" || isMobileView) {
    return <MobileLayout>{children}</MobileLayout>
  }

  // Web 端 (响应式)
  return <WebLayout>{children}</WebLayout>
}
