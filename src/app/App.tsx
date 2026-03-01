import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
// import { Toaster } from './components/ui/sonner';
import { Toaster } from 'sonner';
import { ThemeProvider } from './context/theme-context';
import { AuthProvider, useAuth } from './context/auth-context';
import { ProtectedRoute } from './components/protected-route';
import { Sidebar } from './components/sidebar';
import { TopNav } from './components/top-nav';
import { Dashboard } from './pages/dashboard';
import { AdManagement } from './pages/ad-management';
import { DeviceManagement } from './pages/device-management';
import { DeviceDetail } from './pages/device-detail';
import { GroupManagement } from './pages/group-management';
import { PlaybackControl } from './pages/playback-control';
import { Analytics } from './pages/analytics';
import { Settings } from './pages/settings';
import { Notifications } from './pages/notifications';
import { NotFound } from './pages/not-found';
import { Login } from './pages/login';
import { cn } from './components/ui/utils';

function AppContent() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route - Login */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <Login />
          } 
        />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
                {/* Mobile Overlay */}
                {mobileMenuOpen && (
                  <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                  />
                )}
                
                {/* Sidebar */}
                <div className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:block`}>
                  <Sidebar
                    collapsed={sidebarCollapsed}
                    onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                  />
                </div>
                
                <div
                  className={cn(
                    'transition-all duration-300',
                    sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'
                  )}
                >
                  <TopNav onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
                  
                  <main className="pt-16">
                    <div className="p-6 lg:p-8">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/ads" element={<AdManagement />} />
                        <Route path="/devices" element={<DeviceManagement />} />
                        <Route path="/devices/:deviceId" element={<DeviceDetail />} />
                        <Route path="/groups" element={<GroupManagement />} />
                        <Route path="/playback" element={<PlaybackControl />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/notifications" element={<Notifications />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </div>
                  </main>
                </div>
                
                
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
     
    </BrowserRouter>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
         <Toaster position="bottom-right" />
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;