"use client"

import { useRouter } from "next/navigation"
import { useState, useCallback } from "react"

export function useSmoothNavigation() {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)

  const navigate = useCallback(
    (href: string, delay = 150) => {
      setIsNavigating(true)

      // Add a small delay to show the loading state
      setTimeout(() => {
        router.push(href)
        // Reset after navigation
        setTimeout(() => setIsNavigating(false), 100)
      }, delay)
    },
    [router],
  )

  const back = useCallback(
    (delay = 150) => {
      setIsNavigating(true)

      setTimeout(() => {
        router.back()
        setTimeout(() => setIsNavigating(false), 100)
      }, delay)
    },
    [router],
  )

  return { navigate, back, isNavigating }
}
