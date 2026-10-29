import Background from './components/Background'
import Hero from './components/Hero'
import Gallery from './components/Gallery'
import RecommendForm from './components/RecommendForm'
import { BOOKS } from './data/books'

const READ = BOOKS.filter((b) => b.status === 'baca').length

export default function App() {
  return (
    <>
      <Background />
      <header className="top">
        <a href="#atas" className="logo">rak buku</a>
        <nav><a href="#rak">koleksi</a><a href="#kirim">kirim rekomendasi</a></nav>
      </header>
      <main id="atas">
        <Hero total={BOOKS.length} read={READ} />
        <Gallery books={BOOKS} />
        <RecommendForm />
      </main>
      <footer>Dibuat dengan buku yang belum selesai dibaca.</footer>
    </>
  )
}
