import React, { useState } from 'react';
import { Download, Calendar, TrendingUp, Monitor, Video } from 'lucide-react';
import { mockVideos, mockDevices, mockAnalyticsData } from '../lib/mock-data';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { toast } from 'sonner';

export function Analytics() {
  const [dateRange, setDateRange] = useState('30');

  const handleExport = () => {
    toast.success('Analytics report exported successfully');
  };

  // Calculate top performing ads
  const topAds = [...mockVideos]
    .sort((a, b) => b.currentPlayCount - a.currentPlayCount)
    .slice(0, 5);

  // Device performance data
  const devicePerformanceData = mockDevices
    .filter((d) => d.status === 'online')
    .map((device) => ({
      name: device.name.split(' ')[0],
      uptime: device.uptime,
      storage: (device.storageUsed / device.storageTotal) * 100,
    }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
            Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Detailed insights and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <Input
              type="number"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-20"
              min="7"
              max="90"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">days</span>
          </div>
          <Button onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Total Plays</span>
          </div>
          <p className="text-3xl font-semibold text-gray-900 dark:text-white">
            {mockVideos.reduce((sum, v) => sum + v.currentPlayCount, 0).toLocaleString()}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">+18.7% from last month</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-950 rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Active Ads</span>
          </div>
          <p className="text-3xl font-semibold text-gray-900 dark:text-white">
            {mockVideos.filter((v) => v.status === 'active').length}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            of {mockVideos.length} total
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-950 rounded-lg flex items-center justify-center">
              <Monitor className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Online Devices</span>
          </div>
          <p className="text-3xl font-semibold text-gray-900 dark:text-white">
            {mockDevices.filter((d) => d.status === 'online').length}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            of {mockDevices.length} total
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-950 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Completion</span>
          </div>
          <p className="text-3xl font-semibold text-gray-900 dark:text-white">87.3%</p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">+5.2% improvement</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ad Plays Over Time */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Ad Plays Over Time
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockAnalyticsData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-800" />
              <XAxis
                dataKey="date"
                className="text-xs"
                tick={{ fill: 'currentColor', className: 'fill-gray-600 dark:fill-gray-400' }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: 'currentColor', className: 'fill-gray-600 dark:fill-gray-400' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="plays"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Plays"
              />
              <Line
                type="monotone"
                dataKey="completionRate"
                stroke="#10b981"
                strokeWidth={2}
                name="Completion %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Device Performance */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Device Performance
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={devicePerformanceData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-800" />
              <XAxis
                dataKey="name"
                className="text-xs"
                tick={{ fill: 'currentColor', className: 'fill-gray-600 dark:fill-gray-400' }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: 'currentColor', className: 'fill-gray-600 dark:fill-gray-400' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
              />
              <Legend />
              <Bar dataKey="uptime" fill="#3b82f6" name="Uptime %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performing Ads */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Top Performing Advertisements
        </h2>
        <div className="space-y-4">
          {topAds.map((video, index) => {
            const percentage = (video.currentPlayCount / video.playCountLimit) * 100;
            return (
              <div key={video.id} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                  {index + 1}
                </div>
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-20 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {video.currentPlayCount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">plays</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
