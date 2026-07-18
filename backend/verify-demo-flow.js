import { PrismaClient } from '@prisma/client';
import { io } from 'socket.io-client';
import { spawn } from 'child_process';
import assert from 'assert';
import 'dotenv/config';

const prisma = new PrismaClient();
const API_BASE = 'http://localhost:5000/api/v1';

async function cleanup() {
  console.log('🧹 Cleaning up database tables...');
  await prisma.report.deleteMany();
  await prisma.walletTransaction.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.rideParticipant.deleteMany();
  await prisma.ride.deleteMany();
  await prisma.vehicle.deleteMany();
}

async function setupUsersAndVehicle() {
  console.log('👤 Configuring users and vehicles...');
  
  // Update employees to bypass first login password reset requirement
  const driver = await prisma.employee.update({
    where: { email: 'admin@acme.com' },
    data: { isFirstLogin: false, status: 'ACTIVE' }
  });
  
  const passenger = await prisma.employee.update({
    where: { email: 'employee@acme.com' },
    data: { isFirstLogin: false, status: 'ACTIVE' }
  });

  // Create default active vehicle for driver
  const vehicle = await prisma.vehicle.create({
    data: {
      ownerId: driver.id,
      vehicleNumber: 'MH12AB9999',
      type: 'SEDAN',
      brand: 'Honda',
      model: 'City',
      color: 'White',
      fuelType: 'PETROL',
      seatingCapacity: 4,
      registrationYear: 2023,
      vehicleImage: 'http://example.com/car.jpg',
      rcNumber: 'RC-99999',
      rcImage: 'http://example.com/rc.jpg',
      insuranceExpiry: new Date('2028-12-31'),
      isDefault: true,
      status: 'ACTIVE',
      verificationStatus: 'VERIFIED'
    }
  });

  return { driver, passenger, vehicle };
}

function startServer() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Spawning backend server...');
    const serverProcess = spawn('node', ['dist/index.js'], {
      stdio: 'pipe',
      env: { ...process.env, PORT: '5000' }
    });

    let started = false;
    serverProcess.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Server is running')) {
        started = true;
        resolve(serverProcess);
      }
    });

    serverProcess.stderr.on('data', (data) => {
      console.error(`[Server Error] ${data.toString()}`);
    });

    setTimeout(() => {
      if (!started) {
        serverProcess.kill();
        reject(new Error('Server start timed out after 8 seconds'));
      }
    }, 8000);
  });
}

// HTTP request wrappers
async function login(email) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ loginId: email, password: 'password123' })
  });
  const json = await res.json();
  assert.ok(json.success, `Login failed for ${email}`);
  return json.data.token;
}

async function createRide(token, vehicleId) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split('T')[0];

  const res = await fetch(`${API_BASE}/rides`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      vehicleId,
      sourceAddress: 'LDRP Institute, Gandhinagar',
      sourceLatitude: 23.2385,
      sourceLongitude: 72.6399,
      destinationAddress: 'GIFT City, Gandhinagar',
      destinationLatitude: 23.1619,
      destinationLongitude: 72.6896,
      pickupDate: dateStr,
      pickupTime: '09:00',
      pricePerSeat: 15.00,
      availableSeats: 3,
      femaleOnly: false
    })
  });
  const json = await res.json();
  assert.ok(json.success, `Ride creation failed: ${JSON.stringify(json)}`);
  return json.data;
}

async function searchRides(token) {
  const res = await fetch(`${API_BASE}/rides/search`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const json = await res.json();
  assert.ok(json.success, 'Ride search failed');
  return json.data;
}

async function bookRide(token, rideId) {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ rideId, seatsBooked: 2 })
  });
  const json = await res.json();
  assert.ok(json.success, `Booking failed: ${JSON.stringify(json)}`);
  return json.data.id;
}

async function acceptBooking(token, bookingId) {
  let retries = 3;
  while (retries > 0) {
    const res = await fetch(`${API_BASE}/bookings/${bookingId}/accept`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const json = await res.json();
    if (json.success) {
      return;
    }
    console.warn(`⚠️ Accept booking attempt failed (retries left: ${retries - 1}): ${JSON.stringify(json)}`);
    retries--;
    if (retries === 0) {
      assert.ok(json.success, `Accept booking failed: ${JSON.stringify(json)}`);
    }
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
}

async function getWallet(token) {
  const res = await fetch(`${API_BASE}/wallet`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const json = await res.json();
  assert.ok(json.success, 'Get wallet failed');
  return json.data;
}

async function confirmRecharge(token, sessionId) {
  const res = await fetch(`${API_BASE}/wallet/recharge/confirm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ sessionId })
  });
  const json = await res.json();
  assert.ok(json.success, `Confirm recharge failed: ${JSON.stringify(json)}`);
  return json.data;
}

async function payBooking(token, bookingId) {
  const res = await fetch(`${API_BASE}/wallet/pay`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ bookingId })
  });
  const json = await res.json();
  assert.ok(json.success, `Pay booking failed: ${JSON.stringify(json)}`);
  return json.data;
}

async function startRide(token, rideId) {
  const res = await fetch(`${API_BASE}/rides/${rideId}/start`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const json = await res.json();
  assert.ok(json.success, `Start ride failed: ${JSON.stringify(json)}`);
  return json.data;
}

async function completeRide(token, rideId) {
  const res = await fetch(`${API_BASE}/rides/${rideId}/complete`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const json = await res.json();
  assert.ok(json.success, `Complete ride failed: ${JSON.stringify(json)}`);
  return json.data;
}

async function fileReport(token, rideId, reportedUserId) {
  const res = await fetch(`${API_BASE}/reports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      rideId,
      reportedUserId,
      category: 'SAFETY',
      description: 'Test safety concern report.'
    })
  });
  const json = await res.json();
  assert.ok(json.success, `File report failed: ${JSON.stringify(json)}`);
  return json.data.id;
}

async function getReportsAdmin(token) {
  const res = await fetch(`${API_BASE}/reports`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const json = await res.json();
  assert.ok(json.success, 'Admin list reports failed');
  return json.data;
}

async function updateReportStatusAdmin(token, reportId, status) {
  const res = await fetch(`${API_BASE}/reports/${reportId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });
  const json = await res.json();
  assert.ok(json.success, `Admin update report status failed: ${JSON.stringify(json)}`);
  return json.data;
}

function verifySocket(rideId) {
  return new Promise((resolve, reject) => {
    console.log('🔌 Connecting Socket.IO client...');
    const client = io('http://localhost:5000');
    
    client.on('connect', () => {
      client.emit('join-ride', { rideId });
    });

    client.on('location-updated', (data) => {
      console.log('📍 Location broadcast verified successfully:', data);
      client.disconnect();
      resolve();
    });

    setTimeout(() => {
      const driverClient = io('http://localhost:5000');
      driverClient.on('connect', () => {
        driverClient.emit('driver-location-update', {
          rideId,
          latitude: 18.52043,
          longitude: 73.856743
        });
        setTimeout(() => driverClient.disconnect(), 200);
      });
    }, 500);

    setTimeout(() => {
      client.disconnect();
      reject(new Error('Socket location-updated event timeout'));
    }, 4000);
  });
}

async function run() {
  let serverProcess;
  try {
    // 1. Prepare Database
    await cleanup();
    const { driver, passenger, vehicle } = await setupUsersAndVehicle();
    await prisma.$disconnect();

    // 2. Start Express / HTTP Server
    serverProcess = await startServer();
    console.log('✅ Server started successfully on port 5000');

    // 3. User Authentication
    console.log('🔑 Authenticating driver and passenger...');
    const driverToken = await login('admin@acme.com');
    const passengerToken = await login('employee@acme.com');

    // 4. Offer Ride
    console.log('🚗 Creating offered ride...');
    const ride = await createRide(driverToken, vehicle.id);
    console.log(`Created Ride: Code: ${ride.rideCode}`);

    // 5. Discover & Book Ride
    console.log('🔍 Searching and booking ride...');
    const searchResults = await searchRides(passengerToken);
    assert.ok(searchResults.length > 0, 'Offered ride not found in search results');
    
    const bookingId = await bookRide(passengerToken, ride.id);
    console.log(`Booking submitted. ID: ${bookingId}`);

    // 6. Driver Accept Booking
    console.log('✅ Accepting booking request...');
    await acceptBooking(driverToken, bookingId);

    // 7. Wallet Recharge
    console.log('💳 Checking wallet & simulating Stripe recharge...');
    const initialWallet = await getWallet(passengerToken);
    assert.strictEqual(Number(initialWallet.balance), 0);
    
    // Simulate successful Stripe payment confirmation via mock confirmation key
    const rechargedWallet = await confirmRecharge(passengerToken, 'mock_session_150');
    console.log(`Recharged Passenger Wallet. New Balance: $${rechargedWallet.balance}`);
    assert.strictEqual(Number(rechargedWallet.balance), 150.00);

    // 8. Passenger Wallet Payment
    console.log('💸 Deducting booking payment from passenger wallet...');
    const payment = await payBooking(passengerToken, bookingId);
    console.log(`Paid booking fare of $${payment.fare}. Remaining passenger balance: $${payment.balance}`);
    assert.strictEqual(payment.fare, 30.00); // 2 seats * $15.00
    assert.strictEqual(payment.balance, 120.00);

    // 9. Socket Real-time Location Tracking Event
    console.log('📡 Starting location event validations...');
    await verifySocket(ride.id);

    // 10. Start Ride
    console.log('🟢 Starting ride...');
    await startRide(driverToken, ride.id);

    // 11. Complete Ride & Credit Earning
    console.log('🏁 Completing ride...');
    const completionResult = await completeRide(driverToken, ride.id);
    console.log(`Ride completed. Credited driver wallet with: $${completionResult.creditedAmount}`);
    assert.strictEqual(completionResult.creditedAmount, 30.00);

    const driverWallet = await getWallet(driverToken);
    console.log(`Driver Wallet Balance: $${driverWallet.balance}`);
    assert.strictEqual(Number(driverWallet.balance), 30.00);

    // 12. File Incident Report
    console.log('⚠️ Filing passenger safety incident report...');
    const reportId = await fileReport(passengerToken, ride.id, driver.id);
    console.log(`Report created successfully. ID: ${reportId}`);

    // 13. Admin Report Status Updates
    console.log('🛡️ Admin reviewing filed reports...');
    const reportsList = await getReportsAdmin(driverToken); // Alice Admin token
    assert.ok(reportsList.some(r => r.id === reportId), 'Incidents report missing from admin logs');

    const updatedReport = await updateReportStatusAdmin(driverToken, reportId, 'RESOLVED');
    console.log(`Updated report ${reportId} status to: ${updatedReport.status}`);
    assert.strictEqual(updatedReport.status, 'RESOLVED');

    console.log('\n🌟🌟🌟 ALL END-TO-END DEMO TEST SCENARIOS PASSED SUCCESSFULLY! 🌟🌟\n');
  } catch (err) {
    console.error('❌ Verification script failed with error:', err);
    process.exitCode = 1;
  } finally {
    if (serverProcess) {
      console.log('🔌 Shutting down Express server...');
      serverProcess.kill();
    }
    await prisma.$disconnect();
  }
}

run();
