import { describe, expect, it } from 'vitest'
import { isFilter, isPriority, isTodo } from '../types/todo'

const validTodo = {
  id: '1',
  title: 't',
  content: '',
  priority: 'medium',
  completed: false,
  createdAt: 123,
} as const

describe('isPriority', () => {
  it('接受合法优先级', () => {
    expect(isPriority('high')).toBe(true)
    expect(isPriority('medium')).toBe(true)
    expect(isPriority('low')).toBe(true)
  })

  it('拒绝非法值', () => {
    expect(isPriority('urgent')).toBe(false)
    expect(isPriority('')).toBe(false)
    expect(isPriority(null)).toBe(false)
    expect(isPriority(undefined)).toBe(false)
    expect(isPriority(1)).toBe(false)
  })
})

describe('isFilter', () => {
  it('接受合法筛选值', () => {
    expect(isFilter('all')).toBe(true)
    expect(isFilter('active')).toBe(true)
    expect(isFilter('completed')).toBe(true)
  })

  it('拒绝非法值', () => {
    expect(isFilter('done')).toBe(false)
    expect(isFilter(0)).toBe(false)
  })
})

describe('isTodo', () => {
  it('接受结构完整的 Todo', () => {
    expect(isTodo(validTodo)).toBe(true)
  })

  it('拒绝缺字段的对象', () => {
    const missingId = { title: 't', content: '', priority: 'medium', completed: false, createdAt: 123 }
    expect(isTodo(missingId)).toBe(false)
  })

  it('拒绝字段类型错误的对象', () => {
    expect(isTodo({ ...validTodo, priority: 'urgent' })).toBe(false)
    expect(isTodo({ ...validTodo, completed: 'yes' })).toBe(false)
    expect(isTodo({ ...validTodo, createdAt: 'now' })).toBe(false)
    expect(isTodo({ ...validTodo, title: 42 })).toBe(false)
  })

  it('拒绝非对象', () => {
    expect(isTodo(null)).toBe(false)
    expect(isTodo('todo')).toBe(false)
    expect(isTodo(42)).toBe(false)
    expect(isTodo(undefined)).toBe(false)
  })
})
