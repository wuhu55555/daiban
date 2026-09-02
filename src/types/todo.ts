// Todo 领域类型定义与类型守卫
// 守卫函数供数据层（todoStorage）校验 localStorage 数据时复用，与类型定义内聚在同一文件

/** 优先级：高 / 中 / 低 */
export type Priority = 'high' | 'medium' | 'low'

/** 筛选视图：全部 / 未完成 / 已完成 */
export type Filter = 'all' | 'active' | 'completed'

/** 事项实体（对应 localStorage `todos` 数组元素） */
export interface Todo {
  id: string
  title: string
  content: string
  priority: Priority
  completed: boolean
  createdAt: number
}

/** 判断值是否为合法 Priority */
export function isPriority(value: unknown): value is Priority {
  return value === 'high' || value === 'medium' || value === 'low'
}

/** 判断值是否为合法 Filter */
export function isFilter(value: unknown): value is Filter {
  return value === 'all' || value === 'active' || value === 'completed'
}

/** 判断值是否为结构合法的 Todo（字段齐全且类型正确，供 localStorage 读取校验） */
export function isTodo(value: unknown): value is Todo {
  if (typeof value !== 'object' || value === null) return false
  const record = value as Record<string, unknown>
  return (
    typeof record.id === 'string' &&
    typeof record.title === 'string' &&
    typeof record.content === 'string' &&
    isPriority(record.priority) &&
    typeof record.completed === 'boolean' &&
    typeof record.createdAt === 'number'
  )
}
