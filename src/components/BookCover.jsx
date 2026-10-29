import { useState } from 'react'
import { coverGradient } from '../lib/book'

export default function BookCover({ book, className = '' }) {
  const [failed, setFailed] = useState(false)
  const showImage = Boolean(book.cover) && !failed

  return (
    <div
      className={`cover ${className}`.trim()}
      style={showImage ? undefined : { background: coverGradient(book.title) }}
    >
      {showImage ? (
        <img
          src={book.cover}
          alt={`${book.title} cover`}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="cover-type">
          <small>{book.country || 'eveshelf'}</small>
          <strong>{book.title}</strong>
          <span>{book.author}</span>
        </div>
      )}
    </div>
  )
}
