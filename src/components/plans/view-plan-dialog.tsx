import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Plan } from "@/lib/mock-data"
import { DollarSign, Users, Check } from "lucide-react"

interface ViewPlanDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  plan: Plan | null
}

export function ViewPlanDialog({ open, onOpenChange, plan }: ViewPlanDialogProps) {
  if (!plan) return null

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge variant="success">Active</Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Plan Details</DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Plan Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-3xl font-bold text-gray-900">{plan.name}</h3>
              <p className="text-gray-600 mt-2">{plan.description}</p>
            </div>
            {getStatusBadge(plan.status)}
          </div>

          {/* Pricing */}
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <div className="flex items-center justify-center gap-2">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <div className="text-5xl font-bold text-blue-600">${plan.price}</div>
            </div>
            <p className="text-gray-600 mt-2">Investment Amount</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">Subscribers</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{plan.subscribers.toLocaleString()}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm font-medium">Total Revenue</span>
              </div>
              <p className="text-2xl font-bold text-green-600">${plan.revenue.toLocaleString()}</p>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Features Included</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
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