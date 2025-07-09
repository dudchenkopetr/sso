"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, Users, Shield, ChevronRight, Settings, BarChart3 } from "lucide-react"
import { useSmoothNavigation } from "./hooks/use-smooth-navigation"
import { motion } from "framer-motion"

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
  hover: {
    scale: 1.02,
    y: -4,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
    },
  },
}

export default function Component() {
  const { navigate, openModal, isNavigating } = useSmoothNavigation()

  const managementCards = [
    {
      id: "wallet",
      title: "Wallet Management",
      description: "Manage digital wallets, transactions, and payment methods",
      icon: Wallet,
      color: "blue",
      href: "/wallet-management",
      type: "forward" as const,
    },
    {
      id: "team",
      title: "Team Access",
      description: "Control team member access and permissions across projects",
      icon: Users,
      color: "emerald",
      href: "/team-access",
      type: "forward" as const,
    },
    {
      id: "sso",
      title: "Single Sign-On",
      description: "Configure SSO settings and authentication providers",
      icon: Shield,
      color: "violet",
      href: "/single-sign-on",
      type: "forward" as const,
    },
  ]

  const quickActions = [
    {
      id: "settings",
      title: "Settings",
      icon: Settings,
      href: "/settings",
      type: "modal" as const,
    },
    {
      id: "analytics",
      title: "Analytics",
      icon: BarChart3,
      href: "/analytics",
      type: "modal" as const,
    },
  ]

  const handleCardClick = (card: (typeof managementCards)[0]) => {
    if (card.type === "modal") {
      openModal(card.href, { preload: true })
    } else {
      navigate(card.href, { type: card.type, preload: true })
    }
  }

  const handleQuickAction = (action: (typeof quickActions)[0]) => {
    if (action.type === "modal") {
      openModal(action.href)
    } else {
      navigate(action.href, { type: action.type })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header with smooth transitions */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white border-b border-slate-200 px-4 py-3"
      >
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <motion.div className="flex items-center" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Airship-logo-navigation%201-lSX4t5Wm0WSCYasUkWttCQsBcxucXj.png"
              alt="Airship Logo"
              className="h-8 w-auto"
            />
          </motion.div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-xs">
              Team Access
            </Badge>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Management Portal</h1>
          <p className="text-slate-600 text-sm max-w-md mx-auto">
            Choose a management area to configure and control your system
          </p>
        </motion.div>

        {/* Management Cards */}
        <motion.div initial="hidden" animate="visible" className="grid md:grid-cols-3 gap-4 mb-8">
          {managementCards.map((card, index) => {
            const IconComponent = card.icon
            return (
              <motion.div key={card.id} custom={index} variants={cardVariants} whileHover="hover" whileTap="tap">
                <Card
                  className="group cursor-pointer border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-lg"
                  onClick={() => handleCardClick(card)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <motion.div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                          card.color === "blue"
                            ? "bg-blue-50 group-hover:bg-blue-100"
                            : card.color === "emerald"
                              ? "bg-emerald-50 group-hover:bg-emerald-100"
                              : "bg-violet-50 group-hover:bg-violet-100"
                        }`}
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <IconComponent
                          className={`w-4 h-4 ${
                            card.color === "blue"
                              ? "text-[#1A48D6]"
                              : card.color === "emerald"
                                ? "text-emerald-600"
                                : "text-violet-600"
                          }`}
                        />
                      </motion.div>
                      <motion.div animate={{ x: 0 }} whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors duration-200" />
                      </motion.div>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1 text-sm">{card.title}</h3>
                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">{card.description}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs h-7 bg-slate-50 hover:bg-slate-100 transition-all duration-200"
                    >
                      Configure
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </main>

      {/* Enhanced Loading Overlay with different styles based on navigation type */}
      {isNavigating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-8 h-8 border-2 border-[#1A48D6] border-t-transparent rounded-full"
          />
        </motion.div>
      )}
    </div>
  )
}
