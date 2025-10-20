"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usersApi } from "@/apis/users.api";
import { plansApi } from "@/apis/plans.api";
import type { User, Plan } from "@/lib/mock-data";
import {
  TrendingUp,
  Users,
  DollarSign,
  CreditCard,
  ArrowUp,
  ArrowDown,
  AlertCircle,
} from "lucide-react";

// Helper function to format currency
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Helper function to format percentage
const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export default function AnalyticsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [usersData, plansData] = await Promise.all([
        usersApi.getAll(),
        plansApi.getAll(),
      ]);
      setUsers(usersData || []);
      setPlans(plansData || []);
    } catch (err) {
      console.error("Failed to load analytics data", err);
      setError("Failed to load analytics data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-9 w-48 bg-gray-200 animate-pulse rounded" />
          <div className="h-5 w-64 bg-gray-200 animate-pulse rounded mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="h-24 bg-gray-100 animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-gray-600">{error}</p>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const totalRevenue = plans
    .filter((p) => p.status === "active")
    .reduce((sum, plan) => sum + (plan.revenue || 0), 0);
  const totalSubscribers = plans.reduce(
    (sum, plan) => sum + (plan.subscribers || 0),
    0
  );
  const activeUsers = users.filter((u) => u.status === "active").length;
  const totalUsers = users.length || 1; // Prevent division by zero

  // Calculate growth percentages (mock data)
  const metrics = [
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      change: 12.5,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Active Users",
      value: activeUsers.toLocaleString(),
      change: 8.3,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Subscribers",
      value: totalSubscribers.toLocaleString(),
      change: 15.2,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Active Plans",
      value: plans.filter((p) => p.status === "active").length.toLocaleString(),
      change: 0,
      icon: CreditCard,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const revenueByPlan = plans
    .filter((p) => p.status === "active")
    .sort((a, b) => (b.revenue || 0) - (a.revenue || 0));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">
          Track performance metrics and insights.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {metric.title}
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-2">
                      {metric.value}
                    </h3>
                    <div className="flex items-center mt-2">
                      {metric.change > 0 ? (
                        <ArrowUp className="h-4 w-4 text-green-600" />
                      ) : metric.change < 0 ? (
                        <ArrowDown className="h-4 w-4 text-red-600" />
                      ) : null}
                      <span
                        className={`text-sm ml-1 ${
                          metric.change > 0
                            ? "text-green-600"
                            : metric.change < 0
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        {metric.change > 0 ? "+" : ""}
                        {metric.change}% from last month
                      </span>
                    </div>
                  </div>
                  <div className={`${metric.bgColor} p-3 rounded-full`}>
                    <Icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue by Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {revenueByPlan.length > 0 ? (
              revenueByPlan.map((plan) => {
                const revenue = plan.revenue || 0;
                const percentage = totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0;
                return (
                  <div key={plan._id || plan.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">
                        {plan.name || "Unnamed Plan"}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatCurrency(revenue)} ({formatPercentage(percentage)})
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500 py-4">
                No active plans with revenue data available.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* User Status Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                  <span className="text-gray-700">Active</span>
                </div>
                <span className="font-medium">
                  {users.filter((u) => u.status === "active").length.toLocaleString()} (
                  {formatPercentage((activeUsers / totalUsers) * 100)})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-400 rounded-full mr-2" />
                  <span className="text-gray-700">Inactive</span>
                </div>
                <span className="font-medium">
                  {users.filter((u) => u.status === "inactive").length.toLocaleString()} (
                  {formatPercentage(
                    (users.filter((u) => u.status === "inactive").length /
                      totalUsers) *
                    100
                  )})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                  <span className="text-gray-700">Suspended</span>
                </div>
                <span className="font-medium">
                  {users.filter((u) => u.status === "suspended").length.toLocaleString()} (
                  {formatPercentage(
                    (users.filter((u) => u.status === "suspended").length /
                      totalUsers) *
                    100
                  )})
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Revenue Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {users.length > 0 ? (
                users
                  .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
                  .slice(0, 5)
                  .map((user, index) => (
                    <div
                      key={user._id || user.id}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-500 w-6">
                          #{index + 1}
                        </span>
                        <span className="ml-2 text-gray-900">
                          {user.name || "Unknown User"}
                        </span>
                      </div>
                      <span className="font-medium text-green-600">
                        {formatCurrency(user.revenue || 0)}
                      </span>
                    </div>
                  ))
              ) : (
                <p className="text-center text-gray-500 py-4">
                  No user data available.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
