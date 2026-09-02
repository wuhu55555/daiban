# 代办事项

> 一个打开即用的纯前端代办事项应用：增删改查、完成勾选、筛选，数据存 localStorage，刷新不丢。

## 技术栈
- 前端：Vue 3（Composition API + `<script setup>`）+ TypeScript + Vite
- 样式：原生 CSS（Scoped，不引 UI 库）
- 持久化：浏览器 localStorage（key: `todos`）
- 测试：Vitest + @vue/test-utils

## 目录结构
```
src/
├── components/   # UI 组件（TodoStats / TodoFilter / TodoForm / TodoItem）
├── hooks/        # 业务逻辑（useTodos：CRUD / 排序 / 筛选 / 校验）
├── services/     # 数据访问（todoStorage：localStorage 读写 + 校验兜底）
├── types/        # 类型定义与守卫（Todo / Priority / Filter）
└── __tests__/    # 单测（8 个测试文件）
docs/
├── requirements.md   # 需求契约
├── architecture.md   # 架构契约
├── database.md       # 数据契约（localStorage）
└── steps/            # 阶段步骤归档（STEPS-MVP.md）
```

## 环境要求
- Node.js >= 20.19（Vite 8 要求，推荐 22 LTS）
- 现代浏览器（Chrome / Safari / Edge，需支持 localStorage 与 crypto.randomUUID）

## 安装与启动
```bash
# 安装依赖
npm install

# 开发启动（base 为 /daiban/，访问 http://localhost:5173/daiban/）
npm run dev

# 生产构建（产物在 dist/）
npm run build

# 预览构建产物
npm run preview
```

## 质量校验脚本
```bash
npm run typecheck   # vue-tsc 类型检查
npm run lint        # ESLint（0 error / 0 warning）
npm test            # Vitest 单测
```

## 主要功能
- 事项列表 + 顶部统计（总数 / 未完成数）
- 新增 / 编辑 / 删除（删除前原生 confirm 确认）
- 勾选完成 / 取消完成（已完成加删除线并沉底）
- 筛选：全部 / 未完成 / 已完成
- localStorage 持久化，刷新不丢；脏数据自动校验兜底

## 排序规则
未完成在前、已完成在后；组内按创建时间倒序。

## 部署（GitHub Pages）
- **在线地址**：https://wuhu55555.github.io/daiban/
- **部署方式**：`npm run build` 产出 `dist/`，推送至 `gh-pages` 分支（仓库 Settings → Pages → Source: Deploy from a branch → gh-pages / root）
- **Vite base**：已配置为 `/daiban/`（GitHub Pages 子路径部署），本地开发访问路径相应为 `/daiban/`
- 亦可托管于任意静态站点服务（Nginx / Vercel / 对象存储等），无服务端依赖；非子路径平台需将 base 改为 `/`
