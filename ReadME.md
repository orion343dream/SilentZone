# SilentZone Pro

## Overview
A professional Android mobile application with Node.js Express backend for managing location-based silent zones. The app allows users to create geofenced zones where their device automatically enters silent mode, featuring GPS tracking, background location monitoring, and device vibration control.

## Project Structure
```
├── backend/          # Express.js API server
│   ├── server.js     # Main server file with CRUD endpoints
│   └── package.json  # Backend dependencies
├── frontend/         # Expo React Native app
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── screens/       # App screens
│   │   ├── services/      # API and service layer
│   │   ├── types/         # TypeScript type definitions
│   │   └── constants/     # App constants
│   ├── App.tsx            # Main app component
│   └── package.json       # Frontend dependencies
└── .gitignore
```

## Technology Stack
- **Frontend**: Expo (React Native), TypeScript, React Navigation
- **Backend**: Node.js, Express.js
- **Storage**: AsyncStorage (local), REST API (sync)
- **Maps**: React Native Maps (native only)

## Setup & Configuration

### Ports
- **Frontend (Expo Web)**: Port 5000
- **Backend (Express API)**: Port 3000

### Backend API Endpoints
- `GET /api/zones` - Fetch all zones
- `POST /api/zones` - Create a new zone
- `PUT /api/zones/:id` - Update a zone
- `DELETE /api/zones/:id` - Delete a zone
- `GET /` - Health check endpoint

### Environment Detection
The frontend automatically detects the Replit environment and uses the correct backend URL:
- **Replit**: `https://3000-<replit-domain>/api/zones`
- **Local**: `http://localhost:3000/api/zones`

## Platform Support
- **Android Mobile**: Full functionality with GPS tracking, geofencing, background location monitoring, silent mode control, and vibration management
- **Web**: Limited functionality - zone management only (no GPS tracking or device control)

## Key Features
- **GPS Location Tracking**: Continuous background GPS monitoring
- **Geofencing**: Automatic zone detection and silent mode activation
- **Device Control**: Silent mode and vibration management
- **Background Services**: Location monitoring even when app is closed
- **Zone Management**: Create, edit, and manage multiple silent zones
- **Real-time Monitoring**: Instant notifications when entering/leaving zones
- **User Authentication**: Secure login and registration system
- **Data Synchronization**: Zone data sync across devices

## Recent Changes (October 2025)
- Configured for Replit environment
- Added CORS support for API
- Created platform-specific map wrappers to avoid native module imports on web
- Fixed backend URL detection for Replit domains
- Set up proper workflows for both frontend and backend

## Known Limitations
- Geofencing only works on native platforms (iOS/Android)
- Maps are not available on web (fallback to manual lat/long input)
- Silent mode toggling requires native modules (not available in Expo managed workflow)
- **Backend storage is in-memory** - zones are lost on server restart (production would need database)
- Native app builds would need environment configuration to point to deployed backend URL

## Running the Project
The project automatically starts both workflows:
1. **Backend**: `cd backend && npm start` (port 3000)
2. **Frontend**: `cd frontend && npm run web` (port 5000)

## Development Notes
- The app uses AsyncStorage for local zone storage
- Backend provides sync endpoints for multi-device support
- Platform-specific code is handled via `.native.tsx` and `.web.tsx` file extensions
