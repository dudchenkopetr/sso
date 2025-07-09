"use client"

import { useRouter } from "next/navigation"
import { useState, useCallback } from "react"

type NavigationType = "forward" | "back" | "replace" | "modal"

interface NavigationOptions {
  type?: NavigationType
  delay?: number
  preload?: boolean
}

export function useSmoothNavigation() {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)
  const [navigationType, setNavigationType] = useState<NavigationType>("forward")

  const navigate = useCallback(
    (href: string, options: NavigationOptions = {}) => {
      const { type = "forward", delay = 150, preload = false } = options

      setIsNavigating(true)
      setNavigationType(type)

      // Preload the route if requested
      if (preload) {
        router.prefetch(href)
      }

      // Add delay based on navigation type
      const navigationDelay = type === "modal" ? 100 : delay

      setTimeout(() => {
        if (type === "replace") {
          router.replace(href)
        } else {
          router.push(href)
        }

        // Reset after navigation with different timing for different types
        const resetDelay = type === "modal" ? 200 : 100
        setTimeout(() => setIsNavigating(false), resetDelay)
      }, navigationDelay)
    },
    [router],
  )

  const back = useCallback(
    (options: NavigationOptions = {}) => {
      const { delay = 100 } = options

      setIsNavigating(true)
      setNavigationType("back")

      setTimeout(() => {
        router.back()
        setTimeout(() => setIsNavigating(false), 50)
      }, delay)
    },
    [router],
  )

  const goHome = useCallback(() => {
    navigate("/", { type: "replace", delay: 100 })
  }, [navigate])

  const replace = useCallback(
    (href: string, options: NavigationOptions = {}) => {
      navigate(href, { ...options, type: "replace" })
    },
    [navigate],
  )

  const openModal = useCallback(
    (href: string, options: NavigationOptions = {}) => {
      navigate(href, { ...options, type: "modal", delay: 100 })
    },
    [navigate],
  )

  return {
    navigate,
    back,
    goHome,
    replace,
    openModal,
    isNavigating,
    navigationType,
  }
}
