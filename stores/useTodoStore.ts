import { create } from 'zustand'
import {
  createTodo,
  deleteTodo,
  getUserTodos,
  updateTodo,
  updateTodoCompleted
} from '@/api/todo'
import { Todo } from '@/types/todo' // Todo 인터페이스 import
import { ApiError } from '@/types/errors' // ApiError 타입 import

interface TodoStore {
  todos: Todo[]
  loading: boolean
  error: ApiError | null // error를 ApiError로 설정
  fetchTodos: (user_id: number) => Promise<void>
  addTodo: (newTodo: Omit<Todo, 'todolist_id'>) => Promise<void>
  updateTodo: (todolist_id: number, updatedTodo: Partial<Todo>) => Promise<void>
  deleteTodo: (todolist_id: number) => Promise<void>
  completeTodo: (todolist_id: number, isCompleted: boolean) => Promise<void>
}

// Zustand 스토어 생성
export const useTodoStore = create<TodoStore>(set => ({
  todos: [],
  loading: false,
  error: null,

  // todo 목록 불러오기
  fetchTodos: async (user_id: number) => {
    set({ loading: true, error: null })
    try {
      const todos = await getUserTodos(user_id)
      set({ todos })
    } catch (error) {
      set({ error: error as ApiError }) // ApiError로 처리
    } finally {
      set({ loading: false })
    }
  },

  // 새로운 todo 추가
  addTodo: async (newTodo: Omit<Todo, 'todolist_id'>) => {
    set({ loading: true, error: null })
    try {
      const addedTodo = await createTodo(newTodo)
      set(state => ({ todos: [...state.todos, addedTodo] }))
    } catch (error) {
      set({ error: error as ApiError }) // ApiError로 처리
    } finally {
      set({ loading: false })
    }
  },

  // todo 업데이트
  updateTodo: async (todolist_id: number, updatedTodo: Partial<Todo>) => {
    set({ loading: true, error: null })
    try {
      const updated = await updateTodo(todolist_id, updatedTodo)
      set(state => ({
        todos: state.todos.map(todo =>
          todo.todolist_id === todolist_id ? updated : todo
        )
      }))
    } catch (error) {
      set({ error: error as ApiError }) // ApiError로 처리
    } finally {
      set({ loading: false })
    }
  },

  // todo 삭제
  deleteTodo: async (todolist_id: number) => {
    set({ loading: true, error: null })
    try {
      await deleteTodo(todolist_id)
      set(state => ({
        todos: state.todos.filter(todo => todo.todolist_id !== todolist_id)
      }))
    } catch (error) {
      set({ error: error as ApiError }) // ApiError로 처리
    } finally {
      set({ loading: false })
    }
  },

  // todo 완료 상태 변경
  completeTodo: async (todolist_id: number, isCompleted: boolean) => {
    set({ loading: true, error: null })
    try {
      const updated = await updateTodoCompleted(todolist_id, isCompleted)
      set(state => ({
        todos: state.todos.map(todo =>
          todo.todolist_id === todolist_id ? updated : todo
        )
      }))
    } catch (error) {
      set({ error: error as ApiError }) // ApiError로 처리
    } finally {
      set({ loading: false })
    }
  }
}))
