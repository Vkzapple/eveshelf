import { useQuery } from '@tanstack/react-query'
import { findCoverUrl } from '../lib/covers'

export function useBookCover(book) {
  const { data } = useQuery({
    queryKey: ['cover', book.id, book.title, book.author],
    queryFn: () => findCoverUrl(book.title, book.author),
    enabled: Boolean(book.title && !book.cover),
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
  })

  return book.cover || data || ''
}