import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import router from '@/router';
import { useAppStore } from '@/store/useAppStore';

// 初始化React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// 主题初始化组件
function ThemeInitializer() {
  const { theme } = useAppStore();
  
  React.useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // system
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', isDark);
    }
  }, [theme]);

  return null;
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeInitializer />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
