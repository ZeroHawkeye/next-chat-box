import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { resolve } from "path"

// 获取构建目标平台
const platform = process.env.BUILD_PLATFORM || "tauri"
const host = process.env.TAURI_DEV_HOST

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // 使用 SWC 加速开发构建
      babel: {
        plugins: [],
      },
    }),
  ],

  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },

  // 定义全局常量
  define: {
    __BUILD_PLATFORM__: JSON.stringify(platform),
  },

  // CSS 配置
  css: {
    devSourcemap: true,
  },

  // 构建配置
  build: {
    // Web 端输出到 dist-web，Tauri 端输出到 dist
    outDir: platform === "web" ? "dist-web" : "dist",
    // 清空输出目录
    emptyOutDir: true,
    // 源码映射 (生产环境关闭以减小体积)
    sourcemap: false,
    // 压缩配置 - 使用 esbuild（更快）
    minify: "esbuild",
    // 目标环境
    target: "esnext",
    // CSS 代码分割
    cssCodeSplit: true,
    // 减小 chunk 大小警告阈值
    chunkSizeWarningLimit: 500,
    // 分块策略
    rollupOptions: {
      output: {
        // 入口文件名
        entryFileNames: "assets/[name]-[hash].js",
        // chunk 文件名
        chunkFileNames: "assets/[name]-[hash].js",
        // 资源文件名
        assetFileNames: "assets/[name]-[hash].[ext]",
        // 手动分块 - 优化首屏加载
        manualChunks: (id) => {
          // React 核心 - 最高优先级预加载
          if (id.includes("react-dom") || id.includes("react/")) {
            return "react"
          }
          // 路由 - 核心依赖
          if (id.includes("@tanstack/react-router")) {
            return "router"
          }
          // 状态管理
          if (id.includes("zustand")) {
            return "state"
          }
          // React Query
          if (id.includes("@tanstack/react-query")) {
            return "query"
          }
          // Radix UI 组件 - 按需加载
          if (id.includes("@radix-ui")) {
            return "ui"
          }
          // 图标库 - 按需加载
          if (id.includes("lucide-react")) {
            return "icons"
          }
          // Tauri API - 桌面端专用
          if (id.includes("@tauri-apps")) {
            return "tauri"
          }
        },
      },
    },
  },

  // 优化配置
  optimizeDeps: {
    // 预构建依赖
    include: [
      "react",
      "react-dom",
      "@tanstack/react-router",
      "zustand",
      "@tanstack/react-query",
      "lucide-react",
      "clsx",
      "tailwind-merge",
    ],
    // 排除 Tauri API（在运行时加载）
    exclude: ["@tauri-apps/api"],
  },

  // Tauri 开发服务器配置
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
    // 预热常用文件
    warmup: {
      clientFiles: [
        "./src/main.tsx",
        "./src/App.tsx",
        "./src/router/index.tsx",
        "./src/components/layout/*.tsx",
      ],
    },
  },

  // 预览服务器配置 (用于 Web 端)
  preview: {
    port: 4173,
    strictPort: true,
  },

  // esbuild 配置
  esbuild: {
    // 生产环境移除 console 和 debugger
    drop: platform === "web" ? ["console", "debugger"] : [],
    // 保持函数名（调试用）
    keepNames: true,
  },
})
