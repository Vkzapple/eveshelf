// Email tujuan rekomendasi dari pengunjung.
export const CONTACT_EMAIL = 'emailkamu@example.com'

// Pola link toko. Dipakai kalau sebuah buku tidak punya field `link` sendiri.
export const storeSearchUrl = (title) =>
  `https://www.gramedia.com/search?q=${encodeURIComponent(title)}`
