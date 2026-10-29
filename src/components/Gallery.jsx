import { useMemo, useState } from 'react'
import BookCard from './BookCard'

const FILTERS = [
  { key: 'semua', label: 'Semua' },
  { key: 'baca', label: 'Sudah dibaca' },
  { key: 'wishlist', label: 'Wishlist' },
]

export default function Gallery({ books }) {
  const [filter, setFilter] = useState('semua')
  const visible = useMemo(
    () => (filter === 'semua' ? books : books.filter((b) => b.status === filter)),
    [books, filter],
  )

  return (
    <section id="rak" className="shelf">
      <div className="shelf-head">
        <h2>Koleksi</h2>
        <div className="filters" role="group" aria-label="Filter buku">
          {FILTERS.map(({ key, label }) => (
            <button key={key} aria-pressed={filter === key} onClick={() => setFilter(key)}>{label}</button>
          ))}
        </div>
      </div>
      <div className="grid">
        {visible.map((b, i) => <BookCard key={b.title} book={b} index={i} />)}
      </div>
      <p className="hint">Klik sampul untuk membuka halaman bukunya di Gramedia.</p>
    </section>
  )
}
