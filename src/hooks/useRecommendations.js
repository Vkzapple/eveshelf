import { useQuery } from '@tanstack/react-query'
import { fetchRecommendations } from '../lib/api'
import { isSupabaseConfigured } from '../lib/supabase'

export const RECOMMENDATIONS_KEY = ['recommendations']

export function useRecommendations() {
  return useQuery({
    queryKey: RECOMMENDATIONS_KEY,
    queryFn: fetchRecommendations,
    enabled: isSupabaseConfigured,
  })
}
