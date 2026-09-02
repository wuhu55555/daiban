// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoFilter from '../components/TodoFilter.vue'

describe('TodoFilter', () => {
  it('渲染三个筛选按钮', () => {
    const wrapper = mount(TodoFilter, { props: { modelValue: 'all' } })
    const btns = wrapper.findAll('button')
    expect(btns).toHaveLength(3)
    expect(btns.map((b) => b.text())).toEqual(['全部', '未完成', '已完成'])
  })

  it('点击按钮发出 update:modelValue', async () => {
    const wrapper = mount(TodoFilter, { props: { modelValue: 'all' } })
    await wrapper.findAll('button')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['active'])
  })

  it('当前筛选对应按钮带激活态 class', () => {
    const wrapper = mount(TodoFilter, { props: { modelValue: 'completed' } })
    const btns = wrapper.findAll('button')
    expect(btns[2].classes()).toContain('todo-filter__btn--active')
    expect(btns[0].classes()).not.toContain('todo-filter__btn--active')
  })
})
