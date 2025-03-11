export interface Event {
  event_id: number
  title: string
  emoticon?: string
  startDatetime: string
  endDatetime: string
  isRecurring: string
  memo: string
  category: string
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
  allDay: boolean
}
