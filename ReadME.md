# Silent Zones Detector

## Overview
A React Native Expo application with Node.js Express backend for managing location-based silent zones. The app allows users to create geofenced zones where their device should automatically enter silent mode.

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
- **Backend (Express API)**: Port 3001

### Backend API Endpoints
- `GET /api/zones` - Fetch all zones
- `POST /api/zones` - Create a new zone
- `PUT /api/zones/:id` - Update a zone
- `DELETE /api/zones/:id` - Delete a zone
- `GET /` - Health check endpoint

### Environment Detection
The frontend automatically detects the Replit environment and uses the correct backend URL:
- **Replit**: `https://3001-<replit-domain>/api/zones`
- **Local**: `http://localhost:3001/api/zones`

## Platform Support
- **Mobile**: Full functionality with geofencing, maps, and location services
- **Web**: Limited functionality - manual zone management via latitude/longitude input (maps not available)

## Key Features
- Create and manage silent zones with custom radius
- View zones on an interactive map (native platforms)
- Background geofencing (native platforms)
- Zone synchronization with backend
- Cross-platform support (iOS, Android, Web)

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
1. **Backend**: `cd backend && npm start` (port 3001)
2. **Frontend**: `cd frontend && npm run web` (port 5000)

## Development Notes
- The app uses AsyncStorage for local zone storage
- Backend provides sync endpoints for multi-device support
- Platform-specific code is handled via `.native.tsx` and `.web.tsx` file extensions
