// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoStats from '../components/TodoStats.vue'

describe('TodoStats', () => {
  it('渲染总数与未完成数', () => {
    const wrapper = mount(TodoStats, { props: { totalCount: 5, activeCount: 2 } })
    expect(wrapper.text()).toContain('共 5 项')
    expect(wrapper.text()).toContain('未完成 2 项')
  })

  it('零值正常渲染', () => {
    const wrapper = mount(TodoStats, { props: { totalCount: 0, activeCount: 0 } })
    expect(wrapper.text()).toContain('共 0 项')
    expect(wrapper.text()).toContain('未完成 0 项')
  })
})
