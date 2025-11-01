"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToastContainer } from "@/components/ui/toast";
import { UserFormDialog } from "@/components/users/user-form-dialog";
import { DeleteUserDialog } from "@/components/users/delete-user-dialog";
import { ViewUserDialog } from "@/components/users/view-user-dialog";
import { usersApi } from "@/apis/users.api";
import { plansApi } from "@/apis/plans.api";
import type { User, Plan } from "@/lib/mock-data";
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Check,
  X,
} from "lucide-react";

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [approvalFilter, setApprovalFilter] = useState<string>("all");
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formDialog, setFormDialog] = useState({
    open: false,
    mode: "create" as "create" | "edit",
    user: null as User | null,
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    user: null as User | null,
  });
  const [viewDialog, setViewDialog] = useState({
    open: false,
    user: null as User | null,
  });
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
      const [usersData, plansData] = await Promise.all([
        usersApi.getAll(),
        plansApi.getAll(),
      ]);
      setUsers(usersData);
      setPlans(plansData);
      setError(null);
    } catch (err) {
      setError("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData: Partial<User>, sendResetEmail?: boolean) => {
    try {
      await usersApi.create(userData);

      // Send password reset email if checkbox was checked
      if (sendResetEmail && userData.email) {
        try {
          await usersApi.sendPasswordResetEmail(userData.email);
          showToast("User created successfully and password reset email sent", "success");
        } catch (emailErr) {
          console.error("Failed to send reset email:", emailErr);
          showToast("User created but failed to send password reset email", "info");
        }
      } else {
        showToast("User created successfully", "success");
      }

      await fetchData();
    } catch (err) {
      showToast("Failed to create user", "error");
      throw err;
    }
  };

  const handleUpdateUser = async (userData: Partial<User>) => {
    const userId = formDialog.user?._id || formDialog.user?.id;
    if (!userId) return;
    try {
      await usersApi.update(userId, userData);
      await fetchData();
      showToast("User updated successfully", "success");
    } catch (err) {
      showToast("Failed to update user", "error");
      throw err;
    }
  };

  const handleDeleteUser = async () => {
    const userId = deleteDialog.user?._id || deleteDialog.user?.id;
    if (!userId) return;
    try {
      await usersApi.delete(userId);
      await fetchData();
      showToast("User deleted successfully", "success");
    } catch (err) {
      showToast("Failed to delete user", "error");
      throw err;
    }
  };

  const handleApproveUser = async (user: User) => {
    const userId = user._id || user.id;
    if (!userId) return;
    try {
      await usersApi.approve(userId);
      await fetchData();
      showToast("User approved successfully", "success");
    } catch (err) {
      showToast("Failed to approve user", "error");
      console.error(err);
    }
  };

  const handleRejectUser = async (user: User) => {
    const userId = user._id || user.id;
    if (!userId) return;
    const reason = prompt("Please enter rejection reason:");
    if (!reason) return;
    try {
      await usersApi.reject(userId, reason);
      await fetchData();
      showToast("User rejected successfully", "success");
    } catch (err) {
      showToast("Failed to reject user", "error");
      console.error(err);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    const matchesApproval =
      approvalFilter === "all" || user.approvalStatus === approvalFilter;
    return matchesSearch && matchesStatus && matchesApproval;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="success">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getApprovalBadge = (approvalStatus?: string) => {
    switch (approvalStatus) {
      case "approved":
        return <Badge className="bg-green-100 text-green-700">Approved</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-700">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
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
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">
            Manage your platform users and their subscriptions.
          </p>
        </div>
        <Button
          onClick={() =>
            setFormDialog({ open: true, mode: "create", user: null })
          }
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Approval Status Tabs */}
      <Tabs value={approvalFilter} onValueChange={setApprovalFilter} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <span>All Users</span>
            <Badge variant="secondary" className="text-xs">
              {users.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            <span>Approved</span>
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200">
              {users.filter(u => u.approvalStatus === "approved").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <span>Pending</span>
            <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-700 border-yellow-200">
              {users.filter(u => u.approvalStatus === "pending").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-2">
            <span>Rejected</span>
            <Badge variant="secondary" className="text-xs bg-red-100 text-red-700 border-red-200">
              {users.filter(u => u.approvalStatus === "rejected").length}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users by name or email..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                All
              </Button>
              <Button
                variant={statusFilter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("active")}
              >
                Active
              </Button>
              <Button
                variant={statusFilter === "inactive" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("inactive")}
              >
                Inactive
              </Button>
              <Button
                variant={statusFilter === "suspended" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("suspended")}
              >
                Suspended
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Approval</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user._id || user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{getApprovalBadge(user.approvalStatus)}</TableCell>
                  <TableCell>
                    {Array.isArray(user.plan) && user.plan.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {user.plan.map((p, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {typeof p === 'string' ? p : p?.name || 'Unknown'}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <Badge variant="outline" className="text-gray-400">No plan</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(user.joinDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(user.lastLogin).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-medium">${user.revenue}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      {user.approvalStatus === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleApproveUser(user)}
                            title="Approve User"
                          >
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRejectUser(user)}
                            title="Reject User"
                          >
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewDialog({ open: true, user })}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setFormDialog({ open: true, mode: "edit", user })
                        }
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteDialog({ open: true, user })}
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

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {users.length}
            </div>
            <p className="text-sm text-gray-500 mt-1">All registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {users.filter((u) => u.status === "active").length}
            </div>
            <p className="text-sm text-gray-500 mt-1">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              $
              {users
                .reduce((sum, user) => sum + user.revenue, 0)
                .toLocaleString()}
            </div>
            <p className="text-sm text-gray-500 mt-1">From all users</p>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <UserFormDialog
        open={formDialog.open}
        onOpenChange={(open) => setFormDialog({ ...formDialog, open })}
        onSubmit={
          formDialog.mode === "create" ? handleCreateUser : handleUpdateUser
        }
        user={formDialog.user}
        plans={plans}
        mode={formDialog.mode}
      />

      <DeleteUserDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        onConfirm={handleDeleteUser}
        user={deleteDialog.user}
      />

      <ViewUserDialog
        open={viewDialog.open}
        onOpenChange={(open) => setViewDialog({ ...viewDialog, open })}
        user={viewDialog.user}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
