import { useEffect, useRef } from 'react'

const ORBITS = [
  { a: 0.11, e: 0, col: '110,200,200', v: 0.9 },
  { a: 0.17, e: 0.3, col: '150,200,130', v: 0.65 },
  { a: 0.24, e: 0.55, col: '232,194,122', v: 0.45 },
  { a: 0.33, e: 0.72, col: '200,120,120', v: 0.3 },
  { a: 0.44, e: 0.82, col: '170,130,210', v: 0.2 },
  { a: 0.58, e: 0.88, col: '110,200,200', v: 0.13 },
]
const TILT = -0.35
const TAU = Math.PI * 2

export default function Background() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let W = 0
    let H = 0
    let stars = []
    let raf = 0
    let last = 0
    let mx = 0
    let my = 0
    let sx = 0
    let sy = 0

    const resize = () => {
      W = canvas.width = innerWidth * dpr
      H = canvas.height = innerHeight * dpr
      const count = Math.min(140, Math.floor((W * H) / 18000))
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: (Math.random() * 1.2 + 0.3) * dpr,
        p: Math.random() * 6,
      }))
    }

    const onMove = (event) => {
      mx = event.clientX / innerWidth - 0.5
      my = event.clientY / innerHeight - 0.5
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

      for (const star of stars) {
        ctx.fillStyle = `rgba(220,225,255,${0.25 + 0.3 * Math.sin(time / 1500 + star.p)})`
        ctx.fillRect(star.x - sx * 8 * dpr, star.y - sy * 8 * dpr, star.r, star.r)
      }

      const cx = W * 0.72 - sx * 40 * dpr
      const cy = H * 0.46 - sy * 30 * dpr - scrollY * 0.12 * dpr
      const unit = Math.min(W, H * 1.6)

      ORBITS.forEach((orbit, index) => {
        const A = orbit.a * unit * 1.5
        const B = A * Math.sqrt(1 - orbit.e * orbit.e)
        const focus = orbit.e * A
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(TILT)
        ctx.strokeStyle = `rgba(${orbit.col},.2)`
        ctx.lineWidth = dpr
        ctx.beginPath()
        ctx.ellipse(-focus, 0, A, B, 0, 0, TAU)
        ctx.stroke()
        const angle = (time / 1000) * orbit.v + index * 1.7
        ctx.fillStyle = `rgba(${orbit.col},.95)`
        ctx.shadowColor = `rgba(${orbit.col},.9)`
        ctx.shadowBlur = 10 * dpr
        ctx.beginPath()
        ctx.arc(-focus + A * Math.cos(angle), B * Math.sin(angle), 3 * dpr, 0, TAU)
        ctx.fill()
        ctx.restore()
      })

      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 28 * dpr)
      glow.addColorStop(0, 'rgba(255,236,190,.95)')
      glow.addColorStop(1, 'rgba(255,236,190,0)')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(cx, cy, 28 * dpr, 0, TAU)
      ctx.fill()

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
