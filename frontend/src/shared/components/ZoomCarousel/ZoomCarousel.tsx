import { useEffect, useRef, type ReactNode } from 'react'
import styles from './ZoomCarousel.module.css'

interface ZoomCarouselProps<T> {

    items: T[]
    renderItem: (item: T) => ReactNode
    speed?: number
}

function shuffle<T>(array: T[]): T[] {

    const result = [...array]

    for (let i = result.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1))
        ;[result[i], result[j]] = [result[j], result[i]]
    }

    return result
}

export function ZoomCarousel<T>({ items, renderItem, speed = 0.4 }: ZoomCarouselProps<T>) {

    const trackRef = useRef<HTMLDivElement>(null)
    const viewportRef = useRef<HTMLDivElement>(null)
    const shuffledRef = useRef<T[]>(shuffle(items))
    const offsetRef = useRef(0)

    useEffect(() => {

        const track = trackRef.current
        const viewport = viewportRef.current

        if (!track || !viewport || items.length === 0) return

        let animationFrame: number

        const animate = () => {

            offsetRef.current += speed

            const halfWidth = track.scrollWidth / 2

            if (offsetRef.current >= halfWidth) {

                offsetRef.current = 0
            }

            track.style.transform = `translateX(-${offsetRef.current}px)`

            const viewportCenter = viewport.getBoundingClientRect().left + viewport.clientWidth / 2

            Array.from(track.children).forEach((child) => {

                const el = child as HTMLElement
                const rect = el.getBoundingClientRect()
                const cardCenter = rect.left + rect.width / 2
                const distance = Math.abs(viewportCenter - cardCenter)
                const maxDistance = viewport.clientWidth / 2

                const proximity = Math.max(0, 1 - distance / maxDistance)
                const scale = 0.85 + proximity * 0.25

                el.style.transform = `scale(${scale})`
                el.style.opacity = `${0.6 + proximity * 0.4}`
            })

            animationFrame = requestAnimationFrame(animate)
        }

        animationFrame = requestAnimationFrame(animate)

        return () => cancelAnimationFrame(animationFrame)

    }, [items, speed])

    if (items.length === 0) return null

    const duplicated = [...shuffledRef.current, ...shuffledRef.current]

    return (
        <div ref={viewportRef} className={styles.viewport}>
            <div ref={trackRef} className={styles.track}>
                {duplicated.map((item, index) => (
                    <div key={index} className={styles.card}>
                        {renderItem(item)}
                    </div>
                ))}
            </div>
        </div>
    )
}