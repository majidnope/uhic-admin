"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ToastContainer } from "@/components/ui/toast"
import { PlanFormDialog } from "@/components/plans/plan-form-dialog"
import { DeletePlanDialog } from "@/components/plans/delete-plan-dialog"
import { ViewPlanDialog } from "@/components/plans/view-plan-dialog"
import { plansApi } from "@/apis/plans.api"
import type { Plan } from "@/lib/mock-data"
import {
  Plus,
  Edit,
  MoreHorizontal,
  Users,
  DollarSign,
  Check,
  X,
  Trash2,
  Eye
} from "lucide-react"

export default function PlansPage() {
  const [selectedTab, setSelectedTab] = useState<"admin" | "user-created" | "rejected">("admin")
  const [plans, setPlans] = useState<Plan[]>([])
  const [pendingPlans, setPendingPlans] = useState<Plan[]>([])
  const [rejectedPlans, setRejectedPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [formDialog, setFormDialog] = useState({ open: false, mode: "create" as "create" | "edit", plan: null as Plan | null })
  const [deleteDialog, setDeleteDialog] = useState({ open: false, plan: null as Plan | null })
  const [viewDialog, setViewDialog] = useState({ open: false, plan: null as Plan | null })
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: "success" | "error" | "info" }>>([])

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = Math.random().toString(36).substring(7)
    setToasts(prev => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  useEffect(() => {
    fetchPlans()
    fetchPendingPlans()
    fetchRejectedPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      setLoading(true)
      const data = await plansApi.getAll()
      setPlans(data)
      setError(null)
    } catch (err) {
      setError('Failed to load plans')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchPendingPlans = async () => {
    try {
      const data = await plansApi.getPending()
      setPendingPlans(data)
    } catch (err) {
      console.error('Failed to load pending plans:', err)
    }
  }

  const fetchRejectedPlans = async () => {
    try {
      const allPlans = await plansApi.getAll()
      const rejected = allPlans.filter(p => (p as any).approvalStatus === 'rejected')
      setRejectedPlans(rejected)
    } catch (err) {
      console.error('Failed to load rejected plans:', err)
    }
  }

  const handleCreatePlan = async (planData: Partial<Plan>) => {
    try {
      await plansApi.create(planData)
      await fetchPlans()
      showToast("Plan created successfully", "success")
    } catch (err) {
      showToast("Failed to create plan", "error")
      throw err
    }
  }

  const handleUpdatePlan = async (planData: Partial<Plan>) => {
    const planId = formDialog.plan?._id || formDialog.plan?.id
    if (!planId) return
    try {
      await plansApi.update(planId, planData)
      await fetchPlans()
      showToast("Plan updated successfully", "success")
    } catch (err) {
      showToast("Failed to update plan", "error")
      throw err
    }
  }

  const handleDeletePlan = async () => {
    const planId = deleteDialog.plan?._id || deleteDialog.plan?.id
    if (!planId) return
    try {
      await plansApi.delete(planId)
      await fetchPlans()
      showToast("Plan deleted successfully", "success")
    } catch (err) {
      showToast("Failed to delete plan", "error")
      throw err
    }
  }

  const handleApprovePlan = async (planId: string) => {
    try {
      await plansApi.approve(planId)
      await fetchPlans()
      await fetchPendingPlans()
      await fetchRejectedPlans()
      showToast("Plan approved successfully", "success")
    } catch (err) {
      showToast("Failed to approve plan", "error")
    }
  }

  const handleRejectPlan = async (planId: string, reason: string) => {
    try {
      await plansApi.reject(planId, reason)
      await fetchPlans()
      await fetchPendingPlans()
      await fetchRejectedPlans()
      showToast("Plan rejected successfully", "success")
    } catch (err) {
      showToast("Failed to reject plan", "error")
    }
  }

  const adminPlans = plans.filter(plan => (plan as any).createdByType === 'admin')
  const displayedPlans = selectedTab === "admin" ? adminPlans : selectedTab === "rejected" ? rejectedPlans : pendingPlans

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge variant="success">Active</Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    )
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-600">{error}</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subscription Plans</h1>
          <p className="text-gray-600 mt-1">
            Manage your subscription plans and pricing tiers.
          </p>
        </div>
        <Button onClick={() => setFormDialog({ open: true, mode: "create", plan: null })}>
          <Plus className="h-4 w-4 mr-2" />
          Create Plan
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <Button
          variant={selectedTab === "admin" ? "default" : "ghost"}
          size="sm"
          onClick={() => setSelectedTab("admin")}
          className="rounded-md"
        >
          Admin Plans ({adminPlans.length})
        </Button>
        <Button
          variant={selectedTab === "user-created" ? "default" : "ghost"}
          size="sm"
          onClick={() => setSelectedTab("user-created")}
          className="rounded-md"
        >
          Pending Plans ({pendingPlans.length})
        </Button>
        <Button
          variant={selectedTab === "rejected" ? "default" : "ghost"}
          size="sm"
          onClick={() => setSelectedTab("rejected")}
          className="rounded-md"
        >
          Rejected Plans ({rejectedPlans.length})
        </Button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedPlans.map((plan) => (
          <Card key={plan._id || plan.id} className="relative">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    {getStatusBadge(plan.status)}
                    <Badge variant="outline" className="capitalize">
                      {(plan as any).riskLevel || 'N/A'}
                    </Badge>
                  </div>
                  {/* User Info for User-Created Plans */}
                  {(selectedTab === "user-created" || selectedTab === "rejected") && (plan as any).createdBy && (
                    <div className="mt-3 p-2 bg-blue-50 rounded-md">
                      <p className="text-xs text-gray-500">Created by:</p>
                      <p className="text-sm font-medium text-gray-900">
                        {(plan as any).createdBy?.name || 'Unknown User'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(plan as any).createdBy?.email || 'No email'}
                      </p>
                    </div>
                  )}
                  {/* Rejection Reason for Rejected Plans */}
                  {selectedTab === "rejected" && (plan as any).rejectionReason && (
                    <div className="mt-3 p-2 bg-red-50 rounded-md border border-red-200">
                      <p className="text-xs text-red-600 font-medium">Rejection Reason:</p>
                      <p className="text-sm text-red-700 mt-1">
                        {(plan as any).rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteDialog({ open: true, plan })}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Price */}
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-gray-900">
                  ${plan.price}
                </div>
                <div className="text-sm text-gray-500">Investment Amount</div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600">{plan.description}</p>

              {/* Features */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900">Features:</p>
                <ul className="space-y-1">
                  {plan.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                  {plan.features.length > 4 && (
                    <li className="text-sm text-gray-500">
                      +{plan.features.length - 4} more features
                    </li>
                  )}
                </ul>
              </div>

              {/* Stats */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-medium">{(plan as any).expectedReturn || 'N/A'}</span>
                  <span className="text-sm text-gray-500">expected return</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-medium">{(plan as any).duration || 'N/A'}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                {selectedTab === "admin" ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setFormDialog({ open: true, mode: "edit", plan })}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setViewDialog({ open: true, plan })}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </>
                ) : selectedTab === "rejected" ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setViewDialog({ open: true, plan })}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => setDeleteDialog({ open: true, plan })}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-green-600 border-green-600 hover:bg-green-50"
                      onClick={() => handleApprovePlan((plan._id || plan.id) as string)}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => {
                        const reason = prompt("Enter rejection reason:");
                        if (reason) handleRejectPlan((plan._id || plan.id) as string, reason);
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{plans.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {plans.filter(p => p.status === "active").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Expected Return</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {plans.length > 0 ? (plans[0] as any).expectedReturn || 'N/A' : 'N/A'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Risk Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600">
              Low: {plans.filter(p => (p as any).riskLevel === "Low").length} |
              Med: {plans.filter(p => (p as any).riskLevel === "Medium").length} |
              High: {plans.filter(p => (p as any).riskLevel === "High").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Feature</th>
                  {plans.filter(p => p.status === "active").map(plan => (
                    <th key={plan._id || plan.id} className="text-center py-3 px-4 font-medium text-gray-900">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">Price</td>
                  {plans.filter(p => p.status === "active").map(plan => (
                    <td key={plan._id || plan.id} className="text-center py-3 px-4">
                      ${plan.price}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">Expected Return</td>
                  {plans.filter(p => p.status === "active").map(plan => (
                    <td key={plan._id || plan.id} className="text-center py-3 px-4">
                      {(plan as any).expectedReturn || 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">Duration</td>
                  {plans.filter(p => p.status === "active").map(plan => (
                    <td key={plan._id || plan.id} className="text-center py-3 px-4">
                      {(plan as any).duration || 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">Risk Level</td>
                  {plans.filter(p => p.status === "active").map(plan => (
                    <td key={plan._id || plan.id} className="text-center py-3 px-4 font-medium">
                      {(plan as any).riskLevel || 'N/A'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <PlanFormDialog
        open={formDialog.open}
        onOpenChange={(open) => setFormDialog({ ...formDialog, open })}
        onSubmit={formDialog.mode === "create" ? handleCreatePlan : handleUpdatePlan}
        plan={formDialog.plan}
        mode={formDialog.mode}
      />

      <DeletePlanDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        onConfirm={handleDeletePlan}
        plan={deleteDialog.plan}
      />

      <ViewPlanDialog
        open={viewDialog.open}
        onOpenChange={(open) => setViewDialog({ ...viewDialog, open })}
        plan={viewDialog.plan}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}