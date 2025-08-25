import { useEffect, useRef } from 'react'

interface UseIntersectionObserverProps {
  onIntersect: () => void
  threshold?: number
  rootMargin?: string
  enabled?: boolean
}

export function useIntersectionObserver({
  onIntersect,
  threshold = 0,
  rootMargin = '0px',
  enabled = true,
}: UseIntersectionObserverProps) {
  const ref = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!enabled || !ref.current) return
    
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          onIntersect()
        }
      },
      { threshold, rootMargin }
    )
    
    observer.observe(ref.current)
    
    return () => observer.disconnect()
  }, [onIntersect, threshold, rootMargin, enabled])
  
  return { ref }
}