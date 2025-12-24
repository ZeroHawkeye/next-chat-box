# AGENTS.md

## Project Overview
Tauri v2 + React 19 + TypeScript 跨平台应用，目标：Cherry Studio + Dify 风格的 AI 聊天应用，支持简化工作流任务。

## Tech Stack
- **Frontend**: React 19 + TypeScript + Vite 7
- **Desktop**: Tauri v2
- **Routing**: TanStack Router v1
- **State**: Zustand v5
- **Data Fetching**: TanStack Query v5
- **UI**: Radix UI + Tailwind CSS v3
- **Icons**: Lucide React

## Commands
- `bun run build` - TypeScript 检查 + Vite 构建 (用于验证)
- `bun run tauri build` - 构建桌面应用
- `bun run tauri dev` - 禁止在 agent 上下文中使用
- `bun run preview` - 预览构建结果
- `cargo check` - Rust 代码检查 (修改 src-tauri 代码时必须运行)

## Project Structure
```
src/
├── components/ui/     # UI 组件库 (Button 等)
├── lib/               # 工具函数 (cn, utils)
├── pages/             # 页面组件
│   ├── index.tsx      # 首页
│   ├── chat.tsx       # 聊天页
│   └── settings.tsx   # 设置页
├── router/            # TanStack Router 配置
├── store/             # Zustand 状态管理
│   └── useAppStore.ts # 全局状态
├── styles/            # 样式文件
│   └── globals.css    # 全局样式 + Tailwind
├── App.tsx            # 根组件 (Outlet)
└── main.tsx           # 入口文件
src-tauri/
├── src/lib.rs         # Rust 后端命令
└── tauri.conf.json    # Tauri 配置
```

## Code Style
- **TypeScript**: Strict mode, noUnusedLocals, noUnusedParameters
- **Imports**: React hooks → local modules → @tauri-apps/* → styles
- **Components**: Functional components with hooks, default export
- **Strings**: Double quotes `"`
- **Indent**: 2 spaces
- **Naming**: PascalCase (组件), camelCase (函数/变量), kebab-case (CSS)
- **Path Alias**: `@/` 映射到 `src/`

## State Management (Zustand)
```typescript
// 使用示例
const { chats, createChat, theme } = useAppStore();
```

## Routing (TanStack Router)
- `/` - 首页 (对话列表)
- `/chat` - 聊天页面
- `/settings` - 设置页面

## Tauri Commands
```typescript
import { invoke } from "@tauri-apps/api/core";
// 调用 Rust 命令
const result = await invoke("command_name", { arg: value });
```

## Platform Adaptation
- 使用响应式设计适配 Web/Mobile
- 桌面端利用 Tauri 原生功能
- 考虑平台特定的 UI/UX 适配

## Important Notes
- 禁止运行 `dev` 或 `start` 命令启动服务
- 使用 `bun run build` 验证前端代码正确性
- 修改 `src-tauri` 代码后，必须运行 `cargo check` 验证 Rust 代码
- 使用中文回复
