import assert from 'assert';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const API_BASE = 'http://localhost:5000/api/v1';
const prisma = new PrismaClient();

async function testBookings() {
  console.log('🧪 Starting Phase 6 & 7 Booking Module Verification Tests...');

  // Reset database state
  console.log('\nResetting database login states via Prisma...');
  const bcrypt = await import('bcrypt');
  const tempHash = await bcrypt.default.hash('password123', 10);
  
  // We need to ensure employees exist and are active
  await prisma.employee.updateMany({
    where: { email: { in: ['employee@acme.com', 'charlie@acme.com', 'admin@acme.com'] } },
    data: {
      passwordHash: tempHash,
      isFirstLogin: false,
      status: 'ACTIVE'
    }
  });

  // Fetch users
  const bob = await prisma.employee.findUnique({ where: { email: 'employee@acme.com' } });
  const charlie = await prisma.employee.findUnique({ where: { email: 'charlie@acme.com' } });
  const alice = await prisma.employee.findUnique({ where: { email: 'admin@acme.com' } });
  assert.ok(bob && charlie && alice);

  // Clean old bookings, rides & vehicles
  await prisma.rideParticipant.deleteMany();
  await prisma.ride.deleteMany();
  await prisma.vehicle.deleteMany();

  // Log in Bob (Driver)
  console.log('Logging in Bob (Driver)...');
  const bobRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ loginId: 'employee@acme.com', password: 'password123' })
  });
  assert.strictEqual(bobRes.status, 200);
  const bobData = await bobRes.json();
  const bobToken = bobData.data.token;

  // Log in Charlie (Passenger)
  console.log('Logging in Charlie (Passenger)...');
  const charlieRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ loginId: 'charlie@acme.com', password: 'password123' })
  });
  assert.strictEqual(charlieRes.status, 200);
  const charlieData = await charlieRes.json();
  const charlieToken = charlieData.data.token;

  // Create active verified vehicle for Bob (capacity: 4)
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

  // Future pickup time
  const nextYear = new Date().getUTCFullYear() + 1;
  const pDateStr = `${nextYear}-10-20`;
  const pTimeStr = '15:30';

  // Bob offers a ride (available seats: 3)
  console.log('Bob offering a ride (available seats: 3)...');
  const rideRes = await fetch(`${API_BASE}/rides`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bobToken}`
    },
    body: JSON.stringify({
      vehicleId: vBob.id,
      sourceAddress: 'LDRP Institute, Gandhinagar',
      sourceLatitude: 23.2385,
      sourceLongitude: 72.6399,
      destinationAddress: 'GIFT City, Gandhinagar',
      destinationLatitude: 23.1619,
      destinationLongitude: 72.6896,
      pickupDate: pDateStr,
      pickupTime: pTimeStr,
      pricePerSeat: 100.00,
      availableSeats: 3,
      femaleOnly: false
    })
  });
  assert.strictEqual(rideRes.status, 201);
  const rideData = await rideRes.json();
  const rideId = rideData.data.id;

  // Test 1: Ride Discovery (Search)
  console.log('\nTest 1: Charlie searches for rides...');
  const searchRes = await fetch(`${API_BASE}/rides/search?source=Office&limit=5`, {
    headers: { 'Authorization': `Bearer ${charlieToken}` }
  });
  assert.strictEqual(searchRes.status, 200);
  const searchData = await searchRes.json();
  assert.strictEqual(searchData.success, true);
  assert.strictEqual(searchData.data.length, 1);
  // Verify inclusion of driver name and vehicle summary
  const discoveredRide = searchData.data[0];
  assert.strictEqual(discoveredRide.driver.name, 'Bob Employee');
  assert.strictEqual(discoveredRide.vehicle.brand, 'Maruti');
  assert.strictEqual(discoveredRide.vehicle.model, 'Swift');
  console.log('✅ Ride discovery search succeeded and returned driver/vehicle details.');

  // Test 2: Discovery Details (Public Ride Details)
  console.log('\nTest 2: Charlie gets public details of Bob\'s ride...');
  const publicRes = await fetch(`${API_BASE}/rides/public/${rideId}`, {
    headers: { 'Authorization': `Bearer ${charlieToken}` }
  });
  assert.strictEqual(publicRes.status, 200);
  const publicData = await publicRes.json();
  assert.strictEqual(publicData.success, true);
  assert.strictEqual(publicData.data.driver.name, 'Bob Employee');
  assert.strictEqual(publicData.data.vehicle.brand, 'Maruti');
  assert.strictEqual(publicData.data.vehicle.color, 'Blue');
  console.log('✅ Discovery public ride details API works.');

  // Test 3: Own ride exclusion
  console.log('\nTest 3: Bob searches for rides (should not see his own)...');
  const bobSearchRes = await fetch(`${API_BASE}/rides/search`, {
    headers: { 'Authorization': `Bearer ${bobToken}` }
  });
  const bobSearchData = await bobSearchRes.json();
  assert.strictEqual(bobSearchData.data.length, 0);
  console.log('✅ Own ride excluded from search results correctly.');

  // Test 4: Passenger requesting a booking
  console.log('\nTest 4: Charlie requests a booking for 2 seats...');
  const bookingCreateRes = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${charlieToken}`
    },
    body: JSON.stringify({
      rideId: rideId,
      seatsBooked: 2
    })
  });
  assert.strictEqual(bookingCreateRes.status, 201);
  const bookingCreateData = await bookingCreateRes.json();
  assert.strictEqual(bookingCreateData.success, true);
  assert.strictEqual(bookingCreateData.data.status, 'PENDING');
  assert.strictEqual(bookingCreateData.data.seatsBooked, 2);
  const bookingId = bookingCreateData.data.id;
  console.log(`✅ Booking request created in PENDING status. Booking ID: ${bookingId}`);

  // Test 5: Duplicate booking rejection
  console.log('\nTest 5: Charlie requests duplicate booking for same ride...');
  const duplicateBookingRes = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${charlieToken}`
    },
    body: JSON.stringify({
      rideId: rideId,
      seatsBooked: 1
    })
  });
  assert.strictEqual(duplicateBookingRes.status, 400);
  const duplicateBookingData = await duplicateBookingRes.json();
  assert.match(duplicateBookingData.error.message, /already have an active booking/i);
  console.log('✅ Duplicate booking request rejected successfully.');

  // Test 6: Booking own ride rejection
  console.log('\nTest 6: Bob tries to book his own ride...');
  const ownBookingRes = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bobToken}`
    },
    body: JSON.stringify({
      rideId: rideId,
      seatsBooked: 1
    })
  });
  assert.strictEqual(ownBookingRes.status, 400);
  const ownBookingData = await ownBookingRes.json();
  assert.match(ownBookingData.error.message, /cannot book your own ride/i);
  console.log('✅ Booking own ride rejected successfully.');

  // Test 7: Fetch incoming requests (Driver) & own bookings (Passenger)
  console.log('\nTest 7: Fetching bookings list...');
  // Charlie fetches his bookings
  const myBookingsRes = await fetch(`${API_BASE}/bookings/me`, {
    headers: { 'Authorization': `Bearer ${charlieToken}` }
  });
  assert.strictEqual(myBookingsRes.status, 200);
  const myBookingsData = await myBookingsRes.json();
  assert.strictEqual(myBookingsData.data.length, 1);
  assert.strictEqual(myBookingsData.data[0].id, bookingId);

  // Bob fetches booking requests
  const bobRequestsRes = await fetch(`${API_BASE}/bookings/requests`, {
    headers: { 'Authorization': `Bearer ${bobToken}` }
  });
  assert.strictEqual(bobRequestsRes.status, 200);
  const bobRequestsData = await bobRequestsRes.json();
  assert.strictEqual(bobRequestsData.data.length, 1);
  assert.strictEqual(bobRequestsData.data[0].id, bookingId);
  assert.strictEqual(bobRequestsData.data[0].passenger.name, 'Charlie Inactive'); // Charlie's seed name was "Charlie Inactive"
  console.log('✅ /bookings/me and /bookings/requests return correct lists.');

  // Test 8: Driver accepts booking request (with transactional seat adjustment)
  console.log('\nTest 8: Bob accepts Charlie\'s booking request...');
  const acceptRes = await fetch(`${API_BASE}/bookings/${bookingId}/accept`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${bobToken}` }
  });
  assert.strictEqual(acceptRes.status, 200);
  const acceptData = await acceptRes.json();
  assert.strictEqual(acceptData.success, true);
  assert.strictEqual(acceptData.data.status, 'ACCEPTED');

  // Verify bookedSeats on the ride increased
  const updatedRide = await prisma.ride.findUnique({ where: { id: rideId } });
  assert.strictEqual(updatedRide.bookedSeats, 2);
  console.log('✅ Booking accepted and bookedSeats increased to 2.');

  // Test 9: Overbooking seat limits checks
  console.log('\nTest 9: Testing overbooking constraints (remaining seats: 1)...');
  // Log in Alice and try to book 2 seats (only 1 seat remaining)
  const aliceRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ loginId: 'admin@acme.com', password: 'password123' })
  });
  const aliceData = await aliceRes.json();
  const aliceToken = aliceData.data.token;

  const overbookRequestRes = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${aliceToken}`
    },
    body: JSON.stringify({
      rideId: rideId,
      seatsBooked: 2
    })
  });
  assert.strictEqual(overbookRequestRes.status, 400);
  const overbookRequestData = await overbookRequestRes.json();
  assert.match(overbookRequestData.error.message, /only 1 seats remaining/i);
  console.log('✅ Overbooking blocked correctly at request creation stage.');

  // Now make a valid booking request for 1 seat
  console.log('Alice requests 1 remaining seat...');
  const aliceBookingRes = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${aliceToken}`
    },
    body: JSON.stringify({
      rideId: rideId,
      seatsBooked: 1
    })
  });
  assert.strictEqual(aliceBookingRes.status, 201);
  const aliceBookingData = await aliceBookingRes.json();
  const aliceBookingId = aliceBookingData.data.id;

  // Verify ride is now excluded from search because availableSeats == bookedSeats (full)
  console.log('Searching rides (should show 0 results as the ride is full in requests)...');
  // Wait, bookedSeats is 2, but Alice's booking of 1 is still PENDING, so bookedSeats is still 2. Available seats is 3. So 1 seat is still free. The ride is not full yet.
  // Let's accept Alice's booking first, making the ride full (bookedSeats = 3)
  console.log('Bob accepts Alice\'s booking request...');
  const acceptAliceRes = await fetch(`${API_BASE}/bookings/${aliceBookingId}/accept`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${bobToken}` }
  });
  assert.strictEqual(acceptAliceRes.status, 200);

  // Search again: ride is fully booked, so search should show 0 results
  console.log('Charlie searches for rides again (should show 0 results as ride is now full)...');
  const searchFullRes = await fetch(`${API_BASE}/rides/search`, {
    headers: { 'Authorization': `Bearer ${charlieToken}` }
  });
  const searchFullData = await searchFullRes.json();
  assert.strictEqual(searchFullData.data.length, 0);
  console.log('✅ Fully booked ride is automatically excluded from search discovery.');

  // Test 10: Cancel booking (Passenger)
  console.log('\nTest 10: Charlie cancels his accepted booking (2 seats)...');
  const cancelRes = await fetch(`${API_BASE}/bookings/${bookingId}/cancel`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${charlieToken}` }
  });
  assert.strictEqual(cancelRes.status, 200);
  const cancelData = await cancelRes.json();
  assert.strictEqual(cancelData.success, true);
  assert.strictEqual(cancelData.data.status, 'CANCELLED');

  // Verify bookedSeats on the ride decreased back by 2 (should be 3 - 2 = 1)
  const finalRide = await prisma.ride.findUnique({ where: { id: rideId } });
  assert.strictEqual(finalRide.bookedSeats, 1);
  console.log('✅ Booking cancelled, bookedSeats decreased back to 1.');

  // Test 11: Re-booking allowed if previous booking was CANCELLED
  console.log('\nTest 11: Charlie requests a new booking after cancellation...');
  const rebookRes = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${charlieToken}`
    },
    body: JSON.stringify({
      rideId: rideId,
      seatsBooked: 2 // 2 seats are now available again
    })
  });
  assert.strictEqual(rebookRes.status, 201);
  const rebookData = await rebookRes.json();
  assert.strictEqual(rebookData.success, true);
  assert.strictEqual(rebookData.data.status, 'PENDING');
  console.log('✅ Re-booking after cancellation works correctly.');

  console.log('\n🎉 ALL SPRINT BOOKING AND DISCOVERY TESTS PASSED SUCCESSFULLY!');
}

testBookings().catch((err) => {
  console.error('\n❌ Booking tests failed:', err);
  process.exit(1);
}).finally(() => {
  prisma.$disconnect();
});
