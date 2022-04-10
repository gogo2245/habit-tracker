export enum HabitInterval {
  daily = 0,
  weekly = 1,
  monthly,
}

export type Habit = {
  id: string
  name: string
  description?: string
  interval: HabitInterval
  repetition: number
}
