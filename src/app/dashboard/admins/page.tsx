"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToastContainer } from "@/components/ui/toast";
import { adminsApi, type Admin } from "@/apis/admins.api";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Mail,
  Lock,
  User,
  EyeOff,
} from "lucide-react";
import { PermissionSelector } from "@/components/permission-selector";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formDialog, setFormDialog] = useState({
    open: false,
    mode: "create" as "create" | "edit",
    admin: null as Admin | null,
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    admin: null as Admin | null,
  });
  const [viewDialog, setViewDialog] = useState({
    open: false,
    admin: null as Admin | null,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin" as "super_admin" | "admin" | "moderator",
    permissions: [] as string[],
  });

  const [showPassword, setShowPassword] = useState(false);

  const [toasts, setToasts] = useState<
    Array<{ id: string; message: string; type: "success" | "error" | "info" }>
  >([]);

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const adminsData = await adminsApi.getAll();
      setAdmins(adminsData);
      setError(null);
    } catch (err) {
      setError("Failed to load admins");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "admin",
      permissions: [],
    });
  };

  const handleOpenCreateDialog = () => {
    resetForm();
    setFormDialog({ open: true, mode: "create", admin: null });
  };

  const handleOpenEditDialog = (admin: Admin) => {
    setFormData({
      name: admin.name,
      email: admin.email,
      password: "",
      role: admin.role as "super_admin" | "admin" | "moderator",
      permissions: (admin as any).permissions || [],
    });
    setFormDialog({ open: true, mode: "edit", admin });
  };

  const handleSubmit = async () => {
    try {
      if (formDialog.mode === "create") {
        // Backend now accepts permissions field
        const createData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          permissions: formData.permissions,
        };
        await adminsApi.create(createData);
        showToast("Admin created successfully", "success");
      } else {
        const adminId = formDialog.admin?._id;
        if (!adminId) return;
        const updateData: any = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          permissions: formData.permissions,
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        await adminsApi.update(adminId, updateData);
        showToast("Admin updated successfully", "success");
      }
      await fetchData();
      setFormDialog({ ...formDialog, open: false });
    } catch (err) {
      showToast(
        `Failed to ${formDialog.mode === "create" ? "create" : "update"} admin`,
        "error"
      );
    }
  };

  const handleDelete = async () => {
    const adminId = deleteDialog.admin?._id;
    if (!adminId) return;
    try {
      await adminsApi.delete(adminId);
      await fetchData();
      showToast("Admin deleted successfully", "success");
      setDeleteDialog({ open: false, admin: null });
    } catch (err) {
      showToast("Failed to delete admin", "error");
    }
  };

  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch =
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || admin.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "super_admin":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <ShieldAlert className="h-3 w-3" />
            Super Admin
          </Badge>
        );
      case "admin":
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            Admin
          </Badge>
        );
      case "moderator":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Moderator
          </Badge>
        );
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Administrators</h1>
          <p className="text-gray-600 mt-1">
            Manage admin users and their permissions.
          </p>
        </div>
        <Button onClick={handleOpenCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Admin
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search admins by name or email..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Role Filter */}
            <div className="flex gap-2">
              <Button
                variant={roleFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setRoleFilter("all")}
              >
                All
              </Button>
              <Button
                variant={roleFilter === "super_admin" ? "default" : "outline"}
                size="sm"
                onClick={() => setRoleFilter("super_admin")}
              >
                Super Admin
              </Button>
              <Button
                variant={roleFilter === "admin" ? "default" : "outline"}
                size="sm"
                onClick={() => setRoleFilter("admin")}
              >
                Admin
              </Button>
              <Button
                variant={roleFilter === "moderator" ? "default" : "outline"}
                size="sm"
                onClick={() => setRoleFilter("moderator")}
              >
                Moderator
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admins Table */}
      <Card>
        <CardHeader>
          <CardTitle>Administrators ({filteredAdmins.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Admin</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdmins.map((admin) => (
                <TableRow key={admin._id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {admin.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">
                          {admin.name}
                        </p>
                        <p className="text-sm text-gray-500">{admin.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(admin.role)}</TableCell>
                  <TableCell className="text-gray-600">
                    {admin.createdAt
                      ? new Date(admin.createdAt).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setViewDialog({ open: true, admin })
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEditDialog(admin)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setDeleteDialog({ open: true, admin })
                        }
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Admins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {admins.length}
            </div>
            <p className="text-sm text-gray-500 mt-1">All administrators</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Super Admins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {admins.filter((a) => a.role === "super_admin").length}
            </div>
            <p className="text-sm text-gray-500 mt-1">Full access</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Moderators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {admins.filter((a) => a.role === "moderator").length}
            </div>
            <p className="text-sm text-gray-500 mt-1">Limited access</p>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={formDialog.open} onOpenChange={(open) => setFormDialog({ ...formDialog, open })}>
        <DialogContent className="max-w-[600px] max-h-[85vh] p-0 gap-0">
          <div className="overflow-y-auto max-h-[85vh]">
            <DialogHeader className="px-6 pt-6 pb-4 sticky top-0 bg-white z-10 border-b">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {formDialog.mode === "create" ? "Create New Admin" : "Edit Administrator"}
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-base">
                {formDialog.mode === "create"
                  ? "Add a new administrator to the system with specific role and permissions."
                  : "Update administrator information and permissions."}
              </DialogDescription>
            </DialogHeader>

            <div className="px-6 py-6 space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-gray-900">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="John Doe"
                    className="pl-11 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-900">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="admin@example.com"
                    className="pl-11 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-900">
                  Password
                  {formDialog.mode === "create" && <span className="text-red-500">*</span>}
                  {formDialog.mode === "edit" && (
                    <span className="text-xs text-gray-500 font-normal ml-2">
                      (leave blank to keep current)
                    </span>
                  )}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder={formDialog.mode === "edit" ? "••••••••" : "Minimum 8 characters"}
                    className="pl-11 pr-12 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required={formDialog.mode === "create"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {formDialog.mode === "create" && (
                  <p className="text-xs text-gray-500">
                    Must be at least 8 characters long
                  </p>
                )}
              </div>

              {/* Role Field */}
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-semibold text-gray-900 block">
                  Role & Permissions <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: "super_admin" | "admin" | "moderator") =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full [&>span]:line-clamp-1">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="h-4 w-4 text-red-600" />
                        <span>Super Admin</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-blue-600" />
                        <span>Admin</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="moderator">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-gray-600" />
                        <span>Moderator</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Permissions Selector - Only for non-super_admin */}
              {formData.role !== "super_admin" && (
                <div className="space-y-2 pt-4 border-t">
                  <PermissionSelector
                    selectedPermissions={formData.permissions}
                    onChange={(permissions) =>
                      setFormData({ ...formData, permissions })
                    }
                  />
                </div>
              )}

              {/* Super Admin Note */}
              {formData.role === "super_admin" && (
                <div className="pt-4 border-t">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <ShieldAlert className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-blue-900">
                          Super Admin Access
                        </p>
                        <p className="text-xs text-blue-700 mt-1">
                          Super Admins automatically have all permissions and full system access.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="px-6 py-4 border-t bg-gray-50 sticky bottom-0">
              <div className="flex gap-3 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFormDialog({ ...formDialog, open: false });
                    setShowPassword(false);
                  }}
                  className="h-12 flex-1 sm:flex-initial text-base font-medium"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="h-12 flex-1 sm:flex-initial bg-blue-600 hover:bg-blue-700 text-base font-medium"
                >
                  {formDialog.mode === "create" ? (
                    <>
                      <Plus className="h-5 w-5 mr-2" />
                      Create Admin
                    </>
                  ) : (
                    <>
                      <Edit className="h-5 w-5 mr-2" />
                      Update Admin
                    </>
                  )}
                </Button>
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Admin</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deleteDialog.admin?.name}? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, admin: null })}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialog.open} onOpenChange={(open) => setViewDialog({ ...viewDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Admin Details</DialogTitle>
          </DialogHeader>
          {viewDialog.admin && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback>
                    {viewDialog.admin.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">
                    {viewDialog.admin.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {viewDialog.admin.email}
                  </p>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Role</Label>
                <div>{getRoleBadge(viewDialog.admin.role)}</div>
              </div>
              <div className="grid gap-2">
                <Label>Created At</Label>
                <p className="text-sm">
                  {viewDialog.admin.createdAt
                    ? new Date(viewDialog.admin.createdAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>
              <div className="grid gap-2">
                <Label>Last Updated</Label>
                <p className="text-sm">
                  {viewDialog.admin.updatedAt
                    ? new Date(viewDialog.admin.updatedAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() => setViewDialog({ open: false, admin: null })}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
