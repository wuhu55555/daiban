<script setup lang="ts">
import { computed, ref } from 'vue'
import TodoFilter from './components/TodoFilter.vue'
import TodoForm from './components/TodoForm.vue'
import TodoItem from './components/TodoItem.vue'
import TodoStats from './components/TodoStats.vue'
import { useTodos } from './hooks/useTodos'
import type { Filter, Priority, Todo } from './types/todo'

const {
  todos,
  totalCount,
  activeCount,
  addTodo,
  updateTodo,
  toggleCompleted,
  removeTodo,
  filteredTodos,
} = useTodos()

const filter = ref<Filter>('all')
const editingTodo = ref<Todo | null>(null)

function handleSubmit(draft: { title: string; content: string; priority: Priority }): void {
  if (editingTodo.value) {
    updateTodo(editingTodo.value.id, draft)
    editingTodo.value = null
  } else {
    addTodo(draft)
  }
}

function handleEdit(todo: Todo): void {
  editingTodo.value = todo
}

function handleCancelEdit(): void {
  editingTodo.value = null
}

const visibleTodos = computed(() => filteredTodos(filter.value))
</script>

<template>
  <main class="app">
    <h1 class="app__title">
      代办事项
    </h1>
    <TodoStats
      :total-count="totalCount"
      :active-count="activeCount"
    />
    <TodoFilter v-model="filter" />
    <TodoForm
      :todo="editingTodo"
      @submit="handleSubmit"
      @cancel="handleCancelEdit"
    />
    <ul class="todo-list">
      <TodoItem
        v-for="todo in visibleTodos"
        :key="todo.id"
        :todo="todo"
        @toggle="toggleCompleted"
        @edit="handleEdit"
        @remove="removeTodo"
      />
    </ul>
    <p
      v-if="visibleTodos.length === 0"
      class="todo-empty"
    >
      {{ todos.length === 0 ? '暂无事项，添加第一条待办吧' : '当前筛选下暂无事项' }}
    </p>
  </main>
</template>

<style scoped>
.app {
  max-width: 640px;
  margin: 0 auto;
  padding: 32px 16px;
}

.app__title {
  font-size: 24px;
  margin-bottom: 8px;
}

.todo-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.todo-empty {
  color: #86909c;
  text-align: center;
  padding: 32px 0;
}
</style>
