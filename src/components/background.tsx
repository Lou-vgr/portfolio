// Glitter Wrap — Background Component
import { type CSSProperties, useEffect, useRef } from "react"

export default function GlitterWrap({
    particleCount = 500,
    color1 = "#ffffff",
    color2 = "#ffffff",
    color3 = "#ffffff",
    speed = 5,
    density = 100,
    starSize = 20,
    focalDepth = 13,
    turbulence = 0,
    brightness = 100,
    glitterIntensity = 3,
    trailAmount = 100,
    reverse = false,
    style,
}: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const rafRef = useRef<number | null>(null)
    const sizeRef = useRef({ w: 0, h: 0, dpr: 1 })

    useEffect(() => {
        const container = containerRef.current
        const canvas = canvasRef.current
        if (!container || !canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        type Star = {
            x: number
            y: number
            z: number
            px: number
            py: number
            seed: number
            vmul: number
            flashUntil: number
            nextFlash: number
        }

        const stars: Star[] = []
        let elapsed = 0
        let lastT = performance.now()

        const stepZ = speed * 0.0008
        const focal = focalDepth / 100
        const starScale = starSize * 0.15
        const glitter = glitterIntensity * 0.1
        const trail = trailAmount / 100

        const resetStar = (s: Star, initial = false) => {
            const angle = Math.random() * Math.PI * 2
            const radius = (0.2 + Math.random() * 0.8) * (density / 15)
            s.x = Math.cos(angle) * radius
            s.y = Math.sin(angle) * radius
            if (reverse) {
                s.z = initial ? focal + Math.random() * (1 - focal) : focal
            } else {
                s.z = initial ? Math.random() : 1.0
            }
            s.px = NaN
            s.py = NaN
            s.seed = Math.random() * 1000
            s.vmul = 0.6 + Math.random() * 0.8
            s.flashUntil = 0
            s.nextFlash = elapsed + 1 + Math.random() * 4 * (1 / Math.max(0.0001, glitter))
        }

        const makeStar = (): Star => ({
            x: 0, y: 0, z: 0, px: NaN, py: NaN, seed: 0, vmul: 1, flashUntil: 0, nextFlash: 0,
        })

        const syncCount = () => {
            const count = Math.max(1, Math.floor(particleCount))
            if (stars.length === count) return
            if (stars.length > count) {
                stars.length = count
            } else {
                while (stars.length < count) {
                    const s = makeStar()
                    resetStar(s, true)
                    stars.push(s)
                }
            }
        }

        const resize = (entry?: ResizeObserverEntry) => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2)
            const cr = entry?.contentRect
            const rectW = cr?.width || container.clientWidth || container.getBoundingClientRect().width
            const rectH = cr?.height || container.clientHeight || container.getBoundingClientRect().height
            const w = Math.max(1, Math.floor(rectW) || 600)
            const h = Math.max(1, Math.floor(rectH) || 400)

            const prev = sizeRef.current
            if (prev.w === w && prev.h === h && prev.dpr === dpr) return

            sizeRef.current = { w, h, dpr }
            canvas.width = Math.floor(w * dpr)
            canvas.height = Math.floor(h * dpr)
            canvas.style.width = `${w}px`
            canvas.style.height = `${h}px`
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            ctx.clearRect(0, 0, w, h)
        }

        syncCount()
        resize()

        const ro = new ResizeObserver((entries) => resize(entries[0]))
        ro.observe(container)

        const drawFrame = (deltaSec: number) => {
            syncCount()

            const { w, h } = sizeRef.current
            const cx = w / 2
            const cy = h / 2
            const projScale = Math.min(w, h) * 0.9

            const dt = Math.max(0.001, Math.min(0.1, deltaSec)) * 60
            const keep = Math.pow(Math.min(0.98, Math.max(0, trail)), dt)
            const trailAlpha = Math.max(0.1, 1 - keep)

            ctx.globalAlpha = 1
            ctx.globalCompositeOperation = "source-over"
            ctx.fillStyle = `rgba(0, 0, 0, ${trailAlpha})`
            ctx.fillRect(0, 0, w, h)

            ctx.globalCompositeOperation = "lighter"

            for (let i = 0; i < stars.length; i++) {
                const s = stars[i]
                const vz = stepZ * s.vmul * dt
                if (reverse) {
                    s.z += vz
                    if (s.z >= 1.0) {
                        resetStar(s)
                        continue
                    }
                } else {
                    s.z -= vz
                    if (s.z <= focal) {
                        resetStar(s)
                        continue
                    }
                }

                let tx = s.x
                let ty = s.y
                if (turbulence > 0) {
                    const t = elapsed * 1.2 + s.seed
                    const amp = (turbulence * 0.2) * (1 - s.z) * 0.25
                    tx += Math.sin(t + s.seed) * amp
                    ty += Math.cos(t * 1.13 + s.seed * 0.7) * amp
                }

                const persp = focal / Math.max(s.z, 0.0001)
                const sx = cx + tx * persp * projScale
                const sy = cy + ty * persp * projScale

                if (!reverse && (sx < -20 || sx > w + 20 || sy < -20 || sy > h + 20)) {
                    resetStar(s)
                    continue
                }

                let flashMult = 1
                if (glitter > 0) {
                    if (elapsed >= s.nextFlash && s.flashUntil < elapsed) {
                        s.flashUntil = elapsed + 0.04 + Math.random() * 0.07
                        s.nextFlash = elapsed + 1 + Math.random() * 4 * (1 / Math.max(0.0001, glitter))
                    }
                    if (elapsed <= s.flashUntil) {
                        flashMult = 1 + 2.5 * glitter
                    }
                }

                const sizePersp = Math.min(2.5, (focal / Math.max(s.z, 0.0001)) * 0.6)
                const baseR = Math.max(0.25, starScale * (0.4 + sizePersp))
                const maxR = 1 + starScale * 2.5
                const r = Math.min(baseR * flashMult, maxR)

                const lifeT = reverse ? s.z : 1 - s.z
                const fadeIn = reverse ? Math.min(1, (s.z - focal) / (1 - focal) / 0.12) : 1
                const bright = Math.min(1, brightness / 100)
                const a = Math.min(1, reverse ? 0.85 - lifeT * 0.6 : lifeT * 0.9 + 0.05) * fadeIn * bright * (flashMult > 1 ? 1 : 0.85)

                if (!Number.isNaN(s.px) && !Number.isNaN(s.py)) {
                    ctx.globalAlpha = a * 0.5
                    ctx.strokeStyle = color1
                    ctx.lineWidth = Math.max(0.4, r * 0.4)
                    ctx.beginPath()
                    ctx.moveTo(s.px, s.py)
                    ctx.lineTo(sx, sy)
                    ctx.stroke()
                }

                ctx.globalAlpha = a
                ctx.fillStyle = color1
                ctx.fillRect(sx - r, sy - r, r * 2, r * 2)

                s.px = sx
                s.py = sy
            }

            ctx.globalAlpha = 1
            ctx.globalCompositeOperation = "source-over"
            elapsed += Math.min(0.1, Math.max(0, deltaSec))
        }

        const loop = (t: number) => {
            const deltaSec = (t - lastT) / 1000
            lastT = t
            drawFrame(deltaSec)
            rafRef.current = requestAnimationFrame(loop)
        }
        rafRef.current = requestAnimationFrame(loop)

        return () => {
            if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
            ro.disconnect()
        }
    }, [particleCount, color1, color2, color3, speed, density, starSize, focalDepth, turbulence, brightness, glitterIntensity, trailAmount, reverse])

    return (
        <div
            ref={containerRef}
            style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                padding: 0,
                margin: 0,
                boxSizing: "border-box",
                overflow: "hidden",
                zIndex: -1,
                ...style,
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    display: "block",
                }}
            />
        </div>
    )
}

type Props = {
    particleCount?: number
    color1?: string
    color2?: string
    color3?: string
    speed?: number
    density?: number
    starSize?: number
    focalDepth?: number
    turbulence?: number
    brightness?: number
    glitterIntensity?: number
    trailAmount?: number
    reverse?: boolean
    style?: CSSProperties
}