export const STATUS = {
  read: 'read',
  wishlist: 'wishlist',
}

export const STATUS_LABEL = {
  read: 'Read',
  wishlist: 'Wishlist',
}

export const createId = () => {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export const hashTitle = (value = '') => {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) % 360
  }
  return hash
}

export const coverGradient = (title = '') => {
  const hue = hashTitle(title)
  return `linear-gradient(155deg, hsl(${hue} 38% 36%), hsl(${(hue + 42) % 360} 44% 14%))`
}

export const stars = (rating = 0) =>
  `${'★'.repeat(Math.max(0, Math.min(5, rating)))}${'☆'.repeat(5 - Math.max(0, Math.min(5, rating)))}`

export const bookMeta = (book) =>
  [book.country, book.year, book.genre].filter(Boolean).join(' · ')
