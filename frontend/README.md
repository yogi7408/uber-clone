# 🚖 Uber Clone

A full-stack ride-booking application inspired by Uber, built using React.js, Node.js, Express.js, MongoDB, and Socket.IO. The application supports user and captain authentication, ride booking, fare estimation, live location tracking, and ride management.

## ✨ Features

### 👤 User
- User registration and login
- JWT-based authentication
- Search pickup and destination locations
- Get location suggestions
- Calculate estimated ride fares
- Book a ride
- Track captain location during a ride
- Start and manage the ride experience

### 🚘 Captain
- Captain registration and login
- Vehicle details management
- Captain profile and authentication
- Update captain location
- Receive and confirm ride requests
- Start a ride using OTP verification
- Complete a ride

### 🗺️ Maps and Location
- Interactive maps using Leaflet and OpenStreetMap
- Location search using OpenStreetMap-based geocoding
- Distance and travel-time estimation using OSRM
- Live location updates using Socket.IO

## 🛠️ Tech Stack

**Frontend**
- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Leaflet
- React Leaflet
- Socket.IO Client

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- express-validator
- Socket.IO

**Mapping Services**
- OpenStreetMap
- Nominatim
- OSRM

**Development Tools**
- Git
- GitHub
- Postman
- Visual Studio Code
- npm

## 📁 Project Structure

```text
uber-clone/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── services/
│   ├── app.js
│   ├── server.js
│   ├── socket.js
│   ├── .env
│   └── package.json
│
└── README.md
```

*Note: The structure above is representative. Adjust folder and file names to match your actual repository.*

## ⚙️ Prerequisites

Install the following before running the project:

- Node.js and npm
- MongoDB
- Git
- A modern web browser

## 🚀 Installation and Setup

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd uber-clone
```

Replace `<YOUR_GITHUB_REPOSITORY_URL>` with your GitHub repository URL.

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory:

```env
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/uber-clone
JWT_SECRET=your_secure_jwt_secret
```

Add any other environment variables required by your backend code.

Start the backend:

```bash
npm start
```

If your `package.json` does not define a start script, use the appropriate entry file, for example:

```bash
node server.js
```

The backend is expected to run at:

```text
http://localhost:4000
```

### 3. Set up the frontend

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend directory:

```env
VITE_BASE_URL=http://localhost:4000
```

Start the frontend:

```bash
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

## 🔐 Environment Variables

### Backend

| Variable | Description |
|---|---|
| `PORT` | Backend server port |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used for JWT authentication |

### Frontend

| Variable | Description |
|---|---|
| `VITE_BASE_URL` | Backend API base URL |

Your application may require additional environment variables depending on its implementation.

**Important:** Never commit `.env` files, JWT secrets, database credentials, or other private keys to GitHub.

## 🔌 API Documentation

Base URL for local development:

```text
http://localhost:4000
```

The endpoint paths below assume that the Express application mounts the routers at `/users`, `/captains`, `/maps`, and `/rides`.

Protected endpoints require the appropriate authenticated user or captain session/token, as implemented by the backend.

### 👤 User APIs

Base path: `/users`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/users/register` | Register a new user |
| POST | `/users/login` | Log in a user |
| GET | `/users/profile` | Get user profile |
| GET | `/users/logout` | Log out a user |

#### Register a user

```http
POST /users/register
Content-Type: application/json
```

Example body:

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

Validation requires a valid email, a first name of at least 3 characters, and a password of at least 6 characters.

#### Log in a user

```http
POST /users/login
Content-Type: application/json
```

Example body:

```json
{
  "email": "avery@example.com",
  "password": "secure123"
}
```

### 🚘 Captain APIs

Base path: `/captains`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/captains/register` | Register a captain |
| POST | `/captains/login` | Log in a captain |
| GET | `/captains/profile` | Get captain profile |
| PATCH | `/captains/update-location` | Update captain location |
| GET | `/captains/logout` | Log out a captain |

Captain registration validates email, name fields, password, vehicle color, vehicle plate, vehicle capacity, and vehicle type.

Accepted vehicle types in the registration route are `car`, `motorcycle`, and `auto`.

### 🗺️ Map APIs

Base path: `/maps`

All listed map endpoints require user authentication.

| Method | Endpoint | Required parameters |
|---|---|---|
| GET | `/maps/get-coordinates` | `address` |
| GET | `/maps/get-distance-time` | `origin`, `destination` |
| GET | `/maps/get-suggestions` | `input` |

Example requests:

```http
GET /maps/get-coordinates?address=Ayodhya
GET /maps/get-distance-time?origin=Ayodhya&destination=Lucknow
GET /maps/get-suggestions?input=Ayodhya
```

Query values must be at least 3 characters long. Invalid requests return HTTP `400` with validation errors.

### 🚕 Ride APIs

Base path: `/rides`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/rides/create` | Create a ride request |
| GET | `/rides/get-fare` | Calculate estimated fare |
| POST | `/rides/confirm` | Confirm a ride |
| GET | `/rides/start-ride` | Start a ride using OTP |
| POST | `/rides/end-ride` | Complete a ride |

#### Create a ride

```http
POST /rides/create
Content-Type: application/json
```

Example body:

```json
{
  "pickup": "Ayodhya",
  "destination": "Lucknow",
  "vehicleType": "car"
}
```

The `pickup` and `destination` fields must be strings of at least 3 characters. The accepted ride vehicle types are `auto`, `car`, and `moto`.

#### Get fare

```http
GET /rides/get-fare?pickup=Ayodhya&destination=Lucknow
```

Both query parameters are required.

#### Confirm a ride

```http
POST /rides/confirm
Content-Type: application/json
```

Example body:

```json
{
  "rideId": "<mongo-ride-id>"
}
```

This endpoint requires captain authentication.

#### Start a ride

```http
GET /rides/start-ride?rideId=<mongo-ride-id>&otp=<six-digit-otp>
```

This endpoint requires captain authentication. The ride ID must be a valid MongoDB ObjectId, and the OTP must be a 6-character string.

#### End a ride

```http
POST /rides/end-ride
Content-Type: application/json
```

Example body:

```json
{
  "rideId": "<mongo-ride-id>"
}
```

This endpoint requires captain authentication.

## 📍 Real-Time Location Tracking

The application uses Socket.IO to support real-time communication and location updates.

- Socket.IO Client connects the frontend to the backend.
- Captains can send location updates while a ride is active.
- Ride participants can receive location updates when the corresponding socket events and room membership are configured.
- Leaflet displays the map, markers, and route-related information.
- OpenStreetMap provides map tiles.
- Nominatim is used for geocoding and location search.
- OSRM is used for route distance and travel-time estimates.

Availability and rate limits of external mapping services may affect location search and routing.

## 🧪 Testing with Postman

You can test the backend endpoints using Postman.

1. Start MongoDB and the backend server.
2. Register a user or captain.
3. Log in and obtain the authentication token or session used by your backend.
4. Configure the required authentication for protected endpoints.
5. Send requests with the HTTP methods and parameters documented above.
6. Check the response status and validation messages.

Use valid MongoDB ObjectIds when testing ride confirmation, ride start, and ride completion.

## 🛡️ Security Notes

- Keep secrets and credentials in environment variables.
- Never push `.env` files to GitHub.
- Validate request data on the server.
- Use secure password hashing.
- Protect private endpoints with authentication middleware.
- Avoid sharing JWT tokens or database credentials in screenshots or public repositories.

## 🐛 Troubleshooting

### MongoDB connection error

- Ensure MongoDB is installed and running.
- Check the `MONGO_URI` value in the backend `.env`.
- Confirm that the database host and port are correct.

### Frontend cannot connect to backend

- Confirm that the backend is running on port `4000`.
- Verify `VITE_BASE_URL` in the frontend `.env`.
- Restart the Vite server after changing environment variables.
- Check backend CORS configuration.

### Map or location search not working

- Check your internet connection.
- Verify that the mapping service endpoints are reachable.
- Check the browser console and backend terminal for errors.
- Be aware that public geocoding and routing services can have usage limits.

### Authentication errors

- Confirm that you are logged in with the correct user or captain account.
- Send the authentication token or cookie expected by your middleware.
- Check token expiry and backend authentication configuration.

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test your changes locally.
5. Submit a pull request.

## 📄 License

Add a license to the repository if you intend to distribute or reuse this project. If you choose the MIT License, include a `LICENSE` file containing the appropriate license text.

---

**Built as a full-stack learning project to explore ride booking, authentication, mapping, and real-time communication.**
