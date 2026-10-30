export const STORE_NAME = 'Gramedia'

export const storeSearchUrl = (title) =>
  `https://www.gramedia.com/search?q=${encodeURIComponent(title)}`
