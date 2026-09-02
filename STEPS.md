# 执行步骤：MVP阶段

**关联PLAN阶段**：阶段一：MVP
**当前状态**：待开始
**总进度**：已完成 5/8 步

## 步骤清单

### Step 1: 工程骨架初始化（Vite + Vue3 + TS + 依赖）
- **涉及文件**：
  - 前端：`package.json`、`vite.config.ts`（脚手架生成 `index.html` / `tsconfig*.json` / `src/main.ts` 基线）
  - 后端：无（纯前端项目）
- **依赖**：无
- **状态**：[x] 已完成
- **验证标准**：`npm run dev` 启动成功，浏览器访问 http://localhost:5173 渲染 Vue 应用根组件

### Step 2: 类型定义（Todo / Priority / Filter）
- **涉及文件**：
  - 前端：`src/types/todo.ts`
  - 后端：无（纯前端项目）
- **依赖**：Step 1
- **状态**：[x] 已完成
- **验证标准**：`npx tsc --noEmit` 类型检查通过，`Todo` 接口六字段与 `Priority` / `Filter` 联合类型导出正确

### Step 3: 数据层（localStorage 封装）
- **涉及文件**：
  - 前端：`src/services/todoStorage.ts`
  - 后端：无（纯前端项目）
- **依赖**：Step 2
- **状态**：[x] 已完成
- **验证标准**：单测/控制台验证——写入→读取往返一致；非法 JSON 或非数组结构时重置为空数组且不抛错

### Step 4: 业务层（useTodos 组合函数）
- **涉及文件**：
  - 前端：`src/hooks/useTodos.ts`
  - 后端：无（纯前端项目）
- **依赖**：Step 3
- **状态**：[x] 已完成
- **验证标准**：单测断言——CRUD 正确；排序为「未完成在前、已完成在后、组内 createdAt 倒序」；筛选三态正确；标题非空且 ≤50 字校验生效

### Step 5: 统计 + 筛选组件
- **涉及文件**：
  - 前端：`src/components/TodoStats.vue`、`src/components/TodoFilter.vue`
  - 后端：无（纯前端项目）
- **依赖**：Step 4
- **状态**：[x] 已完成
- **验证标准**：页面顶部显示「总数 / 未完成数」；切换 全部/未完成/已完成 筛选，列表实时按对应视图渲染

### Step 6: 新增/编辑表单组件
- **涉及文件**：
  - 前端：`src/components/TodoForm.vue`
  - 后端：无（纯前端项目）
- **依赖**：Step 5
- **状态**：[ ] 待开始
- **验证标准**：空标题提交被拦截；标题输入超过 50 字被 maxlength 截断；提交后新事项出现在列表首位

### Step 7: 列表项组件 + 根组件装配
- **涉及文件**：
  - 前端：`src/components/TodoItem.vue`、`src/App.vue`
  - 后端：无（纯前端项目）
- **依赖**：Step 6
- **状态**：[ ] 待开始
- **验证标准**：手工走通完整流程——新增→编辑→勾选完成（删除线+沉底）→筛选→删除（confirm）→刷新页面数据完整保留

### Step 8: 核心逻辑单测完善与真实性验证
- **涉及文件**：
  - 前端：`src/__tests__/todoStorage.spec.ts`、`src/__tests__/useTodos.spec.ts`
  - 后端：无（纯前端项目）
- **依赖**：Step 4
- **状态**：[ ] 待开始
- **验证标准**：`npm run test` 全部用例通过；故意改错一处排序/校验逻辑，对应测试变红（证明测试真实有效）

---

## 拆解规则（AI 生成 STEPS 时必须遵守）

1. 每个 Step 只能涉及 1-2 个文件。
2. 必须明确标注每个 Step 涉及的后端文件路径和前端文件路径。
3. 确保 Step 之间有明确的先后依赖关系（Step 2 依赖 Step 1 完成）。
4. 每个 Step 必须附带一句明确的验证标准。
