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
import { analyticsApi, type DashboardData } from "@/apis/analytics.api"
import type { Plan, User } from "@/lib/mock-data"
import { Plus, Eye, TrendingUp, AlertCircle, ArrowUpRight, ArrowDownRight, Coins, UserPlus } from "lucide-react"
import { PermissionGate } from "@/components/permission-gate"

export default function DashboardPage() {
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      setError(null)
      const [dashboard, plansData] = await Promise.all([
        analyticsApi.getDashboard(),
        plansApi.getAll()
      ])
      setDashboardData(dashboard)
      setPlans(plansData)
    } catch (err) {
      console.error('Failed to load dashboard data', err)
      setError('Failed to load dashboard data. Please try again.')
      showToast("Failed to load dashboard data", "error")
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

  // Calculate metrics from real data
  const totalRevenue = dashboardData?.overview.totalRevenue || 0
  const activeUsers = dashboardData?.overview.usersByStatus.active || 0
  const totalUsers = dashboardData?.overview.totalUsers || 0
  const totalPlans = dashboardData?.overview.totalPlans || 0
  const pendingPlansCount = dashboardData?.overview.pendingPlansCount || 0
  
  // Calculate growth rate (if no data, show 0)
  const inactiveUsers = dashboardData?.overview.usersByStatus.inactive || 0
  const suspendedUsers = dashboardData?.overview.usersByStatus.suspended || 0
  const activeUserPercentage = totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(1) : "0"

  const financialMetrics = [
    {
      label: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      change: 0,
      changeType: "neutral" as const,
      icon: "dollar-sign"
    },
    {
      label: "Active Users",
      value: activeUsers.toString(),
      change: 0,
      changeType: "neutral" as const,
      icon: "users"
    },
    {
      label: "New Users (7d)",
      value: (dashboardData?.overview.usersLast7Days || 0).toString(),
      change: 0,
      changeType: "neutral" as const,
      icon: "user-plus"
    },
    {
      label: "Total Coins",
      value: (dashboardData?.overview.totalCoinsInCirculation || 0).toLocaleString(),
      change: 0,
      changeType: "neutral" as const,
      icon: "coins"
    }
  ]

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-gray-200 rounded-xl" />
          <div className="h-96 bg-gray-200 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2 text-sm">
            Welcome back! Here's what's happening with your finance platform today.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <PermissionGate permission="view_analytics">
            <Button variant="outline" className="shadow-sm hover:shadow transition-shadow">
              <Eye className="h-4 w-4 mr-2" />
              View Reports
            </Button>
          </PermissionGate>
          <PermissionGate permission="create_users">
            <Button onClick={() => setUserFormDialog(true)} className="shadow-sm hover:shadow-md transition-shadow">
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </PermissionGate>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column - Stats and Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Status Overview */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">User Status Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
                  <p className="text-sm text-gray-600 mt-1">Active</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-600">{inactiveUsers}</p>
                  <p className="text-sm text-gray-600 mt-1">Inactive</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{suspendedUsers}</p>
                  <p className="text-sm text-gray-600 mt-1">Suspended</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Plans */}
          {pendingPlansCount > 0 && (
            <Card className="shadow-sm hover:shadow-md transition-shadow border-yellow-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    Pending Plans ({pendingPlansCount})
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push('/dashboard/plans')}
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData?.pendingPlans.slice(0, 3).map((plan) => (
                    <div key={plan.id} className="flex justify-between items-start p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{plan.name}</p>
                        <p className="text-sm text-gray-600">${plan.price}/{plan.createdBy?.name || 'Unknown'}</p>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => router.push(`/dashboard/plans?id=${plan.id}`)}
                      >
                        Review
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Referrals */}
          {dashboardData?.recentReferrals && dashboardData.recentReferrals.length > 0 && (
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Recent Referrals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.recentReferrals.slice(0, 5).map((referral) => (
                    <div key={referral.userId} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{referral.userName}</p>
                        <p className="text-sm text-gray-600">
                          Referred by {referral.referredBy?.name || 'Unknown'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">+{referral.pointsAwarded} pts</p>
                        <p className="text-xs text-gray-500">
                          {new Date(referral.joinDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Transactions */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Coins className="h-5 w-5 text-blue-500" />
                  Recent Transactions
                </CardTitle>
                {dashboardData?.recentTransactions && dashboardData.recentTransactions.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push('/dashboard/analytics')}
                  >
                    View All
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {dashboardData?.recentTransactions && dashboardData.recentTransactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">User</th>
                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Type</th>
                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Description</th>
                        <th className="text-right py-3 px-2 text-sm font-semibold text-gray-600">Amount</th>
                        <th className="text-right py-3 px-2 text-sm font-semibold text-gray-600">Balance</th>
                        <th className="text-right py-3 px-2 text-sm font-semibold text-gray-600">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.recentTransactions.slice(0, 5).map((transaction) => (
                        <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-2">
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{transaction.user?.name || 'Unknown'}</p>
                              <p className="text-xs text-gray-500">{transaction.user?.email || ''}</p>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              transaction.type === 'earned' 
                                ? 'bg-green-100 text-green-700' 
                                : transaction.type === 'spent'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {transaction.type === 'earned' ? (
                                <ArrowUpRight className="h-3 w-3" />
                              ) : (
                                <ArrowDownRight className="h-3 w-3" />
                              )}
                              {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-sm text-gray-700">
                            {transaction.description}
                          </td>
                          <td className={`py-3 px-2 text-right font-semibold text-sm ${
                            transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'earned' ? '+' : '-'}{Math.abs(transaction.amount)}
                          </td>
                          <td className="py-3 px-2 text-right font-medium text-sm text-gray-900">
                            {transaction.balanceAfter}
                          </td>
                          <td className="py-3 px-2 text-right text-xs text-gray-500">
                            {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 px-4">
                  <div className="rounded-full bg-gray-100 p-4 mb-3">
                    <Coins className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">No Transactions Yet</h3>
                  <p className="text-xs text-gray-500 text-center max-w-xs">
                    Transaction activity will appear here once users start earning, spending, or redeeming coins.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Actions and Top Staff */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <PermissionGate permission="create_plans">
                <Button
                  variant="outline"
                  className="w-full justify-start hover:bg-gray-50 transition-colors"
                  onClick={() => setPlanFormDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Plan
                </Button>
              </PermissionGate>
              <PermissionGate permission="view_users">
                <Button
                  variant="outline"
                  className="w-full justify-start hover:bg-gray-50 transition-colors"
                  onClick={() => router.push('/dashboard/users')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View All Users
                </Button>
              </PermissionGate>
              <PermissionGate permission="view_analytics">
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover:bg-gray-50 transition-colors"
                  onClick={() => router.push('/dashboard/analytics')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </PermissionGate>
            </CardContent>
          </Card>

          {/* Top Staff Performance */}
          {dashboardData?.topStaff && dashboardData.topStaff.length > 0 && (
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Top Staff
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.topStaff.map((staff) => (
                    <div key={staff.email} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-transparent rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold text-sm">
                          {staff.rank}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{staff.name}</p>
                          <p className="text-xs text-gray-500">{staff.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">{staff.totalPoints}</p>
                        <p className="text-xs text-gray-500">points</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* System Status */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Users</span>
                <span className="font-semibold text-gray-900">{totalUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Plans</span>
                <span className="font-semibold text-gray-900">{totalPlans}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending Plans</span>
                <span className="font-semibold text-yellow-600">{pendingPlansCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Coupons</span>
                <span className="font-semibold text-blue-600">{dashboardData?.overview.activeCouponsCount || 0}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="text-sm text-gray-600">Total Revenue</span>
                <span className="font-bold text-green-600">${totalRevenue.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Users */}
          {dashboardData?.recentUsers && dashboardData.recentUsers.length > 0 && (
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Recent Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.recentUsers.map((user) => (
                    <div key={user.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-700' 
                              : user.status === 'suspended'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {user.status}
                          </span>
                          {user.plan && (
                            <span className="text-xs text-gray-600">{user.plan.name}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right ml-2">
                        <p className="text-xs text-gray-500">
                          {new Date(user.joinDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Plan Distribution */}
          {dashboardData?.planDistribution && dashboardData.planDistribution.length > 0 && (
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Plan Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.planDistribution.map((plan, index) => {
                    const totalUsers = dashboardData.planDistribution.reduce((sum, p) => sum + p.users, 0);
                    const percentage = totalUsers > 0 ? ((plan.users / totalUsers) * 100).toFixed(1) : 0;
                    
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-900">{plan.name}</span>
                          <span className="text-sm text-gray-600">{plan.users} users ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>Revenue: ${plan.revenue.toLocaleString()}</span>
                          <span>Avg: ${plan.users > 0 ? (plan.revenue / plan.users).toFixed(0) : 0}/user</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
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