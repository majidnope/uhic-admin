"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToastContainer } from "@/components/ui/toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings as SettingsIcon, Save, Bell, Shield, Database } from "lucide-react";

export default function SettingsPage() {
  const [toasts, setToasts] = useState<
    Array<{ id: string; message: string; type: "success" | "error" | "info" }>
  >([]);

  const [generalSettings, setGeneralSettings] = useState({
    siteName: "FinanceAdmin",
    siteUrl: "http://localhost:3000",
    supportEmail: "support@financeadmin.com",
    timezone: "UTC",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newUserAlerts: true,
    paymentAlerts: true,
    systemAlerts: true,
  });

  const [databaseSettings, setDatabaseSettings] = useState({
    mongoUri: "mongodb://localhost:27017/uhic",
    backupFrequency: "daily",
    retentionDays: "30",
  });

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

  const handleSaveGeneral = () => {
    // Save general settings
    showToast("General settings saved successfully", "success");
  };

  const handleSaveNotifications = () => {
    // Save notification settings
    showToast("Notification settings saved successfully", "success");
  };

  const handleSaveDatabase = () => {
    // Save database settings
    showToast("Database settings saved successfully", "success");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your application settings and preferences.
        </p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <SettingsIcon className="h-5 w-5 mr-2" />
            General Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              value={generalSettings.siteName}
              onChange={(e) =>
                setGeneralSettings({
                  ...generalSettings,
                  siteName: e.target.value,
                })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="siteUrl">Site URL</Label>
            <Input
              id="siteUrl"
              value={generalSettings.siteUrl}
              onChange={(e) =>
                setGeneralSettings({
                  ...generalSettings,
                  siteUrl: e.target.value,
                })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="supportEmail">Support Email</Label>
            <Input
              id="supportEmail"
              type="email"
              value={generalSettings.supportEmail}
              onChange={(e) =>
                setGeneralSettings({
                  ...generalSettings,
                  supportEmail: e.target.value,
                })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select
              value={generalSettings.timezone}
              onValueChange={(value) =>
                setGeneralSettings({ ...generalSettings, timezone: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="America/New_York">Eastern Time</SelectItem>
                <SelectItem value="America/Chicago">Central Time</SelectItem>
                <SelectItem value="America/Denver">Mountain Time</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                <SelectItem value="Europe/London">London</SelectItem>
                <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveGeneral}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-sm text-gray-500">
                Receive notifications via email
              </p>
            </div>
            <Button
              variant={notificationSettings.emailNotifications ? "default" : "outline"}
              size="sm"
              onClick={() =>
                setNotificationSettings({
                  ...notificationSettings,
                  emailNotifications: !notificationSettings.emailNotifications,
                })
              }
            >
              {notificationSettings.emailNotifications ? "Enabled" : "Disabled"}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>New User Alerts</Label>
              <p className="text-sm text-gray-500">
                Get notified when new users register
              </p>
            </div>
            <Button
              variant={notificationSettings.newUserAlerts ? "default" : "outline"}
              size="sm"
              onClick={() =>
                setNotificationSettings({
                  ...notificationSettings,
                  newUserAlerts: !notificationSettings.newUserAlerts,
                })
              }
            >
              {notificationSettings.newUserAlerts ? "Enabled" : "Disabled"}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Payment Alerts</Label>
              <p className="text-sm text-gray-500">
                Receive alerts for payment activities
              </p>
            </div>
            <Button
              variant={notificationSettings.paymentAlerts ? "default" : "outline"}
              size="sm"
              onClick={() =>
                setNotificationSettings({
                  ...notificationSettings,
                  paymentAlerts: !notificationSettings.paymentAlerts,
                })
              }
            >
              {notificationSettings.paymentAlerts ? "Enabled" : "Disabled"}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>System Alerts</Label>
              <p className="text-sm text-gray-500">
                Important system notifications
              </p>
            </div>
            <Button
              variant={notificationSettings.systemAlerts ? "default" : "outline"}
              size="sm"
              onClick={() =>
                setNotificationSettings({
                  ...notificationSettings,
                  systemAlerts: !notificationSettings.systemAlerts,
                })
              }
            >
              {notificationSettings.systemAlerts ? "Enabled" : "Disabled"}
            </Button>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveNotifications}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Database Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Database Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="mongoUri">MongoDB URI</Label>
            <Input
              id="mongoUri"
              value={databaseSettings.mongoUri}
              onChange={(e) =>
                setDatabaseSettings({
                  ...databaseSettings,
                  mongoUri: e.target.value,
                })
              }
              type="password"
            />
            <p className="text-sm text-gray-500">
              Connection string for MongoDB database
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="backupFrequency">Backup Frequency</Label>
            <Select
              value={databaseSettings.backupFrequency}
              onValueChange={(value) =>
                setDatabaseSettings({ ...databaseSettings, backupFrequency: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="retentionDays">Backup Retention (days)</Label>
            <Input
              id="retentionDays"
              type="number"
              value={databaseSettings.retentionDays}
              onChange={(e) =>
                setDatabaseSettings({
                  ...databaseSettings,
                  retentionDays: e.target.value,
                })
              }
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline">
              <Shield className="h-4 w-4 mr-2" />
              Test Connection
            </Button>
            <Button onClick={handleSaveDatabase}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Change Password</Label>
            <p className="text-sm text-gray-500 mb-2">
              Update your admin password for enhanced security
            </p>
            <Button variant="outline">Change Password</Button>
          </div>
          <div className="grid gap-2">
            <Label>Two-Factor Authentication</Label>
            <p className="text-sm text-gray-500 mb-2">
              Add an extra layer of security to your account
            </p>
            <Button variant="outline">Enable 2FA</Button>
          </div>
          <div className="grid gap-2">
            <Label>Session Management</Label>
            <p className="text-sm text-gray-500 mb-2">
              Manage active sessions and logout from all devices
            </p>
            <Button variant="outline">View Sessions</Button>
          </div>
        </CardContent>
      </Card>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
