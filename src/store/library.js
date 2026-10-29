import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SEED_BOOKS } from '../data/books'
import { createId, STATUS } from '../lib/book'

const normalize = (book) => ({
  id: book.id || createId(),
  title: book.title?.trim() || 'Untitled',
  author: book.author?.trim() || '',
  country: book.country?.trim() || '',
  year: Number(book.year) || '',
  genre: book.genre?.trim() || '',
  status: book.status === STATUS.read ? STATUS.read : STATUS.wishlist,
  rating: Math.max(0, Math.min(5, Number(book.rating) || 0)),
  review: book.review?.trim() || '',
  cover: book.cover?.trim() || '',
  link: book.link?.trim() || '',
  addedAt: book.addedAt || Date.now(),
})

export const useLibrary = create(
  persist(
    (set) => ({
      books: SEED_BOOKS,

      addBook: (book) =>
        set((state) => ({
          books: [
            { ...normalize(book), id: createId(), addedAt: Date.now() },
            ...state.books,
          ],
        })),

      updateBook: (id, patch) =>
        set((state) => ({
          books: state.books.map((book) =>
            book.id === id ? normalize({ ...book, ...patch }) : book,
          ),
        })),

      removeBook: (id) =>
        set((state) => ({ books: state.books.filter((book) => book.id !== id) })),

      restoreBook: (book) =>
        set((state) => ({ books: [book, ...state.books] })),

      toggleStatus: (id) =>
        set((state) => ({
          books: state.books.map((book) =>
            book.id === id
              ? {
                  ...book,
                  status: book.status === STATUS.read ? STATUS.wishlist : STATUS.read,
                }
              : book,
          ),
        })),

      replaceBooks: (books) => set({ books: books.map(normalize) }),

      resetBooks: () => set({ books: SEED_BOOKS }),
    }),
    { name: 'eveshelf:library', version: 1 },
  ),
)
