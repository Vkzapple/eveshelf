import { useEffect, useState } from 'react'
import { useBookCover } from '../hooks/useBookCover'
import { coverGradient } from '../lib/book'

export default function BookCover({ book, className = '' }) {
  const resolved = useBookCover(book)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [resolved])

  const showImage = Boolean(resolved) && !failed

  return (
    <div
      className={`cover ${className}`.trim()}
      style={showImage ? undefined : { background: coverGradient(book.title) }}
    >
      {showImage ? (
        <img
          src={resolved}
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
