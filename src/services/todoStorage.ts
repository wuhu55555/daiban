import { isTodo, type Todo } from '../types/todo'

/** localStorage 存储 key（固定常量，集中管理，不散落硬编码） */
export const STORAGE_KEY = 'todos'

/**
 * 从 localStorage 读取事项列表。
 * 校验契约（见 docs/database.md）：parse 失败或非数组 → 重置为空数组并告警；
 * 数组内非法元素 → 逐项丢弃、合法项保留。任何异常都不向上抛，保证应用不崩溃。
 */
export function loadTodos(): Todo[] {
  let raw: string | null
  try {
    raw = localStorage.getItem(STORAGE_KEY)
  } catch (error) {
    console.warn('[todoStorage] 读取 localStorage 失败，重置为空列表', error)
    return []
  }

  // 首次使用：无数据，返回空列表
  if (raw === null) return []

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch (error) {
    console.warn('[todoStorage] JSON 解析失败，重置为空列表', error)
    return []
  }

  // 结构校验：顶层必须是数组
  if (!Array.isArray(parsed)) {
    console.warn('[todoStorage] 数据结构非法（非数组），重置为空列表')
    return []
  }

  const valid = parsed.filter(isTodo)
  if (valid.length !== parsed.length) {
    console.warn('[todoStorage] 检测到非法数据项，已丢弃')
  }
  return valid
}

/**
 * 将事项列表写入 localStorage。写失败（如配额满 / 隐私模式）仅告警，不向上抛错。
 */
export function saveTodos(todos: Todo[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  } catch (error) {
    console.error('[todoStorage] 写入 localStorage 失败', error)
  }
}
