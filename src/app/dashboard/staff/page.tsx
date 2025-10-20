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
import { staffApi, type Staff } from "@/apis/staff.api";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Users,
  UserCog,
  Mail,
  Lock,
  User,
  EyeOff,
  CheckCircle,
  XCircle,
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

export default function StaffPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formDialog, setFormDialog] = useState({
    open: false,
    mode: "create" as "create" | "edit",
    staff: null as Staff | null,
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    staff: null as Staff | null,
  });
  const [viewDialog, setViewDialog] = useState({
    open: false,
    staff: null as Staff | null,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer_support" as "super_admin" | "admin" | "moderator" | "customer_support" | "accountant",
    isActive: true,
    permissions: [] as string[],
  });

  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
      const staffData = await staffApi.getAll();
      setStaff(staffData);
      setError(null);
    } catch (err) {
      setError("Failed to load staff");
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
      role: "customer_support",
      isActive: true,
      permissions: [],
    });
  };

  const handleOpenCreateDialog = () => {
    resetForm();
    setFormDialog({ open: true, mode: "create", staff: null });
  };

  const handleOpenEditDialog = (staff: Staff) => {
    setFormData({
      name: staff.name,
      email: staff.email,
      password: "",
      role: staff.role,
      isActive: staff.isActive ?? true,
      permissions: staff.permissions || [],
    });
    setFormDialog({ open: true, mode: "edit", staff });
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation (only for create mode or if password is provided in edit mode)
    if (formDialog.mode === "create") {
      if (!formData.password) {
        errors.password = "Password is required";
      } else if (formData.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
      }
    } else if (formData.password && formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    // Role validation
    if (!formData.role) {
      errors.role = "Please select a role";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    // Clear previous errors
    setFieldErrors({});
    setError("");

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      if (formDialog.mode === "create") {
        // Staff backend accepts permissions field
        const createData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          isActive: formData.isActive,
          permissions: formData.permissions,
        };
        await staffApi.create(createData);
        showToast("Staff member created successfully", "success");
      } else {
        const staffId = formDialog.staff?._id;
        if (!staffId) return;
        const updateData: any = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          isActive: formData.isActive,
          permissions: formData.permissions,
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        await staffApi.update(staffId, updateData);
        showToast("Staff member updated successfully", "success");
      }
      await fetchData();
      setFormDialog({ ...formDialog, open: false });
      setFieldErrors({});
    } catch (err: any) {
      console.error('API Error:', err);

      let errorMessage = `Failed to ${formDialog.mode === "create" ? "create" : "update"} staff member`;

      // Handle different error types
      if (err.response) {
        const status = err.response.status;
        const errorData = err.response.data;

        if (status === 400) {
          // Handle validation errors from backend
          if (errorData.errors && typeof errorData.errors === 'object') {
            // Backend sent field-specific errors (object format)
            setFieldErrors(errorData.errors);
            errorMessage = "Please fix the validation errors";
          } else if (errorData.message) {
            // Backend sent a message (could be string or array)
            if (Array.isArray(errorData.message)) {
              // Message is an array of errors
              const messages = errorData.message.join(', ');
              errorMessage = messages;
              setError(messages);
            } else {
              // Message is a string
              errorMessage = errorData.message;
              setError(errorData.message);
            }
          } else {
            errorMessage = "Please check the form and try again";
            setError(errorMessage);
          }
        } else if (status === 409) {
          errorMessage = "A staff member with this email already exists";
          setError(errorMessage);
          setFieldErrors({ email: "This email is already in use" });
        } else if (status === 401 || status === 403) {
          errorMessage = "You don't have permission to perform this action";
          setError(errorMessage);
        } else if (status >= 500) {
          errorMessage = "Server error. Please try again later";
          setError(errorMessage);
        } else {
          errorMessage = errorData.message || "An error occurred";
          setError(errorMessage);
        }
      } else if (err.message) {
        errorMessage = err.message;
        setError(err.message);
      } else {
        setError(errorMessage);
      }

      showToast(errorMessage, "error");
    }
  };

  const handleDelete = async () => {
    const staffId = deleteDialog.staff?._id;
    if (!staffId) return;
    try {
      await staffApi.delete(staffId);
      await fetchData();
      showToast("Staff member deleted successfully", "success");
      setDeleteDialog({ open: false, staff: null });
    } catch (err) {
      showToast("Failed to delete staff member", "error");
    }
  };

  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && member.isActive) ||
      (statusFilter === "inactive" && !member.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "super_admin":
        return <Badge variant="destructive">Super Admin</Badge>;
      case "admin":
        return <Badge variant="default">Admin</Badge>;
      case "moderator":
        return <Badge variant="secondary">Moderator</Badge>;
      case "customer_support":
        return <Badge className="bg-green-600 hover:bg-green-700">Customer Support</Badge>;
      case "accountant":
        return <Badge className="bg-purple-600 hover:bg-purple-700">Accountant</Badge>;
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
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600 mt-1">
            Manage staff members, roles, and permissions.
          </p>
        </div>
        <Button onClick={handleOpenCreateDialog} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Staff Member
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
                placeholder="Search staff by name or email..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Role Filter */}
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="customer_support">Customer Support</SelectItem>
                <SelectItem value="accountant">Accountant</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Staff Table */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Members ({filteredStaff.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((member) => (
                <TableRow key={member._id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">
                          {member.name}
                        </p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(member.role)}</TableCell>
                  <TableCell>
                    {member.isActive ? (
                      <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <XCircle className="h-3 w-3 mr-1" />
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {member.createdAt
                      ? new Date(member.createdAt).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setViewDialog({ open: true, staff: member })
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEditDialog(member)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setDeleteDialog({ open: true, staff: member })
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

      {/* Staff Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Staff
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {staff.length}
            </div>
            <p className="text-sm text-gray-500 mt-1">All staff members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Staff
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {staff.filter((s) => s.isActive).length}
            </div>
            <p className="text-sm text-gray-500 mt-1">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Customer Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {staff.filter((s) => s.role === "customer_support").length}
            </div>
            <p className="text-sm text-gray-500 mt-1">Support team</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Accountants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {staff.filter((s) => s.role === "accountant").length}
            </div>
            <p className="text-sm text-gray-500 mt-1">Finance team</p>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={formDialog.open} onOpenChange={(open) => setFormDialog({ ...formDialog, open })}>
        <DialogContent className="max-w-[600px] max-h-[85vh] p-0 gap-0">
          <div className="overflow-y-auto max-h-[85vh]">
            <DialogHeader className="px-6 pt-6 pb-4 sticky top-0 bg-white z-10 border-b">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {formDialog.mode === "create" ? "Add New Staff Member" : "Edit Staff Member"}
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-base">
                {formDialog.mode === "create"
                  ? "Create a new staff account with specific role and permissions."
                  : "Update staff member information and settings."}
              </DialogDescription>
            </DialogHeader>

            <div className="px-6 py-6 space-y-6">
              {/* General Error Message */}
              {error && !Object.keys(fieldErrors).length && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

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
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (fieldErrors.name) {
                        setFieldErrors({ ...fieldErrors, name: "" });
                      }
                    }}
                    placeholder="John Doe"
                    className={`pl-11 h-12 text-base ${
                      fieldErrors.name
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                    required
                  />
                </div>
                {fieldErrors.name && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <XCircle className="h-4 w-4" />
                    {fieldErrors.name}
                  </p>
                )}
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
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (fieldErrors.email) {
                        setFieldErrors({ ...fieldErrors, email: "" });
                      }
                    }}
                    placeholder="staff@example.com"
                    className={`pl-11 h-12 text-base ${
                      fieldErrors.email
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                    required
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <XCircle className="h-4 w-4" />
                    {fieldErrors.email}
                  </p>
                )}
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
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      if (fieldErrors.password) {
                        setFieldErrors({ ...fieldErrors, password: "" });
                      }
                    }}
                    placeholder={formDialog.mode === "edit" ? "••••••••" : "Minimum 8 characters"}
                    className={`pl-11 pr-12 h-12 text-base ${
                      fieldErrors.password
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    }`}
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
                {fieldErrors.password && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <XCircle className="h-4 w-4" />
                    {fieldErrors.password}
                  </p>
                )}
                {!fieldErrors.password && formDialog.mode === "create" && (
                  <p className="text-xs text-gray-500">
                    Must be at least 8 characters long
                  </p>
                )}
              </div>

              {/* Role Field */}
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-semibold text-gray-900 block">
                  Role <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: any) => {
                    setFormData({ ...formData, role: value });
                    if (fieldErrors.role) {
                      setFieldErrors({ ...fieldErrors, role: "" });
                    }
                  }}
                >
                  <SelectTrigger className={`h-12 text-base w-full [&>span]:line-clamp-1 ${
                    fieldErrors.role
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  }`}>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer_support">Customer Support</SelectItem>
                    <SelectItem value="accountant">Accountant</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                {fieldErrors.role && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <XCircle className="h-4 w-4" />
                    {fieldErrors.role}
                  </p>
                )}
              </div>

              {/* Status Field */}
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-semibold text-gray-900 block">
                  Account Status <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.isActive ? "active" : "inactive"}
                  onValueChange={(value) =>
                    setFormData({ ...formData, isActive: value === "active" })
                  }
                >
                  <SelectTrigger className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full [&>span]:line-clamp-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Active</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="inactive">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-gray-600" />
                        <span>Inactive</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Permissions Selector */}
              <div className="space-y-2 pt-4 border-t">
                <PermissionSelector
                  selectedPermissions={formData.permissions}
                  onChange={(permissions) =>
                    setFormData({ ...formData, permissions })
                  }
                />
              </div>
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
                      Create Staff
                    </>
                  ) : (
                    <>
                      <Edit className="h-5 w-5 mr-2" />
                      Update Staff
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
            <DialogTitle>Delete Staff Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deleteDialog.staff?.name}? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, staff: null })}
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
            <DialogTitle>Staff Member Details</DialogTitle>
          </DialogHeader>
          {viewDialog.staff && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    {viewDialog.staff.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">
                    {viewDialog.staff.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {viewDialog.staff.email}
                  </p>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Role</Label>
                <div>{getRoleBadge(viewDialog.staff.role)}</div>
              </div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <div>
                  {viewDialog.staff.isActive ? (
                    <Badge variant="default" className="bg-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <XCircle className="h-3 w-3 mr-1" />
                      Inactive
                    </Badge>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Created At</Label>
                <p className="text-sm">
                  {viewDialog.staff.createdAt
                    ? new Date(viewDialog.staff.createdAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>
              <div className="grid gap-2">
                <Label>Last Updated</Label>
                <p className="text-sm">
                  {viewDialog.staff.updatedAt
                    ? new Date(viewDialog.staff.updatedAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() => setViewDialog({ open: false, staff: null })}
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
