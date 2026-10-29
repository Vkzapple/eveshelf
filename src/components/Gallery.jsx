import { useCallback, useMemo, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import BookCard from './BookCard'
import BookDetail from './BookDetail'

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'read', label: 'Read' },
  { key: 'wishlist', label: 'Wishlist' },
]

export default function Gallery({ books, loading, error }) {
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const closeDetail = useCallback(() => setSelected(null), [])

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase()
    return books.filter((book) => {
      const matchesFilter = filter === 'all' || book.status === filter
      const matchesQuery =
        !term ||
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term) ||
        book.genre.toLowerCase().includes(term)
      return matchesFilter && matchesQuery
    })
  }, [books, filter, query])

  return (
    <section id="shelf" className="shelf">
      <div className="section-head">
        <div>
          <p className="eyebrow">The collection</p>
          <h2>What is on the shelf</h2>
        </div>
        <label className="search">
          <Search size={16} />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title, author, genre"
            aria-label="Search books"
          />
        </label>
      </div>

      <div className="toolbar">
        <div className="filters" role="group" aria-label="Filter books">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              aria-pressed={filter === key}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="result-count">
          <SlidersHorizontal size={14} />
          {visible.length} {visible.length === 1 ? 'book' : 'books'}
        </p>
      </div>

      {loading ? (
        <p className="empty">Loading the shelf…</p>
      ) : error ? (
        <p className="empty">Could not load the shelf. {error.message}</p>
      ) : visible.length > 0 ? (
        <div className="book-grid">
          {visible.map((book, index) => (
            <BookCard key={book.id} book={book} index={index} onOpen={setSelected} />
          ))}
        </div>
      ) : (
        <p className="empty">No books match that search yet.</p>
      )}

      {selected && <BookDetail book={selected} onClose={closeDetail} />}
    </section>
  )
}
