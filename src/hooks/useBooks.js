import { useQuery } from '@tanstack/react-query'
import { fetchBooks } from '../lib/api'
import { isSupabaseConfigured } from '../lib/supabase'

export const BOOKS_KEY = ['books']

export function useBooks() {
  return useQuery({
    queryKey: BOOKS_KEY,
    queryFn: fetchBooks,
    enabled: isSupabaseConfigured,
  })
}
