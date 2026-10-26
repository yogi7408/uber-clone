# Uber Clone Backend

Express API and Socket.IO server for the Uber Clone ride-booking application.

## Features
- User registration, login, profile and logout
- Captain authentication and vehicle details
- Captain location updates
- Location lookup and autocomplete
- Fare estimation and ride creation
- Ride confirmation, OTP-based start and completion
- Real-time ride notifications through Socket.IO

## Tech Stack
- Node.js and Express.js
- MongoDB and Mongoose
- JWT authentication
- bcrypt
- express-validator
- Socket.IO
- OpenStreetMap-based services: Nominatim, Photon and OSRM

## Requirements
- Node.js and npm
- A reachable MongoDB database

## Configuration
Create `backend/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/uber-clone
JWT_SECRET=replace-with-a-long-random-secret
PORT=4000
```

`MONGO_URI` and `JWT_SECRET` are required. `PORT` is optional and defaults to `4000`. Keep real credentials out of source control.

## Run Locally

From the repository root, start the backend:

```bash
cd backend
npm install
node server.js
```

The API and Socket.IO server run on the configured port, normally `http://localhost:4000`. Start the frontend separately and set `VITE_BASE_URL` in `frontend/.env` if the backend is not at that default URL.

## API Endpoints
Base URL: `http://localhost:4000`. Protected endpoints accept the token in a cookie or an `Authorization` bearer header.

### Users
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/users/register` | No | Register a user. Requires `fullName.firstName` (minimum 3 characters), valid `email`, and `password` (minimum 6 characters). |
| POST | `/users/login` | No | Log in with email and password. |
| GET | `/users/profile` | User | Get the authenticated user's profile. |
| GET | `/users/logout` | User | Blacklist the current token and clear the cookie. |

Example user registration body:

```json
{
  "fullName": {
    "firstName": "Avery",
    "lastName": "Morgan"
  },
  "email": "avery@example.com",
  "password": "secure123"
}
```

### Captains
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/captains/register` | No | Register a captain and vehicle. |
| POST | `/captains/login` | No | Log in a captain. |
| GET | `/captains/profile` | Captain | Get the authenticated captain's profile. |
| PATCH | `/captains/update-location` | Captain | Update latitude (`ltd`) and longitude (`lng`); marks the captain active. |
| GET | `/captains/logout` | Captain | Blacklist the current token and clear the cookie. |

Captain registration requires `fullName`, `email`, `password`, and `vehicle` fields (`color`, `plate`, `capacity`, and `vehicleType`). Captain vehicle types are `car`, `motorcycle`, and `auto`.

### Maps
| Method | Endpoint | Query parameters | Description |
|---|---|---|---|
| GET | `/maps/get-coordinates` | `address` | Resolve an address to coordinates. |
| GET | `/maps/get-distance-time` | `origin`, `destination` | Calculate driving distance and estimated duration. |
| GET | `/maps/get-suggestions` | `input` | Return location suggestions. |

Map endpoints require user authentication. Text parameters must be at least 3 characters long.

### Rides
| Method | Endpoint | Auth | Parameters |
|---|---|---|---|
| POST | `/rides/create` | User | JSON: `pickup`, `destination`, `vehicleType` |
| GET | `/rides/get-fare` | User | Query: `pickup`, `destination` |
| POST | `/rides/confirm` | Captain | JSON: `rideId` |
| GET | `/rides/start-ride` | Captain | Query: `rideId`, `otp` |
| POST | `/rides/end-ride` | Captain | JSON: `rideId` |

Ride and fare vehicle types are `auto`, `car`, and `moto`. The OTP to start a ride is 6 characters.

## Authentication
Registration and login return a JWT in the response body; login also sets a `token` cookie. Protected routes accept that cookie or the JWT as a bearer token. JWTs expire after 24 hours, and logout blacklists the presented token.

```http
Authorization: Bearer <jwt-token>
```

## Socket.IO

Connect to the backend origin, then join as the authenticated account:

```js
socket.emit('join', { userId: '<account-id>', userType: 'user' });
```

Use `userType: 'captain'` for a captain. The server emits `new-ride` to nearby captains and sends `ride-confirmed`, `ride-started`, and `ride-ended` events to the user.

## Maps and Routing
- Nominatim for geocoding
- Photon for autocomplete suggestions
- OSRM for route distance and estimated duration

These public services do not require an API key in this project and may impose usage limits or availability constraints.

## Security
- Never commit `.env` files.
- Use a strong JWT secret.
- Validate requests and protect private routes.
- Never publish tokens or database credentials.

## Testing
No automated backend test suite is configured yet. Endpoints can be exercised with an API client using the request methods, bodies, query parameters, and authentication described above.

## License
No license is specified. Add a LICENSE file if you intend to distribute this project under a particular license.
