import { memo, useRef } from 'react'
import { useInView } from '../hooks/useInView'
import { storeSearchUrl } from '../config'

const canTilt = () =>
  matchMedia('(hover: hover)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches

function BookCard({ book, index }) {
  const ref = useRef(null)
  const seen = useInView(ref)
  const { title, author, country, status, rating, height, hue, note, cover, link } = book

  // Efek tilt menulis CSS variable langsung ke DOM agar tidak memicu re-render.
  const onMove = (e) => {
    if (!canTilt()) return
    const el = ref.current, r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height
    el.style.setProperty('--ry', `${(x - 0.5) * 9}deg`)
    el.style.setProperty('--rx', `${(0.5 - y) * 9}deg`)
    el.style.setProperty('--mx', `${x * 100}%`)
    el.style.setProperty('--my', `${y * 100}%`)
  }
  const onLeave = () => {
    ref.current.style.setProperty('--rx', '0deg')
    ref.current.style.setProperty('--ry', '0deg')
  }

  return (
    <a
      ref={ref}
      className={`book${seen ? ' in' : ''}`}
      href={link || storeSearchUrl(title)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${title}, buka di Gramedia`}
      style={{ '--h': `${height}px`, transitionDelay: `${(index % 4) * 70}ms` }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <div className="cover" style={{ background: `linear-gradient(160deg,hsl(${hue} 42% 32%),hsl(${(hue + 45) % 360} 48% 14%))` }}>
        {cover ? (
          <img src={cover} alt="" loading="lazy" />
        ) : (
          <>
            <small>{country}</small>
            <div><strong>{title}</strong><span>{author}</span></div>
          </>
        )}
      </div>
      <div className="shine" />
      <div className="over">
        <p>{note}</p>
        <div className="meta">
          {status === 'baca'
            ? <span className="stars" aria-label={`Rating ${rating} dari 5`}>{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
            : <span className="badge">wishlist</span>}
          <span>Buka di Gramedia</span>
        </div>
      </div>
    </a>
  )
}

export default memo(BookCard)
