import { CONTACT_EMAIL } from '../config'

export default function RecommendForm() {
  // Tanpa backend: submit membuka aplikasi email pengunjung dengan isi terisi.
  const onSubmit = (e) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const body = `Judul: ${f.get('title')}\nPenulis: ${f.get('author')}\nDari: ${f.get('from')}\n\nAlasan:\n${f.get('why')}`
    const subject = `Rekomendasi buku: ${f.get('title')}`
    location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <section id="kirim" className="send">
      <h2>Punya buku yang harus saya baca?</h2>
      <p className="lead">Tulis judul dan alasannya. Rekomendasimu terkirim lewat email dan saya baca satu per satu.</p>
      <form onSubmit={onSubmit}>
        <label>Judul buku<input name="title" required maxLength={120} /></label>
        <label>Penulis<input name="author" maxLength={120} /></label>
        <label>Nama kamu<input name="from" maxLength={60} /></label>
        <label className="wide">Kenapa saya perlu membacanya?<textarea name="why" rows={3} maxLength={500} /></label>
        <button type="submit">Kirim rekomendasi</button>
      </form>
    </section>
  )
}
