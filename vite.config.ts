import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { resolve } from "path"

// 获取构建目标平台
const platform = process.env.BUILD_PLATFORM || "tauri"
const host = process.env.TAURI_DEV_HOST

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },

  // 定义全局常量
  define: {
    __BUILD_PLATFORM__: JSON.stringify(platform),
  },

  // 构建配置
  build: {
    // Web 端输出到 dist-web，Tauri 端输出到 dist
    outDir: platform === "web" ? "dist-web" : "dist",
    // 清空输出目录
    emptyOutDir: true,
    // 源码映射 (生产环境关闭)
    sourcemap: platform === "web" ? false : true,
    // 压缩配置
    minify: "esbuild",
    // 分块策略
    rollupOptions: {
      output: {
        manualChunks: {
          // React 相关
          "vendor-react": ["react", "react-dom"],
          // 路由
          "vendor-router": ["@tanstack/react-router"],
          // 状态管理
          "vendor-state": ["zustand", "@tanstack/react-query"],
          // UI 组件
          "vendor-ui": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-select",
            "@radix-ui/react-slot",
            "@radix-ui/react-tabs",
            "@radix-ui/react-toast",
          ],
        },
      },
    },
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },

  // 预览服务器配置 (用于 Web 端)
  preview: {
    port: 4173,
    strictPort: true,
  },
})
