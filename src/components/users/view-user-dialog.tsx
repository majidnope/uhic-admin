import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { User } from "@/lib/mock-data"
import { Mail, Calendar, DollarSign, CreditCard, Activity } from "lucide-react"

interface ViewUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
}

export function ViewUserDialog({ open, onOpenChange, user }: ViewUserDialogProps) {
  if (!user) return null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="success">Active</Badge>
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* User Header */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">
                {user.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-gray-900">{user.name}</h3>
              <p className="text-gray-600 flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4" />
                {user.email}
              </p>
            </div>
            {getStatusBadge(user.status)}
          </div>

          {/* User Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <CreditCard className="h-4 w-4" />
                <span className="text-sm font-medium">Plan</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {typeof user.plan === 'string' ? user.plan : user.plan?.name}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm font-medium">Total Revenue</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">${user.revenue}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">Join Date</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(user.joinDate).toLocaleDateString()}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Activity className="h-4 w-4" />
                <span className="text-sm font-medium">Last Login</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(user.lastLogin).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}