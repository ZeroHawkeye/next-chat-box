# AGENTS.md

## Commands
- `bun run build` - 前端验证 (TypeScript 检查 + Vite 构建)
- `bun run typecheck` - 仅 TypeScript 类型检查
- `cargo check` - Rust 代码快速验证 (在 src-tauri 目录运行)
- **禁止**: `dev`、`start` 等启动服务的命令

## Project Structure
- `src/` - React 前端 (components/, pages/, store/, hooks/, lib/, router/)
- `src-tauri/src/` - Rust 后端 (commands/, models/, lib.rs, error.rs)

## Code Style
- **TypeScript**: Strict mode, 双引号, 2 空格缩进, `@/` 路径别名
- **Naming**: PascalCase (组件), camelCase (函数/变量), kebab-case (CSS)
- **Imports**: React hooks -> @/ 本地模块 -> @tauri-apps/* -> 样式
- **Rust**: 使用 `#[tauri::command]` 定义命令, 错误处理用 `AppResult<T>`

## Tech Stack
Tauri v2 + React 19 + TypeScript + Vite | Zustand (状态) | TanStack Router (路由) | Radix UI + Tailwind CSS

## Notes
- 修改 Rust 代码后必须运行 `cargo check` 验证
- 使用中文回复
