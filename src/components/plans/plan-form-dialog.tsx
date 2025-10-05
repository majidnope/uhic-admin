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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Plan } from "@/lib/mock-data"
import { X } from "lucide-react"

interface PlanFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (planData: Partial<Plan>) => Promise<void>
  plan?: Plan | null
  mode: "create" | "edit"
}

export function PlanFormDialog({
  open,
  onOpenChange,
  onSubmit,
  plan,
  mode,
}: PlanFormDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    billing: "monthly" as "monthly" | "yearly",
    features: [] as string[],
    status: "active" as "active" | "inactive",
    description: "",
    subscribers: 0,
    revenue: 0,
  })
  const [featureInput, setFeatureInput] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (plan && mode === "edit") {
      setFormData({
        name: plan.name,
        price: plan.price,
        billing: plan.billing as "monthly" | "yearly",
        features: plan.features,
        status: plan.status as "active" | "inactive",
        description: plan.description,
        subscribers: plan.subscribers,
        revenue: plan.revenue,
      })
    } else {
      setFormData({
        name: "",
        price: 0,
        billing: "monthly",
        features: [],
        status: "active",
        description: "",
        subscribers: 0,
        revenue: 0,
      })
    }
  }, [plan, mode, open])

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData({ ...formData, features: [...formData.features, featureInput.trim()] })
      setFeatureInput("")
    }
  }

  const handleRemoveFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    })
  }

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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create New Plan" : "Edit Plan"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Fill in the details to create a new subscription plan"
              : "Update plan information"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Plan Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="billing">Billing Cycle</Label>
                <Select
                  value={formData.billing}
                  onValueChange={(value: "monthly" | "yearly") =>
                    setFormData({ ...formData, billing: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select billing cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "active" | "inactive") =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="features">Features</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  id="features"
                  placeholder="Add a feature..."
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddFeature())}
                />
                <Button type="button" onClick={handleAddFeature} variant="outline">
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                  >
                    <span className="text-sm">{feature}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFeature(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="subscribers">Subscribers</Label>
                <Input
                  id="subscribers"
                  type="number"
                  value={formData.subscribers}
                  onChange={(e) =>
                    setFormData({ ...formData, subscribers: parseInt(e.target.value) || 0 })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="revenue">Revenue ($)</Label>
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
              {loading ? "Saving..." : mode === "create" ? "Create Plan" : "Update Plan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}