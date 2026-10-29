import { ArrowDown } from 'lucide-react'

export default function Hero({ total, read }) {
  return (
    <section className="hero">
      <p className="eyebrow">A personal shelf · read, wishlisted, reviewed</p>
      <h1>
        eve<em>shelf</em>
      </h1>
      <p className="lead">
        Books I have finished, books I am still chasing, and the ones I would press into
        your hands. A small library of recommendations, kept honestly.
      </p>
      <div className="hero-actions">
        <button
          type="button"
          className="btn btn-solid"
          onClick={() => document.getElementById('shelf')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Browse the shelf
          <ArrowDown size={16} />
        </button>
        <ul className="hero-stats">
          <li>
            <strong>{total}</strong>
            <span>books</span>
          </li>
          <li>
            <strong>{read}</strong>
            <span>read</span>
          </li>
          <li>
            <strong>{total - read}</strong>
            <span>wishlist</span>
          </li>
        </ul>
      </div>
    </section>
  )
}
