"use client";

import { useAuth } from "@/contexts/auth-context";
import { ReactNode } from "react";

interface PermissionGateProps {
  children: ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  superAdminOnly?: boolean;
  fallback?: ReactNode;
}

export function PermissionGate({
  children,
  permission,
  permissions = [],
  requireAll = false,
  superAdminOnly = false,
  fallback = null,
}: PermissionGateProps) {
  const { user, hasPermission } = useAuth();

  // Super admin only check
  if (superAdminOnly) {
    if (user?.role !== 'super_admin') {
      return <>{fallback}</>;
    }
    return <>{children}</>;
  }

  // Single permission check
  if (permission) {
    if (!hasPermission(permission)) {
      return <>{fallback}</>;
    }
    return <>{children}</>;
  }

  // Multiple permissions check
  if (permissions.length > 0) {
    const hasAccess = requireAll
      ? permissions.every((p) => hasPermission(p))
      : permissions.some((p) => hasPermission(p));

    if (!hasAccess) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}
