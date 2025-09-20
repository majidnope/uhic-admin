"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Search, LogOut } from "lucide-react"

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 py-4 pl-16 pr-6 lg:px-6">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users, plans, transactions..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </Button>

          {/* User menu */}
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/api/placeholder/32/32" alt="Admin" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              Admin User
            </span>
            <Button variant="ghost" size="icon">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}