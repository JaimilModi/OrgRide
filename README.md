# 🚘 OrgRide — Corporate Ride Sharing Platform

OrgRide is a corporate ride-sharing platform designed to make daily employee commuting more connected, convenient, and efficient.

The platform enables verified employees within an organisation to offer rides, discover available rides, manage bookings, make wallet-based payments, and track active journeys in real time.

OrgRide is powered by a TypeScript-based Node.js backend with PostgreSQL, Prisma ORM, Socket.IO real-time communication, map integration, and an internal wallet system with Stripe recharge support.

---

## ✨ Key Features

### 🔐 Authentication & Organisation Validation

- Secure employee authentication
- JWT-based protected routes
- Organisation-based employee validation
- Role-based access control
- Employee and administrator roles
- Protected backend APIs

### 🚗 Vehicle Management

Drivers can register and manage their vehicles, including relevant vehicle information and documentation.

The vehicle workflow supports the foundation required for verified employees to offer rides through the platform.

### 🔎 Ride Discovery

Employees looking for a ride can search available journeys based on their commute requirements.

Ride information can include:

- Source
- Destination
- Pickup date and time
- Available seats
- Price per seat
- Driver and vehicle information

### 🛣️ Ride Management

Drivers can create and manage rides while defining their route and ride availability.

The system supports the complete ride lifecycle from ride creation to journey completion.

### 🎫 Booking System

Passengers can request seats on available rides, while drivers can manage incoming booking requests.

The booking workflow supports different booking states and allows users to manage their rides through a structured process.

```text
Find Ride
    ↓
Request Seat
    ↓
Driver Reviews Request
    ↓
Accept / Reject
    ↓
Payment
    ↓
Start Ride
    ↓
Complete Journey
```

### 💳 Internal Wallet System

OrgRide includes an integrated wallet system for ride-related payments.

Features include:

- Wallet balance
- Wallet transaction history
- Wallet recharge
- Stripe-powered recharge flow
- Booking payments
- Payment transaction records

### 📍 Maps & Route Visualisation

OrgRide integrates map-based functionality for ride locations and routes.

The current implementation uses:

- Leaflet
- OpenStreetMap
- OSRM

The ride data model supports geographic coordinates for source and destination locations, enabling route visualisation and location-aware ride functionality.

### 🛰️ Real-Time Driver Tracking

OrgRide uses **Socket.IO** for real-time communication and driver tracking.

The real-time architecture supports broadcasting driver location updates during active rides, allowing connected clients to receive journey location events.

### 🚨 Reporting System

Users can report ride-related or user-related issues through the platform.

The reporting system provides the foundation for administrative review and improved accountability within the corporate ride-sharing network.

### 🛡️ Administration

OrgRide includes administrative functionality for managing and monitoring the platform.

Depending on the configured permissions, administrators can manage organisation-level operations and monitor platform activity.

---

## 🛠️ Technical Stack

### Backend

- Node.js
- Express.js
- TypeScript
- Zod
- Socket.IO
- Stripe
- JWT Authentication

### Database

- PostgreSQL
- Neon
- Prisma ORM

### Frontend

The current working prototype uses:

- HTML5
- Vanilla JavaScript
- Leaflet.js
- OpenStreetMap
- OSRM

> The frontend architecture may be migrated to a modern component-based framework as the project evolves while preserving the existing backend functionality.

### Cloud & External Services

- Neon PostgreSQL
- Cloudinary
- Stripe
- OpenStreetMap
- OSRM

---

## 🏗️ Core Platform Flow

```text
                         ┌──────────────────────┐
                         │    Authentication    │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ Organisation Access  │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
             ┌─────────────┐                 ┌─────────────┐
             │ Find a Ride │                 │ Offer Ride  │
             └──────┬──────┘                 └──────┬──────┘
                    │                               │
                    ▼                               ▼
             Search Available                Create & Manage
                  Rides                           Rides
                    │                               │
                    └───────────────┬───────────────┘
                                    │
                                    ▼
                             Request a Seat
                                    │
                                    ▼
                          Driver Reviews Request
                              │             │
                              ▼             ▼
                           Accept         Reject
                              │
                              ▼
                         Wallet Payment
                              │
                              ▼
                           Start Ride
                              │
                              ▼
                     Real-Time Ride Tracking
                              │
                              ▼
                        Complete Journey
```

---

## 🚀 Installation & Setup

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- Access to a PostgreSQL database or Neon project

---

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <repository-name>
```

### 2. Go to the Backend Directory

```bash
cd backend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the `backend/` directory.

You can use `.env.example` as the reference.

```env
PORT=5000

DATABASE_URL="your-neon-postgresql-connection-string"

NODE_ENV=development

JWT_SECRET="your-secure-jwt-secret"

CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"

STRIPE_SECRET_KEY="your-stripe-secret-key"
```

> ⚠️ Never commit real database credentials, JWT secrets, Cloudinary credentials, Stripe keys, or other private credentials to the repository.

### 5. Generate the Prisma Client

```bash
npx prisma generate
```

### 6. Initialise the Database

Synchronise the Prisma schema with PostgreSQL:

```bash
npx prisma db push
```

### 7. Seed Test Accounts

```bash
npx prisma db seed
```

---

## ▶️ Running the Application

### Development Mode

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Start Production Build

```bash
npm run start
```

Once the server starts, open:

`http://localhost:5000/`

---

## 🧪 Verification & Testing

OrgRide includes an automated end-to-end verification flow for testing major backend functionality.

Run:

```bash
cd backend
node verify-demo-flow.js
```

The verification flow validates important functionality including:

- Wallet operations
- Payment flows
- Booking state transitions
- Socket.IO tracking events
- Reporting functionality

---

## 🔄 Main Ride Workflow

### For Riders

1. Sign in with an authorised employee account.
2. Search for available rides.
3. Review ride and route information.
4. Request a seat.
5. Wait for driver approval.
6. Complete the required wallet payment.
7. Join the ride.
8. Follow the active journey where tracking is available.

### For Drivers

1. Sign in with an authorised employee account.
2. Register vehicle information.
3. Create a ride.
4. Define the source, destination and ride details.
5. Review passenger booking requests.
6. Accept or reject requests.
7. Start the ride.
8. Share real-time location updates during the journey.
9. Complete the ride.

---

## 🔒 Security

The backend architecture includes:

- JWT authentication
- Password hashing
- Protected API routes
- Role-based access control
- Zod request validation
- Environment-based secret management
- Organisation-aware access

Additional production security controls should be configured before a public deployment.

---

## 🎯 Project Vision

OrgRide is built around a simple idea:

> **People working together can commute together.**

Instead of operating as an unrestricted public taxi marketplace, OrgRide focuses on building a trusted corporate commuting ecosystem where employees can discover compatible journeys within their organisational network.

The platform aims to make workplace commuting:

- More convenient
- More connected
- More affordable
- More organised
- More resource-efficient

---

## 🔮 Future Enhancements

Potential future improvements include:

- Advanced route matching
- Recurring commute scheduling
- Smarter ride recommendations
- Enhanced live GPS tracking
- Push notifications
- Enterprise mobility analytics
- Carbon savings insights
- Mobile applications
- Advanced safety features

---

## 📄 Project Status

OrgRide is currently under active development.

The core prototype includes the backend infrastructure and major functional workflows required for corporate ride sharing, including ride management, booking workflows, wallet payments, map functionality, real-time tracking, and reporting.

---

## 👥 Team

Developed as part of the **Odoo × KSV 2026 Grand Finale**.

---

<p align="center">
  <strong>OrgRide</strong><br>
  Corporate commuting, better connected.
</p>
