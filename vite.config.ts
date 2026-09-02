/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Vite 配置：仅注册 Vue 插件；测试走 vitest 默认 node 环境（核心逻辑为纯 TS，无需 jsdom）
export default defineConfig({
  plugins: [vue()],
})
