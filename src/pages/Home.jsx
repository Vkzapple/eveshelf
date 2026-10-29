import Background from '../components/Background'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Gallery from '../components/Gallery'
import Recommend from '../components/Recommend'
import SetupNotice from '../components/SetupNotice'
import Footer from '../components/Footer'
import { useBooks } from '../hooks/useBooks'
import { isSupabaseConfigured } from '../lib/supabase'

export default function Home() {
  const { data: books = [], isLoading, error } = useBooks()
  const read = books.filter((book) => book.status === 'read').length

  return (
    <>
      <Background />
      <Header />
      <main>
        <Hero total={books.length} read={read} />
        {isSupabaseConfigured ? (
          <Gallery books={books} loading={isLoading} error={error} />
        ) : (
          <SetupNotice />
        )}
        <Recommend />
      </main>
      <Footer />
    </>
  )
}
