// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoForm from '../components/TodoForm.vue'
import { TITLE_MAX_LENGTH } from '../hooks/useTodos'
import type { Todo } from '../types/todo'

const editTodo: Todo = {
  id: '1',
  title: '旧标题',
  content: '旧内容',
  priority: 'high',
  completed: false,
  createdAt: 100,
}

describe('TodoForm 新增模式', () => {
  it('提交发出正确 draft 并清空表单', async () => {
    const wrapper = mount(TodoForm, { props: { todo: null } })
    await wrapper.find('input[aria-label="标题"]').setValue('  买牛奶  ')
    await wrapper.find('textarea[aria-label="内容"]').setValue('记得打折')
    await wrapper.find('select[aria-label="优先级"]').setValue('high')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('submit')?.[0]).toEqual([
      { title: '买牛奶', content: '记得打折', priority: 'high' },
    ])
    // 提交后清空表单
    expect((wrapper.find('input[aria-label="标题"]').element as HTMLInputElement).value).toBe('')
  })

  it('空标题提交被拦截并显示错误', async () => {
    const wrapper = mount(TodoForm, { props: { todo: null } })
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(wrapper.text()).toContain('标题不能为空')
  })

  it('标题输入框带 maxlength 限制', () => {
    const wrapper = mount(TodoForm, { props: { todo: null } })
    const input = wrapper.find('input[aria-label="标题"]')
    expect(input.attributes('maxlength')).toBe(String(TITLE_MAX_LENGTH))
  })

  it('新增模式按钮文案为添加且无取消按钮', () => {
    const wrapper = mount(TodoForm, { props: { todo: null } })
    expect(wrapper.find('button[type="submit"]').text()).toBe('添加')
    expect(wrapper.find('button[type="button"]').exists()).toBe(false)
  })
})

describe('TodoForm 编辑模式', () => {
  it('初始填充待编辑事项', () => {
    const wrapper = mount(TodoForm, { props: { todo: editTodo } })
    expect((wrapper.find('input[aria-label="标题"]').element as HTMLInputElement).value).toBe(
      '旧标题',
    )
    expect(
      (wrapper.find('textarea[aria-label="内容"]').element as HTMLTextAreaElement).value,
    ).toBe('旧内容')
    expect((wrapper.find('select[aria-label="优先级"]').element as HTMLSelectElement).value).toBe(
      'high',
    )
  })

  it('编辑模式按钮文案为保存且有取消按钮', () => {
    const wrapper = mount(TodoForm, { props: { todo: editTodo } })
    expect(wrapper.find('button[type="submit"]').text()).toBe('保存')
    expect(wrapper.find('button[type="button"]').exists()).toBe(true)
  })

  it('点击取消发出 cancel 事件', async () => {
    const wrapper = mount(TodoForm, { props: { todo: editTodo } })
    await wrapper.find('button[type="button"]').trigger('click')
    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })
})
