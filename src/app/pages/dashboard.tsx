import React from 'react';
import { Video, Monitor, PlayCircle, Activity, TrendingUp, Clock } from 'lucide-react';
import { StatCard } from '../components/stat-card';
import { mockVideos, mockDevices, mockAnalyticsData } from '../lib/mock-data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '../components/ui/badge';

export function Dashboard() {
  const totalVideos = mockVideos.length;
  const totalDevices = mockDevices.length;
  const onlineDevices = mockDevices.filter(d => d.status === 'online').length;
  const offlineDevices = totalDevices - onlineDevices;
  const totalPlays = mockVideos.reduce((sum, v) => sum + v.currentPlayCount, 0);

  const recentVideos = mockVideos
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const recentDevices = mockDevices
    .sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back! Here's what's happening with your ad network today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Videos"
          value={totalVideos}
          change="+12.5%"
          changeType="positive"
          icon={<Video className="w-6 h-6 text-white" />}
          iconColor="bg-blue-500"
        />
        <StatCard
          title="Total Devices"
          value={totalDevices}
          change="+3.2%"
          changeType="positive"
          icon={<Monitor className="w-6 h-6 text-white" />}
          iconColor="bg-purple-500"
        />
        <StatCard
          title="Online Devices"
          value={`${onlineDevices}/${totalDevices}`}
          change={`${offlineDevices} offline`}
          changeType={offlineDevices > 0 ? 'negative' : 'positive'}
          icon={<Activity className="w-6 h-6 text-white" />}
          iconColor="bg-green-500"
        />
        <StatCard
          title="Total Ad Plays"
          value={totalPlays.toLocaleString()}
          change="+18.7%"
          changeType="positive"
          icon={<PlayCircle className="w-6 h-6 text-white" />}
          iconColor="bg-orange-500"
        />
      </div>

      {/* Analytics Chart */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
              Ad Plays Over Time
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Last 30 days performance
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Plays</span>
            </div>
          </div>
        </div>
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
            <Line
              type="monotone"
              dataKey="plays"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recently Added Ads */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recently Added Ads
            </h2>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View all
            </button>
          </div>
          <div className="space-y-3">
            {recentVideos.map((video) => (
              <div
                key={video.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {video.duration}s
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {video.currentPlayCount} plays
                    </span>
                  </div>
                </div>
                <Badge
                  variant={video.status === 'active' ? 'default' : 'secondary'}
                  className="capitalize"
                >
                  {video.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Connected Devices */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Device Status
            </h2>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View all
            </button>
          </div>
          <div className="space-y-3">
            {recentDevices.map((device) => (
              <div
                key={device.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  device.status === 'online' 
                    ? 'bg-green-100 dark:bg-green-950' 
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}>
                  <Monitor className={`w-5 h-5 ${
                    device.status === 'online'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {device.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(device.lastActive).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    device.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400 capitalize">
                    {device.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
