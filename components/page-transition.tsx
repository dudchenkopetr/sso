"use client"

import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { type ReactNode, useEffect, useState } from "react"

interface PageTransitionProps {
  children: ReactNode
}

type RouteType = "forward" | "back" | "modal" | "sidebar" | "replace" | "initial"
type AnimationType = "slide" | "fade" | "scale" | "flip" | "drawer" | "stack"

interface RouteConfig {
  pattern: RegExp
  type: RouteType
  animation: AnimationType
}

// Route configuration - define different animations for different route patterns
const routeConfigs: RouteConfig[] = [
  // Management pages - slide animation
  { pattern: /^\/wallet-management/, type: "forward", animation: "slide" },
  { pattern: /^\/team-access/, type: "forward", animation: "slide" },
  { pattern: /^\/single-sign-on/, type: "forward", animation: "slide" },

  // Modal-like pages - scale animation
  { pattern: /\/settings/, type: "modal", animation: "scale" },
  { pattern: /\/profile/, type: "modal", animation: "scale" },

  // Dashboard/overview pages - fade animation
  { pattern: /^\/$/, type: "replace", animation: "fade" },
  { pattern: /^\/dashboard/, type: "replace", animation: "fade" },
]

// Animation variants for different types
const animationVariants = {
  slide: {
    initial: { opacity: 0, x: 30, scale: 0.98 },
    in: { opacity: 1, x: 0, scale: 1 },
    out: { opacity: 0, x: -30, scale: 0.98 },
  },
  slideBack: {
    initial: { opacity: 0, x: -30, scale: 0.98 },
    in: { opacity: 1, x: 0, scale: 1 },
    out: { opacity: 0, x: 30, scale: 0.98 },
  },
  fade: {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95, y: 10 },
    in: { opacity: 1, scale: 1, y: 0 },
    out: { opacity: 0, scale: 0.98, y: -5 },
  },
  flip: {
    initial: { opacity: 0, rotateY: -15, scale: 0.9 },
    in: { opacity: 1, rotateY: 0, scale: 1 },
    out: { opacity: 0, rotateY: 15, scale: 0.9 },
  },
  drawer: {
    initial: { opacity: 0, y: 50, scale: 0.95 },
    in: { opacity: 1, y: 0, scale: 1 },
    out: { opacity: 0, y: -20, scale: 0.98 },
  },
  stack: {
    initial: { opacity: 0, scale: 0.8, y: 100 },
    in: { opacity: 1, scale: 1, y: 0 },
    out: { opacity: 0, scale: 1.05, y: -50 },
  },
}

// Transition configurations for different animation types
const transitionConfigs = {
  slide: {
    type: "tween",
    ease: "anticipate",
    duration: 0.4,
  },
  slideBack: {
    type: "tween",
    ease: "anticipate",
    duration: 0.4,
  },
  fade: {
    type: "tween",
    ease: "easeInOut",
    duration: 0.3,
  },
  scale: {
    type: "tween",
    ease: "easeOut",
    duration: 0.3,
  },
  flip: {
    type: "spring",
    damping: 20,
    stiffness: 300,
    duration: 0.6,
  },
  drawer: {
    type: "spring",
    damping: 30,
    stiffness: 400,
    duration: 0.4,
  },
  stack: {
    type: "spring",
    damping: 25,
    stiffness: 200,
    duration: 0.7,
  },
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [currentRouteType, setCurrentRouteType] = useState<RouteType>("initial")
  const [currentAnimation, setCurrentAnimation] = useState<AnimationType>("fade")

  // Detect route type and animation based on navigation
  useEffect(() => {
    // Find matching route configuration
    const routeConfig = routeConfigs.find((config) => config.pattern.test(pathname))

    if (routeConfig) {
      setCurrentRouteType(routeConfig.type)
      setCurrentAnimation(routeConfig.animation)
    } else {
      // Default configuration
      setCurrentRouteType("forward")
      setCurrentAnimation("slide")
    }
  }, [pathname])

  // Select appropriate animation variant
  const getAnimationVariant = () => {
    if (currentRouteType === "back") {
      return animationVariants.slideBack
    }
    return animationVariants[currentAnimation] || animationVariants.slide
  }

  const getTransitionConfig = () => {
    if (currentRouteType === "back") {
      return transitionConfigs.slideBack
    }
    return transitionConfigs[currentAnimation] || transitionConfigs.slide
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={getAnimationVariant()}
        transition={getTransitionConfig()}
        className="min-h-screen"
        style={{
          // Add perspective for 3D animations like flip
          perspective: currentAnimation === "flip" ? "1000px" : "none",
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Export route type detector for use in other components
export function useRouteType() {
  const pathname = usePathname()

  const getRouteInfo = () => {
    const routeConfig = routeConfigs.find((config) => config.pattern.test(pathname))
    return {
      type: routeConfig?.type || "forward",
      animation: routeConfig?.animation || "slide",
      pathname,
    }
  }

  return getRouteInfo()
}
