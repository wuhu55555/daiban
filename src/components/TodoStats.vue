<script setup lang="ts">
/** 顶部统计：总数 / 未完成数（需求功能 1），纯展示组件 */
defineProps<{
  totalCount: number
  activeCount: number
}>()
</script>

<template>
  <p class="todo-stats">
    共 <strong>{{ totalCount }}</strong> 项 · 未完成 <strong>{{ activeCount }}</strong> 项
  </p>
</template>

<style scoped>
.todo-stats {
  color: #646a73;
  font-size: 14px;
  margin: 8px 0 12px;
}

.todo-stats strong {
  color: #1f2329;
  font-weight: 600;
}
</style>
