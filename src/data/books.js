/**
 * Sumber data tunggal untuk rak buku. Edit file ini saja.
 *
 * status : 'baca' | 'wishlist'
 * rating : 1-5 (hanya untuk status 'baca')
 * height : tinggi sampul dalam px, memberi ritme pada galeri masonry
 * hue    : warna dasar sampul (0-360)
 * link   : (opsional) link produk persis di Gramedia atau toko lain
 * cover  : (opsional) gambar sampul asli, mis. 'covers/1984.jpg' (taruh di /public/covers)
 */
export const BOOKS = [
  { title: '1984', author: 'George Orwell', country: 'Inggris', status: 'baca', rating: 3, height: 300, hue: 8, note: 'Ternyata terlalu ramai dibicarakan. Ide Newspeak tetap menarik, tapi hype-nya melebihi isinya.' },
  { title: 'Things Fall Apart', author: 'Chinua Achebe', country: 'Nigeria', status: 'wishlist', height: 230, hue: 28, note: 'Kolonialisme dari sisi masyarakat Igbo. Pendek, sekitar 200 halaman.' },
  { title: 'Ficciones', author: 'Jorge Luis Borges', country: 'Argentina', status: 'wishlist', height: 350, hue: 250, note: 'Cerpen tentang labirin, perpustakaan tak terbatas, dan logika yang bermain dengan realitas.' },
  { title: 'Klara and the Sun', author: 'Kazuo Ishiguro', country: 'Inggris', status: 'wishlist', height: 280, hue: 42, note: 'Novel tentang AI yang mengamati manusia.' },
  { title: 'Chronicle of a Death Foretold', author: 'Gabriel García Márquez', country: 'Kolombia', status: 'wishlist', height: 240, hue: 350, note: 'Novela pendek soal kehormatan dan komunitas yang gagal bertindak.' },
  { title: 'The Kite Runner', author: 'Khaled Hosseini', country: 'Afghanistan', status: 'wishlist', height: 340, hue: 200, note: 'Sejarah Afghanistan dari monarki sampai Taliban lewat dua sahabat.' },
  { title: 'Flatland', author: 'Edwin A. Abbott', country: 'Inggris', status: 'wishlist', height: 220, hue: 160, note: 'Dunia dua dimensi, latihan berpikir analogis.' },
  { title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', country: 'Rusia', status: 'wishlist', height: 360, hue: 0, note: 'Moralitas dan rasionalisasi. Tebal tapi menggugah.' },
  { title: 'Pachinko', author: 'Min Jin Lee', country: 'Korea / Jepang', status: 'wishlist', height: 290, hue: 130, note: 'Diskriminasi dan identitas lintas generasi.' },
  { title: 'The Three-Body Problem', author: 'Liu Cixin', country: 'Tiongkok', status: 'wishlist', height: 320, hue: 270, note: 'Fisika, politik, dan kontak pertama dengan peradaban lain.' },
  { title: 'Kokoro', author: 'Natsume Soseki', country: 'Jepang', status: 'wishlist', height: 230, hue: 320, note: 'Kesepian dan rasa bersalah di Jepang era Meiji.' },
  { title: 'Why Nations Fail', author: 'Acemoglu & Robinson', country: 'Amerika Serikat', status: 'wishlist', height: 300, hue: 90, note: 'Bagaimana institusi politik menentukan kemakmuran.' },
]
