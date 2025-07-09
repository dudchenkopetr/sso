"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, MoreHorizontal, UserPlus, ChevronDown, Trash2, Shield, UserX, AlertTriangle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSmoothNavigation } from "../hooks/use-smooth-navigation"
import { motion } from "framer-motion"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface TeamMember {
  id: string
  username: string
  email: string
  isAdmin: boolean
  hasSSO: boolean
}

interface ConfirmationModal {
  isOpen: boolean
  title: string
  description: string
  action: () => void
  type: "destructive" | "warning"
}

const initialTeamMembers: TeamMember[] = [
  {
    id: "1",
    username: "john.doe",
    email: "john.doe@company.com",
    isAdmin: true,
    hasSSO: true,
  },
  {
    id: "2",
    username: "jane.smith",
    email: "jane.smith@company.com",
    isAdmin: false,
    hasSSO: true,
  },
  {
    id: "3",
    username: "mike.wilson",
    email: "mike.wilson@company.com",
    isAdmin: false,
    hasSSO: false,
  },
  {
    id: "4",
    username: "sarah.johnson",
    email: "sarah.johnson@company.com",
    isAdmin: true,
    hasSSO: true,
  },
]

export default function WalletManagementPage() {
  const { back, isNavigating, navigate } = useSmoothNavigation()
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers)
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [confirmationModal, setConfirmationModal] = useState<ConfirmationModal>({
    isOpen: false,
    title: "",
    description: "",
    action: () => {},
    type: "destructive",
  })

  const [inviteModal, setInviteModal] = useState(false)
  const [inviteEmails, setInviteEmails] = useState<string[]>([""])
  const [inviteSSO, setInviteSSO] = useState(true)

  const [editModal, setEditModal] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [editEmail, setEditEmail] = useState("")
  const [editAccessLevel, setEditAccessLevel] = useState("editor")
  const [editSSO, setEditSSO] = useState(false)

  const { toast } = useToast()

  const showConfirmation = (
    title: string,
    description: string,
    action: () => void,
    type: "destructive" | "warning" = "destructive",
  ) => {
    setConfirmationModal({
      isOpen: true,
      title,
      description,
      action,
      type,
    })
  }

  const closeConfirmation = () => {
    setConfirmationModal({
      isOpen: false,
      title: "",
      description: "",
      action: () => {},
      type: "destructive",
    })
  }

  const executeConfirmedAction = () => {
    confirmationModal.action()
    closeConfirmation()
  }

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMembers((prev) => (prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]))
  }

  const toggleAllMembers = () => {
    setSelectedMembers((prev) => (prev.length === teamMembers.length ? [] : teamMembers.map((member) => member.id)))
  }

  const toggleAdminStatus = (memberId: string) => {
    const member = teamMembers.find((m) => m.id === memberId)
    if (!member) return

    if (member.isAdmin) {
      showConfirmation(
        "Remove Admin Access",
        `Are you sure you want to remove admin privileges from ${member.username}? This will restrict their access to administrative functions.`,
        () => {
          setTeamMembers((prev) =>
            prev.map((member) => (member.id === memberId ? { ...member, isAdmin: false } : member)),
          )
        },
        "warning",
      )
    } else {
      setTeamMembers((prev) => prev.map((member) => (member.id === memberId ? { ...member, isAdmin: true } : member)))
    }
  }

  const toggleSSOStatus = (memberId: string) => {
    const member = teamMembers.find((m) => m.id === memberId)
    if (!member) return

    if (member.hasSSO) {
      showConfirmation(
        "Disable SSO Access",
        `Are you sure you want to disable SSO for ${member.username}? They will need to use standard login credentials.`,
        () => {
          setTeamMembers((prev) =>
            prev.map((member) => (member.id === memberId ? { ...member, hasSSO: false } : member)),
          )
        },
        "warning",
      )
    } else {
      setTeamMembers((prev) => prev.map((member) => (member.id === memberId ? { ...member, hasSSO: true } : member)))
    }
  }

  const handleBulkAction = (action: string) => {
    const selectedCount = selectedMembers.length

    switch (action) {
      case "enable-admin":
        setTeamMembers((prev) =>
          prev.map((member) => (selectedMembers.includes(member.id) ? { ...member, isAdmin: true } : member)),
        )
        break
      case "disable-admin":
        showConfirmation(
          "Remove Admin Access",
          `Are you sure you want to remove admin privileges from ${selectedCount} member${selectedCount > 1 ? "s" : ""}? This will restrict their access to administrative functions.`,
          () => {
            setTeamMembers((prev) =>
              prev.map((member) => (selectedMembers.includes(member.id) ? { ...member, isAdmin: false } : member)),
            )
          },
          "warning",
        )
        break
      case "enable-sso":
        setTeamMembers((prev) =>
          prev.map((member) => (selectedMembers.includes(member.id) ? { ...member, hasSSO: true } : member)),
        )
        break
      case "disable-sso":
        showConfirmation(
          "Disable SSO Access",
          `Are you sure you want to disable SSO for ${selectedCount} member${selectedCount > 1 ? "s" : ""}? They will need to use standard login credentials.`,
          () => {
            setTeamMembers((prev) =>
              prev.map((member) => (selectedMembers.includes(member.id) ? { ...member, hasSSO: false } : member)),
            )
          },
          "warning",
        )
        break
      case "remove":
        showConfirmation(
          "Remove Team Members",
          `Are you sure you want to remove ${selectedCount} member${selectedCount > 1 ? "s" : ""} from the team? This action cannot be undone.`,
          () => {
            setTeamMembers((prev) => prev.filter((member) => !selectedMembers.includes(member.id)))
            setSelectedMembers([])
          },
        )
        break
    }
  }

  const closeInviteModal = () => {
    setInviteModal(false)
    setInviteEmails([""])
    setInviteSSO(true)
  }

  const closeEditModal = () => {
    setEditModal(false)
    setEditingMember(null)
    setEditEmail("")
    setEditAccessLevel("editor")
    setEditSSO(false)
  }

  const handleEditSubmit = () => {
    if (!editingMember || !editEmail.trim() || !editEmail.includes("@")) return

    setTeamMembers((prev) =>
      prev.map((member) =>
        member.id === editingMember.id
          ? {
              ...member,
              email: editEmail.trim(),
              isAdmin: editAccessLevel === "admin",
              hasSSO: editSSO,
            }
          : member,
      ),
    )

    toast({
      variant: "success",
      title: "Member Updated",
      description: `${editingMember.username} has been updated successfully`,
    })

    closeEditModal()
  }

  const handleIndividualAction = (memberId: string, action: string) => {
    const member = teamMembers.find((m) => m.id === memberId)
    if (!member) return

    switch (action) {
      case "edit":
        setEditingMember(member)
        setEditEmail(member.email)
        setEditAccessLevel(member.isAdmin ? "admin" : "editor")
        setEditSSO(member.hasSSO)
        setEditModal(true)
        break
      case "remove":
        showConfirmation(
          "Remove Team Member",
          `Are you sure you want to remove ${member.username} from the team? This action cannot be undone.`,
          () => {
            setTeamMembers((prev) => prev.filter((m) => m.id !== memberId))
          },
        )
        break
      case "delete":
        showConfirmation(
          "Delete Team Member",
          `Are you sure you want to permanently delete ${member.username}? This will remove all their data and cannot be undone.`,
          () => {
            setTeamMembers((prev) => prev.filter((m) => m.id !== memberId))
          },
        )
        break
    }
  }

  const openInviteModal = () => {
    setInviteModal(true)
    setInviteEmails([""])
    setInviteSSO(true)
  }

  const addEmailField = () => {
    setInviteEmails([...inviteEmails, ""])
  }

  const removeEmailField = (index: number) => {
    if (inviteEmails.length > 1) {
      setInviteEmails(inviteEmails.filter((_, i) => i !== index))
    }
  }

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...inviteEmails]
    newEmails[index] = value
    setInviteEmails(newEmails)
  }

  const handleInviteSubmit = () => {
    const validEmails = inviteEmails.filter((email) => email.trim() && email.includes("@"))
    if (validEmails.length === 0) return

    const newMembers = validEmails.map((email, index) => ({
      id: `new-${Date.now()}-${index}`,
      username: email.split("@")[0],
      email: email.trim(),
      isAdmin: false,
      hasSSO: inviteSSO,
    }))

    setTeamMembers((prev) => [...prev, ...newMembers])
    closeInviteModal()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header with smooth back transition */}
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
            Team Management
          </Badge>
        </div>
      </motion.header>

      {/* Page Title Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-6xl mx-auto px-4 py-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Wallet Managementnt</h1>
          <p className="text-slate-600 text-sm max-w-2xl">
            Manage your team members, control access permissions, and configure authentication settings. Add new
            members, assign admin privileges, and enable SSO for secure access.
          </p>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-6xl mx-auto px-4 pb-6"
      >
        {/* Search and Actions Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search team members"
              className="pl-10 h-9 text-sm bg-white transition-all duration-200 focus:ring-2 focus:ring-[#1A48D6]/20 focus:border-[#1A48D6]"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">
              {selectedMembers.length} of {teamMembers.length} selected
            </span>

            {selectedMembers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                      Bulk Actions
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleBulkAction("enable-admin")}>
                      <Shield className="w-4 h-4 mr-2" />
                      Enable Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction("disable-admin")}>
                      <UserX className="w-4 h-4 mr-2" />
                      Disable Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction("enable-sso")}>
                      <Shield className="w-4 h-4 mr-2" />
                      Enable SSO
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction("disable-sso")}>
                      <UserX className="w-4 h-4 mr-2" />
                      Disable SSO
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction("remove")} className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove Members
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            )}

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                className="flex items-center gap-2 bg-[#1A48D6] hover:bg-[#1A48D6]/90"
                onClick={openInviteModal}
              >
                <UserPlus className="w-4 h-4" />
                Invite Members
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Team Members Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-lg border border-slate-200 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3 px-4 w-12">
                    <Checkbox
                      checked={selectedMembers.length === teamMembers.length}
                      onCheckedChange={toggleAllMembers}
                    />
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Admin
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-600 uppercase tracking-wider">
                    SSO
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {teamMembers.map((member, index) => (
                  <motion.tr
                    key={member.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-slate-50 transition-colors duration-200"
                  >
                    <td className="py-3 px-4">
                      <Checkbox
                        checked={selectedMembers.includes(member.id)}
                        onCheckedChange={() => toggleMemberSelection(member.id)}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium text-slate-900">{member.username}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-slate-600">{member.email}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={member.isAdmin}
                          onCheckedChange={() => toggleAdminStatus(member.id)}
                          size="sm"
                        />
                        <span className="text-xs text-slate-500">Toggle admin</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Switch checked={member.hasSSO} onCheckedChange={() => toggleSSOStatus(member.id)} size="sm" />
                        <span className="text-xs text-slate-500">Toggle SSO</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleIndividualAction(member.id, "edit")}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleIndividualAction(member.id, "remove")}>
                            Remove
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleIndividualAction(member.id, "delete")}
                            className="text-red-600"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.main>

      {/* Loading Overlay */}
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

      {/* Modals remain the same... */}
      <Dialog open={confirmationModal.isOpen} onOpenChange={closeConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  confirmationModal.type === "destructive" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-left">{confirmationModal.title}</DialogTitle>
              </div>
            </div>
          </DialogHeader>
          <DialogDescription className="text-left mt-2">{confirmationModal.description}</DialogDescription>
          <DialogFooter className="flex gap-2 mt-6">
            <Button variant="outline" onClick={closeConfirmation} size="sm">
              Cancel
            </Button>
            <Button
              onClick={executeConfirmedAction}
              size="sm"
              className={
                confirmationModal.type === "destructive"
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-amber-600 hover:bg-amber-700 text-white"
              }
            >
              {confirmationModal.type === "destructive" ? "Delete" : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Members Drawer */}
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
                <h2 className="text-lg font-semibold text-slate-900">Invite Team Members</h2>
                <Button
                  onClick={handleInviteSubmit}
                  disabled={!inviteEmails.some((email) => email.trim() && email.includes("@"))}
                  className="bg-[#1A48D6] hover:bg-[#1A48D6]/90 text-white"
                >
                  Send Invitations
                </Button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="space-y-6">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Add new team members by entering their email addresses. You can invite multiple members at once and
                    configure their initial settings.
                  </p>

                  {/* Email Addresses Section */}
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-slate-900">Email Addresses</h3>

                    {inviteEmails.map((email, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          type="email"
                          placeholder="Enter email address"
                          value={email}
                          onChange={(e) => updateEmail(index, e.target.value)}
                          className="flex-1"
                        />
                        {inviteEmails.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEmailField(index)}
                            className="h-9 w-9 p-0 text-slate-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addEmailField}
                      className="w-full text-sm bg-transparent"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Another Email
                    </Button>
                  </div>

                  {/* SSO Settings */}
                  <div className="p-4 bg-slate-50 rounded-lg space-y-4">
                    <h3 className="text-base font-semibold text-slate-900">Settings</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-slate-700">Enable SSO</label>
                        <p className="text-xs text-slate-500">Allow new members to use single sign-on</p>
                      </div>
                      <Switch checked={inviteSSO} onCheckedChange={setInviteSSO} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Edit Member Drawer */}
      {editModal && editingMember && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={closeEditModal} />

          {/* Drawer */}
          <div className="fixed inset-y-0 right-0 z-50 h-full w-1/2 bg-white shadow-2xl border-l border-slate-200 transform transition-transform duration-300 ease-in-out">
            <div className="flex h-full flex-col">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                <Button variant="ghost" onClick={closeEditModal} className="text-slate-600 hover:text-slate-900">
                  Cancel
                </Button>
                <h2 className="text-lg font-semibold text-slate-900">Edit {editingMember.username}</h2>
                <Button
                  onClick={handleEditSubmit}
                  disabled={!editEmail.trim() || !editEmail.includes("@")}
                  className="bg-[#1A48D6] hover:bg-[#1A48D6]/90 text-white"
                >
                  Save Changes
                </Button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="space-y-6">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Update {editingMember.username}'s information and access settings.
                  </p>

                  {/* Member Info Section */}
                  <div className="p-4 bg-slate-50 rounded-lg space-y-4">
                    <h3 className="text-base font-semibold text-slate-900">Member Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Username:</span>
                        <span className="font-medium text-slate-900">{editingMember.username}</span>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Email Address</label>
                        <Input
                          type="email"
                          placeholder="Enter email address"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Access Settings Section */}
                  <div className="p-4 bg-slate-50 rounded-lg space-y-4">
                    <h3 className="text-base font-semibold text-slate-900">Access Settings</h3>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Access Level</label>
                        <Select value={editAccessLevel} onValueChange={setEditAccessLevel}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select access level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="admin">Administrator</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-slate-500">Choose the appropriate access level for this member</p>
                      </div>
                    </div>
                  </div>

                  {/* SSO Settings */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex-1 pr-4">
                        <h3 className="text-base font-semibold text-slate-900 mb-1">SSO Access</h3>
                        <p className="text-sm text-slate-600">Allow this user to sign in with SSO</p>
                      </div>
                      <Switch checked={editSSO} onCheckedChange={setEditSSO} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
