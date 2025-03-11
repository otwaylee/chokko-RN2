export interface Todo {
  todolist_id: number
  title: string
  startDatetime: string
  endDatetime?: string
  isRecurring: string
  category?: string
  memo?: string
  notification?: boolean
  completed: boolean
  allDay?: boolean
  user?: {
    id: number
    email: string
    username: string
    pets?: Array<{
      pet_id: number
      pet_name: string
      species: number
      pet_registration_number: string
      date_of_birth: string
      gender: string
      neutering: string
      breed: string
    }>
  }
}
