import axios from 'axios';
import { Event } from '@/types/event';
import apiClient from './apiClient';

// GET: 특정 event 가져오기
export async function getEvent(event_id: number): Promise<Event> {
  const response = await apiClient.get<Event>(`/events/${event_id}`);
  return response.data;
}

// GET: 모든 event 가져오기
export async function getAllEvents(): Promise<Event[]> {
  const response = await apiClient.get<Event[]>(`/events`);
  return response.data;
}

// POST: 새로운 event 생성
export async function createEvent(
  newEvent: Omit<Event, 'event_id'>
): Promise<Event> {
  const response = await apiClient.post<Event>(`/events`, newEvent);
  return response.data;
}

// PUT: event 수정
export async function updateEvent(
  event_id: number,
  updatedEvent: Partial<Event>
): Promise<Event> {
  const response = await apiClient.put<Event>(
    `/events/${event_id}`,
    updatedEvent
  );
  return response.data;
}

// DELETE: event 삭제
export async function deleteEvent(event_id: number): Promise<void> {
  await apiClient.delete(`/events/${event_id}`);
}

// GET: 주간 이벤트 목록 가져오기
export async function getWeeklyEvents(): Promise<Event[]> {
  const response = await apiClient.get<Event[]>(`/api/events/events/week`);
  return response.data;
}

// GET: 월간 이벤트 목록 가져오기
export async function getMonthlyEvents(): Promise<Event[]> {
  const response = await apiClient.get<Event[]>(`/events/events/month`);
  return response.data;
}

// GET: 일간 이벤트 목록 가져오기
export async function getDailyEvents(): Promise<Event[]> {
  const response = await apiClient.get<Event[]>(`/events/events/day`);
  return response.data;
}
