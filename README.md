# Digital Advertisement Display Management System

A modern, professional React-based admin dashboard for managing digital advertisement displays across multiple devices.

## Features

### 🔐 Authentication System
- **Login Page** - Clean, minimal design with eye-toggle password field
- **Protected Routes** - All dashboard pages require authentication
- **Session Persistence** - Login state saved in localStorage
- **Automatic Redirects** - Redirects to login when not authenticated
- **Logout Functionality** - Secure logout with confirmation

**Demo Credentials:**
- Email: `admin@addisplay.com`
- Password: `admin123`

### 📊 Dashboard
- Real-time statistics (Total Videos, Devices, Online/Offline status, Ad plays)
- Interactive analytics chart showing ad plays over time
- Recently added ads list
- Device status monitoring
- Quick overview cards

### 🎬 Ad Management
- Video/Ad table with thumbnails, duration, play counts, and status
- **Pagination controls** with customizable page size
- Upload new advertisements with detailed metadata
- Assign ads to specific devices
- Schedule start/end dates
- Set priority levels (Low, Medium, High)
- Edit, Pause/Resume, and Delete functionality
- Search and filter by status

### 📺 Device Management
- Comprehensive device listing with location and status
- Real-time online/offline monitoring
- Storage usage tracking with visual indicators
- Device uptime statistics
- Device control actions (View, Restart, Remove)
- Search and filter capabilities

### 🔍 Device Details
- Live preview of currently playing content
- Complete device information
- Assigned advertisements list
- Playback history logs
- Storage utilization metrics

### 🎮 Playback Control
- Visual card-based device grid
- Live playback status for each device
- Play/Pause/Stop controls per device
- Emergency override for all displays
- Real-time status indicators

### 📈 Analytics
- Comprehensive performance metrics
- Ad plays over time chart
- Device performance bar chart
- Top performing advertisements ranking
- Customizable date range
- Export report functionality

### 🔔 Notifications
- **Full notifications page** with filtering
- Real-time system alerts
- Device offline notifications
- Ad expiration warnings
- Storage alerts
- Mark as read/unread functionality
- Delete individual notifications

### ⚙️ Settings
- Profile management
- Password change
- Dark/Light mode toggle
- Email notification settings
- Storage management configuration
- Auto-cleanup settings
- Content retention period

## Technical Stack

- **React 18.3.1** - UI Framework
- **TypeScript** - Type Safety
- **Tailwind CSS v4** - Styling
- **React Router 7** - Navigation
- **Recharts** - Data Visualization
- **Lucide React** - Icons
- **Sonner** - Toast Notifications
- **Radix UI** - Accessible Components

## Design System

- **Modern SaaS Aesthetic** - Inspired by Stripe/Vercel
- **Dark & Light Mode** - Fully themed with smooth transitions
- **Responsive Design** - Desktop-first with mobile optimization
- **Professional UI Components** - Cards, Tables, Modals, Badges
- **Smooth Animations** - Transitions and hover effects
- **Custom Scrollbars** - Styled for both themes

## Key Features

✅ Fully Responsive (Desktop, Tablet, Mobile)
✅ Dark/Light Mode Support
✅ Search & Filter Functionality
✅ Loading Skeletons
✅ Empty State Designs
✅ Confirmation Modals
✅ Toast Notifications
✅ Pagination Ready
✅ Type-Safe with TypeScript
✅ Accessible UI Components

## Project Structure

```
/src/app
  ├── components/          # Reusable UI components
  │   ├── ui/             # Base UI components (shadcn-style)
  │   ├── sidebar.tsx     # Navigation sidebar
  │   ├── top-nav.tsx     # Top navigation bar
  │   └── stat-card.tsx   # Statistics card component
  ├── context/            # React Context providers
  │   └── theme-context.tsx
  ├── lib/                # Utilities and mock data
  │   └── mock-data.ts
  ├── pages/              # Page components
  │   ├── dashboard.tsx
  │   ├── ad-management.tsx
  │   ├── device-management.tsx
  │   ├── device-detail.tsx
  │   ├── playback-control.tsx
  │   ├── analytics.tsx
  │   └── settings.tsx
  └── App.tsx             # Main application component
```

## Mock Data

The application uses comprehensive mock data including:
- 8 sample videos/advertisements
- 8 connected devices
- Playback logs
- System notifications
- Analytics data (30 days)

## Future Enhancements

- Real-time WebSocket connections for live updates
- Video file upload with progress tracking
- Advanced filtering and sorting
- Bulk operations
- User roles and permissions
- Detailed audit logs
- Email notification system
- API integration ready

---

Built with ❤️ using React and Tailwind CSS