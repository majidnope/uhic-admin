"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { Bell, LogOut, User, Settings, ChevronDown } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export function Header() {
  const { user, logout } = useAuth()
  const router = useRouter()

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return "U"
    const names = user.name.split(" ")
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return user.name.substring(0, 2).toUpperCase()
  }

  // Handle logout
  const handleLogout = () => {
    logout()
  }

  // Handle navigation
  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <header className="bg-white border-b border-gray-200 py-4 pl-16 pr-6 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center justify-end">
        {/* Right section */}
        <div className="flex items-center space-x-4">
          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-gray-900" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-y-auto">
                <div className="p-2 space-y-2">
                  {/* Sample notifications */}
                  <div className="p-3 rounded-md hover:bg-gray-100 cursor-pointer transition-colors">
                    <p className="text-sm font-medium text-gray-900">
                      New user registration
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      John Doe just registered
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      2 minutes ago
                    </p>
                  </div>
                  <div className="p-3 rounded-md hover:bg-gray-100 cursor-pointer transition-colors">
                    <p className="text-sm font-medium text-gray-900">
                      Payment received
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      New payment of $500 received
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      1 hour ago
                    </p>
                  </div>
                  <div className="p-3 rounded-md hover:bg-gray-100 cursor-pointer transition-colors">
                    <p className="text-sm font-medium text-gray-900">
                      Plan activation
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      User activated premium plan
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      3 hours ago
                    </p>
                  </div>
                </div>
              </div>
              <DropdownMenuSeparator />
              <div className="p-2">
                <Button
                  variant="ghost"
                  className="w-full text-sm justify-center"
                  onClick={() => handleNavigation("/dashboard/notifications")}
                >
                  View all notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-3 h-auto py-2 px-3 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || "User"}`}
                    alt={user?.name || "User"}
                  />
                  <AvatarFallback className="bg-blue-600 text-white">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-900 leading-none">
                    {user?.name || "Loading..."}
                  </span>
                  <span className="text-xs text-gray-600 leading-none mt-1">
                    {user?.role || ""}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-900 hidden sm:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-600 font-normal">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => handleNavigation("/dashboard/profile")}
                  className="cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleNavigation("/dashboard/settings")}
                  className="cursor-pointer"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
