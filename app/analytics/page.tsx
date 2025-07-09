"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BarChart3, TrendingUp, Users, Activity } from "lucide-react"
import { useSmoothNavigation } from "../hooks/use-smooth-navigation"
import { motion } from "framer-motion"

export default function AnalyticsPage() {
  const { back, navigate } = useSmoothNavigation()

  const stats = [
    { label: "Total Users", value: "2,847", icon: Users, change: "+12%" },
    { label: "Active Sessions", value: "1,234", icon: Activity, change: "+5%" },
    { label: "Growth Rate", value: "23.5%", icon: TrendingUp, change: "+2.1%" },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white border-b border-slate-200 px-4 py-3"
      >
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (window.history.length > 1) {
                    back()
                  } else {
                    navigate("/", { type: "replace" })
                  }
                }}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </motion.div>
            <div className="h-4 w-px bg-slate-300" />
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Airship-logo-navigation%201-lSX4t5Wm0WSCYasUkWttCQsBcxucXj.png"
              alt="Airship Logo"
              className="h-6 w-auto"
            />
          </div>
          <Badge variant="secondary" className="text-xs">
            Analytics
          </Badge>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Analytics Dashboard</h1>
            <p className="text-slate-600 text-sm">Monitor your system performance and user engagement</p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-600">{stat.label}</p>
                          <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                          <p className="text-sm text-green-600">{stat.change}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-[#1A48D6]" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Chart Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#1A48D6]" />
                  Usage Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
                  <p className="text-slate-500">Chart visualization would go here</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
