"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CreditCard,
  Users,
  DollarSign,
  BarChart3,
  UserCog,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Permission {
  id: string;
  label: string;
  description?: string;
}

export interface PermissionCategory {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  permissions: Permission[];
}

export const permissionCategories: PermissionCategory[] = [
  {
    id: "plans",
    title: "Plans Management",
    icon: CreditCard,
    permissions: [
      { id: "view_plans", label: "View Plans", description: "Can view all plans" },
      { id: "create_plans", label: "Create Plans", description: "Can create new plans" },
      { id: "edit_plans", label: "Edit Plans", description: "Can edit existing plans" },
      { id: "delete_plans", label: "Delete Plans", description: "Can delete plans" },
    ],
  },
  {
    id: "users",
    title: "Users Management",
    icon: Users,
    permissions: [
      { id: "view_users", label: "View Users", description: "Can view all users" },
      { id: "create_users", label: "Create Users", description: "Can create new users" },
      { id: "edit_users", label: "Edit Users", description: "Can edit user information" },
      { id: "delete_users", label: "Delete Users", description: "Can delete users" },
    ],
  },
  {
    id: "revenue",
    title: "Transaction Management",
    icon: DollarSign,
    permissions: [
      { id: "view_revenue", label: "View Revenue", description: "Can view revenue data" },
      { id: "manage_revenue", label: "Manage Revenue", description: "Can manage transactions" },
    ],
  },
  {
    id: "analytics",
    title: "Analytics & Reporting",
    icon: BarChart3,
    permissions: [
      { id: "view_dashboard", label: "View Dashboard", description: "Can access dashboard" },
      { id: "view_analytics", label: "View Analytics", description: "Can view analytics reports" },
    ],
  },
  {
    id: "staff",
    title: "Staff Management",
    icon: UserCog,
    permissions: [
      { id: "view_staff", label: "View Staff", description: "Can view staff members" },
      { id: "manage_staff", label: "Manage Staff", description: "Can create/edit/delete staff" },
    ],
  },
];

interface PermissionSelectorProps {
  selectedPermissions: string[];
  onChange: (permissions: string[]) => void;
  disabled?: boolean;
}

export function PermissionSelector({
  selectedPermissions,
  onChange,
  disabled = false,
}: PermissionSelectorProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    permissionCategories.map((cat) => cat.id)
  );

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const togglePermission = (permissionId: string) => {
    if (disabled) return;

    const newPermissions = selectedPermissions.includes(permissionId)
      ? selectedPermissions.filter((id) => id !== permissionId)
      : [...selectedPermissions, permissionId];

    onChange(newPermissions);
  };

  const selectAllInCategory = (category: PermissionCategory) => {
    if (disabled) return;

    const categoryPermissionIds = category.permissions.map((p) => p.id);
    const allSelected = categoryPermissionIds.every((id) =>
      selectedPermissions.includes(id)
    );

    if (allSelected) {
      // Deselect all
      onChange(
        selectedPermissions.filter((id) => !categoryPermissionIds.includes(id))
      );
    } else {
      // Select all
      const newPermissions = [
        ...new Set([...selectedPermissions, ...categoryPermissionIds]),
      ];
      onChange(newPermissions);
    }
  };

  const getCategoryProgress = (category: PermissionCategory) => {
    const total = category.permissions.length;
    const selected = category.permissions.filter((p) =>
      selectedPermissions.includes(p.id)
    ).length;
    return { selected, total };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold text-gray-900">
          Permissions
        </Label>
        <div className="text-sm text-gray-600">
          {selectedPermissions.length} selected
        </div>
      </div>

      <div className="space-y-3">
        {permissionCategories.map((category) => {
          const Icon = category.icon;
          const isExpanded = expandedCategories.includes(category.id);
          const { selected, total } = getCategoryProgress(category);
          const allSelected = selected === total && total > 0;

          return (
            <Card key={category.id} className="border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 rounded-lg bg-blue-50">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-sm font-semibold text-gray-900">
                        {category.title}
                      </CardTitle>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {selected} of {total} selected
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => selectAllInCategory(category)}
                      disabled={disabled}
                      className="text-xs h-7 px-2"
                    >
                      {allSelected ? "Deselect All" : "Select All"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleCategory(category.id)}
                      className="h-8 w-8 p-0"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {category.permissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                      >
                        <Checkbox
                          id={permission.id}
                          checked={selectedPermissions.includes(permission.id)}
                          onCheckedChange={() => togglePermission(permission.id)}
                          disabled={disabled}
                          className="mt-0.5 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <Label
                            htmlFor={permission.id}
                            className={`text-sm font-medium cursor-pointer block ${
                              disabled ? "cursor-not-allowed opacity-50" : ""
                            }`}
                          >
                            {permission.label}
                          </Label>
                          {permission.description && (
                            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                              {permission.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
