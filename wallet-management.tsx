"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Search, MoreHorizontal, UserPlus, ChevronDown, RefreshCwIcon as Refresh } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface WalletManagementProps {
  onBack: () => void
}

interface TeamMember {
  id: string
  username: string
  email: string
  isAdmin: boolean
  hasSSO: boolean
}

const teamMembers: TeamMember[] = [
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

export default function WalletManagement({ onBack }: WalletManagementProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="h-4 w-px bg-slate-300" />
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Airship-logo-navigation%201-lSX4t5Wm0WSCYasUkWttCQsBcxucXj.png"
              alt="Airship Logo"
              className="h-6 w-auto"
            />
          </div>
          <Badge variant="secondary" className="text-xs">
            Team Management
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Search and Actions Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search team members" className="pl-10 h-9 text-sm bg-white" />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">0 of 4 selected</span>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                  Actions
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Refresh className="w-4 h-4 mr-2" />
                  Refresh
                </DropdownMenuItem>
                <DropdownMenuItem>Export</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button size="sm" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <UserPlus className="w-4 h-4" />
              Invite Members
            </Button>
          </div>
        </div>

        {/* Team Members Table */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
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
                {teamMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium text-slate-900">{member.username}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-slate-600">{member.email}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Switch checked={member.isAdmin} size="sm" />
                        <span className="text-xs text-slate-500">Toggle admin</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Switch checked={member.hasSSO} size="sm" />
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
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Remove</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
