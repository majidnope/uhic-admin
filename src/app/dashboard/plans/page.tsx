"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockPlans } from "@/lib/mock-data"
import {
  Plus,
  Edit,
  MoreHorizontal,
  Users,
  DollarSign,
  Check,
  X
} from "lucide-react"

export default function PlansPage() {
  const [selectedTab, setSelectedTab] = useState<"all" | "active" | "inactive">("all")

  const filteredPlans = mockPlans.filter(plan => {
    if (selectedTab === "all") return true
    return plan.status === selectedTab
  })

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge variant="success">Active</Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    )
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
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Plan
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <Button
          variant={selectedTab === "all" ? "default" : "ghost"}
          size="sm"
          onClick={() => setSelectedTab("all")}
          className="rounded-md"
        >
          All Plans ({mockPlans.length})
        </Button>
        <Button
          variant={selectedTab === "active" ? "default" : "ghost"}
          size="sm"
          onClick={() => setSelectedTab("active")}
          className="rounded-md"
        >
          Active ({mockPlans.filter(p => p.status === "active").length})
        </Button>
        <Button
          variant={selectedTab === "inactive" ? "default" : "ghost"}
          size="sm"
          onClick={() => setSelectedTab("inactive")}
          className="rounded-md"
        >
          Inactive ({mockPlans.filter(p => p.status === "inactive").length})
        </Button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <Card key={plan.id} className="relative">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    {getStatusBadge(plan.status)}
                    <Badge variant="outline" className="capitalize">
                      {plan.billing}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Price */}
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-gray-900">
                  ${plan.price}
                </div>
                <div className="text-sm text-gray-500">per month</div>
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
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium">{plan.subscribers}</span>
                  <span className="text-sm text-gray-500">subscribers</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium">${plan.revenue.toLocaleString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
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
            <div className="text-2xl font-bold text-gray-900">{mockPlans.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockPlans.filter(p => p.status === "active").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {mockPlans.reduce((sum, plan) => sum + plan.subscribers, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${mockPlans
                .filter(p => p.status === "active")
                .reduce((sum, plan) => sum + plan.revenue, 0)
                .toLocaleString()}
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
                  {mockPlans.filter(p => p.status === "active").map(plan => (
                    <th key={plan.id} className="text-center py-3 px-4 font-medium text-gray-900">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">Price</td>
                  {mockPlans.filter(p => p.status === "active").map(plan => (
                    <td key={plan.id} className="text-center py-3 px-4">
                      ${plan.price}/month
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">Subscribers</td>
                  {mockPlans.filter(p => p.status === "active").map(plan => (
                    <td key={plan.id} className="text-center py-3 px-4">
                      {plan.subscribers.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">Monthly Revenue</td>
                  {mockPlans.filter(p => p.status === "active").map(plan => (
                    <td key={plan.id} className="text-center py-3 px-4 text-green-600 font-medium">
                      ${plan.revenue.toLocaleString()}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}