import React from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Monitor, MapPin, Activity, HardDrive, Clock, Video } from 'lucide-react';
import { mockDevices, mockVideos, mockPlaybackLogs } from '../lib/mock-data';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';

export function DeviceDetail() {
  const { deviceId } = useParams();
  const device = mockDevices.find((d) => d.id === deviceId);

  if (!device) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Monitor className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Device Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The device you're looking for doesn't exist.
        </p>
        <Link to="/devices">
          <Button>Back to Devices</Button>
        </Link>
      </div>
    );
  }

  const assignedVideos = mockVideos.filter((v) =>
    device.assignedAds.includes(v.id)
  );
  const deviceLogs = mockPlaybackLogs.filter((log) => log.deviceId === device.id);
  const storagePercentage = (device.storageUsed / device.storageTotal) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/devices"
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Devices
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
              {device.name}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {device.location}
              </span>
              <span>Device ID: {device.deviceId}</span>
            </div>
          </div>
          <Badge
            variant={device.status === 'online' ? 'default' : 'secondary'}
            className="capitalize"
          >
            {device.status}
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-950 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white capitalize">
            {device.status}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Uptime: {device.uptime}%
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-950 rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Assigned Ads</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {device.assignedAds.length}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950 rounded-lg flex items-center justify-center">
              <HardDrive className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Storage</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {device.storageUsed.toFixed(1)} GB
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            of {device.storageTotal} GB
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-950 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Last Active</span>
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {new Date(device.lastActive).toLocaleTimeString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {new Date(device.lastActive).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Preview */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Live Preview
          </h2>
          <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
            {device.currentlyPlaying ? (
              <>
                <img
                  src={
                    mockVideos.find((v) => v.id === device.currentlyPlaying)?.thumbnail ||
                    ''
                  }
                  alt="Currently playing"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-black/75 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-white text-sm font-medium">
                    {mockVideos.find((v) => v.id === device.currentlyPlaying)?.title}
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center">
                <Monitor className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No content playing</p>
              </div>
            )}
          </div>
          <div className="mt-4">
            <Progress value={storagePercentage} className="h-2 mb-2" />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Storage: {storagePercentage.toFixed(1)}% used
            </p>
          </div>
        </div>

        {/* Assigned Ads */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Assigned Advertisements
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {assignedVideos.map((video) => (
              <div
                key={video.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-16 h-10 rounded object-cover"
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
                    <Badge
                      variant={video.status === 'active' ? 'default' : 'secondary'}
                      className="text-xs capitalize"
                    >
                      {video.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Playback Logs */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Playback History
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Video
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Timestamp
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Duration
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {deviceLogs.map((log) => {
                const video = mockVideos.find((v) => v.id === log.videoId);
                return (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {video?.title || 'Unknown'}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {log.duration}s
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={log.completed ? 'default' : 'secondary'}>
                        {log.completed ? 'Completed' : 'Interrupted'}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
