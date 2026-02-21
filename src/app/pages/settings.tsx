import React, { useState } from 'react';
import { User, Lock, Palette, HardDrive, Save } from 'lucide-react';
import { useTheme } from '../context/theme-context';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';
import { useAuth } from '../context/auth-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

export function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [autoCleanup, setAutoCleanup] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [storageLimit, setStorageLimit] = useState('80');
  const {user} = useAuth();
  const handleSaveProfile = () => {
    toast.success('Profile updated successfully');
  };

  const handleChangePassword = () => {
    toast.success('Password changed successfully');
  };

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account and system preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <User className="w-5 h-5" />
              <span className="font-medium text-sm">Profile</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              <Lock className="w-5 h-5" />
              <span className="font-medium text-sm">Security</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              <Palette className="w-5 h-5" />
              <span className="font-medium text-sm">Appearance</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              <HardDrive className="w-5 h-5" />
              <span className="font-medium text-sm">Storage</span>
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Profile Settings
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Update your personal information
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" defaultValue={user?.first_name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" defaultValue={user?.last_name} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue={user?.email} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" defaultValue="AdDisplay Corp" />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center">
                <Lock className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Change Password
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Update your password regularly for security
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleChangePassword} className="gap-2">
                  <Lock className="w-4 h-4" />
                  Change Password
                </Button>
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950 rounded-full flex items-center justify-center">
                <Palette className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Appearance
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Customize how the dashboard looks
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Theme Mode</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Currently using {theme} mode
                  </p>
                </div>
                <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Receive alerts via email
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
            </div>
          </div>

          {/* Storage Settings */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950 rounded-full flex items-center justify-center">
                <HardDrive className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Storage Management
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Configure storage and cleanup settings
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto Cleanup</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Automatically delete old content
                  </p>
                </div>
                <Switch checked={autoCleanup} onCheckedChange={setAutoCleanup} />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="storage-limit">Storage Warning Threshold (%)</Label>
                <Input
                  id="storage-limit"
                  type="number"
                  value={storageLimit}
                  onChange={(e) => setStorageLimit(e.target.value)}
                  min="50"
                  max="95"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Get notified when storage exceeds this percentage
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="retention">Content Retention Period</Label>
                <Select defaultValue="90">
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">180 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings} className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
