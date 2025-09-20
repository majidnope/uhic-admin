import { MetricCard } from "@/components/dashboard/metric-card"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { mockFinancialMetrics, mockPlans } from "@/lib/mock-data"
import { Plus, Eye } from "lucide-react"

export default function DashboardPage() {
  const activePlans = mockPlans.filter(plan => plan.status === "active")
  const totalSubscribers = activePlans.reduce((sum, plan) => sum + plan.subscribers, 0)

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
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockFinancialMetrics.map((metric, index) => (
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
                <div key={plan.id} className="flex justify-between items-center">
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
              <Button variant="outline" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Create New Plan
              </Button>
              <Button variant="outline" className="w-full justify-start">
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
    </div>
  )
}