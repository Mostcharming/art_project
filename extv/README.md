# CARSL TV - Android TV Application

This is an [Expo](https://expo.dev) project optimized for **Android TV platforms** with remote control support.

## Quick Start

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start development server**

   ```bash
   npm start
   ```

3. **Run on Android TV**
   ```bash
   npm run android
   ```

## What Changed for TV

This project has been converted from a mobile (iOS/Android) app to an **Android TV-only** application:

### ✅ Changes Made

- **Removed iOS, Web, and non-TV Android support**
- **Removed all pages except Splash1** (main landing page)
- **Landscape-only orientation** (TV standard)
- **TV-optimized layouts** with proper safe zones
- **Large typography** for 10+ foot viewing distance
- **Focus-based navigation** with remote control support
- **TV-specific color scheme** (high contrast, reduced burn-in)
- **Custom TV components** (TVButton with focus states)

### 📱 Pages

- `app/(tabs)/index.tsx` - Loading screen (4-second splash)
- `app/splash/splash1.tsx` - Main welcome screen
- Removed: dashboard, profile, settings, tags, carousels, auth flows, etc.

### 🎮 Remote Control Support

- **D-Pad Navigation**: Up/Down/Left/Right to navigate
- **Select/Enter**: Center button or Enter key to activate
- **Back**: Go back or exit
- **Home**: Return to home screen

## Important Files

- **TV_DEVELOPMENT_GUIDE.md** - Comprehensive guide for TV development
- **constants/tv.ts** - TV layout, typography, spacing, and colors
- **components/TVButton.tsx** - TV-optimized button component
- **hooks/useTVRemote.ts** - Remote control handling

## Configuration

### Current Setup

```json
{
  "orientation": "landscape",
  "platforms": ["android"],
  "isTV": true
}
```

### What Was Removed

- iOS configuration
- Web configuration
- Non-TV Android features
- Bottom navigation
- Mobile-specific components
- All multi-page navigation flows

## Project Structure

```
extv/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx       # Loading screen
│   │   └── _layout.tsx     # Tab layout (TV)
│   ├── splash/
│   │   └── splash1.tsx     # Main splash screen
│   └── _layout.tsx         # Root layout
├── components/
│   ├── TVButton.tsx        # TV button with focus
│   └── ...
├── constants/
│   ├── tv.ts              # TV sizes, colors, spacing
│   └── ...
├── hooks/
│   ├── useTVRemote.ts     # Remote control hook
│   └── ...
└── TV_DEVELOPMENT_GUIDE.md
```

## Development

### Start Dev Server

```bash
npm start
```

### Run on Android TV Emulator

```bash
npm run android
```

### Build APK for Deployment

```bash
eas build --platform android
```

## Resources

- [TV_DEVELOPMENT_GUIDE.md](./TV_DEVELOPMENT_GUIDE.md) - Full TV development guide
- [Expo Documentation](https://docs.expo.dev/)
- [Android TV Design Guide](https://developer.android.com/training/tv/start)
- [React Native TV OS](https://github.com/react-native-tvos/react-native-tvos)

## Notes

- **Landscape only**: All screens are landscape orientation
- **Remote navigation**: Use D-Pad instead of touch
- **No multi-page flows**: Only splash screen currently implemented
- **Android TV only**: Not compatible with iOS or mobile Android

For detailed TV development information, see [TV_DEVELOPMENT_GUIDE.md](./TV_DEVELOPMENT_GUIDE.md)
