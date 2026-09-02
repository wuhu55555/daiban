<script setup lang="ts">
import { ref, watch } from 'vue'
import { TITLE_MAX_LENGTH, validateTitle } from '../hooks/useTodos'
import type { Priority, Todo } from '../types/todo'

const props = defineProps<{
  /** 编辑模式传入待编辑事项；null 表示新增模式 */
  todo: Todo | null
}>()

const emit = defineEmits<{
  (e: 'submit', draft: { title: string; content: string; priority: Priority }): void
  (e: 'cancel'): void
}>()

/** 优先级选项：高 / 中 / 低 */
const priorityOptions: { value: Priority; label: string }[] = [
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' },
]

const title = ref('')
const content = ref('')
const priority = ref<Priority>('medium')
const error = ref('')

// 编辑模式初始化：todo 变化时填充表单；切回新增模式时清空
watch(
  () => props.todo,
  (todo) => {
    if (todo) {
      title.value = todo.title
      content.value = todo.content
      priority.value = todo.priority
      error.value = ''
    } else {
      reset()
    }
  },
  { immediate: true },
)

function reset(): void {
  title.value = ''
  content.value = ''
  priority.value = 'medium'
  error.value = ''
}

/** 编辑态按 Esc 取消编辑（UX 优化：键盘操作） */
function handleEsc(): void {
  if (props.todo) emit('cancel')
}

function handleSubmit(): void {
  // 标题校验（去空格非空 + ≤50 字），失败则拦截不发事件
  const message = validateTitle(title.value)
  if (message) {
    error.value = message
    return
  }
  emit('submit', { title: title.value.trim(), content: content.value, priority: priority.value })
  reset()
}
</script>

<template>
  <form class="todo-form" @submit.prevent="handleSubmit" @keydown.esc="handleEsc">
    <div class="todo-form__row">
      <input
        v-model="title"
        type="text"
        class="todo-form__input"
        placeholder="标题（必填）"
        :maxlength="TITLE_MAX_LENGTH"
        aria-label="标题"
        @keydown.enter.prevent="handleSubmit"
      />
      <select v-model="priority" class="todo-form__select" aria-label="优先级">
        <option v-for="opt in priorityOptions" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </div>
    <textarea
      v-model="content"
      class="todo-form__textarea"
      placeholder="内容（可选）"
      rows="2"
      aria-label="内容"
    ></textarea>
    <p v-if="error" class="todo-form__error">{{ error }}</p>
    <div class="todo-form__actions">
      <button type="submit" class="todo-form__submit">{{ todo ? '保存' : '添加' }}</button>
      <button v-if="todo" type="button" class="todo-form__cancel" @click="emit('cancel')">
        取消
      </button>
    </div>
  </form>
</template>

<style scoped>
.todo-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.todo-form__row {
  display: flex;
  gap: 8px;
}

.todo-form__input {
  flex: 1;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #d0d3d6;
  border-radius: 6px;
  outline: none;
}

.todo-form__input:focus,
.todo-form__select:focus,
.todo-form__textarea:focus {
  border-color: #3370ff;
}

.todo-form__select {
  padding: 8px 10px;
  font-size: 14px;
  border: 1px solid #d0d3d6;
  border-radius: 6px;
  background: #fff;
  outline: none;
}

.todo-form__textarea {
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  font-family: inherit;
  border: 1px solid #d0d3d6;
  border-radius: 6px;
  outline: none;
  resize: vertical;
}

.todo-form__error {
  color: #d83931;
  font-size: 13px;
}

.todo-form__actions {
  display: flex;
  gap: 8px;
}

.todo-form__submit {
  padding: 8px 24px;
  font-size: 14px;
  border: none;
  border-radius: 6px;
  background: #3370ff;
  color: #fff;
  cursor: pointer;
}

.todo-form__submit:hover {
  background: #1d5ceb;
}

.todo-form__cancel {
  padding: 8px 16px;
  font-size: 14px;
  border: 1px solid #d0d3d6;
  border-radius: 6px;
  background: #fff;
  color: #4e5969;
  cursor: pointer;
}
</style>
