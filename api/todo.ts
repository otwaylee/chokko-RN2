import axios from 'axios';
import { Todo } from '@/types/todo'; // 인터페이스 import
import apiClient from './apiClient';

// GET: 특정 todo 항목 가져오기
export async function getTodo(todolist_id: number): Promise<Todo> {
  const response = await apiClient.get<Todo>(`/todolists/${todolist_id}`);
  return response.data;
}

// GET: 특정 유저의 todo 목록 가져오기
export async function getUserTodos(user_id: number): Promise<Todo[]> {
  const response = await apiClient.get<Todo[]>(`/todolists/user/${user_id}`);
  return response.data;
}

// POST: 새로운 todo 항목 생성
export async function createTodo(
  newTodo: Omit<Todo, 'todolist_id'>
): Promise<Todo> {
  const response = await apiClient.post<Todo>(`/todolists`, newTodo);
  return response.data;
}

// PUT: todo 항목 수정
export async function updateTodo(
  todolist_id: number,
  updatedTodo: Partial<Todo>
): Promise<Todo> {
  const response = await apiClient.put<Todo>(
    `/todolists/${todolist_id}`,
    updatedTodo
  );
  return response.data;
}

// DELETE: todo 항목 삭제
export async function deleteTodo(todolist_id: number): Promise<void> {
  await apiClient.delete(`/todolists/${todolist_id}`);
}

// PATCH: todo 완료 상태 업데이트
export async function updateTodoCompleted(
  todolist_id: number,
  isCompleted: boolean
): Promise<Todo> {
  const response = await apiClient.patch<Todo>(
    `/todolists/${todolist_id}/complete`,
    null,
    {
      params: { isCompleted },
    }
  );
  return response.data;
}
