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
      transactions: {
        Row: {
          id: string
          description: string
          amount: number
          type: 'income' | 'expense'
          category: string
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          description: string
          amount: number
          type: 'income' | 'expense'
          category: string
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          description?: string
          amount?: number
          type?: 'income' | 'expense'
          category?: string
          date?: string
          created_at?: string
        }
      }
    }
  }
}