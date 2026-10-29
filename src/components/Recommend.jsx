import { Mail } from 'lucide-react'
import { CONTACT_EMAIL } from '../config'

export default function Recommend() {
  const onSubmit = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const title = data.get('title')
    const author = data.get('author')
    const reason = data.get('reason')
    const body = `Title: ${title}\nAuthor: ${author}\n\nWhy I should read it:\n${reason}`
    const subject = `Book recommendation: ${title}`
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <section id="recommend" className="recommend">
      <div className="recommend-copy">
        <p className="eyebrow">Pass it on</p>
        <h2>A book I should read next?</h2>
        <p className="lead">
          Leave a title and tell me why it matters. Recommendations land in my inbox and I
          read every one of them.
        </p>
      </div>
      <form onSubmit={onSubmit}>
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
        <button type="submit" className="btn btn-solid">
          <Mail size={16} />
          Send recommendation
        </button>
      </form>
    </section>
  )
}
