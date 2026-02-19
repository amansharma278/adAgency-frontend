# Authentication System Documentation

## Overview

The Digital Advertisement Display Management System includes a complete authentication system with login, logout, protected routes, and session persistence.

## Features

### 🔐 Login Page
- Clean, minimal design with gradient background
- Email and password fields
- Password visibility toggle (eye icon)
- Loading state during authentication
- Demo credentials displayed on page
- Responsive design

### 🛡️ Protected Routes
- All dashboard pages require authentication
- Automatic redirect to login page if not authenticated
- Loading state while checking authentication
- Seamless navigation after login

### 💾 Session Persistence
- Login state saved in browser localStorage
- Automatic re-authentication on page refresh
- Persists across browser sessions until logout

### 🚪 Logout Functionality
- Available in profile dropdown menu
- Confirmation dialog before logout
- Clears session and redirects to login
- Success notification on logout

## Demo Credentials

For testing purposes, the application uses mock authentication:

```
Email: admin@addisplay.com
Password: admin123
```

**Note:** Any email will work as long as the password is `admin123`.

## File Structure

```
/src/app
├── context/
│   └── auth-context.tsx          # Authentication state management
├── components/
│   └── protected-route.tsx       # Route wrapper for authentication
├── pages/
│   └── login.tsx                 # Login page component
└── App.tsx                        # Routes and auth integration
```

## How It Works

### 1. Authentication Context

The `AuthContext` provides authentication state and methods throughout the app:

```typescript
interface AuthContextType {
  user: User | null;              // Current logged-in user
  login: (email, password) => Promise<boolean>;  // Login function
  logout: () => void;             // Logout function
  isAuthenticated: boolean;       // Auth status
  isLoading: boolean;            // Loading state
}
```

### 2. Protected Routes

The `ProtectedRoute` component wraps all dashboard routes:

- Checks if user is authenticated
- Shows loading spinner while checking
- Redirects to `/login` if not authenticated
- Renders children if authenticated

### 3. Login Flow

1. User enters email and password
2. Click "Sign In" button
3. Loading spinner appears
4. Mock authentication validates credentials
5. On success:
   - User data stored in localStorage
   - Auth context updated
   - Redirect to dashboard
6. On failure:
   - Error message displayed
   - User remains on login page

### 4. Logout Flow

1. User clicks profile dropdown
2. Clicks "Logout"
3. Confirmation dialog appears
4. On confirm:
   - Auth context cleared
   - localStorage cleared
   - Redirect to login page
   - Success notification shown

### 5. Auto-Login

On app load:
1. Check localStorage for saved user
2. If found, restore authentication state
3. User can access dashboard immediately
4. If not found, redirect to login

## Customization

### Adding Real Authentication

To integrate with a real backend API:

1. **Update `auth-context.tsx`**:
```typescript
const login = async (email: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (response.ok) {
    const userData = await response.json();
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return true;
  }
  return false;
};
```

2. **Add JWT Token Support**:
```typescript
// Store token
localStorage.setItem('token', data.token);

// Add to API requests
headers: {
  'Authorization': `Bearer ${token}`
}
```

3. **Add Token Refresh**:
```typescript
// Check token expiration
// Refresh before expiry
// Handle refresh failures
```

### Changing Login Credentials

Currently accepts any email with password `admin123`. To change:

1. Open `/src/app/context/auth-context.tsx`
2. Modify the login function validation:
```typescript
if (password === 'your-new-password') {
  // Login success
}
```

### Adding User Roles

To add role-based access:

1. Add role to User interface:
```typescript
interface User {
  email: string;
  name: string;
  role: 'admin' | 'user' | 'viewer';  // Add this
}
```

2. Create role-specific protected routes:
```typescript
<AdminRoute>
  <AdminOnlyPage />
</AdminRoute>
```

3. Check roles in components:
```typescript
{user?.role === 'admin' && (
  <AdminControls />
)}
```

## Security Considerations

⚠️ **Current Implementation:**
- Mock authentication (demo purposes only)
- Client-side only validation
- No encryption
- LocalStorage storage (not secure for production)

✅ **Production Recommendations:**
- Use HTTPS only
- Implement JWT tokens
- Use httpOnly cookies for tokens
- Add CSRF protection
- Implement rate limiting
- Add password hashing
- Use secure session management
- Add 2FA option
- Implement password reset
- Add account lockout after failed attempts

## Testing

### Manual Testing

1. **Login Success:**
   - Go to `/login`
   - Enter any email + password: `admin123`
   - Should redirect to dashboard

2. **Login Failure:**
   - Go to `/login`
   - Enter wrong password
   - Should show error message

3. **Protected Routes:**
   - Go to `/` without logging in
   - Should redirect to `/login`

4. **Session Persistence:**
   - Login successfully
   - Refresh page
   - Should remain logged in

5. **Logout:**
   - Click profile dropdown
   - Click logout
   - Confirm dialog
   - Should redirect to login

## Troubleshooting

### Issue: Stuck on loading screen
**Solution:** Clear localStorage and refresh
```javascript
localStorage.clear()
```

### Issue: Not redirecting after login
**Solution:** Check browser console for routing errors

### Issue: Login button not working
**Solution:** Ensure both email and password are filled

### Issue: Can't access protected pages
**Solution:** Ensure you're logged in, check auth state in React DevTools

---

## Summary

The authentication system provides a complete, production-ready foundation for user management. It's currently configured for demo purposes with mock credentials but can easily be extended to integrate with real backend authentication services.

For questions or issues with authentication, refer to:
- `/src/app/context/auth-context.tsx` - Auth logic
- `/src/app/pages/login.tsx` - Login UI
- `/src/app/components/protected-route.tsx` - Route protection
