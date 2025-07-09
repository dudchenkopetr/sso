"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Search,
  MoreHorizontal,
  UserPlus,
  ChevronDown,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  X,
} from "lucide-react"
import { useSmoothNavigation } from "../../../hooks/use-smooth-navigation"
import { useState } from "react"
import { useParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronRightIcon as BreadcrumbChevron } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TeamMember {
  id: string
  name: string
  email: string
  accessLevel: string
  hasSSO: boolean
  avatar?: string
}

interface ConfirmationModal {
  isOpen: boolean
  title: string
  description: string
  action: () => void
  type: "destructive" | "warning"
}

const projectTeamMembers: Record<string, { name: string; members: TeamMember[] }> = {
  "1": {
    name: "ChainDelight DEV",
    members: [
      {
        id: "1",
        name: "Jonathan Welmor",
        email: "jonathan.welmor+chrome@airship.com",
        accessLevel: "Owner",
        hasSSO: true,
        avatar: "J",
      },
      {
        id: "2",
        name: "Melissa David",
        email: "mr_melissa.david@test",
        accessLevel: "Administrator",
        hasSSO: false,
        avatar: "M",
      },
      {
        id: "3",
        name: "Lisa Helena",
        email: "lisa.helena.thank",
        accessLevel: "Reports, Campaigns and Segments",
        hasSSO: true,
        avatar: "L",
      },
      {
        id: "4",
        name: "Darla Salem",
        email: "darla.salem+dice@airship.com",
        accessLevel: "Administrator",
        hasSSO: false,
        avatar: "D",
      },
      {
        id: "5",
        name: "Maxine Arctuby",
        email: "mr_maxine.arctuby",
        accessLevel: "Full Access",
        hasSSO: true,
        avatar: "M",
      },
      {
        id: "6",
        name: "Jennifer Walther",
        email: "mr_jennifer.walther",
        accessLevel: "Administrator",
        hasSSO: false,
        avatar: "M",
      },
      {
        id: "7",
        name: "Mike Harrick",
        email: "mr_mike.harrick",
        accessLevel: "Full Access",
        hasSSO: true,
        avatar: "M",
      },
      {
        id: "8",
        name: "Simon Jomel",
        email: "mr_simon.jomel",
        accessLevel: "Administrator",
        hasSSO: false,
        avatar: "M",
      },
      {
        id: "9",
        name: "Aaron Gales",
        email: "mr_aaron.gales",
        accessLevel: "Administrator",
        hasSSO: true,
        avatar: "M",
      },
      {
        id: "10",
        name: "Michelle Barnett",
        email: "mr_michelle.alex.barnett",
        accessLevel: "Administrator",
        hasSSO: false,
        avatar: "M",
      },
    ],
  },
  "2": {
    name: "Sandgrid Test App",
    members: [
      {
        id: "1",
        name: "Test User 1",
        email: "test1@sandgrid.com",
        accessLevel: "Full Access",
        hasSSO: true,
        avatar: "T",
      },
      {
        id: "2",
        name: "Test User 2",
        email: "test2@sandgrid.com",
        accessLevel: "Administrator",
        hasSSO: false,
        avatar: "T",
      },
    ],
  },
  "3": {
    name: "ChainDelight PROD",
    members: [
      {
        id: "1",
        name: "Production Admin",
        email: "admin@chaindelight.com",
        accessLevel: "Administrator",
        hasSSO: true,
        avatar: "P",
      },
    ],
  },
}

const accessLevels = [
  { value: "viewer", label: "Viewer" },
  { value: "editor", label: "Editor" },
  { value: "administrator", label: "Administrator" },
  { value: "full", label: "Full Access" },
  { value: "owner", label: "Owner" },
  { value: "reports", label: "Reports, Campaigns and Segments" },
]

export default function ProjectTeamAccessPage() {
  const { navigate } = useSmoothNavigation()
  const { toast } = useToast()
  const params = useParams()
  const projectId = params.id as string

  const projectData = projectTeamMembers[projectId] || {
    name: "Unknown Project",
    members: [],
  }

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(projectData.members)
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [confirmationModal, setConfirmationModal] = useState<ConfirmationModal>({
    isOpen: false,
    title: "",
    description: "",
    action: () => {},
    type: "destructive",
  })

  const [inviteModal, setInviteModal] = useState(false)
  const [inviteEmails, setInviteEmails] = useState<string[]>([])
  const [currentEmail, setCurrentEmail] = useState("")
  const [enableSSO, setEnableSSO] = useState(false)
  const [selectedAccessLevel, setSelectedAccessLevel] = useState("administrator")

  const [editModal, setEditModal] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [editEmail, setEditEmail] = useState("")
  const [editAccessLevel, setEditAccessLevel] = useState("administrator")
  const [editSSO, setEditSSO] = useState(false)

  const itemsPerPage = 10
  const totalMembers = teamMembers.length
  const totalPages = Math.ceil(totalMembers / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalMembers)

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const paginatedMembers = filteredMembers.slice(startIndex, endIndex)

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
    setSelectedMembers((prev) =>
      prev.length === paginatedMembers.length ? [] : paginatedMembers.map((member) => member.id),
    )
  }

  const toggleSSO = (memberId: string) => {
    const member = teamMembers.find((m) => m.id === memberId)
    if (!member) return

    if (member.hasSSO) {
      showConfirmation(
        "Disable SSO Access",
        `Are you sure you want to disable SSO for ${member.name}? They will need to use standard login credentials.`,
        () => {
          setTeamMembers((prev) =>
            prev.map((member) => (member.id === memberId ? { ...member, hasSSO: false } : member)),
          )
          toast({
            variant: "warning",
            title: "SSO Disabled",
            description: `SSO access has been disabled for ${member.name}`,
          })
        },
        "warning",
      )
    } else {
      setTeamMembers((prev) => prev.map((member) => (member.id === memberId ? { ...member, hasSSO: true } : member)))
      toast({
        variant: "success",
        title: "SSO Enabled",
        description: `SSO access has been enabled for ${member.name}`,
      })
    }
  }

  const handleBulkAction = (action: string) => {
    const selectedCount = selectedMembers.length
    const selectedMemberNames = teamMembers
      .filter((member) => selectedMembers.includes(member.id))
      .map((member) => member.name)

    switch (action) {
      case "enable-sso":
        setTeamMembers((prev) =>
          prev.map((member) => (selectedMembers.includes(member.id) ? { ...member, hasSSO: true } : member)),
        )
        setSelectedMembers([])
        toast({
          variant: "success",
          title: "SSO Enabled",
          description: `SSO access enabled for ${selectedCount} member${selectedCount > 1 ? "s" : ""}`,
        })
        break
      case "disable-sso":
        showConfirmation(
          "Disable SSO Access",
          `Are you sure you want to disable SSO for ${selectedCount} member${selectedCount > 1 ? "s" : ""}?`,
          () => {
            setTeamMembers((prev) =>
              prev.map((member) => (selectedMembers.includes(member.id) ? { ...member, hasSSO: false } : member)),
            )
            setSelectedMembers([])
            toast({
              variant: "warning",
              title: "SSO Disabled",
              description: `SSO access disabled for ${selectedCount} member${selectedCount > 1 ? "s" : ""}`,
            })
          },
          "warning",
        )
        break
      case "remove":
        showConfirmation(
          "Remove Team Members",
          `Are you sure you want to remove ${selectedCount} member${selectedCount > 1 ? "s" : ""} from this project?`,
          () => {
            setTeamMembers((prev) => prev.filter((member) => !selectedMembers.includes(member.id)))
            setSelectedMembers([])
            toast({
              variant: "destructive",
              title: "Members Removed",
              description: `${selectedCount} member${selectedCount > 1 ? "s" : ""} removed from ${projectData.name}`,
            })
          },
        )
        break
    }
  }

  const closeEditModal = () => {
    setEditModal(false)
    setEditingMember(null)
    setEditEmail("")
    setEditAccessLevel("administrator")
    setEditSSO(false)
  }

  const handleEditSubmit = () => {
    if (!editingMember || !editEmail.trim() || !editEmail.includes("@")) return

    const accessLevelLabel = accessLevels.find((level) => level.value === editAccessLevel)?.label || "Administrator"

    setTeamMembers((prev) =>
      prev.map((member) =>
        member.id === editingMember.id
          ? {
              ...member,
              email: editEmail.trim(),
              accessLevel: accessLevelLabel,
              hasSSO: editSSO,
            }
          : member,
      ),
    )

    toast({
      variant: "success",
      title: "Member Updated",
      description: `${editingMember.name} has been updated successfully`,
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
        setEditAccessLevel(accessLevels.find((level) => level.label === member.accessLevel)?.value || "administrator")
        setEditSSO(member.hasSSO)
        setEditModal(true)
        break
      case "remove":
        showConfirmation(
          "Remove Team Member",
          `Are you sure you want to remove ${member.name} from this project?`,
          () => {
            setTeamMembers((prev) => prev.filter((m) => m.id !== memberId))
            toast({
              variant: "destructive",
              title: "Member Removed",
              description: `${member.name} has been removed from ${projectData.name}`,
            })
          },
        )
        break
      case "change-access":
        // Handle access level change
        console.log("Change access for:", member.name)
        toast({
          title: "Change Access Level",
          description: `Opening access level dialog for ${member.name}`,
        })
        break
    }
  }

  const openInviteModal = () => {
    setInviteModal(true)
    setInviteEmails([])
    setCurrentEmail("")
    setEnableSSO(false)
    setSelectedAccessLevel("administrator")
  }

  const closeInviteModal = () => {
    setInviteModal(false)
    setInviteEmails([])
    setCurrentEmail("")
    setEnableSSO(false)
    setSelectedAccessLevel("administrator")
  }

  const handleEmailKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && currentEmail.trim() && currentEmail.includes("@")) {
      if (!inviteEmails.includes(currentEmail.trim())) {
        setInviteEmails([...inviteEmails, currentEmail.trim()])
        toast({
          variant: "success",
          title: "Email Added",
          description: `${currentEmail.trim()} added to invitation list`,
        })
      } else {
        toast({
          variant: "warning",
          title: "Email Already Added",
          description: `${currentEmail.trim()} is already in the invitation list`,
        })
      }
      setCurrentEmail("")
    }
  }

  const removeEmail = (emailToRemove: string) => {
    setInviteEmails(inviteEmails.filter((email) => email !== emailToRemove))
    toast({
      title: "Email Removed",
      description: `${emailToRemove} removed from invitation list`,
    })
  }

  const handleInviteSubmit = () => {
    const validEmails = inviteEmails.filter((email) => email.trim() && email.includes("@"))
    if (validEmails.length === 0) return

    const accessLevelLabel = accessLevels.find((level) => level.value === selectedAccessLevel)?.label || "Administrator"

    const newMembers = validEmails.map((email, index) => ({
      id: `new-${Date.now()}-${index}`,
      name: email.split("@")[0],
      email: email.trim(),
      accessLevel: accessLevelLabel,
      hasSSO: enableSSO,
    }))

    setTeamMembers((prev) => [...prev, ...newMembers])
    closeInviteModal()

    toast({
      variant: "success",
      title: "Invitations Sent",
      description: `${validEmails.length} invitation${validEmails.length > 1 ? "s" : ""} sent for ${projectData.name}`,
    })
  }

  const handleRefresh = () => {
    // Simulate refresh action
    toast({
      title: "Refreshed",
      description: "Team member data has been refreshed",
    })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Airship-logo-navigation%201-lSX4t5Wm0WSCYasUkWttCQsBcxucXj.png"
              alt="Airship Logo"
              className="h-6 w-auto cursor-pointer"
              onClick={() => navigate("/", { type: "replace" })}
            />
          </div>
          <Badge variant="secondary" className="text-xs">
            Project Team Access
          </Badge>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-100 px-4 py-2">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center space-x-2 text-sm">
            <button
              onClick={() => navigate("/", { type: "replace" })}
              className="text-slate-500 hover:text-slate-700 transition-colors duration-200"
            >
              Home
            </button>
            <BreadcrumbChevron className="w-4 h-4 text-slate-400" />
            <button
              onClick={() => navigate("/team-access", { type: "back" })}
              className="text-slate-500 hover:text-slate-700 transition-colors duration-200"
            >
              Team Access
            </button>
            <BreadcrumbChevron className="w-4 h-4 text-slate-400" />
            <span className="text-slate-900 font-medium">{projectData.name}</span>
          </nav>
        </div>
      </div>

      {/* Page Title Section */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{projectData.name} - Team Access</h1>
          <p className="text-slate-600 text-sm max-w-2xl">
            Manage team members and their access levels for this project
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 pb-6">
        {/* Search and Actions Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search team members"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9 text-sm bg-white transition-all duration-200 focus:ring-2 focus:ring-[#1A48D6]/20 focus:border-[#1A48D6]"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">
              {selectedMembers.length} of {totalMembers} selected
            </span>

            {selectedMembers.length > 0 && (
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                      Actions
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleBulkAction("enable-sso")}>Enable SSO</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction("disable-sso")}>Disable SSO</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction("remove")} className="text-red-600">
                      Remove Members
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            <div>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-transparent hover:bg-slate-100 transition-colors duration-200"
                onClick={handleRefresh}
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>

            <div>
              <Button
                size="sm"
                className="flex items-center gap-2 bg-[#1A48D6] hover:bg-[#1A48D6]/90 transition-colors duration-200 text-white"
                onClick={openInviteModal}
              >
                <UserPlus className="w-4 h-4" />
                Invite Members
              </Button>
            </div>
          </div>
        </div>

        {/* Team Members Table */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3 px-4 w-12">
                    <Checkbox
                      checked={selectedMembers.length === paginatedMembers.length && paginatedMembers.length > 0}
                      onCheckedChange={toggleAllMembers}
                    />
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Access Level
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
                {paginatedMembers.map((member, index) => (
                  <tr key={member.id} className="hover:bg-slate-50 transition-colors duration-200">
                    <td className="py-3 px-4">
                      <Checkbox
                        checked={selectedMembers.includes(member.id)}
                        onCheckedChange={() => toggleMemberSelection(member.id)}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="text-sm font-medium text-slate-900">{member.name}</div>
                        <div className="text-xs text-slate-500">{member.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          member.accessLevel === "Owner"
                            ? "default"
                            : member.accessLevel === "Administrator"
                              ? "secondary"
                              : "outline"
                        }
                        className="text-xs"
                      >
                        {member.accessLevel}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Switch checked={member.hasSSO} onCheckedChange={() => toggleSSO(member.id)} size="sm" />
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
                          <DropdownMenuItem onClick={() => handleIndividualAction(member.id, "change-access")}>
                            Change Access Level
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleIndividualAction(member.id, "remove")}
                            className="text-red-600"
                            disabled={member.accessLevel === "Owner"}
                          >
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-200">
            <div className="text-sm text-slate-600">
              Showing {startIndex + 1} to {endIndex} of {totalMembers} results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <span className="text-sm text-slate-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
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
              {confirmationModal.type === "destructive" ? "Remove" : "Confirm"}
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
                <h2 className="text-lg font-semibold text-slate-900">Invite to {projectData.name}</h2>
                <Button
                  onClick={handleInviteSubmit}
                  disabled={inviteEmails.length === 0}
                  className="bg-[#1A48D6] hover:bg-[#1A48D6]/90 text-white"
                >
                  Send
                </Button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="space-y-6">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Add email addresses to invite users to {projectData.name}. New members will be added with
                    Administrator access by default.
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
                          <div key={email} className="transition-opacity duration-200">
                            <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1">
                              {email}
                              <button
                                onClick={() => removeEmail(email)}
                                className="ml-1 hover:text-red-600 transition-colors duration-200"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Project Info and Role Selection */}
                  <div className="p-4 bg-slate-50 rounded-lg space-y-4">
                    <h3 className="text-base font-semibold text-slate-900">Project Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Project:</span>
                        <span className="font-medium text-slate-900">{projectData.name}</span>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Access Level</label>
                        <Select value={selectedAccessLevel} onValueChange={setSelectedAccessLevel}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select access level" />
                          </SelectTrigger>
                          <SelectContent>
                            {accessLevels.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-slate-500">
                          All invited members will receive this access level for this project
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Enable SSO Section */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex-1 pr-4">
                        <h3 className="text-base font-semibold text-slate-900 mb-1">Enable SSO</h3>
                        <p className="text-sm text-slate-600">Allow these users to sign in with SSO for this project</p>
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
                <h2 className="text-lg font-semibold text-slate-900">Edit {editingMember.name}</h2>
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
                    Update {editingMember.name}'s information and access settings for {projectData.name}.
                  </p>

                  {/* Member Info Section */}
                  <div className="p-4 bg-slate-50 rounded-lg space-y-4">
                    <h3 className="text-base font-semibold text-slate-900">Member Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Name:</span>
                        <span className="font-medium text-slate-900">{editingMember.name}</span>
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

                  {/* Project Access Section */}
                  <div className="p-4 bg-slate-50 rounded-lg space-y-4">
                    <h3 className="text-base font-semibold text-slate-900">Project Access</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Project:</span>
                        <span className="font-medium text-slate-900">{projectData.name}</span>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Access Level</label>
                        <Select value={editAccessLevel} onValueChange={setEditAccessLevel}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select access level" />
                          </SelectTrigger>
                          <SelectContent>
                            {accessLevels.map((level) => (
                              <SelectItem key={level.value} value={level.value} disabled={level.value === "owner"}>
                                {level.label}
                              </SelectItem>
                            ))}
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
                        <p className="text-sm text-slate-600">Allow this user to sign in with SSO for this project</p>
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
