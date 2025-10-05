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
} from "lucide-react";

export default function AnalyticsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersData, plansData] = await Promise.all([
        usersApi.getAll(),
        plansApi.getAll(),
      ]);
      setUsers(usersData);
      setPlans(plansData);
    } catch (err) {
      console.error("Failed to load analytics data", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  const totalRevenue = plans
    .filter((p) => p.status === "active")
    .reduce((sum, plan) => sum + plan.revenue, 0);
  const totalSubscribers = plans.reduce(
    (sum, plan) => sum + plan.subscribers,
    0
  );
  const activeUsers = users.filter((u) => u.status === "active").length;
  const totalUsers = users.length;

  // Calculate growth percentages (mock data)
  const metrics = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      change: 12.5,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Active Users",
      value: activeUsers.toString(),
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
      value: plans.filter((p) => p.status === "active").length.toString(),
      change: 0,
      icon: CreditCard,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const revenueByPlan = plans
    .filter((p) => p.status === "active")
    .sort((a, b) => b.revenue - a.revenue);

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
            {revenueByPlan.map((plan) => {
              const percentage = (plan.revenue / totalRevenue) * 100;
              return (
                <div key={plan._id || plan.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">
                      {plan.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      ${plan.revenue.toLocaleString()} ({percentage.toFixed(1)}
                      %)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
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
                  {users.filter((u) => u.status === "active").length} (
                  {((activeUsers / totalUsers) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-400 rounded-full mr-2" />
                  <span className="text-gray-700">Inactive</span>
                </div>
                <span className="font-medium">
                  {users.filter((u) => u.status === "inactive").length} (
                  {(
                    (users.filter((u) => u.status === "inactive").length /
                      totalUsers) *
                    100
                  ).toFixed(1)}
                  %)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                  <span className="text-gray-700">Suspended</span>
                </div>
                <span className="font-medium">
                  {users.filter((u) => u.status === "suspended").length} (
                  {(
                    (users.filter((u) => u.status === "suspended").length /
                      totalUsers) *
                    100
                  ).toFixed(1)}
                  %)
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
              {users
                .sort((a, b) => b.revenue - a.revenue)
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
                      <span className="ml-2 text-gray-900">{user.name}</span>
                    </div>
                    <span className="font-medium text-green-600">
                      ${user.revenue}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
