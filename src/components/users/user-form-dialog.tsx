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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { User, Plan } from "@/lib/mock-data"

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (userData: Partial<User>, sendResetEmail?: boolean) => Promise<void>
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
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    status: "active" | "inactive" | "suspended";
    plan: string[];
    revenue: number;
  }>({
    name: "",
    email: "",
    status: "active",
    plan: [],
    revenue: 0,
  })
  const [sendResetEmail, setSendResetEmail] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user && mode === "edit") {
      // Handle plan as array or single value
      let planIds: string[] = [];
      if (Array.isArray(user.plan)) {
        planIds = user.plan.map(p => typeof p === 'string' ? p : (p?._id || p?.id || "")).filter(Boolean);
      } else if (user.plan) {
        const planId = typeof user.plan === 'string' ? user.plan : (user.plan?._id || user.plan?.id || "");
        if (planId) planIds = [planId];
      }

      setFormData({
        name: user.name,
        email: user.email,
        status: user.status as "active" | "inactive" | "suspended",
        plan: planIds,
        revenue: user.revenue,
      })
      setSendResetEmail(false) // Don't send reset email when editing
    } else {
      setFormData({
        name: "",
        email: "",
        status: "active",
        plan: [],
        revenue: 0,
      })
      setSendResetEmail(true) // Default to true for new users
    }
  }, [user, mode, plans, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(formData, mode === "create" ? sendResetEmail : false)
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
                value={formData.status}
                onValueChange={(value: "active" | "inactive" | "suspended") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Plans (Select multiple)</Label>
              <div className="border rounded-md p-3 space-y-2 max-h-48 overflow-y-auto">
                {plans.length === 0 ? (
                  <p className="text-sm text-gray-500">No plans available</p>
                ) : (
                  plans.map((plan) => {
                    const planId = plan._id || plan.id || '';
                    const isChecked = formData.plan.includes(planId);

                    return (
                      <div key={planId} className="flex items-center space-x-2">
                        <Checkbox
                          id={`plan-${planId}`}
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({ ...formData, plan: [...formData.plan, planId] });
                            } else {
                              setFormData({ ...formData, plan: formData.plan.filter(id => id !== planId) });
                            }
                          }}
                        />
                        <Label
                          htmlFor={`plan-${planId}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {plan.name} - ${plan.price}
                        </Label>
                      </div>
                    );
                  })
                )}
              </div>
              {formData.plan.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {formData.plan.length} plan{formData.plan.length !== 1 ? 's' : ''} selected
                </p>
              )}
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

            {mode === "create" && (
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="sendResetEmail"
                  checked={sendResetEmail}
                  onCheckedChange={(checked) => setSendResetEmail(checked as boolean)}
                />
                <Label
                  htmlFor="sendResetEmail"
                  className="text-sm font-normal cursor-pointer"
                >
                  Send password reset email to user (recommended)
                </Label>
              </div>
            )}
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