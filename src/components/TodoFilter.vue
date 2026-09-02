<script setup lang="ts">
import type { Filter } from '../types/todo'

defineProps<{
  modelValue: Filter
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: Filter): void
}>()

/** 筛选选项：全部 / 未完成 / 已完成 */
const options: { value: Filter; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'active', label: '未完成' },
  { value: 'completed', label: '已完成' },
]

function select(value: Filter): void {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="todo-filter">
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      class="todo-filter__btn"
      :class="{ 'todo-filter__btn--active': modelValue === opt.value }"
      :aria-pressed="modelValue === opt.value"
      @click="select(opt.value)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

<style scoped>
.todo-filter {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.todo-filter__btn {
  padding: 6px 16px;
  font-size: 14px;
  border: 1px solid #d0d3d6;
  border-radius: 6px;
  background: #fff;
  color: #4e5969;
  cursor: pointer;
  transition:
    border-color 0.2s,
    color 0.2s,
    background 0.2s;
}

.todo-filter__btn:hover {
  border-color: #3370ff;
  color: #3370ff;
}

.todo-filter__btn--active {
  background: #3370ff;
  border-color: #3370ff;
  color: #fff;
}
</style>
