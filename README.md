# OrgRide — Corporate Ride Sharing Platform

OrgRide is a corporate ride-sharing web application built on Node.js, Express, TypeScript, Prisma, and Neon PostgreSQL. It features authentication, organization validation, vehicle registration, ride booking, real-time Socket.IO driver tracking, Leaflet maps, and an internal Wallet system supporting Stripe recharges.

---

## Technical Stack
- **Backend**: Node.js, Express, TypeScript, Zod, Socket.IO, Stripe
- **Database**: PostgreSQL (hosted on Neon), Prisma ORM
- **Frontend**: HTML5, Vanilla JavaScript, React Leaflet, OpenStreetMap, OSRM

---

## Installation & Setup

1. **Clone the repository and go to the backend folder**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `backend/` directory (see `.env.example`):
   ```env
   PORT=5000
   DATABASE_URL="postgresql://neondb_owner:...@ep-floral-mouse-...aws.neon.tech/neondb?sslmode=require"
   NODE_ENV=development
   JWT_SECRET="your-super-secret-key"
   CLOUDINARY_CLOUD_NAME="..."
   CLOUDINARY_API_KEY="..."
   CLOUDINARY_API_SECRET="..."
   STRIPE_SECRET_KEY="sk_test_..."
   ```

4. **Initialize Database Tables**:
   Sync models with PostgreSQL:
   ```bash
   npx prisma db push
   ```

5. **Seed Test Accounts**:
   ```bash
   npx prisma db seed
   ```

---

## Running the Application

- **Start in development mode**:
  ```bash
  npm run dev
  ```
- **Build TypeScript into JavaScript**:
  ```bash
  npm run build
  ```
- **Start production bundle**:
  ```bash
  npm run start
  ```

Once the server boots, access the dashboard at:
👉 **[http://localhost:5000/](http://localhost:5000/)**

---

## Verification & Testing

To run the automated end-to-end testing script that validates the Wallet payments, booking states, Socket.IO broadcast tracking events, and the Report system:

```bash
cd backend
node verify-demo-flow.js
```
