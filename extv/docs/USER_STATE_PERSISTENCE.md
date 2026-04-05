# User State Persistence

## Overview

The extv app implements persistent user authentication that survives app restarts and only clears on explicit logout. This is achieved using Zustand with AsyncStorage persistence middleware.

## Architecture

### 1. User Store (`store/userStore.ts`)

The `useUserStore` is a Zustand store that manages:

- **user**: Complete viewer information
- **token**: JWT authentication token
- **loginUser()**: Store both user and token on login
- **logout()**: Clear all user data
- **isAuthenticated()**: Check if user is logged in and active

**Key Features:**

- Persists to AsyncStorage automatically
- Survives app restarts
- Only cleared on explicit logout
- Validates user status (active account only)

### 2. Updated User Interface

The User interface matches the Viewer model returned from the backend:

```typescript
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  vibePreference?: number;
  appUsage?: string;
  isVerified: boolean;
  status: "active" | "suspended" | "banned";
  createdAt?: string;
  updatedAt?: string;
}
```

### 3. Backend Integration

The backend `/viewers/login` endpoint returns complete viewer data:

```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "viewer": {
    "id": "viewer-id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "vibePreference": 50,
    "appUsage": "discovery",
    "isVerified": true,
    "status": "active",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-02T00:00:00Z"
  }
}
```

## Authentication Flow

### Sign In Flow

1. User enters email and password in `SignInScreen`
2. API call to `/viewers/login`
3. Backend validates credentials and returns complete user data
4. `loginUser(viewer, token)` stores both in Zustand store
5. Store automatically persists to AsyncStorage
6. App navigates to Home screen

### Sign Up Flow

1. User enters registration details in `SignUpScreen`
2. API call to `/viewers/register`
3. API call to `/viewers/login` with same credentials
4. Backend returns complete user data
5. `loginUser(viewer, token)` stores both
6. App navigates to Home screen

### Logout Flow

1. User initiates logout
2. `logout()` clears user and token from store
3. AsyncStorage is automatically cleared
4. App navigates back to Landing screen

## Navigation Integration

The app uses `TVNavigationProvider` with an `initialScreen` prop:

```tsx
<TVNavigationProvider initialScreen={user ? "Home" : "Landing"}>
  <ScreenRenderer />
</TVNavigationProvider>
```

**Logic:**

- If `user` exists in store (persisted from previous session) → Start at Home
- If `user` is null (first time or after logout) → Start at Landing

## Usage in Components

### Checking Authentication Status

```tsx
import { useUserStore } from "@/store/userStore";

function MyComponent() {
  const { user, isAuthenticated } = useUserStore();

  if (!isAuthenticated()) {
    return <Text>Please log in</Text>;
  }

  return <Text>Welcome, {user?.firstName}</Text>;
}
```

### Logging Out

```tsx
import { useUserStore } from "@/store/userStore";

function LogoutButton() {
  const { logout } = useUserStore();

  return (
    <Pressable onPress={() => logout()}>
      <Text>Log Out</Text>
    </Pressable>
  );
}
```

### Accessing User Data

```tsx
import { useUserStore } from "@/store/userStore";

function UserProfile() {
  const { user, updateUser } = useUserStore();

  if (!user) return null;

  return (
    <View>
      <Text>
        {user.firstName} {user.lastName}
      </Text>
      <Text>{user.email}</Text>
      <Text>Vibe: {user.vibePreference}</Text>
    </View>
  );
}
```

### Updating User Data

```tsx
const { updateUser } = useUserStore();

// Update specific fields
updateUser({
  vibePreference: 75,
  firstName: "Jane",
});
```

## Persistence Details

### Storage

- **Engine**: AsyncStorage (React Native)
- **Key**: `user-store` (stored in LocalStorage on web)
- **Format**: JSON serialization

### Storage Location

- **Android/iOS**: Device-specific secure storage
- **Web**: Browser LocalStorage

### Lifetime

- **Persists**: App restarts, background suspension, network disconnections
- **Clears**: Explicit logout, app uninstall (Android/iOS)

## Account Status Validation

The `isAuthenticated()` method checks:

1. `user` exists (not null)
2. `token` exists (not null)
3. `user.isVerified` is true (email verified)
4. `user.status === "active"` (not suspended or banned)

This ensures only valid, active accounts can access the app.

## Security Considerations

1. **Token Storage**: JWT token is stored in AsyncStorage alongside user data
2. **No Password Storage**: Passwords are never stored locally
3. **Status Validation**: Account status (suspended/banned) is checked on login
4. **API Integration**: All API calls should include the token in headers

### Recommended: Token Refresh

For enhanced security in production:

```tsx
// Add to your API service
export const apiService = {
  async request(url: string, options: any) {
    const { token } = useUserStore.getState();

    if (token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    // Handle token refresh on 401
    const response = await fetch(url, options);

    if (response.status === 401) {
      // Logout user if token is invalid
      useUserStore.getState().logout();
    }

    return response.json();
  },
};
```

## Troubleshooting

### User data not persisting

- Check AsyncStorage permissions in app.json
- Verify `name: "user-store"` is correct in store config
- Clear app data and try logging in again

### User logged out unexpectedly

- Check if token expired (implement refresh logic)
- Verify account status didn't change
- Check for logout calls in error handlers

### Wrong initial screen on app start

- Verify `user` is being read from store in RootLayout
- Check TVNavigationProvider receives correct initialScreen prop
- Clear AsyncStorage and restart app
