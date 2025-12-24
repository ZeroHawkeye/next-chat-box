# Next AI

一个现代化的 AI 聊天应用，支持多助手、多会话、多面板布局，提供类似 IDE 的工作区体验。

## 特性

- **多助手系统** - 内置通用助手、代码助手、写作助手、翻译专家等，支持自定义创建
- **多面板布局** - 类似 VS Code 的面板分割，支持水平/垂直分割、拖拽调整大小
- **多 Tab 会话** - 每个面板支持多个会话标签，支持拖拽排序和跨面板移动
- **跨平台支持** - 基于 Tauri 构建，支持 Windows、macOS、Linux 桌面应用，同时支持 Web 端
- **响应式设计** - 自动适配桌面端、Web 端和移动端布局
- **自定义窗口** - 无边框窗口设计，自定义标题栏
- **可拖拽侧边栏** - 支持拖拽调整宽度，拖到极限自动折叠
- **快捷键支持** - 全面的键盘快捷键支持

## 技术栈

| 分类 | 技术 |
|------|------|
| 框架 | Tauri v2 + React 19 + TypeScript |
| 构建 | Vite 7 |
| 状态管理 | Zustand |
| 路由 | TanStack Router |
| UI 组件 | Radix UI + Tailwind CSS |
| 拖拽 | dnd-kit |
| 后端 | Rust |

## 项目结构

```
src/
├── components/
│   ├── assistant/    # 助手相关组件
│   ├── chat/         # 聊天面板、Tab 栏、拖拽等
│   ├── layout/       # 布局组件 (Desktop/Web/Mobile)
│   ├── titlebar/     # 自定义标题栏
│   └── ui/           # 基础 UI 组件
├── hooks/            # 自定义 Hooks
├── lib/              # 工具函数、配置
├── pages/            # 页面组件
├── router/           # 路由配置
├── store/            # Zustand 状态管理
├── styles/           # 全局样式
└── types/            # TypeScript 类型定义

src-tauri/
├── src/
│   ├── commands/     # Tauri 命令
│   └── models/       # 数据模型
└── capabilities/     # Tauri 权限配置
```

## 开发

### 环境要求

- Node.js 18+
- Bun (推荐) 或 npm/yarn
- Rust (用于 Tauri 构建)

### 安装依赖

```bash
bun install
```

### 命令

```bash
# 前端类型检查
bun run typecheck

# 前端构建验证
bun run build

# Web 端构建
bun run build:web

# Tauri 开发模式
bun run tauri:dev

# Tauri 生产构建
bun run tauri:build

# Rust 代码检查 (在 src-tauri 目录)
cargo check
```

## 推荐 IDE 配置

- [VS Code](https://code.visualstudio.com/)
  - [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
  - [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
  - [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
