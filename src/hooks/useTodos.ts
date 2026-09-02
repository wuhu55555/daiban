import { computed, ref } from 'vue'
import { loadTodos, saveTodos } from '../services/todoStorage'
import type { Filter, Priority, Todo } from '../types/todo'

/** 标题长度上限（需求：最多 50 字） */
export const TITLE_MAX_LENGTH = 50

/** 新增/编辑事项的输入载荷 */
export interface TodoDraft {
  title: string
  content: string
  priority: Priority
}

/** 校验标题：去空格后非空且 ≤50 字；返回错误信息，空串表示通过 */
export function validateTitle(title: string): string {
  const trimmed = title.trim()
  if (trimmed.length === 0) return '标题不能为空'
  if (trimmed.length > TITLE_MAX_LENGTH) return `标题不能超过 ${TITLE_MAX_LENGTH} 字`
  return ''
}

/**
 * 排序规则（需求 Q1 确认）：未完成在前、已完成在后；组内按 createdAt 倒序。
 * 纯函数、不修改原数组，供列表渲染与单测复用。
 */
export function sortTodos(todos: Todo[]): Todo[] {
  return [...todos].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    return b.createdAt - a.createdAt
  })
}

/**
 * 事项业务组合函数：集中承载状态与 CRUD/排序/筛选/统计/校验。
 * 组件只调用此 Hook 暴露的操作，不直连数据层。
 */
export function useTodos() {
  const todos = ref<Todo[]>(loadTodos())

  /** 总数 */
  const totalCount = computed(() => todos.value.length)
  /** 未完成数 */
  const activeCount = computed(() => todos.value.filter((t) => !t.completed).length)

  function persist(): void {
    saveTodos(todos.value)
  }

  /** 新增事项；返回错误信息，空串表示成功 */
  function addTodo(draft: TodoDraft): string {
    const error = validateTitle(draft.title)
    if (error) return error
    const todo: Todo = {
      id: crypto.randomUUID(),
      title: draft.title.trim(),
      content: draft.content,
      priority: draft.priority,
      completed: false,
      createdAt: Date.now(),
    }
    todos.value.push(todo)
    persist()
    return ''
  }

  /** 编辑事项（标题/内容/优先级）；返回错误信息，空串表示成功 */
  function updateTodo(
    id: string,
    patch: Partial<Pick<Todo, 'title' | 'content' | 'priority'>>,
  ): string {
    const target = todos.value.find((t) => t.id === id)
    if (!target) return '事项不存在'
    if (patch.title !== undefined) {
      const error = validateTitle(patch.title)
      if (error) return error
      target.title = patch.title.trim()
    }
    if (patch.content !== undefined) target.content = patch.content
    if (patch.priority !== undefined) target.priority = patch.priority
    persist()
    return ''
  }

  /** 勾选完成 / 取消完成 */
  function toggleCompleted(id: string): void {
    const target = todos.value.find((t) => t.id === id)
    if (!target) return
    target.completed = !target.completed
    persist()
  }

  /** 删除事项 */
  function removeTodo(id: string): void {
    todos.value = todos.value.filter((t) => t.id !== id)
    persist()
  }

  /** 按筛选视图返回已排序列表 */
  function filteredTodos(filter: Filter): Todo[] {
    const base = sortTodos(todos.value)
    if (filter === 'active') return base.filter((t) => !t.completed)
    if (filter === 'completed') return base.filter((t) => t.completed)
    return base
  }

  return {
    todos,
    totalCount,
    activeCount,
    addTodo,
    updateTodo,
    toggleCompleted,
    removeTodo,
    filteredTodos,
  }
}
