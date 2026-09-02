// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import App from '../App.vue'

/** 通过表单新增一条事项 */
async function addTodo(wrapper: VueWrapper, title: string, content = ''): Promise<void> {
  await wrapper.find('input[aria-label="标题"]').setValue(title)
  if (content) await wrapper.find('textarea[aria-label="内容"]').setValue(content)
  await wrapper.find('form').trigger('submit')
}

/** 点击文本匹配的按钮 */
async function clickButton(wrapper: VueWrapper, text: string): Promise<void> {
  const btn = wrapper.findAll('button').find((b) => b.text() === text)
  if (!btn) throw new Error(`未找到按钮：${text}`)
  await btn.trigger('click')
}

describe('App 集成', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.stubGlobal('confirm', vi.fn(() => true))
  })

  it('新增事项后列表出现且统计更新', async () => {
    const wrapper = mount(App)
    await addTodo(wrapper, '买牛奶', '记得打折')
    expect(wrapper.text()).toContain('买牛奶')
    expect(wrapper.text()).toContain('记得打折')
    expect(wrapper.text()).toContain('共 1 项')
    expect(wrapper.text()).toContain('未完成 1 项')
  })

  it('编辑事项流程：填充旧值→修改→保存', async () => {
    const wrapper = mount(App)
    await addTodo(wrapper, '旧标题')
    await clickButton(wrapper, '编辑')
    await wrapper.find('input[aria-label="标题"]').setValue('新标题')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.text()).toContain('新标题')
    expect(wrapper.text()).not.toContain('旧标题')
  })

  it('勾选完成 + 筛选联动', async () => {
    const wrapper = mount(App)
    await addTodo(wrapper, '任务A')
    await wrapper.find('input[type="checkbox"]').trigger('change')
    // 已完成视图可见
    await clickButton(wrapper, '已完成')
    expect(wrapper.text()).toContain('任务A')
    // 未完成视图不可见
    await clickButton(wrapper, '未完成')
    expect(wrapper.text()).not.toContain('任务A')
  })

  it('删除事项需 confirm 确认', async () => {
    const wrapper = mount(App)
    await addTodo(wrapper, '待删除')
    await clickButton(wrapper, '删除')
    expect(window.confirm).toHaveBeenCalled()
    expect(wrapper.text()).not.toContain('待删除')
    expect(wrapper.text()).toContain('共 0 项')
  })

  it('刷新（重新挂载）后数据持久化保留', async () => {
    const wrapper = mount(App)
    await addTodo(wrapper, '持久化任务')
    wrapper.unmount()
    const remounted = mount(App)
    expect(remounted.text()).toContain('持久化任务')
  })

  it('空列表显示空态引导文案', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('暂无事项，添加第一条待办吧')
  })

  it('筛选无结果时显示对应空态', async () => {
    const wrapper = mount(App)
    await addTodo(wrapper, '任务A')
    // 标为完成后，未完成筛选下无结果
    await wrapper.find('input[type="checkbox"]').trigger('change')
    await clickButton(wrapper, '未完成')
    expect(wrapper.text()).toContain('当前筛选下暂无事项')
  })
})
