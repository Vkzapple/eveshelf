const COVER_BASE = 'https://covers.openlibrary.org'
const cache = new Map()

const normalize = (value = '') =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

const JUNK = /adaptation|graphic novel|study guide|sparknotes|cliffsnotes|summary|analysis|annotated|activity pack|critical perspectives|connections|related readings|box set/i

async function search(params) {
  const response = await fetch(
    `https://openlibrary.org/search.json?${new URLSearchParams(params)}`,
  )
  if (!response.ok) throw new Error('Cover search is unavailable right now')
  const data = await response.json()
  return (data.docs || []).filter(
    (doc) => doc.cover_i && !JUNK.test(doc.title || ''),
  )
}

function pick(docs, target, fuzzy = false) {
  const exact = docs.find((doc) => normalize(doc.title) === target)
  if (exact) return exact
  const prefix = docs.find((doc) => normalize(doc.title).startsWith(target))
  if (prefix) return prefix
  return fuzzy ? docs[0] : null
}

export async function findCoverUrl(title, author) {
  const cleanTitle = title?.trim()
  if (!cleanTitle) return ''

  const key = `${normalize(cleanTitle)}|${normalize(author)}`
  if (cache.has(key)) return cache.get(key)

  const target = normalize(cleanTitle)
  let match = null

  if (author?.trim()) {
    const query = `title:"${cleanTitle}" AND author:"${author.trim()}"`
    match = pick(
      await search({ q: query, limit: '10', fields: 'title,cover_i' }),
      target,
      true,
    )
  }

  if (!match) {
    const params = {
      title: cleanTitle,
      limit: '10',
      fields: 'title,cover_i',
    }
    if (author?.trim()) params.author = author.trim()
    match = pick(await search(params), target)
  }

  if (!match) {
    match = pick(
      await search({ title: cleanTitle, limit: '10', fields: 'title,cover_i' }),
      target,
    )
  }

  const url = match ? `${COVER_BASE}/b/id/${match.cover_i}-L.jpg` : ''
  cache.set(key, url)
  return url
}

export const googleBooksUrl = (title, author) =>
  `https://www.google.com/search?tbm=bks&q=${encodeURIComponent(author ? `${title} ${author}` : title)}`

export async function findBookUrl(title, author) {
  const cleanTitle = title?.trim()
  if (!cleanTitle) return ''

  const fallback = googleBooksUrl(cleanTitle, author)

  try {
    const params = { title: cleanTitle, limit: '5', fields: 'key,edition_key' }
    if (author?.trim()) params.author = author.trim()
    const response = await fetch(
      `https://openlibrary.org/search.json?${new URLSearchParams(params)}`,
    )
    if (!response.ok) return fallback
    const data = await response.json()
    const doc = data.docs?.[0]
    if (!doc) return fallback

    if (doc.edition_key?.length) {
      return `https://openlibrary.org/books/${doc.edition_key[0]}`
    }
    if (doc.key?.length) {
      return `https://openlibrary.org${doc.key}`
    }
    return fallback
  } catch {
    return fallback
  }
}
