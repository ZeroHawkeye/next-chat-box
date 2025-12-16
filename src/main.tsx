import React, { useEffect } from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "@tanstack/react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import router from "@/router"
import { useThemeStore } from "@/store/useThemeStore"

// 初始化 React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 分钟
    },
  },
})

/**
 * 主题初始化组件
 * 在应用启动时初始化主题并隐藏骨架屏
 */
function ThemeInitializer() {
  const initializeTheme = useThemeStore((state) => state.initializeTheme)

  useEffect(() => {
    initializeTheme()
  }, [initializeTheme])

  return null
}

/**
 * 应用根组件
 */
function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeInitializer />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </React.StrictMode>
  )
}

// 挂载应用
const rootElement = document.getElementById("root")
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<App />)
}
