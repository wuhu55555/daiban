<script setup lang="ts">
import type { Todo } from '../types/todo'

const props = defineProps<{
  todo: Todo
}>()

const emit = defineEmits<{
  (e: 'toggle', id: string): void
  (e: 'edit', todo: Todo): void
  (e: 'remove', id: string): void
}>()

/** 优先级展示配置：标签 + 颜色 class（高=红 / 中=橙 / 低=蓝） */
const priorityConfig: Record<Todo['priority'], { label: string; className: string }> = {
  high: { label: '高', className: 'todo-item__priority--high' },
  medium: { label: '中', className: 'todo-item__priority--medium' },
  low: { label: '低', className: 'todo-item__priority--low' },
}

function handleRemove(): void {
  // 删除前原生 confirm 确认（需求 Q2 确认项）
  if (window.confirm(`确定删除「${props.todo.title}」吗？`)) {
    emit('remove', props.todo.id)
  }
}
</script>

<template>
  <li class="todo-item" :class="{ 'todo-item--completed': todo.completed }">
    <input
      type="checkbox"
      class="todo-item__checkbox"
      :checked="todo.completed"
      :aria-label="`标记${todo.title}完成`"
      @change="emit('toggle', todo.id)"
    />
    <div class="todo-item__body">
      <p class="todo-item__title" :class="{ 'todo-item__title--done': todo.completed }">
        {{ todo.title }}
      </p>
      <p v-if="todo.content" class="todo-item__content">{{ todo.content }}</p>
    </div>
    <span class="todo-item__priority" :class="priorityConfig[todo.priority].className">
      {{ priorityConfig[todo.priority].label }}
    </span>
    <div class="todo-item__actions">
      <button
        type="button"
        class="todo-item__btn"
        :aria-label="`编辑${todo.title}`"
        @click="emit('edit', todo)"
      >
        编辑
      </button>
      <button
        type="button"
        class="todo-item__btn todo-item__btn--danger"
        :aria-label="`删除${todo.title}`"
        @click="handleRemove"
      >
        删除
      </button>
    </div>
  </li>
</template>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: #fff;
  border: 1px solid #e5e6eb;
  border-radius: 8px;
  transition: background 0.2s;
}

.todo-item--completed {
  background: #f7f8fa;
}

.todo-item__checkbox {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  cursor: pointer;
}

.todo-item__body {
  flex: 1;
  min-width: 0;
}

.todo-item__title {
  font-size: 15px;
  color: #1f2329;
  word-break: break-all;
}

.todo-item__title--done {
  /* 已完成：删除线 + 弱化（需求规则） */
  text-decoration: line-through;
  color: #86909c;
}

.todo-item__content {
  font-size: 13px;
  color: #86909c;
  margin-top: 2px;
  word-break: break-all;
}

.todo-item__priority {
  flex-shrink: 0;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.todo-item__priority--high {
  background: #ffece8;
  color: #d83931;
}

.todo-item__priority--medium {
  background: #fff3e8;
  color: #d97706;
}

.todo-item__priority--low {
  background: #e8f3ff;
  color: #3370ff;
}

.todo-item__actions {
  flex-shrink: 0;
  display: flex;
  gap: 6px;
}

.todo-item__btn {
  padding: 4px 10px;
  font-size: 13px;
  border: 1px solid #d0d3d6;
  border-radius: 6px;
  background: #fff;
  color: #4e5969;
  cursor: pointer;
}

.todo-item__btn:hover {
  border-color: #3370ff;
  color: #3370ff;
}

.todo-item__btn--danger:hover {
  border-color: #d83931;
  color: #d83931;
}
</style>
