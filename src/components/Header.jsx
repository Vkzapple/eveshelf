import { Link } from 'react-router-dom'
import { LayoutDashboard } from 'lucide-react'

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

export default function Header() {
  return (
    <header className="top">
      <Link to="/" className="brand">
        eve<span>shelf</span>
      </Link>
      <nav>
        <button type="button" onClick={() => scrollTo('shelf')}>
          Shelf
        </button>
        <button type="button" onClick={() => scrollTo('recommend')}>
          Recommend
        </button>
        <Link to="/admin" className="nav-admin">
          <LayoutDashboard size={15} />
          Admin
        </Link>
      </nav>
    </header>
  )
}
    </header>
  )
}
