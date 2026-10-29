import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { BookImage, Check, Loader2, RotateCcw, Save } from 'lucide-react'
import { findCoverUrl } from '../../lib/covers'

const DEFAULTS = {
  title: '',
  author: '',
  country: '',
  year: '',
  genre: '',
  status: 'read',
  rating: '0',
  review: '',
  cover: '',
  link: '',
}

export default function BookForm({ editing, onSave, onCancel, busy = false }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    getValues,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({ defaultValues: DEFAULTS })

  const [finding, setFinding] = useState(false)
  const status = watch('status')

  useEffect(() => {
    if (!editing) {
      reset(DEFAULTS)
      return
    }
    reset({
      title: editing.title,
      author: editing.author,
      country: editing.country,
      year: editing.year || '',
      genre: editing.genre,
      status: editing.status,
      rating: String(editing.rating || 0),
      review: editing.review,
      cover: editing.cover,
      link: editing.link,
    })
  }, [editing, reset])

  const submit = (values) => {
    onSave({
      ...values,
      year: values.year === '' ? '' : Number(values.year),
      rating: values.status === 'read' ? Number(values.rating) : 0,
    })
    if (!editing) reset(DEFAULTS)
  }

  const findCover = async () => {
    const title = getValues('title')
    if (!title?.trim()) {
      setError('cover', { type: 'manual', message: 'Add a title first.' })
      return
    }

    setFinding(true)
    clearErrors('cover')
    try {
      const cover = await findCoverUrl(title, getValues('author'))
      if (!cover) {
        setError('cover', {
          type: 'manual',
          message: 'No cover found. Paste a URL instead.',
        })
        return
      }
      setValue('cover', cover, { shouldDirty: true, shouldValidate: true })
    } catch {
      setError('cover', {
        type: 'manual',
        message: 'Cover lookup failed. Try again or paste a URL.',
      })
    } finally {
      setFinding(false)
    }
  }

  return (
    <form className="book-form" onSubmit={handleSubmit(submit)}>
      <div className="form-heading">
        <p className="eyebrow">{editing ? 'Edit book' : 'New entry'}</p>
        <h2>{editing ? 'Update this book' : 'Add to the shelf'}</h2>
      </div>

      <label>
        Title
        <input
          {...register('title', { required: 'Title is required' })}
          placeholder="Book title"
          maxLength={160}
        />
        {errors.title && <span className="field-error">{errors.title.message}</span>}
      </label>

      <label>
        Author
        <input
          {...register('author', { required: 'Author is required' })}
          placeholder="Author name"
          maxLength={120}
        />
        {errors.author && <span className="field-error">{errors.author.message}</span>}
      </label>

      <div className="field-row">
        <label>
          Country
          <input {...register('country')} placeholder="Country" maxLength={80} />
        </label>
        <label>
          Year
          <input
            type="number"
            {...register('year', { min: 0, max: 2100 })}
            placeholder="2024"
            min="0"
            max="2100"
          />
        </label>
      </div>

      <div className="field-row">
        <label>
          Genre
          <input {...register('genre')} placeholder="Genre" maxLength={60} />
        </label>
        <label>
          Status
          <select {...register('status')}>
            <option value="read">Read</option>
            <option value="wishlist">Wishlist</option>
          </select>
        </label>
      </div>

      {status === 'read' && (
        <label>
          Rating
          <select {...register('rating')}>
            <option value="0">Not rated</option>
            <option value="1">1 — Did not finish</option>
            <option value="2">2 — It was fine</option>
            <option value="3">3 — Good</option>
            <option value="4">4 — Really good</option>
            <option value="5">5 — Favourite</option>
          </select>
        </label>
      )}

      <label>
        Review
        <textarea
          {...register('review')}
          rows={4}
          placeholder="What did you think?"
          maxLength={1200}
        />
      </label>

      <div className="field-block">
        <span className="field-label">Cover image URL</span>
        <div className="cover-row">
          <input {...register('cover')} placeholder="https://… or covers/book.jpg" />
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={findCover}
            disabled={finding}
          >
            {finding ? (
              <Loader2 size={15} className="spin" />
            ) : (
              <BookImage size={15} />
            )}
            {finding ? 'Searching…' : 'Find cover'}
          </button>
        </div>
        <span className="field-hint">
          Leave it empty to fetch a cover from Open Library automatically.
        </span>
        {errors.cover && <span className="field-error">{errors.cover.message}</span>}
      </div>

      <label>
        Book link
        <input {...register('link')} placeholder="https://…" />
      </label>

      <div className="form-actions">
        <button type="submit" className="btn btn-solid" disabled={busy}>
          {busy ? (
            <Loader2 size={16} className="spin" />
          ) : editing ? (
            <Save size={16} />
          ) : (
            <Check size={16} />
          )}
          {busy ? 'Saving…' : editing ? 'Save changes' : 'Add book'}
        </button>
        {editing && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            <RotateCcw size={15} />
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
