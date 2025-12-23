# WARP.md

这个文件为 WARP (warp.dev) 提供在此仓库中工作的指导。

## 项目概述

基于 Tauri v2 + React 19 + TypeScript 的跨平台 AI 聊天应用，目标是实现类似 Cherry Studio + Dify 的 AI 聊天应用，支持简化工作流任务。

## 技术栈

- **前端**: React 19 + TypeScript + Vite 7
- **桌面端**: Tauri v2
- **路由**: TanStack Router v1
- **状态管理**: Zustand v5
- **数据获取**: TanStack Query v5
- **UI 组件**: Radix UI + Tailwind CSS v3
- **图标**: Lucide React

## 常用命令

### 开发环境
```bash
# 启动 Vite 开发服务器
bun run dev

# 启动 Tauri 桌面开发模式
bun run tauri:dev

# 启动 Web 端开发模式
bun run dev:web
```

### 构建
```bash
# TypeScript 类型检查 + Vite 构建（用于验证）
bun run build

# 构建 Web 端
bun run build:web

# 构建 Tauri 桌面应用
bun run tauri:build
```

### 代码质量
```bash
# TypeScript 类型检查（不生成文件）
bun run typecheck
```

### 预览
```bash
# 预览 Tauri 构建结果
bun run preview

# 预览 Web 端构建结果
bun run preview:web
```

## 架构设计

### 平台适配架构
项目采用多平台架构，支持三种运行模式：
- **Desktop (Tauri)**: 原生桌面应用，具有完整系统集成能力
- **Web**: 浏览器版本，响应式设计
- **Mobile**: 移动端适配（通过响应式设计）

平台检测逻辑集中在 `src/lib/platform.ts`：
- `isTauri()`: 检测是否运行在 Tauri 环境
- `getPlatform()`: 返回 "desktop" | "web" | "mobile"
- `getPlatformInfo()`: 获取完整的平台、设备类型、操作系统等信息

布局组件根据平台自动切换：
- `src/components/layout/DesktopLayout.tsx`: 桌面端布局（自定义标题栏）
- `src/components/layout/WebLayout.tsx`: Web 端布局
- `src/components/layout/MobileLayout.tsx`: 移动端布局（底部导航）

### 路由架构
使用 TanStack Router 实现文件系统路由：
- `/` - 首页（对话列表）
- `/chat` - 聊天页面
- `/settings` - 设置页面

路由采用懒加载策略 (`lazyRouteComponent`)，优化首屏加载性能。

### 状态管理架构
使用 Zustand 进行全局状态管理，分为两个 store：

**useAppStore** (`src/store/useAppStore.ts`):
- 聊天数据: `chats`, `currentChatId`, `isProcessing`
- UI 状态: `sidebarOpen`, `theme`
- 操作方法: `createChat`, `deleteChat`, `updateChat`, `addMessage`

**useThemeStore** (`src/store/useThemeStore.ts`):
- 主题管理

状态持久化通过 Zustand devtools middleware 进行开发调试。

### Tauri 集成
前端调用 Rust 命令的标准方式：
```typescript
import { invoke } from "@tauri-apps/api/core";
const result = await invoke("command_name", { arg: value });
```

当前可用的 Rust 命令：
- `greet`: 示例命令，接收 `name: &str` 参数

Rust 后端位于 `src-tauri/src/lib.rs`，使用 `#[tauri::command]` 宏定义命令。

### 构建优化
Vite 配置 (`vite.config.ts`) 包含多项性能优化：
- **代码分割**: React、路由、状态管理、UI 组件、图标库分别打包
- **构建平台**: 支持通过 `BUILD_PLATFORM` 环境变量切换 Web/Tauri 构建
- **输出目录**: Web 构建输出到 `dist-web`，Tauri 构建输出到 `dist`
- **预热文件**: 开发服务器预热常用文件以加快启动速度

## 代码规范

### TypeScript 配置
- **严格模式**: 启用 `strict`, `noUnusedLocals`, `noUnusedParameters`
- **路径别名**: `@/` 映射到 `src/`
- **模块解析**: 使用 `bundler` 模式

### 代码风格
- **字符串**: 使用双引号 `"`
- **缩进**: 2 个空格
- **命名规范**:
  - 组件: PascalCase
  - 函数/变量: camelCase
  - CSS 类: kebab-case
- **组件**: 函数组件 + Hooks，使用 default export
- **导入顺序**: React hooks → 本地模块 → @tauri-apps/* → 样式

### 项目结构
```
src/
├── components/
│   ├── layout/          # 布局组件（AppLayout、DesktopLayout、WebLayout、MobileLayout）
│   ├── titlebar/        # 自定义标题栏（桌面端）
│   └── ui/              # UI 组件库（Button、Card、Input 等）
├── hooks/               # 自定义 Hooks（usePlatform）
├── lib/                 # 工具函数（platform.ts、utils.ts）
├── pages/               # 页面组件（index、chat、settings）
├── router/              # TanStack Router 配置
├── store/               # Zustand 状态管理
└── styles/              # 全局样式（globals.css + Tailwind）

src-tauri/
├── src/
│   ├── lib.rs           # Rust 命令定义
│   └── main.rs          # Tauri 应用入口
└── tauri.conf.json      # Tauri 配置（窗口、打包等）
```

## 开发注意事项

### Agent 工作流程
- **禁止运行开发服务器**: 不要在 Agent 上下文中执行 `dev` 或 `start` 命令
- **代码验证**: 修改代码后使用 `bun run build` 验证编译正确性
- **类型检查**: 使用 `bun run typecheck` 进行类型检查

### 添加新路由
1. 在 `src/pages/` 创建页面组件
2. 在 `src/router/index.tsx` 中使用 `createRoute` 注册路由
3. 使用 `lazyRouteComponent` 进行懒加载

### 添加 Tauri 命令
1. 在 `src-tauri/src/lib.rs` 中定义命令函数，使用 `#[tauri::command]` 宏
2. 在 `invoke_handler` 中注册命令
3. 前端通过 `invoke("command_name", { args })` 调用

### 平台特定功能
使用 `usePlatform()` Hook 或 `getPlatformInfo()` 检测平台：
```typescript
const { isTauri, isMobile } = usePlatform();

if (isTauri) {
  // 使用 Tauri API
}
```

### 样式开发
- 使用 Tailwind CSS utility classes
- 通过 `cn()` 工具函数（来自 `src/lib/utils.ts`）合并类名
- Radix UI 组件位于 `src/components/ui/`，基于 shadcn/ui 风格

## 窗口配置

Tauri 窗口配置 (`src-tauri/tauri.conf.json`):
- 默认尺寸: 1200x800
- 最小尺寸: 800x600
- 自定义标题栏: `decorations: false`（需要自行实现标题栏组件）
- 应用名称: "Next AI"
