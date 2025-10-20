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
    expectedReturn: "",
    duration: "",
    riskLevel: "Medium" as "Low" | "Medium" | "High",
    color: "",
    features: [] as string[],
    status: "active" as "active" | "inactive",
    description: "",
  })
  const [featureInput, setFeatureInput] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (plan && mode === "edit") {
      setFormData({
        name: plan.name,
        price: plan.price,
        expectedReturn: (plan as any).expectedReturn || "",
        duration: (plan as any).duration || "",
        riskLevel: ((plan as any).riskLevel || "Medium") as "Low" | "Medium" | "High",
        color: (plan as any).color || "",
        features: plan.features,
        status: plan.status as "active" | "inactive",
        description: plan.description,
      })
    } else {
      setFormData({
        name: "",
        price: 0,
        expectedReturn: "",
        duration: "",
        riskLevel: "Medium",
        color: "",
        features: [],
        status: "active",
        description: "",
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
      // Remove any fields that shouldn't be sent to the backend
      const { ...submitData } = formData
      await onSubmit(submitData)
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

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expectedReturn">Expected Return</Label>
                <Input
                  id="expectedReturn"
                  placeholder="e.g., 5-8%"
                  value={formData.expectedReturn}
                  onChange={(e) => setFormData({ ...formData, expectedReturn: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  placeholder="e.g., 12 months"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="riskLevel">Risk Level</Label>
                <Select
                  value={formData.riskLevel}
                  onValueChange={(value: "Low" | "Medium" | "High") =>
                    setFormData({ ...formData, riskLevel: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  placeholder="e.g., blue, green, purple"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  required
                />
              </div>
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