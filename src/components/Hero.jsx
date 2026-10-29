export default function Hero({ total, read }) {
  return (
    <section className="hero">
      <p className="kicker">catatan baca dari berbagai belahan dunia</p>
      <h1>Rak <em>Buku</em></h1>
      <p className="lead">
        {read} buku sudah selesai, {total - read} masih mengantre. Dipilih untuk melatih nalar, dari berbagai belahan dunia.
      </p>
      <a className="down" href="#rak">Lihat koleksi</a>
    </section>
  )
}
