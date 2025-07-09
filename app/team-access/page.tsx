"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, UserPlus } from "lucide-react"
import { useSmoothNavigation } from "../hooks/use-smooth-navigation"
import { motion } from "framer-motion"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { X } from "lucide-react"

interface AcceptedInvitation {
  id: string
  project: string
  appkey: string
  from: string
  accessLevel: string
  acceptedOn: string
}

interface ShareProject {
  id: string
  name: string
}

const acceptedInvitations: AcceptedInvitation[] = [
  {
    id: "1",
    project: "ChainDelight DEV",
    appkey: "M4XkJGZPWeGHleqYhRXJKow",
    from: "Administrator",
    accessLevel: "Administrator",
    acceptedOn: "10/15/2024",
  },
  {
    id: "2",
    project: "Sandgrid Test App",
    appkey: "ZN4314FNB8AS623GzpBR",
    from: "Full Access",
    accessLevel: "Full Access",
    acceptedOn: "2/28/2024",
  },
  {
    id: "3",
    project: "ChainDelight PROD",
    appkey: "PNqHDfcLcSWadfqZZn6n6A",
    from: "Administrator",
    accessLevel: "Administrator",
    acceptedOn: "4/23/2021",
  },
]

const shareProjects: ShareProject[] = [
  { id: "1", name: "Beacon Sample" },
  { id: "2", name: "pleaseshare" },
  { id: "3", name: "Stephanie web notify" },
  { id: "4", name: "Josh Rich Test Dev" },
  { id: "5", name: "Barnacles" },
  { id: "6", name: "ui-test" },
  { id: "7", name: "Caren's New Project" },
  { id: "8", name: "Lucy Gap Me Dev" },
  { id: "9", name: "WEW Collective" },
  { id: "10", name: "BWRHxa" },
  { id: "11", name: "Fine Pine ACME Test" },
]

export default function TeamAccessPage() {
  const { navigate } = useSmoothNavigation()
  const [invitations] = useState<AcceptedInvitation[]>(acceptedInvitations)
  const [inviteModal, setInviteModal] = useState(false)
  const [inviteEmails, setInviteEmails] = useState<string[]>([])
  const [currentEmail, setCurrentEmail] = useState("")
  const [selectedProjects, setSelectedProjects] = useState<Array<{ id: string; name: string; accessLevel: string }>>([])
  const [enableSSO, setEnableSSO] = useState(false)

  const availableProjects = [
    { id: "1", name: "ChainDelight DEV" },
    { id: "2", name: "Sandgrid Test App" },
    { id: "3", name: "ChainDelight PROD" },
    { id: "4", name: "Beacon Sample" },
    { id: "5", name: "Stephanie web notify" },
    { id: "6", name: "Josh Rich Test Dev" },
  ]

  const accessLevels = [
    { value: "viewer", label: "Viewer" },
    { value: "editor", label: "Editor" },
    { value: "admin", label: "Administrator" },
    { value: "full", label: "Full Access" },
  ]

  const handleRevokeAccess = (invitationId: string) => {
    // Handle revoke access logic
    console.log("Revoking access for:", invitationId)
  }

  const handleShareProject = (projectId: string) => {
    // Handle share project logic
    console.log("Sharing project:", projectId)
  }

  const openInviteModal = () => {
    setInviteModal(true)
    setInviteEmails([])
    setCurrentEmail("")
    setSelectedProjects([])
    setEnableSSO(false)
  }

  const closeInviteModal = () => {
    setInviteModal(false)
    setInviteEmails([])
    setCurrentEmail("")
    setSelectedProjects([])
    setEnableSSO(false)
  }

  const handleEmailKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && currentEmail.trim() && currentEmail.includes("@")) {
      if (!inviteEmails.includes(currentEmail.trim())) {
        setInviteEmails([...inviteEmails, currentEmail.trim()])
      }
      setCurrentEmail("")
    }
  }

  const removeEmail = (emailToRemove: string) => {
    setInviteEmails(inviteEmails.filter((email) => email !== emailToRemove))
  }

  const addProject = (projectId: string, projectName: string) => {
    if (!selectedProjects.find((p) => p.id === projectId)) {
      setSelectedProjects([
        ...selectedProjects,
        {
          id: projectId,
          name: projectName,
          accessLevel: "viewer",
        },
      ])
    }
  }

  const removeProject = (projectId: string) => {
    setSelectedProjects(selectedProjects.filter((p) => p.id !== projectId))
  }

  const updateProjectAccessLevel = (projectId: string, accessLevel: string) => {
    setSelectedProjects(selectedProjects.map((p) => (p.id === projectId ? { ...p, accessLevel } : p)))
  }

  const handleSendInvitations = () => {
    if (inviteEmails.length === 0 || selectedProjects.length === 0) return

    // Handle sending invitations logic here
    console.log("Sending invitations:", {
      emails: inviteEmails,
      projects: selectedProjects,
      enableSSO,
    })

    closeInviteModal()
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
            Team Access
          </Badge>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Title and Invite Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <h1 className="text-2xl font-bold text-slate-900">Team access</h1>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className="bg-[#1A48D6] hover:bg-[#1A48D6]/90 text-white" onClick={openInviteModal}>
              <UserPlus className="w-4 h-4 mr-2" />
              Invite to Projects
            </Button>
          </motion.div>
        </motion.div>

        <div className="space-y-8">
          {/* Project Invitations Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Project invitations</h2>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-600 uppercase tracking-wider">
                          Project
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-600 uppercase tracking-wider">
                          Appkey
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-600 uppercase tracking-wider">
                          From
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-600 uppercase tracking-wider">
                          Access Level
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={4} className="py-8 px-4 text-center text-slate-500">
                          No invitations
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Accepted Invitations Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Accepted invitations</h2>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-600 uppercase tracking-wider">
                          Project
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-600 uppercase tracking-wider">
                          Appkey
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-600 uppercase tracking-wider">
                          From
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-600 uppercase tracking-wider">
                          Access Level
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-600 uppercase tracking-wider">
                          Accepted On
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {invitations.map((invitation, index) => (
                        <motion.tr
                          key={invitation.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="hover:bg-slate-50 transition-colors duration-200"
                        >
                          <td className="py-3 px-4">
                            <button
                              onClick={() => navigate(`/project/${invitation.id}/team-access`, { type: "forward" })}
                              className="text-sm font-medium text-[#1A48D6] hover:text-[#1A48D6]/80 cursor-pointer transition-colors duration-200 hover:underline"
                            >
                              {invitation.project}
                            </button>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-slate-600 font-mono">{invitation.appkey}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-slate-600">{invitation.from}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-slate-600">{invitation.accessLevel}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-slate-600">{invitation.acceptedOn}</span>
                          </td>
                          <td className="py-3 px-4">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRevokeAccess(invitation.id)}
                                className="text-xs"
                              >
                                Revoke access
                              </Button>
                            </motion.div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Share Project Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Share project</h2>
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  {shareProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.02 }}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors duration-200"
                    >
                      <span className="text-sm text-slate-700">{project.name}</span>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShareProject(project.id)}
                          className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        {/* Invite Drawer */}
        {inviteModal && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={closeInviteModal} />

            {/* Drawer */}
            <div className="fixed inset-y-0 right-0 z-50 h-full w-1/2 bg-white shadow-2xl border-l border-slate-200 transform transition-transform duration-300 ease-in-out">
              <div className="flex h-full flex-col">
                {/* Drawer Header */}
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                  <Button variant="ghost" onClick={closeInviteModal} className="text-slate-600 hover:text-slate-900">
                    Cancel
                  </Button>
                  <h2 className="text-lg font-semibold text-slate-900">Invite</h2>
                  <Button
                    onClick={handleSendInvitations}
                    disabled={inviteEmails.length === 0 || selectedProjects.length === 0}
                    className="bg-[#1A48D6] hover:bg-[#1A48D6]/90 text-white"
                  >
                    Send
                  </Button>
                </div>

                {/* Drawer Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                  <div className="space-y-6">
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Add email addresses and select projects to invite users to multiple projects at once. Each user
                      will receive separate invitations for each selected project with their specified access level.
                    </p>

                    {/* Email Addresses Section */}
                    <div className="space-y-4">
                      <h3 className="text-base font-semibold text-slate-900">Email addresses</h3>

                      <div className="space-y-3">
                        <Input
                          type="email"
                          placeholder="Enter email address and press Enter"
                          value={currentEmail}
                          onChange={(e) => setCurrentEmail(e.target.value)}
                          onKeyPress={handleEmailKeyPress}
                          className="w-full"
                        />
                        <p className="text-xs text-slate-500">
                          Type an email address and press Enter to add it as a chip below.
                        </p>
                      </div>

                      {/* Email Chips */}
                      {inviteEmails.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {inviteEmails.map((email) => (
                            <motion.div
                              key={email}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1">
                                {email}
                                <button
                                  onClick={() => removeEmail(email)}
                                  className="ml-1 hover:text-red-600 transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Select Projects Section */}
                    <div className="space-y-4">
                      <h3 className="text-base font-semibold text-slate-900">Select Projects and Access Levels</h3>

                      <Select
                        onValueChange={(value) => {
                          const project = availableProjects.find((p) => p.id === value)
                          if (project) addProject(project.id, project.name)
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a project to add" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableProjects
                            .filter((project) => !selectedProjects.find((p) => p.id === project.id))
                            .map((project) => (
                              <SelectItem key={project.id} value={project.id}>
                                {project.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>

                      {/* Selected Projects */}
                      {selectedProjects.length > 0 && (
                        <div className="space-y-3">
                          {selectedProjects.map((project, index) => (
                            <motion.div
                              key={project.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2, delay: index * 0.05 }}
                              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <span className="font-medium text-slate-900 text-sm">{project.name}</span>
                                <button
                                  onClick={() => removeProject(project.id)}
                                  className="text-slate-400 hover:text-red-600 transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                              <Select
                                value={project.accessLevel}
                                onValueChange={(value) => updateProjectAccessLevel(project.id, value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {accessLevels.map((level) => (
                                    <SelectItem key={level.value} value={level.value}>
                                      {level.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Enable SSO Section */}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex-1 pr-4">
                          <h3 className="text-base font-semibold text-slate-900 mb-1">Enable SSO</h3>
                          <p className="text-sm text-slate-600">
                            Allow these users to sign in with SSO across all selected projects
                          </p>
                        </div>
                        <Switch checked={enableSSO} onCheckedChange={setEnableSSO} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
