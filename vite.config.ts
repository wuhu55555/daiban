/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Vite 配置：注册 Vue 插件；base 适配 GitHub Pages 项目页（子路径 /daiban/）
// 测试走 vitest 默认 node 环境（核心逻辑为纯 TS，无需 jsdom）
export default defineConfig({
  base: '/daiban/',
  plugins: [vue()],
})
