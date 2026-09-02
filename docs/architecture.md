# 架构设计文档：代办事项

> 本项目为纯前端应用，**无后端层**；架构遵循《AGENTS.md 编码宪法》分层要求，将「业务逻辑」与「数据访问」分离，前端分层对应关系见 §3。
> 状态：已确认

## 1. 技术选型
| 层 | 选型 | 理由 |
|----|------|------|
| 前端框架 | Vue 3（Composition API + `<script setup>`）+ TypeScript | 需求指定；组合式 API 契合逻辑复用与单测 |
| 构建工具 | Vite | 现代标准工程，HMR 快，TS 原生支持 |
| 样式 | 原生 CSS（Scoped） | 需求确认不引 UI 库，依赖少、体积小 |
| 持久化 | 浏览器 localStorage（key: `todos`） | 需求指定，刷新不丢、零后端成本 |
| 测试 | Vitest | 满足 CHECKLIST 测试层门禁，覆盖核心逻辑 |
| 后端 | 无 | 纯前端单机应用，需求明确无后端 |
| 数据库 | localStorage（详见 docs/database.md） | 需求指定 |

## 2. 总体架构（文字版）
纯前端单层应用，无 API 层、无服务端。数据流单向：组件 → Hook（业务逻辑）→ Service（数据访问）→ 渲染回写。

```
[App.vue 根组件]
   │ 组合装配
   ├─ components/ 展示组件（TodoStats / TodoForm / TodoFilter / TodoItem）
   │        │ 事件/表单
   ├─ hooks/useTodos.ts  业务逻辑：状态 + CRUD + 排序 + 筛选 + 校验
   │        │ 调用
   ├─ services/todoStorage.ts  数据访问：localStorage 读写 + try-catch + 结构校验
   ├─ types/  类型定义（Todo / Priority / Filter）
   └─ utils/  通用工具（id 生成等）
```

渲染流：`TodoForm 提交 → useTodos.addTodo（校验/生成 id/排序）→ todoStorage.save → 列表重渲染`；读取流：`页面加载 → todoStorage.load（校验兜底）→ useTodos 初始化状态 → 渲染`。

## 3. 前端分层
本项目为单页应用（无多页面路由），不设 `pages/`；无网络请求，不设 `api/`。分层映射如下：
- **components**：可复用 UI 展示组件（TodoStats、TodoForm、TodoFilter、TodoItem），只做渲染与事件分发，不含业务逻辑
- **hooks**：业务组合函数 `useTodos`（集中承载 CRUD / 排序 / 筛选 / 校验 / 统计），对组件暴露状态与操作函数
- **services**：`todoStorage`（localStorage 封装，含解析失败兜底与结构校验），是数据访问唯一入口
- **types**：`Todo`、`Priority`、`Filter` 类型定义
- **utils**：通用工具（如 `createId`、`sortTodos` 等纯函数）

## 4. 后端分层
- **不适用**。本项目为纯前端应用，无 Controller / Service / Repository / DTO。
- 对应职责映射：Controller（校验/返回）→ 由 `useTodos` 入口函数承担；Service（业务）→ `useTodos` 承担；Repository（数据访问）→ `services/todoStorage` 承担。此映射保证宪法「业务与数据分离」红线在前端同样成立。

## 5. 模块划分与依赖
| 模块 | 职责 | 依赖的模块 |
|------|------|------------|
| types | Todo / Priority / Filter 类型定义 | 无 |
| utils | 纯工具函数（id 生成、排序） | types |
| services/todoStorage | localStorage 读写、结构校验、损坏兜底重置 | types |
| hooks/useTodos | 业务状态与 CRUD / 排序 / 筛选 / 统计 | services、types |
| components/* | 展示与交互（渲染、事件分发） | hooks、types |
| App.vue | 根组件，装配各组件并初始化 useTodos | components、hooks |

## 6. 关键设计决策
- **决策 1：业务逻辑集中 hooks**。组件只负责渲染与事件分发，全部业务放入 `useTodos` → 满足宪法「页面只接收请求、校验、返回；业务在 Hook/Service」，且核心逻辑可脱离 DOM 直接 Vitest 单测。
- **决策 2：数据访问单一入口**。localStorage 读写封装进 `services/todoStorage`，统一 try-catch + 结构校验，损坏则重置为空数组并告警 → 需求 Q5 确认项，杜绝散落调用。
- **决策 3：排序规则单一函数**。排序采用「未完成在前、已完成在后，组内 createdAt 倒序」的纯函数 `sortTodos`，供列表渲染与单测复用 → 需求 Q1 确认项。
- **决策 4：不引 UI 库**。原生 CSS Scoped 手写，优先级用颜色 + 文字标注（高=红 / 中=橙 / 低=蓝）→ 需求 Q3 确认项，依赖最少。
- **决策 5：id 用 `crypto.randomUUID()`**，无网络依赖 → 需求 Q8 确认项。

## 7. 部署与运行环境
- **环境要求**：Node.js ≥ 18（仅开发/构建期）；运行时仅需现代浏览器（Chrome / Safari / Edge，支持 localStorage 与 crypto.randomUUID）
- **部署方式**：`npm run dev` 本地开发；`npm run build` 产出纯静态资源，可托管于任意静态站点服务，无服务端依赖

## 8. 风险与待确认项
- **风险 1：localStorage 数据丢失**（用户清空、隐私模式受限）→ 影响：已录数据丢失 → 对策：读取 try-catch 兜底不崩溃，不承诺跨浏览器/跨端，需求边界已明确
- **风险 2：旧浏览器缺 `crypto.randomUUID`**（Safari < 15.4）→ 影响：id 生成失败 → 对策：目标现代浏览器；如需兼容再补降级方案（当前不引入）
