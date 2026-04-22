export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          role: 'student' | 'admin'
          full_name: string | null
          created_at: string
        }
        Insert: {
          id: string
          email?: string | null
          role?: 'student' | 'admin'
          full_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          role?: 'student' | 'admin'
          full_name?: string | null
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          date: string
          time: string
          venue: string
          category: EventCategory
          description: string | null
          poster_url: string | null
          status: EventStatus
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          date: string
          time: string
          venue: string
          category: EventCategory
          description?: string | null
          poster_url?: string | null
          status?: EventStatus
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          date?: string
          time?: string
          venue?: string
          category?: EventCategory
          description?: string | null
          poster_url?: string | null
          status?: EventStatus
          created_at?: string
        }
      }
      registrations: {
        Row: {
          id: string
          event_id: string
          user_id: string
          registered_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          registered_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          registered_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

export type EventCategory = 'Technical' | 'Cultural' | 'Robotics' | 'Workshop' | 'Seminar' | 'Other'
export type EventStatus = 'Upcoming' | 'Completed'
export type UserRole = 'student' | 'admin'

export interface Event {
  id: string
  title: string
  date: string
  time: string
  venue: string
  category: EventCategory
  description: string | null
  poster_url: string | null
  status: EventStatus
  created_at: string
  registrant_count?: number
}

export interface Profile {
  id: string
  email: string | null
  role: UserRole
  full_name: string | null
  created_at: string
}

export interface Registration {
  id: string
  event_id: string
  user_id: string
  registered_at: string
  event?: Event
}

export interface EventFilters {
  search: string
  category: EventCategory | 'All'
  status: EventStatus | 'All'
  dateFrom: string
  dateTo: string
}
