import { useState } from 'react'
import { Send } from 'lucide-react'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { createRecommendation } from '../lib/api'
import { RECOMMENDATIONS_KEY, useRecommendations } from '../hooks/useRecommendations'

export default function Recommend() {
  const queryClient = useQueryClient()
  const { data: recommendations = [] } = useRecommendations()
  const [sending, setSending] = useState(false)

  const track = recommendations.slice(0, 12)
  const loop = track.length >= 2 ? [...track, ...track] : []
  const scrollTime = `${Math.max(28, loop.length * 3)}s`

  const submit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const values = {
      title: data.get('title'),
      author: data.get('author'),
      reason: data.get('reason'),
    }

    setSending(true)
    try {
      await createRecommendation(values)
      form.reset()
      queryClient.invalidateQueries({ queryKey: RECOMMENDATIONS_KEY })
      toast.success('Got it. Thanks for the recommendation!')
    } catch (error) {
      toast.error(error.message || 'Could not send that just yet')
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="recommend" className="recommend">
      <div className="recommend-copy">
        <p className="eyebrow">Pass it on</p>
        <h2>A book I should read next?</h2>
        <p className="lead">
          Leave a title and tell me why it matters. It lands in my private shelf
          dashboard, and I read every one of them.
        </p>

        {loop.length > 0 && (
          <div className="recommend-loop" aria-label="Recent recommendations">
            <div className="recommend-track" style={{ animationDuration: scrollTime }}>
              {loop.map((item, index) => (
                <article
                  key={`${item.id}-${index}`}
                  className="recommend-card"
                >
                  <p className="recommend-card-title">
                    <strong>{item.title}</strong>
                    {item.author && <span> · {item.author}</span>}
                  </p>
                  {item.reason && <p className="recommend-card-reason">{item.reason}</p>}
                </article>
              ))}
            </div>
          </div>
        )}
      </div>

      <form onSubmit={submit}>
        <label>
          Book title
          <input name="title" required maxLength={120} placeholder="The book you keep thinking about" />
        </label>
        <label>
          Author
          <input name="author" maxLength={120} placeholder="Who wrote it" />
        </label>
        <label className="wide">
          Why should I read it?
          <textarea name="reason" rows={4} maxLength={500} placeholder="A few honest sentences are enough" />
        </label>
        <button type="submit" className="btn btn-solid" disabled={sending}>
          <Send size={16} />
          {sending ? 'Saving…' : 'Send recommendation'}
        </button>
      </form>
    </section>
  )
}
