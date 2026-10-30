import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  Download,
  LogOut,
  Pencil,
  Search,
  Trash2,
  Upload,
  User,
} from 'lucide-react'
import { toast } from 'sonner'
import BookCover from '../components/BookCover'
import BookForm from '../components/admin/BookForm'
import AuthForm from '../components/admin/AuthForm'
import SupabaseSetup from '../components/admin/SupabaseSetup'
import { STATUS_LABEL, stars } from '../lib/book'
import { BOOKS_KEY, useBooks } from '../hooks/useBooks'
import { RECOMMENDATIONS_KEY, useRecommendations } from '../hooks/useRecommendations'
import { useSession } from '../hooks/useSession'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import {
  createBook,
  deleteBook,
  deleteRecommendation,
  importBooks,
  updateBook,
  updateBookStatus,
} from '../lib/api'

export default function Admin() {
  const session = useSession()
  const queryClient = useQueryClient()
  const { data: books = [], isLoading, error } = useBooks()
  const { data: recommendations = [] } = useRecommendations()
  const [editing, setEditing] = useState(null)
  const [query, setQuery] = useState('')
  const formRef = useRef(null)
  const fileRef = useRef(null)

  const invalidate = () => queryClient.invalidateQueries({ queryKey: BOOKS_KEY })
  const onError = (mutationError) =>
    toast.error(mutationError.message || 'Something went wrong')

  const createMutation = useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      invalidate()
      toast.success('Book added to the shelf')
    },
    onError,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, values }) => updateBook(id, values),
    onSuccess: () => {
      invalidate()
      toast.success('Book updated')
    },
    onError,
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateBookStatus(id, status),
    onSuccess: invalidate,
    onError,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteBook,
    onError,
  })

  const importMutation = useMutation({
    mutationFn: importBooks,
    onSuccess: (_data, imported) => {
      invalidate()
      setEditing(null)
      toast.success(`Imported ${imported.length} books`)
    },
    onError,
  })

  const invalidateRecommendations = () =>
  queryClient.invalidateQueries({ queryKey: RECOMMENDATIONS_KEY })

const recommendationDelete = useMutation({
  mutationFn: deleteRecommendation,
  onSuccess: (_data, id) => {
    invalidateRecommendations()
    toast.success('Recommendation removed')
  },
  onError,
})

const read = books.filter((book) => book.status === 'read').length
  const wishlist = books.length - read

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return books
    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term) ||
        book.genre.toLowerCase().includes(term),
    )
  }, [books, query])

  const handleSave = (values) => {
    if (editing) {
      updateMutation.mutate(
        { id: editing.id, values },
        { onSuccess: () => setEditing(null) },
      )
      return
    }
    createMutation.mutate(values)
  }

  const handleEdit = (book) => {
    setEditing(book)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleStatus = (book) => {
    statusMutation.mutate({
      id: book.id,
      status: book.status === 'read' ? 'wishlist' : 'read',
    })
  }

  const handleDelete = (book) => {
    deleteMutation.mutate(book.id, {
      onSuccess: () => {
        if (editing?.id === book.id) setEditing(null)
        toast(`Removed “${book.title}”`, {
          action: { label: 'Undo', onClick: () => createMutation.mutate(book) },
        })
      },
    })
  }

  const exportBooks = () => {
    const blob = new Blob([JSON.stringify(books, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'eveshelf-library.json'
    link.click()
    URL.revokeObjectURL(url)
    toast.success('Library exported')
  }

  const handleImport = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      const parsed = JSON.parse(await file.text())
      if (!Array.isArray(parsed) || parsed.some((book) => !book?.title)) {
        throw new Error('Expected a JSON array of books with titles')
      }
      importMutation.mutate(parsed)
    } catch (importError) {
      toast.error(importError.message || 'Could not import that file')
    }
  }

  const signOut = async () => {
    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) toast.error(signOutError.message)
  }

  if (!isSupabaseConfigured) return <SupabaseSetup />
  if (session === undefined) {
    return (
      <main className="admin">
        <p className="empty">Checking session…</p>
      </main>
    )
  }
  if (!session) return <AuthForm />

  return (
    <main className="admin">
      <div className="admin-head">
        <div>
          <p className="eyebrow">Content studio</p>
          <h1>
            eve<em>shelf</em> admin
          </h1>
          <p className="admin-note">
            Books and visitor recommendations are saved directly to Supabase.
          </p>
        </div>
        <div className="admin-head-actions">
          <span className="admin-user">
            <User size={14} />
            {session.user.email}
          </span>
          <button type="button" className="btn btn-ghost btn-sm" onClick={signOut}>
            <LogOut size={15} />
            Sign out
          </button>
          <Link to="/" className="btn btn-outline">
            <ArrowLeft size={16} />
            View shelf
          </Link>
        </div>
      </div>

      <div className="admin-stats">
        <div>
          <span>Total books</span>
          <strong>{books.length}</strong>
        </div>
        <div>
          <span>Read</span>
          <strong>{read}</strong>
        </div>
        <div>
          <span>Wishlist</span>
          <strong>{wishlist}</strong>
        </div>
      </div>

      <div className="admin-layout">
        <div className="panel form-panel" ref={formRef}>
          <BookForm
            editing={editing}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
            busy={createMutation.isPending || updateMutation.isPending}
          />
        </div>

        <section className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Library</p>
              <h2>Manage books</h2>
            </div>
            <div className="panel-tools">
              <button
                type="button"
                className="icon-btn"
                onClick={exportBooks}
                title="Export JSON"
                aria-label="Export library as JSON"
              >
                <Download size={17} />
              </button>
              <button
                type="button"
                className="icon-btn"
                onClick={() => fileRef.current?.click()}
                title="Import JSON"
                aria-label="Import library from JSON"
                disabled={importMutation.isPending}
              >
                <Upload size={17} />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                onChange={handleImport}
                hidden
              />
            </div>
          </div>

          <label className="search admin-search">
            <Search size={16} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search your library"
              aria-label="Search your library"
            />
          </label>

          {isLoading ? (
            <p className="empty">Loading your library…</p>
          ) : error ? (
            <p className="empty">Could not load your library. {error.message}</p>
          ) : visible.length > 0 ? (
            <ul className="admin-list">
              {visible.map((book) => (
                <li key={book.id} className="admin-row">
                  <BookCover book={book} className="admin-thumb" />
                  <div className="admin-row-copy">
                    <h3>{book.title}</h3>
                    <p>{book.author}</p>
                    <div className="admin-row-meta">
                      <span className={`pill pill-${book.status} pill-inline`}>
                        {STATUS_LABEL[book.status]}
                      </span>
                      {book.status === 'read' && book.rating > 0 && (
                        <span className="stars">{stars(book.rating)}</span>
                      )}
                      {book.genre && <span>{book.genre}</span>}
                    </div>
                  </div>
                  <div className="admin-row-actions">
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => handleStatus(book)}
                      title={
                        book.status === 'read' ? 'Move to wishlist' : 'Mark as finished'
                      }
                      aria-label={
                        book.status === 'read' ? 'Move to wishlist' : 'Mark as finished'
                      }
                    >
                      {book.status === 'read' ? (
                        <Bookmark size={17} />
                      ) : (
                        <CheckCircle2 size={17} />
                      )}
                    </button>
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => handleEdit(book)}
                      title="Edit book"
                      aria-label={`Edit ${book.title}`}
                    >
                      <Pencil size={17} />
                    </button>
                    <button
                      type="button"
                      className="icon-btn icon-danger"
                      onClick={() => handleDelete(book)}
                      title="Delete book"
                      aria-label={`Delete ${book.title}`}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty">No books found. Add one from the form.</p>
          )}

          <div className="panel-foot">
            <span className="panel-foot-note">
              {books.length} {books.length === 1 ? 'book' : 'books'} synced with Supabase
            </span>
          </div>
        </section>
      </div>

      <section className="panel admin-inbox">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Recommended by readers</p>
            <h2>Recommendation inbox</h2>
          </div>
          <span className="panel-foot-note">
            {recommendations.length}{' '}
            {recommendations.length === 1 ? 'suggestion' : 'suggestions'}
          </span>
        </div>

        {recommendations.length > 0 ? (
          <ul className="admin-list inbox-list">
            {recommendations.map((item) => (
              <li key={item.id} className="admin-row inbox-row">
                <div className="admin-row-copy">
                  <h3>
                    {item.title}
                    {item.author && <span className="inbox-author"> · {item.author}</span>}
                  </h3>
                  {item.reason && <p className="inbox-reason">{item.reason}</p>}
                  <span className="inbox-time">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="admin-row-actions">
                  <button
                    type="button"
                    className="icon-btn icon-danger"
                    onClick={() => recommendationDelete.mutate(item.id)}
                    title="Remove recommendation"
                    aria-label={`Remove ${item.title} recommendation`}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty">No recommendations yet.</p>
        )}
      </section>
    </main>
  )
}
