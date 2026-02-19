import React from 'react';
import { Play, Pause, Square, AlertTriangle, Monitor } from 'lucide-react';
import { mockDevices, mockVideos } from '../lib/mock-data';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { cn } from '../components/ui/utils';
import { toast } from 'sonner';

export function PlaybackControl() {
  const handlePlay = (deviceId: string) => {
    toast.success('Playback resumed');
  };

  const handlePause = (deviceId: string) => {
    toast.success('Playback paused');
  };

  const handleStop = (deviceId: string) => {
    toast.success('Playback stopped');
  };

  const handleEmergencyOverride = () => {
    toast.warning('Emergency override activated - All displays paused');
  };

  const getVideoTitle = (videoId: string | null) => {
    if (!videoId) return 'No content';
    const video = mockVideos.find((v) => v.id === videoId);
    return video?.title || 'Unknown';
  };

  const getVideoThumbnail = (videoId: string | null) => {
    if (!videoId) return null;
    const video = mockVideos.find((v) => v.id === videoId);
    return video?.thumbnail;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
            Playback Control
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Control playback across all connected devices
          </p>
        </div>
        <Button
          variant="destructive"
          onClick={handleEmergencyOverride}
          className="gap-2"
        >
          <AlertTriangle className="w-4 h-4" />
          Emergency Override
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Devices</p>
              <p className="text-3xl font-semibold text-gray-900 dark:text-white">
                {mockDevices.length}
              </p>
            </div>
            <Monitor className="w-10 h-10 text-blue-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Playing Now</p>
              <p className="text-3xl font-semibold text-gray-900 dark:text-white">
                {mockDevices.filter((d) => d.currentlyPlaying).length}
              </p>
            </div>
            <Play className="w-10 h-10 text-green-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Idle Devices</p>
              <p className="text-3xl font-semibold text-gray-900 dark:text-white">
                {mockDevices.filter((d) => !d.currentlyPlaying).length}
              </p>
            </div>
            <Pause className="w-10 h-10 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Device Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockDevices.map((device) => {
          const thumbnail = getVideoThumbnail(device.currentlyPlaying);
          return (
            <div
              key={device.id}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Device Preview */}
              <div className="relative aspect-video bg-gray-900">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt="Currently playing"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Monitor className="w-12 h-12 text-gray-600" />
                  </div>
                )}
                
                {/* Status Indicator */}
                <div className="absolute top-3 right-3">
                  <div
                    className={cn(
                      'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm',
                      device.status === 'online'
                        ? 'bg-green-500/90 text-white'
                        : 'bg-gray-500/90 text-white'
                    )}
                  >
                    <div
                      className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        device.status === 'online' ? 'bg-white' : 'bg-gray-300'
                      )}
                    />
                    {device.status === 'online' ? 'Live' : 'Offline'}
                  </div>
                </div>

                {/* Currently Playing Overlay */}
                {device.currentlyPlaying && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <p className="text-white text-sm font-medium truncate">
                      {getVideoTitle(device.currentlyPlaying)}
                    </p>
                  </div>
                )}
              </div>

              {/* Device Info */}
              <div className="p-4">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {device.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{device.location}</p>
                </div>

                {/* Current Status */}
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Currently Playing:
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {getVideoTitle(device.currentlyPlaying)}
                  </p>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handlePlay(device.id)}
                    disabled={device.status === 'offline'}
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Play
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handlePause(device.id)}
                    disabled={device.status === 'offline'}
                  >
                    <Pause className="w-4 h-4 mr-1" />
                    Pause
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStop(device.id)}
                    disabled={device.status === 'offline'}
                  >
                    <Square className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
