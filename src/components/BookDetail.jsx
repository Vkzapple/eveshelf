import { useEffect, useRef } from 'react'
import { ArrowUpRight, X } from 'lucide-react'
import BookCover from './BookCover'
import { bookMeta, stars } from '../lib/book'
import { STORE_NAME, storeSearchUrl } from '../config'

export default function BookDetail({ book, onClose }) {
  const closeRef = useRef(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (event) => event.key === 'Escape' && onClose()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  if (!book) return null

  return (
    <div
      className="detail-backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <article className="detail" role="dialog" aria-modal="true" aria-label={book.title}>
        <button ref={closeRef} className="icon-btn detail-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <BookCover book={book} className="detail-cover" />

        <div className="detail-body">
          <p className="eyebrow">{book.status === 'read' ? 'Finished' : 'On the wishlist'}</p>
          <h2>{book.title}</h2>
          <p className="detail-author">{book.author}</p>
          <p className="detail-meta">{bookMeta(book)}</p>

          {book.status === 'read' && (
            <p className="stars stars-lg" aria-label={`Rated ${book.rating} out of 5`}>
              {stars(book.rating)}
            </p>
          )}

          {book.review && <p className="detail-review">{book.review}</p>}

          <a
            className="btn btn-outline"
            href={book.link || storeSearchUrl(book.title)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {book.link ? 'Open book link' : `Find on ${STORE_NAME}`}
            <ArrowUpRight size={16} />
          </a>
        </div>
      </article>
    </div>
  )
}
