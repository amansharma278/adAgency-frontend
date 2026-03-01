// Mock data for the Digital Advertisement Display Management System

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  playCountLimit: number;
  currentPlayCount: number;
  assignedDevices: string[];
  status: 'active' | 'inactive' | 'paused';
  startDate: string;
  endDate: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface Device {
  id: string;
  name: string;
  deviceId: string;
  location: string;
  status: 'online' | 'offline';
  currentlyPlaying: string | null;
  lastActive: string;
  storageUsed: number;
  storageTotal: number;
  assignedAds: string[];
  uptime: number;
}
export interface DeviceResponse {
  id: number,
  device_name: string,
  location: string,
  is_online: boolean,
  last_active: string,
  device_id: string,
  assigned_ads: string[]
}

export interface VideoRes {
  "id": number,
  "title": string,
  "description":string,
  "duration": number,
  "play_limit": number,
  "priority": number,
  "start_date": string,
  "end_date": string,
  "is_active": boolean,
  "created_at": string,
  "video": number,
  devices: number[],
  status: 'active' | 'inactive' | 'paused';
  thumbnail: string;
  currentPlayCount: number;
  assignedDevices: string[];

}
export interface PlaybackLog {
  id: string;
  deviceId: string;
  videoId: string;
  timestamp: string;
  duration: number;
  completed: boolean;
}

export interface Notification {
  id: string;
  type: 'device_offline' | 'ad_expired' | 'system' | 'storage_warning';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export const mockVideos: Video[] = [
  {
    id: 'v1',
    title: 'Summer Sale Campaign 2026',
    description: 'Promotional video for summer sale event',
    thumbnail: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400',
    duration: 30,
    playCountLimit: 1000,
    currentPlayCount: 742,
    assignedDevices: ['d1', 'd2', 'd3', 'd4'],
    status: 'active',
    startDate: '2026-02-01',
    endDate: '2026-03-31',
    priority: 'high',
    createdAt: '2026-02-01T10:00:00Z'
  },
  {
    id: 'v2',
    title: 'New Product Launch - SmartWatch Pro',
    description: 'Introduction to our latest smartwatch',
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    duration: 45,
    playCountLimit: 500,
    currentPlayCount: 385,
    assignedDevices: ['d1', 'd5'],
    status: 'active',
    startDate: '2026-02-10',
    endDate: '2026-04-10',
    priority: 'high',
    createdAt: '2026-02-10T14:30:00Z'
  },
  {
    id: 'v3',
    title: 'Brand Story - Company Heritage',
    description: 'Our company journey and values',
    thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400',
    duration: 60,
    playCountLimit: 200,
    currentPlayCount: 156,
    assignedDevices: ['d2', 'd3'],
    status: 'active',
    startDate: '2026-01-15',
    endDate: '2026-12-31',
    priority: 'medium',
    createdAt: '2026-01-15T09:00:00Z'
  },
  {
    id: 'v4',
    title: 'Holiday Special Offers',
    description: 'Limited time holiday promotions',
    thumbnail: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400',
    duration: 25,
    playCountLimit: 800,
    currentPlayCount: 623,
    assignedDevices: ['d4', 'd5', 'd6'],
    status: 'active',
    startDate: '2026-02-01',
    endDate: '2026-02-28',
    priority: 'medium',
    createdAt: '2026-02-01T11:00:00Z'
  },
  {
    id: 'v5',
    title: 'Customer Testimonials',
    description: 'Real stories from satisfied customers',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400',
    duration: 35,
    playCountLimit: 300,
    currentPlayCount: 189,
    assignedDevices: ['d1', 'd3', 'd5'],
    status: 'active',
    startDate: '2026-01-20',
    endDate: '2026-06-30',
    priority: 'low',
    createdAt: '2026-01-20T16:45:00Z'
  },
  {
    id: 'v6',
    title: 'Spring Collection Preview',
    description: 'Sneak peek of upcoming spring collection',
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
    duration: 40,
    playCountLimit: 600,
    currentPlayCount: 245,
    assignedDevices: ['d2', 'd4'],
    status: 'paused',
    startDate: '2026-02-15',
    endDate: '2026-05-15',
    priority: 'medium',
    createdAt: '2026-02-15T13:00:00Z'
  },
  {
    id: 'v7',
    title: 'Corporate Social Responsibility',
    description: 'Our commitment to sustainability',
    thumbnail: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400',
    duration: 50,
    playCountLimit: 150,
    currentPlayCount: 98,
    assignedDevices: ['d6'],
    status: 'active',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    priority: 'low',
    createdAt: '2026-01-01T08:00:00Z'
  },
  {
    id: 'v8',
    title: 'Flash Sale Alert',
    description: '24-hour flash sale announcement',
    thumbnail: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=400',
    duration: 15,
    playCountLimit: 2000,
    currentPlayCount: 1847,
    assignedDevices: ['d1', 'd2', 'd3', 'd4', 'd5', 'd6'],
    status: 'active',
    startDate: '2026-02-17',
    endDate: '2026-02-18',
    priority: 'high',
    createdAt: '2026-02-17T06:00:00Z'
  }
];

export const mockDevices: Device[] = [
  {
    id: '16',
    name: 'Main Store Display',
    deviceId: 'DEV-001-MST',
    location: 'Downtown Store - Main Entrance',
    status: 'online',
    currentlyPlaying: 'v1',
    lastActive: new Date().toISOString(),
    storageUsed: 45.2,
    storageTotal: 128,
    assignedAds: ['v1', 'v2', 'v5', 'v8'],
    uptime: 99.8
  },
  {
    id: 'd2',
    name: 'Mall Kiosk Display',
    deviceId: 'DEV-002-MLK',
    location: 'Shopping Mall - Level 2',
    status: 'online',
    currentlyPlaying: 'v3',
    lastActive: new Date(Date.now() - 120000).toISOString(),
    storageUsed: 62.8,
    storageTotal: 128,
    assignedAds: ['v1', 'v3', 'v6', 'v8'],
    uptime: 98.5
  },
  {
    id: 'd3',
    name: 'Airport Terminal Screen',
    deviceId: 'DEV-003-APT',
    location: 'International Airport - Terminal A',
    status: 'online',
    currentlyPlaying: 'v8',
    lastActive: new Date(Date.now() - 60000).toISOString(),
    storageUsed: 38.5,
    storageTotal: 256,
    assignedAds: ['v1', 'v3', 'v5', 'v8'],
    uptime: 99.9
  },
  {
    id: 'd4',
    name: 'Subway Station Display',
    deviceId: 'DEV-004-SUB',
    location: 'Central Subway Station - Platform 2',
    status: 'offline',
    currentlyPlaying: null,
    lastActive: new Date(Date.now() - 3600000).toISOString(),
    storageUsed: 51.3,
    storageTotal: 128,
    assignedAds: ['v1', 'v4', 'v6', 'v8'],
    uptime: 95.2
  },
  {
    id: 'd5',
    name: 'Coffee Shop Screen',
    deviceId: 'DEV-005-CFS',
    location: 'Star Coffee - City Center',
    status: 'online',
    currentlyPlaying: 'v2',
    lastActive: new Date(Date.now() - 30000).toISOString(),
    storageUsed: 29.7,
    storageTotal: 64,
    assignedAds: ['v2', 'v4', 'v5', 'v8'],
    uptime: 97.6
  },
  {
    id: 'd6',
    name: 'Hotel Lobby Display',
    deviceId: 'DEV-006-HTL',
    location: 'Grand Hotel - Main Lobby',
    status: 'online',
    currentlyPlaying: 'v7',
    lastActive: new Date(Date.now() - 90000).toISOString(),
    storageUsed: 72.1,
    storageTotal: 128,
    assignedAds: ['v4', 'v7', 'v8'],
    uptime: 99.2
  },
  {
    id: 'd7',
    name: 'University Campus Screen',
    deviceId: 'DEV-007-UNI',
    location: 'State University - Student Center',
    status: 'offline',
    currentlyPlaying: null,
    lastActive: new Date(Date.now() - 7200000).toISOString(),
    storageUsed: 18.4,
    storageTotal: 64,
    assignedAds: ['v3', 'v5'],
    uptime: 92.8
  },
  {
    id: 'd8',
    name: 'Gym Fitness Display',
    deviceId: 'DEV-008-GYM',
    location: 'PowerGym - Main Workout Area',
    status: 'online',
    currentlyPlaying: 'v5',
    lastActive: new Date(Date.now() - 45000).toISOString(),
    storageUsed: 33.9,
    storageTotal: 64,
    assignedAds: ['v2', 'v5', 'v8'],
    uptime: 96.4
  }
];

export const mockPlaybackLogs: PlaybackLog[] = [
  {
    id: 'log1',
    deviceId: 'd1',
    videoId: 'v1',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    duration: 30,
    completed: true
  },
  {
    id: 'log2',
    deviceId: 'd2',
    videoId: 'v3',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    duration: 60,
    completed: true
  },
  {
    id: 'log3',
    deviceId: 'd3',
    videoId: 'v8',
    timestamp: new Date(Date.now() - 180000).toISOString(),
    duration: 15,
    completed: true
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'device_offline',
    title: 'Device Offline',
    message: 'Subway Station Display (DEV-004-SUB) has gone offline',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false
  },
  {
    id: 'n2',
    type: 'device_offline',
    title: 'Device Offline',
    message: 'University Campus Screen (DEV-007-UNI) has gone offline',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    read: false
  },
  {
    id: 'n3',
    type: 'ad_expired',
    title: 'Ad Expiring Soon',
    message: 'Flash Sale Alert will expire in 6 hours',
    timestamp: new Date(Date.now() - 900000).toISOString(),
    read: false
  },
  {
    id: 'n4',
    type: 'storage_warning',
    title: 'Storage Warning',
    message: 'Hotel Lobby Display storage is 56% full',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    read: true
  },
  {
    id: 'n5',
    type: 'system',
    title: 'System Update',
    message: 'System maintenance scheduled for Feb 20, 2026',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    read: true
  }
];

// Analytics data for charts
export const generateAnalyticsData = () => {
  const days = 30;
  const data = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      plays: Math.floor(Math.random() * 300) + 150,
      devices: Math.floor(Math.random() * 8) + 4,
      completionRate: Math.floor(Math.random() * 20) + 75
    });
  }

  return data;
};

export const mockAnalyticsData = generateAnalyticsData();
