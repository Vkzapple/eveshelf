import { supabase } from './supabase'

const COLUMNS =
  'id,title,author,country,year,genre,status,rating,review,cover,link,created_at'

const toBook = (row) => ({
  id: row.id,
  title: row.title,
  author: row.author,
  country: row.country,
  year: row.year ?? '',
  genre: row.genre,
  status: row.status,
  rating: row.rating,
  review: row.review,
  cover: row.cover,
  link: row.link,
  addedAt: row.created_at,
})

const toRow = (book) => ({
  title: book.title.trim(),
  author: book.author?.trim() || '',
  country: book.country?.trim() || '',
  year: book.year === '' || book.year == null ? null : Number(book.year),
  genre: book.genre?.trim() || '',
  status: book.status === 'read' ? 'read' : 'wishlist',
  rating: book.status === 'read' ? Number(book.rating) || 0 : 0,
  review: book.review?.trim() || '',
  cover: book.cover?.trim() || '',
  link: book.link?.trim() || '',
})

const unwrap = ({ data, error }) => {
  if (error) throw error
  return data
}

export async function fetchBooks() {
  const { data, error } = await supabase
    .from('books')
    .select(COLUMNS)
    .order('created_at', { ascending: false })

  return unwrap({ data, error }).map(toBook)
}

export async function createBook(book) {
  const { data, error } = await supabase
    .from('books')
    .insert(toRow(book))
    .select(COLUMNS)
    .single()

  return toBook(unwrap({ data, error }))
}

export async function updateBook(id, book) {
  const { data, error } = await supabase
    .from('books')
    .update(toRow(book))
    .eq('id', id)
    .select(COLUMNS)
    .single()

  return toBook(unwrap({ data, error }))
}

export async function updateBookStatus(id, status) {
  const { error } = await supabase.from('books').update({ status }).eq('id', id)
  if (error) throw error
}

export async function deleteBook(id) {
  const { error } = await supabase.from('books').delete().eq('id', id)
  if (error) throw error
}

export async function importBooks(books) {
  const { error } = await supabase.from('books').insert(books.map(toRow))
  if (error) throw error
}
