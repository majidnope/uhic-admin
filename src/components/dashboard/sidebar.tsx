"use client"

import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Settings,
  BarChart3,
  Menu,
  X,
  Shield,
  LogOut,
  UserCog,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    permission: "view_dashboard"
  },
  {
    name: "Users",
    href: "/dashboard/users",
    icon: Users,
    permission: "view_users"
  },
  {
    name: "Plans",
    href: "/dashboard/plans",
    icon: CreditCard,
    permission: "view_plans"
  },
  {
    name: "Admins",
    href: "/dashboard/admins",
    icon: Shield,
    superAdminOnly: true
  },
  {
    name: "Staff",
    href: "/dashboard/staff",
    icon: UserCog,
    permission: "view_staff"
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    permission: "view_analytics"
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, isAdmin, hasPermission, logout } = useAuth()

  // Filter navigation based on permissions
  const visibleNavigation = navigation.filter(item => {
    // Super admin only items
    if ((item as any).superAdminOnly) {
      return user?.role === 'super_admin'
    }

    // Items with permission requirements
    if (item.permission) {
      return hasPermission(item.permission)
    }

    // Items without restrictions
    return true
  })

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white p-2 rounded-md shadow-md border"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-sm transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl shadow-sm">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                UHIC
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {visibleNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:scale-95"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User profile section */}
          <div className="p-4 border-t border-gray-200 bg-gray-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center min-w-0 flex-1">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-full shadow-sm flex-shrink-0">
                  <span className="text-white font-semibold text-sm">
                    {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="ml-3 min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
                </div>
              </div>
              {isAdmin ? (
                <Badge variant="destructive" className="text-xs flex-shrink-0 ml-2">Admin</Badge>
              ) : (
                <Badge variant="secondary" className="text-xs flex-shrink-0 ml-2">Staff</Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}