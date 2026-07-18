import assert from 'assert';
import { PrismaClient } from '@prisma/client';

const API_BASE = 'http://localhost:5000/api/v1';
const prisma = new PrismaClient();

async function testRides() {
  console.log('🧪 Starting Phase 5 Ride Module Verification Tests...');

  // Reset database state
  console.log('\nResetting Bob\'s password and login state via Prisma...');
  const bcrypt = await import('bcrypt');
  const tempHash = await bcrypt.default.hash('password123', 10);
  await prisma.employee.update({
    where: { email: 'employee@acme.com' },
    data: {
      passwordHash: tempHash,
      isFirstLogin: true,
      status: 'ACTIVE'
    }
  });

  const org = await prisma.organization.findFirst();
  assert.ok(org);

  // Bob: Active employee
  const bob = await prisma.employee.findUnique({ where: { email: 'employee@acme.com' } });
  assert.ok(bob);

  // Diana: Suspended employee
  const diana = await prisma.employee.findUnique({ where: { email: 'diana@acme.com' } });
  assert.ok(diana);

  // Log in Bob (temp login)
  console.log('Logging in Bob (Employee) first login...');
  const bobTempRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ loginId: 'employee@acme.com', password: 'password123' })
  });
  assert.strictEqual(bobTempRes.status, 200);
  const bobTempData = await bobTempRes.json();
  const bobTempToken = bobTempData.data.token;

  // Reset Bob's password
  console.log('Resetting Bob\'s password...');
  const bobResetRes = await fetch(`${API_BASE}/auth/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bobTempToken}`
    },
    body: JSON.stringify({ oldPassword: 'password123', newPassword: 'newpassword123' })
  });
  assert.strictEqual(bobResetRes.status, 200);

  // Login Bob with new password
  console.log('Logging in Bob with new password...');
  const bobRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ loginId: 'employee@acme.com', password: 'newpassword123' })
  });
  assert.strictEqual(bobRes.status, 200);
  const bobData = await bobRes.json();
  const bobToken = bobData.data.token;

  // Log in Alice (Admin)
  console.log('Logging in Alice (Admin)...');
  const aliceRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ loginId: 'admin@acme.com', password: 'password123' })
  });
  assert.strictEqual(aliceRes.status, 200);
  const aliceData = await aliceRes.json();
  const aliceToken = aliceData.data.token;

  // Clean old rides & vehicles of Bob
  await prisma.ride.deleteMany();
  await prisma.vehicle.deleteMany();

  // Create Verified owned vehicle for Bob (Capacity: 4)
  console.log('Registering verified active vehicle for Bob...');
  const vBob = await prisma.vehicle.create({
    data: {
      ownerId: bob.id,
      vehicleNumber: 'MH12BOB444',
      type: 'SEDAN',
      brand: 'Maruti',
      model: 'Swift',
      color: 'Blue',
      fuelType: 'CNG',
      seatingCapacity: 4,
      registrationYear: 2022,
      vehicleImage: 'http://cloudinary.com/swift.jpg',
      rcNumber: 'RC-BOB444',
      rcImage: 'http://cloudinary.com/rc-bob.jpg',
      insuranceExpiry: new Date('2028-01-01T00:00:00Z'),
      status: 'ACTIVE',
      verificationStatus: 'VERIFIED'
    }
  });

  // Create Unverified vehicle for Bob
  const vBobUnverified = await prisma.vehicle.create({
    data: {
      ownerId: bob.id,
      vehicleNumber: 'MH12BOB777',
      type: 'SEDAN',
      brand: 'Maruti',
      model: 'Swift',
      color: 'Blue',
      fuelType: 'CNG',
      seatingCapacity: 4,
      registrationYear: 2022,
      vehicleImage: 'http://cloudinary.com/swift.jpg',
      rcNumber: 'RC-BOB777',
      rcImage: 'http://cloudinary.com/rc-bob.jpg',
      insuranceExpiry: new Date('2028-01-01T00:00:00Z'),
      status: 'ACTIVE',
      verificationStatus: 'PENDING'
    }
  });

  // Create Inactive verified vehicle for Bob
  const vBobInactive = await prisma.vehicle.create({
    data: {
      ownerId: bob.id,
      vehicleNumber: 'MH12BOB888',
      type: 'SEDAN',
      brand: 'Maruti',
      model: 'Swift',
      color: 'Blue',
      fuelType: 'CNG',
      seatingCapacity: 4,
      registrationYear: 2022,
      vehicleImage: 'http://cloudinary.com/swift.jpg',
      rcNumber: 'RC-BOB888',
      rcImage: 'http://cloudinary.com/rc-bob.jpg',
      insuranceExpiry: new Date('2028-01-01T00:00:00Z'),
      status: 'INACTIVE',
      verificationStatus: 'VERIFIED'
    }
  });

  // Create Alice's vehicle (Bob does not own this)
  const vAlice = await prisma.vehicle.create({
    data: {
      ownerId: aliceData.data.employee.id,
      vehicleNumber: 'MH12ALI999',
      type: 'SUV',
      brand: 'Tata',
      model: 'Nexon',
      color: 'White',
      fuelType: 'EV',
      seatingCapacity: 5,
      registrationYear: 2023,
      vehicleImage: 'http://cloudinary.com/nexon.jpg',
      rcNumber: 'RC-ALI999',
      rcImage: 'http://cloudinary.com/rc-ali.jpg',
      insuranceExpiry: new Date('2028-01-01T00:00:00Z'),
      status: 'ACTIVE',
      verificationStatus: 'VERIFIED'
    }
  });

  // Future pickup timestamp details
  const nextYear = new Date().getUTCFullYear() + 1;
  const pDateStr = `${nextYear}-10-20`;
  const pTimeStr = '15:30';

  // Test 1: Successful Ride Creation
  console.log('\nTest 1: Creating a valid ride...');
  const createRes = await fetch(`${API_BASE}/rides`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bobToken}`
    },
    body: JSON.stringify({
      vehicleId: vBob.id,
      sourceAddress: 'Bob Office Building A',
      sourceLatitude: 18.52043,
      sourceLongitude: 73.856743,
      destinationAddress: 'Railway Junction',
      destinationLatitude: 18.52843,
      destinationLongitude: 73.868743,
      pickupDate: pDateStr,
      pickupTime: pTimeStr,
      pricePerSeat: 120.50,
      availableSeats: 3,
      notes: 'Luggage allowed',
      femaleOnly: false
    })
  });
  assert.strictEqual(createRes.status, 201);
  const createJson = await createRes.json();
  assert.strictEqual(createJson.success, true);
  assert.match(createJson.data.rideCode, /^ORG-\d{8}-\d{4}$/); // e.g. ORG-20260718-0001
  assert.strictEqual(createJson.data.status, 'SCHEDULED');
  assert.strictEqual(createJson.data.bookedSeats, 0); // Default support check
  const rideId = createJson.data.id;
  console.log(`✅ Valid ride created successfully. Ride Code: ${createJson.data.rideCode}`);

  // Test 2: Invalid Coordinate Rejection (lat: 91, lng: -181)
  console.log('\nTest 2: Creating a ride with invalid coordinates...');
  const badCoordRes = await fetch(`${API_BASE}/rides`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bobToken}`
    },
    body: JSON.stringify({
      vehicleId: vBob.id,
      sourceAddress: 'Bob Office Building A',
      sourceLatitude: 91.0, // Invalid
      sourceLongitude: 73.856743,
      destinationAddress: 'Railway Junction',
      destinationLatitude: 18.52843,
      destinationLongitude: -181.0, // Invalid
      pickupDate: pDateStr,
      pickupTime: pTimeStr,
      pricePerSeat: 120.50,
      availableSeats: 3
    })
  });
  assert.strictEqual(badCoordRes.status, 400);
  const badCoordJson = await badCoordRes.json();
  assert.strictEqual(badCoordJson.success, false);
  console.log('✅ Invalid coordinates rejected correctly with validation messages:', badCoordJson.error.details);

  // Test 3: Past Date Rejection
  console.log('\nTest 3: Creating a ride in the past...');
  const pastRes = await fetch(`${API_BASE}/rides`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bobToken}`
    },
    body: JSON.stringify({
      vehicleId: vBob.id,
      sourceAddress: 'Bob Office Building A',
      sourceLatitude: 18.52043,
      sourceLongitude: 73.856743,
      destinationAddress: 'Railway Junction',
      destinationLatitude: 18.52843,
      destinationLongitude: 73.868743,
      pickupDate: '2024-01-01', // Past
      pickupTime: '12:00',
      pricePerSeat: 120.50,
      availableSeats: 3
    })
  });
  assert.strictEqual(pastRes.status, 400);
  const pastJson = await pastRes.json();
  assert.match(pastJson.error.message, /must be in the future/i);
  console.log('✅ Past pickup date rejected correctly.');

  // Test 4: Seat Capacity checks (Seats: 0, Seats: 5 on capacity of 4)
  console.log('\nTest 4: Creating a ride with invalid availableSeats...');
  const zeroSeatsRes = await fetch(`${API_BASE}/rides`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bobToken}`
    },
    body: JSON.stringify({
      vehicleId: vBob.id,
      sourceAddress: 'Bob Office Building A',
      sourceLatitude: 18.52043,
      sourceLongitude: 73.856743,
      destinationAddress: 'Railway Junction',
      destinationLatitude: 18.52843,
      destinationLongitude: 73.868743,
      pickupDate: pDateStr,
      pickupTime: pTimeStr,
      pricePerSeat: 120.50,
      availableSeats: 0 // invalid
    })
  });
  assert.strictEqual(zeroSeatsRes.status, 400);

  const exceedSeatsRes = await fetch(`${API_BASE}/rides`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bobToken}`
    },
    body: JSON.stringify({
      vehicleId: vBob.id,
      sourceAddress: 'Bob Office Building A',
      sourceLatitude: 18.52043,
      sourceLongitude: 73.856743,
      destinationAddress: 'Railway Junction',
      destinationLatitude: 18.52843,
      destinationLongitude: 73.868743,
      pickupDate: pDateStr,
      pickupTime: pTimeStr,
      pricePerSeat: 120.50,
      availableSeats: 5 // invalid (capacity is 4)
    })
  });
  assert.strictEqual(exceedSeatsRes.status, 400);
  const exceedJson = await exceedSeatsRes.json();
  assert.match(exceedJson.error.message, /cannot exceed vehicle seating capacity/i);
  console.log('✅ Seating capacity boundary validations passed.');

  // Test 5: Vehicle Ownership check (Bob trying to use Alice\'s vehicle)
  console.log('\nTest 5: Creating a ride with someone else\'s vehicle...');
  const ownerBlockRes = await fetch(`${API_BASE}/rides`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bobToken}`
    },
    body: JSON.stringify({
      vehicleId: vAlice.id, // Alice's vehicle
      sourceAddress: 'Bob Office Building A',
      sourceLatitude: 18.52043,
      sourceLongitude: 73.856743,
      destinationAddress: 'Railway Junction',
      destinationLatitude: 18.52843,
      destinationLongitude: 73.868743,
      pickupDate: pDateStr,
      pickupTime: pTimeStr,
      pricePerSeat: 120.50,
      availableSeats: 3
    })
  });
  assert.strictEqual(ownerBlockRes.status, 403);
  console.log('✅ Access blocked (403) when using another employee\'s vehicle.');

  // Test 6: Inactive vehicle rejection
  console.log('\nTest 6: Creating a ride with an inactive vehicle...');
  const inactiveRes = await fetch(`${API_BASE}/rides`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bobToken}`
    },
    body: JSON.stringify({
      vehicleId: vBobInactive.id, // Inactive vehicle
      sourceAddress: 'Bob Office Building A',
      sourceLatitude: 18.52043,
      sourceLongitude: 73.856743,
      destinationAddress: 'Railway Junction',
      destinationLatitude: 18.52843,
      destinationLongitude: 73.868743,
      pickupDate: pDateStr,
      pickupTime: pTimeStr,
      pricePerSeat: 120.50,
      availableSeats: 3
    })
  });
  assert.strictEqual(inactiveRes.status, 400);
  const inactiveJson = await inactiveRes.json();
  assert.match(inactiveJson.error.message, /vehicle is inactive/i);
  console.log('✅ Inactive vehicle rejected correctly.');

  // Test 7: Unverified vehicle rejection
  console.log('\nTest 7: Creating a ride with an unverified vehicle...');
  const unverifiedRes = await fetch(`${API_BASE}/rides`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bobToken}`
    },
    body: JSON.stringify({
      vehicleId: vBobUnverified.id, // Unverified vehicle (PENDING)
      sourceAddress: 'Bob Office Building A',
      sourceLatitude: 18.52043,
      sourceLongitude: 73.856743,
      destinationAddress: 'Railway Junction',
      destinationLatitude: 18.52843,
      destinationLongitude: 73.868743,
      pickupDate: pDateStr,
      pickupTime: pTimeStr,
      pricePerSeat: 120.50,
      availableSeats: 3
    })
  });
  assert.strictEqual(unverifiedRes.status, 400);
  const unverifiedJson = await unverifiedRes.json();
  assert.match(unverifiedJson.error.message, /vehicle is not verified/i);
  console.log('✅ Unverified vehicle rejected correctly.');

  // Test 8: Price rejection (Free ride = 0)
  console.log('\nTest 8: Creating a free ride (Price: 0)...');
  const freeRes = await fetch(`${API_BASE}/rides`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bobToken}`
    },
    body: JSON.stringify({
      vehicleId: vBob.id,
      sourceAddress: 'Bob Office Building A',
      sourceLatitude: 18.52043,
      sourceLongitude: 73.856743,
      destinationAddress: 'Railway Junction',
      destinationLatitude: 18.52843,
      destinationLongitude: 73.868743,
      pickupDate: pDateStr,
      pickupTime: pTimeStr,
      pricePerSeat: 0.00, // free
      availableSeats: 3
    })
  });
  assert.strictEqual(freeRes.status, 400);
  const freeJson = await freeRes.json();
  const errorMsg = freeJson.error.message === 'Validation Error'
    ? freeJson.error.details[0].message
    : freeJson.error.message;
  assert.match(errorMsg, /greater than zero/i);
  console.log('✅ Free ride rejected correctly.');

  // Test 9: Update SCHEDULED ride
  console.log('\nTest 9: Updating a SCHEDULED ride...');
  const updateRes = await fetch(`${API_BASE}/rides/${rideId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bobToken}`
    },
    body: JSON.stringify({
      availableSeats: 2,
      pricePerSeat: 150.00,
      notes: 'No heavy luggage allowed'
    })
  });
  assert.strictEqual(updateRes.status, 200);
  const updateJson = await updateRes.json();
  assert.strictEqual(updateJson.success, true);
  assert.strictEqual(updateJson.data.availableSeats, 2);
  assert.strictEqual(Number(updateJson.data.pricePerSeat), 150.00);
  console.log('✅ Scheduled ride details updated correctly.');

  // Test 10: Cancel SCHEDULED ride (Soft delete)
  console.log('\nTest 10: Cancelling a SCHEDULED ride (Soft Delete)...');
  const cancelRes = await fetch(`${API_BASE}/rides/${rideId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${bobToken}` }
  });
  assert.strictEqual(cancelRes.status, 200);
  const cancelJson = await cancelRes.json();
  assert.strictEqual(cancelJson.success, true);
  assert.strictEqual(cancelJson.data.status, 'CANCELLED');

  // Verify status in DB is soft deleted (not hard deleted)
  const dbRide = await prisma.ride.findUnique({ where: { id: rideId } });
  assert.ok(dbRide);
  assert.strictEqual(dbRide.status, 'CANCELLED');
  console.log('✅ Scheduled ride soft-deleted/cancelled correctly.');

  // Test 11: Edit and Cancel Blocked for non-SCHEDULED rides
  console.log('\nTest 11: Testing edit and cancel blocks for CANCELLED rides...');
  // Try to cancel again (now that it is CANCELLED)
  const cancelAgainRes = await fetch(`${API_BASE}/rides/${rideId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${bobToken}` }
  });
  assert.strictEqual(cancelAgainRes.status, 400);

  // Try to edit a CANCELLED ride
  const editAgainRes = await fetch(`${API_BASE}/rides/${rideId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bobToken}`
    },
    body: JSON.stringify({ availableSeats: 3 })
  });
  assert.strictEqual(editAgainRes.status, 400);
  console.log('✅ Correctly blocked editing or cancelling already-cancelled rides.');

  // Test 12: Verify UTC timestamps stored correctly
  console.log('\nTest 12: Verifying UTC timestamp formatting...');
  const newRideRes = await fetch(`${API_BASE}/rides`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bobToken}`
    },
    body: JSON.stringify({
      vehicleId: vBob.id,
      sourceAddress: 'Bob Office Building A',
      sourceLatitude: 18.52043,
      sourceLongitude: 73.856743,
      destinationAddress: 'Railway Junction',
      destinationLatitude: 18.52843,
      destinationLongitude: 73.868743,
      pickupDate: pDateStr,
      pickupTime: pTimeStr,
      pricePerSeat: 100.00,
      availableSeats: 2
    })
  });
  const newRideJson = await newRideRes.json();
  const dbPickupAt = newRideJson.data.pickupAt; // e.g. "2027-10-20T15:30:00.000Z"
  assert.strictEqual(dbPickupAt.endsWith('Z'), true);
  assert.strictEqual(dbPickupAt.slice(0, 19), `${pDateStr}T${pTimeStr}:00`);
  console.log('✅ UTC timestamp storage matches UTC inputs perfectly.');

  console.log('\n🎉 ALL PHASE 5 RIDE CREATION MODULE TESTS PASSED SUCCESSFULLY!');
}

testRides().catch((err) => {
  console.error('\n❌ Ride tests failed:', err);
  process.exit(1);
}).finally(() => {
  prisma.$disconnect();
});
