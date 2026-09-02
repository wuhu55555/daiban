import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { loadTodos, saveTodos, STORAGE_KEY } from '../services/todoStorage'
import type { Todo } from '../types/todo'

const validTodo: Todo = {
  id: '1',
  title: '测试',
  content: '内容',
  priority: 'medium',
  completed: false,
  createdAt: 1700000000000,
}

/** 内存版 localStorage 桩，隔离每个用例 */
function createStorageStub(): Storage {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => (key in store ? store[key] : null)),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = String(value)
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
    key: vi.fn(() => null),
    get length() {
      return Object.keys(store).length
    },
  } as unknown as Storage
}

describe('todoStorage', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.stubGlobal('localStorage', createStorageStub())
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('首次读取（无数据）返回空数组', () => {
    expect(loadTodos()).toEqual([])
  })

  it('写入后读取往返一致', () => {
    saveTodos([validTodo])
    expect(loadTodos()).toEqual([validTodo])
  })

  it('非法 JSON 重置为空数组并告警', () => {
    ;(globalThis.localStorage as Storage).setItem(STORAGE_KEY, '{broken json')
    expect(loadTodos()).toEqual([])
    expect(warnSpy).toHaveBeenCalled()
  })

  it('非数组结构重置为空数组并告警', () => {
    ;(globalThis.localStorage as Storage).setItem(STORAGE_KEY, JSON.stringify({ a: 1 }))
    expect(loadTodos()).toEqual([])
    expect(warnSpy).toHaveBeenCalled()
  })

  it('数组内非法元素被丢弃、合法元素保留', () => {
    const dirty = [validTodo, { id: '2', title: '缺字段' }, 'oops', null]
    ;(globalThis.localStorage as Storage).setItem(STORAGE_KEY, JSON.stringify(dirty))
    expect(loadTodos()).toEqual([validTodo])
  })

  it('读取抛异常时返回空数组不崩溃', () => {
    const broken = { getItem: vi.fn(() => { throw new Error('denied') }) }
    vi.stubGlobal('localStorage', broken)
    expect(loadTodos()).toEqual([])
  })

  it('写入抛异常时不向上抛错', () => {
    const broken = { setItem: vi.fn(() => { throw new Error('quota') }) }
    vi.stubGlobal('localStorage', broken)
    expect(() => saveTodos([validTodo])).not.toThrow()
  })
})
