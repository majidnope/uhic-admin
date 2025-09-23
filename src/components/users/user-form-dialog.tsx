import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectOption } from "@/components/ui/select"
import type { User, Plan } from "@/lib/mock-data"

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (userData: Partial<User>) => Promise<void>
  user?: User | null
  plans: Plan[]
  mode: "create" | "edit"
}

export function UserFormDialog({
  open,
  onOpenChange,
  onSubmit,
  user,
  plans,
  mode,
}: UserFormDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "active" as const,
    plan: "",
    revenue: 0,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user && mode === "edit") {
      setFormData({
        name: user.name,
        email: user.email,
        status: user.status as "active" | "inactive" | "suspended",
        plan: user.plan,
        revenue: user.revenue,
      })
    } else {
      setFormData({
        name: "",
        email: "",
        status: "active",
        plan: plans[0]?.name || "",
        revenue: 0,
      })
    }
  }, [user, mode, plans, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(formData)
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to submit form:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add New User" : "Edit User"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Fill in the details to create a new user"
              : "Update user information"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as "active" | "inactive" | "suspended",
                  })
                }
              >
                <SelectOption value="active">Active</SelectOption>
                <SelectOption value="inactive">Inactive</SelectOption>
                <SelectOption value="suspended">Suspended</SelectOption>
              </Select>
            </div>

            <div>
              <Label htmlFor="plan">Plan</Label>
              <Select
                id="plan"
                value={formData.plan}
                onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
              >
                {plans.map((plan) => (
                  <SelectOption key={plan.id} value={plan.name}>
                    {plan.name} - ${plan.price}/month
                  </SelectOption>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="revenue">Revenue</Label>
              <Input
                id="revenue"
                type="number"
                value={formData.revenue}
                onChange={(e) =>
                  setFormData({ ...formData, revenue: parseFloat(e.target.value) || 0 })
                }
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : mode === "create" ? "Create User" : "Update User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}