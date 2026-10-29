import { memo } from 'react'
import { Star } from 'lucide-react'
import BookCover from './BookCover'
import { STATUS_LABEL, stars } from '../lib/book'

function BookCard({ book, index, onOpen }) {
  return (
    <article
      className="book-card"
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
    >
      <button
        type="button"
        className="book-trigger"
        onClick={() => onOpen(book)}
        aria-label={`Open details for ${book.title}`}
      >
        <div className="book-cover-wrap">
          <BookCover book={book} />
          <span className={`pill pill-${book.status}`}>{STATUS_LABEL[book.status]}</span>
        </div>
        <div className="book-copy">
          <h3>{book.title}</h3>
          <p>{book.author}</p>
          {book.status === 'read' && book.rating > 0 ? (
            <p className="stars" aria-label={`Rated ${book.rating} out of 5`}>
              {stars(book.rating)}
            </p>
          ) : (
            <p className="book-genre">
              <Star size={12} />
              {book.genre || 'Uncategorised'}
            </p>
          )}
        </div>
      </button>
    </article>
  )
}

export default memo(BookCard)
