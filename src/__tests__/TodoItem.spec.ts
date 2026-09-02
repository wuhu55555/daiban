// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoItem from '../components/TodoItem.vue'
import type { Todo } from '../types/todo'

const todo: Todo = {
  id: '1',
  title: '买牛奶',
  content: '记得打折',
  priority: 'high',
  completed: false,
  createdAt: 100,
}

describe('TodoItem', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('渲染标题、内容与优先级标签', () => {
    const wrapper = mount(TodoItem, { props: { todo } })
    expect(wrapper.text()).toContain('买牛奶')
    expect(wrapper.text()).toContain('记得打折')
    expect(wrapper.text()).toContain('高')
  })

  it('已完成事项标题带删除线 class 且 checkbox 勾选', () => {
    const wrapper = mount(TodoItem, { props: { todo: { ...todo, completed: true } } })
    expect(wrapper.find('.todo-item__title').classes()).toContain('todo-item__title--done')
    expect((wrapper.find('input[type="checkbox"]').element as HTMLInputElement).checked).toBe(true)
  })

  it('勾选触发 toggle 事件', async () => {
    const wrapper = mount(TodoItem, { props: { todo } })
    await wrapper.find('input[type="checkbox"]').trigger('change')
    expect(wrapper.emitted('toggle')?.[0]).toEqual(['1'])
  })

  it('点击编辑触发 edit 事件', async () => {
    const wrapper = mount(TodoItem, { props: { todo } })
    await wrapper.findAll('button').find((b) => b.text() === '编辑')!.trigger('click')
    expect(wrapper.emitted('edit')?.[0]).toEqual([todo])
  })

  it('confirm 确认后触发 remove 事件', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const wrapper = mount(TodoItem, { props: { todo } })
    await wrapper.findAll('button').find((b) => b.text() === '删除')!.trigger('click')
    expect(window.confirm).toHaveBeenCalledWith('确定删除「买牛奶」吗？')
    expect(wrapper.emitted('remove')?.[0]).toEqual(['1'])
  })

  it('confirm 取消时不触发 remove 事件', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    const wrapper = mount(TodoItem, { props: { todo } })
    await wrapper.findAll('button').find((b) => b.text() === '删除')!.trigger('click')
    expect(wrapper.emitted('remove')).toBeUndefined()
  })

  it('操作按钮与勾选框带明确 aria-label', () => {
    const wrapper = mount(TodoItem, { props: { todo } })
    const btns = wrapper.findAll('button')
    expect(btns[0].attributes('aria-label')).toBe('编辑买牛奶')
    expect(btns[1].attributes('aria-label')).toBe('删除买牛奶')
    expect(wrapper.find('input[type="checkbox"]').attributes('aria-label')).toBe('标记买牛奶完成')
  })
})
