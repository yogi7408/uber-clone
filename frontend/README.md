# Uber Clone Frontend

React.js and Vite frontend for the Uber Clone ride-booking application.

## Features
- User and captain registration and login
- Pickup and destination search
- Location autocomplete and fare estimation
- Ride booking and confirmation interface
- Captain dashboard and ride management
- OTP-based ride start flow
- Interactive maps with Leaflet and OpenStreetMap
- Real-time communication with Socket.IO Client

## Tech Stack
- React.js, Vite
- Tailwind CSS
- React Router DOM
- Axios
- Leaflet and React Leaflet
- Socket.IO Client

## Requirements
- Node.js and npm
- A running Uber Clone backend

## Setup
From the project root:

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
VITE_BASE_URL=http://localhost:4000
```

Start the development server:

```bash
npm run dev
```

Open the local URL shown by Vite, usually http://localhost:5173.

## Available Scripts
```bash
npm run dev
npm run build
npm run preview
```

## Backend Integration
The frontend communicates with the backend through `VITE_BASE_URL`.

Main API groups:
- `/users`
- `/captains`
- `/maps`
- `/rides`

Protected requests must use the authentication method expected by the backend.

## Maps and Location
- OpenStreetMap for map tiles
- Nominatim for geocoding
- OSRM for routing and travel-time estimates
- Socket.IO Client for real-time events

## Troubleshooting
- Check `VITE_BASE_URL` if API requests fail.
- Restart Vite after changing `.env`.
- Ensure the backend is running and CORS allows the frontend origin.
- Check Leaflet CSS and map container height if the map is not visible.
- Verify Socket.IO event names and connection status if live updates fail.

## Security
Do not put private API secrets or credentials in frontend environment variables. Variables prefixed with `VITE_` are exposed to the browser.

## License
Add a LICENSE file if you intend to distribute this project under a specific license.
