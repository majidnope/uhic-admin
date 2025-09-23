"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MetricCard } from "@/components/dashboard/metric-card"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ToastContainer } from "@/components/ui/toast"
import { UserFormDialog } from "@/components/users/user-form-dialog"
import { PlanFormDialog } from "@/components/plans/plan-form-dialog"
import { plansApi } from "@/apis/plans.api"
import { usersApi } from "@/apis/users.api"
import type { Plan, User } from "@/lib/mock-data"
import { Plus, Eye } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [plans, setPlans] = useState<Plan[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const [userFormDialog, setUserFormDialog] = useState(false)
  const [planFormDialog, setPlanFormDialog] = useState(false)
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: "success" | "error" | "info" }>>([])

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = Math.random().toString(36).substring(7)
    setToasts(prev => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [plansData, usersData] = await Promise.all([
        plansApi.getAll(),
        usersApi.getAll()
      ])
      setPlans(plansData)
      setUsers(usersData)
    } catch (err) {
      console.error('Failed to load dashboard data', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (userData: Partial<User>) => {
    try {
      await usersApi.create(userData)
      await fetchData()
      showToast("User created successfully", "success")
    } catch (err) {
      showToast("Failed to create user", "error")
      throw err
    }
  }

  const handleCreatePlan = async (planData: Partial<Plan>) => {
    try {
      await plansApi.create(planData)
      await fetchData()
      showToast("Plan created successfully", "success")
    } catch (err) {
      showToast("Failed to create plan", "error")
      throw err
    }
  }

  const activePlans = plans.filter(plan => plan.status === "active")
  const totalSubscribers = activePlans.reduce((sum, plan) => sum + plan.subscribers, 0)
  const totalRevenue = activePlans.reduce((sum, plan) => sum + plan.revenue, 0)
  const activeUsers = users.filter(u => u.status === "active").length

  const financialMetrics = [
    {
      label: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      change: 12.5,
      changeType: "positive" as const,
      icon: "dollar-sign"
    },
    {
      label: "Active Users",
      value: activeUsers.toString(),
      change: 8.2,
      changeType: "positive" as const,
      icon: "users"
    },
    {
      label: "Total Plans",
      value: plans.length.toString(),
      change: 0,
      changeType: "neutral" as const,
      icon: "credit-card"
    },
    {
      label: "Monthly Growth",
      value: "18.4%",
      change: 3.1,
      changeType: "positive" as const,
      icon: "trending-up"
    }
  ]

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening with your finance platform today.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            View Reports
          </Button>
          <Button onClick={() => setUserFormDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialMetrics.map((metric, index) => (
          <MetricCard
            key={index}
            label={metric.label}
            value={metric.value}
            change={metric.change}
            changeType={metric.changeType}
            icon={metric.icon}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          {/* Plan Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Plan Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activePlans.map((plan) => (
                <div key={plan._id || plan.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{plan.name}</p>
                    <p className="text-sm text-gray-500">${plan.price}/month</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{plan.subscribers}</p>
                    <p className="text-sm text-gray-500">subscribers</p>
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Total Subscribers</span>
                  <span className="font-bold text-blue-600">{totalSubscribers.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setPlanFormDialog(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Plan
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push('/dashboard/users')}
              >
                <Eye className="h-4 w-4 mr-2" />
                View All Users
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Eye className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <UserFormDialog
        open={userFormDialog}
        onOpenChange={setUserFormDialog}
        onSubmit={handleCreateUser}
        user={null}
        plans={plans}
        mode="create"
      />

      <PlanFormDialog
        open={planFormDialog}
        onOpenChange={setPlanFormDialog}
        onSubmit={handleCreatePlan}
        plan={null}
        mode="create"
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}