import { create } from 'zustand'
import {
  getEvent,
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getWeeklyEvents,
  getMonthlyEvents,
  getDailyEvents
} from '@/api/event'
import { Event } from '@/types/event'
import { ApiError } from '@/types/errors' // ApiError 타입 import

interface EventStore {
  events: Event[]
  loading: boolean
  error: ApiError | null // error 타입을 ApiError로 명시
  fetchEvents: () => Promise<void>
  fetchEventById: (event_id: number) => Promise<void>
  addEvent: (newEvent: Omit<Event, 'event_id'>) => Promise<void>
  updateEvent: (event_id: number, updatedEvent: Partial<Event>) => Promise<void>
  deleteEvent: (event_id: number) => Promise<void>
  fetchWeeklyEvents: () => Promise<void>
  fetchMonthlyEvents: () => Promise<void>
  fetchDailyEvents: () => Promise<void>
}

export const useEventStore = create<EventStore>(set => ({
  events: [],
  loading: false,
  error: null,

  fetchEvents: async () => {
    set({ loading: true, error: null })
    try {
      const events = await getAllEvents()
      set({ events })
    } catch (error) {
      set({ error: error as ApiError }) // ApiError로 처리
    } finally {
      set({ loading: false })
    }
  },

  fetchEventById: async (event_id: number) => {
    set({ loading: true, error: null })
    try {
      const event = await getEvent(event_id)
      set(state => ({
        events: state.events.map(ev => (ev.event_id === event_id ? event : ev))
      }))
    } catch (error) {
      set({ error: error as ApiError }) // ApiError로 처리
    } finally {
      set({ loading: false })
    }
  },

  // Add a new event
  addEvent: async (newEvent: Omit<Event, 'event_id'>) => {
    set({ loading: true, error: null })
    try {
      const addedEvent = await createEvent(newEvent)
      set(state => ({ events: [...state.events, addedEvent] }))
    } catch (error) {
      set({ error: error as ApiError }) // ApiError로 처리
    } finally {
      set({ loading: false })
    }
  },

  updateEvent: async (event_id: number, updatedEvent: Partial<Event>) => {
    set({ loading: true, error: null })
    try {
      const updated = await updateEvent(event_id, updatedEvent)
      set(state => ({
        events: state.events.map(ev =>
          ev.event_id === event_id ? updated : ev
        )
      }))
    } catch (error) {
      set({ error: error as ApiError }) // ApiError로 처리
    } finally {
      set({ loading: false })
    }
  },

  deleteEvent: async (event_id: number) => {
    set({ loading: true, error: null })
    try {
      await deleteEvent(event_id)
      set(state => ({
        events: state.events.filter(ev => ev.event_id !== event_id)
      }))
    } catch (error) {
      set({ error: error as ApiError }) // ApiError로 처리
    } finally {
      set({ loading: false })
    }
  },

  fetchWeeklyEvents: async () => {
    set({ loading: true, error: null })
    try {
      const weeklyEvents = await getWeeklyEvents()
      set({ events: weeklyEvents })
    } catch (error) {
      set({ error: error as ApiError }) // ApiError로 처리
    } finally {
      set({ loading: false })
    }
  },

  fetchMonthlyEvents: async () => {
    set({ loading: true, error: null })
    try {
      const monthlyEvents = await getMonthlyEvents()
      set({ events: monthlyEvents })
    } catch (error) {
      set({ error: error as ApiError }) // ApiError로 처리
    } finally {
      set({ loading: false })
    }
  },

  fetchDailyEvents: async () => {
    set({ loading: true, error: null })
    try {
      const dailyEvents = await getDailyEvents()
      set({ events: dailyEvents })
    } catch (error) {
      set({ error: error as ApiError }) // ApiError로 처리
    } finally {
      set({ loading: false })
    }
  }
}))
