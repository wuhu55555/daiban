import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TITLE_MAX_LENGTH, sortTodos, useTodos, validateTitle } from '../hooks/useTodos'
import type { Todo } from '../types/todo'

// mock 数据层，隔离 localStorage
vi.mock('../services/todoStorage', () => ({
  loadTodos: vi.fn(),
  saveTodos: vi.fn(),
}))

import { loadTodos, saveTodos } from '../services/todoStorage'

const mockedLoad = vi.mocked(loadTodos)
const mockedSave = vi.mocked(saveTodos)

function makeTodo(partial: Partial<Todo> = {}): Todo {
  return {
    id: crypto.randomUUID(),
    title: '标题',
    content: '',
    priority: 'medium',
    completed: false,
    createdAt: Date.now(),
    ...partial,
  }
}

describe('validateTitle', () => {
  it('空标题或纯空格返回错误', () => {
    expect(validateTitle('')).not.toBe('')
    expect(validateTitle('   ')).not.toBe('')
  })

  it('合法标题返回空串', () => {
    expect(validateTitle('买牛奶')).toBe('')
  })

  it('超过 50 字返回错误，恰好 50 字通过', () => {
    expect(validateTitle('字'.repeat(TITLE_MAX_LENGTH + 1))).not.toBe('')
    expect(validateTitle('字'.repeat(TITLE_MAX_LENGTH))).toBe('')
  })
})

describe('sortTodos', () => {
  it('未完成在前、已完成在后', () => {
    const done = makeTodo({ id: 'done', completed: true, createdAt: 100 })
    const active = makeTodo({ id: 'active', completed: false, createdAt: 200 })
    expect(sortTodos([done, active]).map((t) => t.id)).toEqual(['active', 'done'])
  })

  it('组内按 createdAt 倒序（新→旧）', () => {
    const a = makeTodo({ id: 'a', createdAt: 100 })
    const b = makeTodo({ id: 'b', createdAt: 300 })
    const c = makeTodo({ id: 'c', createdAt: 200 })
    expect(sortTodos([a, b, c]).map((t) => t.id)).toEqual(['b', 'c', 'a'])
  })

  it('不修改原数组', () => {
    const list = [makeTodo({ id: 'a', createdAt: 1 }), makeTodo({ id: 'b', createdAt: 2 })]
    sortTodos(list)
    expect(list.map((t) => t.id)).toEqual(['a', 'b'])
  })
})

describe('useTodos', () => {
  beforeEach(() => {
    mockedLoad.mockReturnValue([])
    mockedSave.mockClear()
  })

  it('初始化从 loadTodos 读取', () => {
    const seed = [makeTodo({ id: 'seed' })]
    mockedLoad.mockReturnValue(seed)
    const { todos } = useTodos()
    expect(todos.value).toEqual(seed)
  })

  it('addTodo 新增事项并持久化', () => {
    const { todos, addTodo } = useTodos()
    const error = addTodo({ title: '  写周报  ', content: '周一', priority: 'high' })
    expect(error).toBe('')
    expect(todos.value).toHaveLength(1)
    expect(todos.value[0]).toMatchObject({
      title: '写周报',
      content: '周一',
      priority: 'high',
      completed: false,
    })
    expect(typeof todos.value[0].createdAt).toBe('number')
    expect(mockedSave).toHaveBeenCalledTimes(1)
  })

  it('addTodo 空标题不添加且不持久化', () => {
    const { todos, addTodo } = useTodos()
    const error = addTodo({ title: '  ', content: '', priority: 'low' })
    expect(error).not.toBe('')
    expect(todos.value).toHaveLength(0)
    expect(mockedSave).not.toHaveBeenCalled()
  })

  it('addTodo 超长标题不添加', () => {
    const { todos, addTodo } = useTodos()
    const error = addTodo({ title: '字'.repeat(TITLE_MAX_LENGTH + 1), content: '', priority: 'low' })
    expect(error).not.toBe('')
    expect(todos.value).toHaveLength(0)
  })

  it('updateTodo 修改标题/内容/优先级', () => {
    const { todos, updateTodo, addTodo } = useTodos()
    addTodo({ title: '旧标题', content: '旧内容', priority: 'low' })
    const id = todos.value[0].id
    const error = updateTodo(id, { title: '新标题', content: '新内容', priority: 'high' })
    expect(error).toBe('')
    expect(todos.value[0]).toMatchObject({ title: '新标题', content: '新内容', priority: 'high' })
  })

  it('updateTodo 不存在的 id 返回错误', () => {
    const { updateTodo } = useTodos()
    expect(updateTodo('nope', { title: 'x' })).not.toBe('')
  })

  it('toggleCompleted 切换完成状态并持久化', () => {
    const { todos, toggleCompleted, addTodo } = useTodos()
    addTodo({ title: 't', content: '', priority: 'medium' })
    const id = todos.value[0].id
    toggleCompleted(id)
    expect(todos.value[0].completed).toBe(true)
    toggleCompleted(id)
    expect(todos.value[0].completed).toBe(false)
    expect(mockedSave).toHaveBeenCalledTimes(3)
  })

  it('removeTodo 删除事项并持久化', () => {
    const { todos, removeTodo, addTodo } = useTodos()
    addTodo({ title: 't', content: '', priority: 'medium' })
    const id = todos.value[0].id
    removeTodo(id)
    expect(todos.value).toHaveLength(0)
    expect(mockedSave).toHaveBeenCalled()
  })

  it('filteredTodos 三态筛选且按排序规则输出', () => {
    const doneOld = makeTodo({ id: 'doneOld', completed: true, createdAt: 100 })
    const doneNew = makeTodo({ id: 'doneNew', completed: true, createdAt: 300 })
    const activeOld = makeTodo({ id: 'activeOld', completed: false, createdAt: 200 })
    mockedLoad.mockReturnValue([doneOld, doneNew, activeOld])
    const { filteredTodos } = useTodos()
    expect(filteredTodos('all').map((t) => t.id)).toEqual(['activeOld', 'doneNew', 'doneOld'])
    expect(filteredTodos('active').map((t) => t.id)).toEqual(['activeOld'])
    expect(filteredTodos('completed').map((t) => t.id)).toEqual(['doneNew', 'doneOld'])
  })

  it('统计 totalCount 与 activeCount', () => {
    mockedLoad.mockReturnValue([makeTodo({ completed: true }), makeTodo({ completed: false })])
    const { totalCount, activeCount } = useTodos()
    expect(totalCount.value).toBe(2)
    expect(activeCount.value).toBe(1)
  })
})
