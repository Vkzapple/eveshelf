import { useEffect, useRef } from 'react'

const BOOK_COLORS = [
  '122,64,54',
  '62,82,71',
  '112,90,52',
  '74,62,92',
  '48,72,86',
  '118,78,47',
  '92,54,66',
  '70,76,54',
]
const TAU = Math.PI * 2

const seededRandom = (seed) => () => {
  seed |= 0
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

export default function Background() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    let W = 0
    let H = 0
    let shelves = []
    let pages = []
    let dust = []
    let raf = 0
    let last = 0
    let mx = 0
    let my = 0
    let sx = 0
    let sy = 0

    const resize = () => {
      W = canvas.width = innerWidth * dpr
      H = canvas.height = innerHeight * dpr
      const random = seededRandom(1984)
      const mobile = innerWidth < 720
      const shelfX = W * (mobile ? 0.36 : 0.52)
      const shelfY = H * (mobile ? 0.54 : 0.13)
      const shelfW = W * 0.55
      const rows = mobile ? 2 : 4
      const rowH = (H * 0.94 - shelfY) / rows

      shelves = Array.from({ length: rows }, (_, row) => {
        const boardY = shelfY + rowH * (row + 1)
        const books = []
        let x = shelfX

        while (x < shelfX + shelfW) {
          const width = (random() * 17 + 7) * dpr
          const height = rowH * (0.46 + random() * 0.34)
          books.push({
            x,
            width,
            height,
            color: BOOK_COLORS[Math.floor(random() * BOOK_COLORS.length)],
            alpha: 0.2 + random() * 0.3,
            bands: Math.floor(random() * 3),
          })
          x += width + (random() * 4) * dpr
        }

        return { boardY, books }
      })

      pages = Array.from({ length: mobile ? 7 : 12 }, () => ({
        x: random() * W,
        y: random() * H,
        width: (random() * 12 + 9) * dpr,
        height: (random() * 14 + 16) * dpr,
        rotation: (random() - 0.5) * 1.4,
        speed: 0.008 + random() * 0.014,
        sway: 10 + random() * 26,
        phase: random() * TAU,
        alpha: 0.07 + random() * 0.11,
      }))

      dust = Array.from({ length: mobile ? 45 : 90 }, () => ({
        x: random() * W,
        y: random() * H,
        size: (random() * 1.5 + 0.5) * dpr,
        drift: (random() - 0.5) * 0.008,
        phase: random() * TAU,
        alpha: 0.15 + random() * 0.35,
      }))
    }

    const onMove = (event) => {
      mx = event.clientX / innerWidth - 0.5
      my = event.clientY / innerHeight - 0.5
    }

    const drawGlow = () => {
      const glow = ctx.createRadialGradient(
        W * 0.8,
        H * 0.16,
        0,
        W * 0.8,
        H * 0.16,
        Math.max(W, H) * 0.55,
      )
      glow.addColorStop(0, 'rgba(232,194,122,.1)')
      glow.addColorStop(0.45, 'rgba(180,120,70,.045)')
      glow.addColorStop(1, 'rgba(180,120,70,0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, W, H)
    }

    const drawShelf = (offsetX, offsetY) => {
      for (const shelf of shelves) {
        const boardY = shelf.boardY + offsetY

        for (const book of shelf.books) {
          const x = book.x - offsetX
          const y = boardY - book.height
          ctx.fillStyle = `rgba(${book.color},${book.alpha})`
          ctx.fillRect(x, y, book.width, book.height)
          ctx.fillStyle = `rgba(232,194,122,${book.alpha * 0.55})`
          ctx.fillRect(x, y, book.width, dpr)

          for (let band = 1; band <= book.bands; band += 1) {
            const bandY = y + (book.height / (book.bands + 1)) * band
            ctx.fillStyle = `rgba(232,194,122,${book.alpha * 0.24})`
            ctx.fillRect(x + dpr, bandY, Math.max(book.width - dpr * 2, 0), dpr)
          }
        }

        const board = ctx.createLinearGradient(
          shelf.books[0]?.x - offsetX || 0,
          0,
          W,
          0,
        )
        board.addColorStop(0, 'rgba(110,78,52,.38)')
        board.addColorStop(0.7, 'rgba(140,96,58,.3)')
        board.addColorStop(1, 'rgba(140,96,58,.08)')
        ctx.fillStyle = board
        ctx.fillRect(
          (shelf.books[0]?.x || W * 0.5) - offsetX,
          boardY,
          W,
          5 * dpr,
        )
        ctx.fillStyle = 'rgba(232,194,122,.12)'
        ctx.fillRect(
          (shelf.books[0]?.x || W * 0.5) - offsetX,
          boardY,
          W,
          dpr,
        )
      }
    }

    const drawPages = (time) => {
      for (const page of pages) {
        const y = ((page.y - time * page.speed) % (H + 80 * dpr)) - 40 * dpr
        const x = page.x + Math.sin(time * 0.00035 + page.phase) * page.sway
        const rotation =
          page.rotation + Math.sin(time * 0.0005 + page.phase) * 0.16

        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(rotation)
        ctx.fillStyle = `rgba(239,230,212,${page.alpha})`
        ctx.fillRect(-page.width / 2, -page.height / 2, page.width, page.height)
        ctx.strokeStyle = `rgba(232,194,122,${page.alpha * 0.75})`
        ctx.lineWidth = dpr * 0.6
        ctx.beginPath()
        ctx.moveTo(-page.width / 2 + 2 * dpr, page.height * 0.22)
        ctx.lineTo(page.width / 2 - 2 * dpr, page.height * 0.22)
        ctx.stroke()
        ctx.restore()
      }
    }

    const drawDust = (time) => {
      for (const mote of dust) {
        const x = mote.x + Math.sin(time * 0.00025 + mote.phase) * 14 * dpr
        ctx.fillStyle = `rgba(232,194,122,${
          mote.alpha * (0.6 + 0.4 * Math.sin(time * 0.0011 + mote.phase))
        })`
        ctx.fillRect(x, mote.y, mote.size, mote.size)
      }
    }

    const frame = (time) => {
      raf = 0
      if (!still && time - last < 33) {
        raf = requestAnimationFrame(frame)
        return
      }
      last = time
      sx += (mx - sx) * 0.05
      sy += (my - sy) * 0.05
      ctx.clearRect(0, 0, W, H)

      drawGlow()
      drawShelf(
        sx * 20 * dpr,
        sy * 12 * dpr + scrollY * 0.05 * dpr,
      )
      drawPages(time)
      drawDust(time)

      if (!still) raf = requestAnimationFrame(frame)
    }

    const start = () => {
      if (!raf) raf = requestAnimationFrame(frame)
    }

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf)
        raf = 0
      } else if (!still) {
        start()
      }
    }

    resize()
    start()
    addEventListener('resize', resize)
    addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('resize', resize)
      removeEventListener('pointermove', onMove)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas id="bg" ref={ref} aria-hidden="true" />
}
