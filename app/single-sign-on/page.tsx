"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Upload, Download, ExternalLink } from "lucide-react"
import { useSmoothNavigation } from "../hooks/use-smooth-navigation"
import { motion } from "framer-motion"
import { useState, useRef } from "react"
import { useToast } from "@/hooks/use-toast"

export default function SingleSignOnPage() {
  const { navigate } = useSmoothNavigation()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [ssoEnabled, setSsoEnabled] = useState(true)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [entityId] = useState("https://go.airship.com/sp")
  const [ssoWebAddress] = useState("--")

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type === "text/xml" || file.name.endsWith(".xml")) {
        setUploadedFile(file)
        toast({
          variant: "success",
          title: "File Uploaded",
          description: `${file.name} has been uploaded successfully`,
        })
      } else {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload an XML metadata file",
        })
      }
    }
  }

  const handleCopyEntityId = async () => {
    try {
      await navigator.clipboard.writeText(entityId)
      toast({
        variant: "success",
        title: "Copied",
        description: "Entity ID copied to clipboard",
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
      })
    }
  }

  const handleDownloadMetadata = () => {
    // Simulate metadata download
    toast({
      title: "Download Started",
      description: "SP Metadata file download has started",
    })
  }

  const handleSsoToggle = (enabled: boolean) => {
    setSsoEnabled(enabled)
    toast({
      variant: enabled ? "success" : "warning",
      title: enabled ? "SSO Enabled" : "SSO Disabled",
      description: enabled
        ? "Single Sign-On has been enabled for your organization"
        : "Single Sign-On has been disabled for your organization",
    })
  }

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
            <motion.img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Airship-logo-navigation%201-lSX4t5Wm0WSCYasUkWttCQsBcxucXj.png"
              alt="Airship Logo"
              className="h-6 w-auto cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={() => navigate("/", { type: "replace" })}
            />
          </div>
          <Badge variant="secondary" className="text-xs">
            Single Sign-On
          </Badge>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-4">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <h1 className="text-xl font-bold text-slate-900 mb-1">Single Sign-On</h1>
          <p className="text-slate-600 text-xs">
            Enable users to log in via identity provider.{" "}
            <button className="text-[#1A48D6] hover:text-[#1A48D6]/80 transition-colors duration-200">
              Learn more
              <ExternalLink className="w-3 h-3 inline ml-1" />
            </button>
          </p>
        </motion.div>

        <div className="space-y-3">
          {/* SSO Configuration Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Single Sign-On Configuration</CardTitle>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Configure SAML-based authentication for your organization
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-slate-700">Enabled</span>
                    <Switch checked={ssoEnabled} onCheckedChange={handleSsoToggle} size="sm" />
                  </div>
                </div>
              </CardHeader>
            </Card>
          </motion.div>

          {/* Identity Provider Metadata */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Identity provider (IDP) metadata</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xml,text/xml"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="space-y-2">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="mb-1 h-7 text-xs"
                      >
                        Choose File
                      </Button>
                      <p className="text-xs text-slate-500">{uploadedFile ? uploadedFile.name : "No file chosen"}</p>
                    </div>
                    <p className="text-xs text-slate-500">Upload your identity provider's metadata XML file</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Service Provider Metadata */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Service provider (SP) metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                {/* Entity ID */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">ENTITY ID</label>
                  <div className="flex items-center gap-1.5">
                    <Input
                      value={entityId}
                      readOnly
                      className="flex-1 bg-slate-50 text-[#1A48D6] font-mono text-xs h-7"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyEntityId}
                      className="flex items-center gap-1 bg-transparent h-7 px-2 text-xs"
                    >
                      <Copy className="w-3 h-3" />
                      Copy
                    </Button>
                  </div>
                </div>

                {/* SSO Web Address */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">SINGLE SIGN-ON WEB ADDRESS</label>
                  <Input value={ssoWebAddress} readOnly className="bg-slate-50 text-slate-500 h-7 text-xs" />
                </div>

                {/* Download Button */}
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadMetadata}
                    className="flex items-center gap-1.5 bg-transparent h-7 text-xs"
                  >
                    <Download className="w-3 h-3" />
                    Download SP Metadata
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
