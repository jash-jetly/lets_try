export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          age: number
          encrypted_passphrase: string
          id_document_url: string | null
          face_verification_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name: string
          last_name: string
          age: number
          encrypted_passphrase: string
          id_document_url?: string | null
          face_verification_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          age?: number
          encrypted_passphrase?: string
          id_document_url?: string | null
          face_verification_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      vaults: {
        Row: {
          id: string
          user_id: string
          name: string
          monthly_amount: number
          start_date: string
          total_invested: number
          auto_debit: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          monthly_amount: number
          start_date: string
          total_invested?: number
          auto_debit?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          monthly_amount?: number
          start_date?: string
          total_invested?: number
          auto_debit?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}