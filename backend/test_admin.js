async function testAdmin() {
  // 1. Login to get token
  const loginRes = await fetch('http://localhost:5000/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orgDomain: 'acme.com', loginId: 'admin@acme.com', password: 'password123' })
  });
  const loginData = await loginRes.json();
  if (!loginData.success) {
    console.error('Login failed', loginData);
    return;
  }
  const token = loginData.data.token;
  console.log('Got token:', token.substring(0, 10) + '...');

  // 2. Fetch pending vehicles
  const vRes = await fetch('http://localhost:5000/api/v1/admin/vehicles', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const vData = await vRes.json();
  if (!vData.success) {
    console.error('Fetch vehicles failed', vData);
    return;
  }
  const vehicles = vData.data;
  console.log('Vehicles:', vehicles.length);

  const pending = vehicles.find(v => v.verificationStatus === 'PENDING');
  if (!pending) {
    console.log('No pending vehicles found. Attempting to approve the first vehicle anyway for testing...');
  }
  
  const targetVehicle = pending || vehicles[0];

  if (targetVehicle) {
    // 3. Approve vehicle
    console.log(`Approving vehicle ${targetVehicle.id}...`);
    const verifyRes = await fetch(`http://localhost:5000/api/v1/admin/vehicles/${targetVehicle.id}/verify`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ status: 'VERIFIED' })
    });
    const verifyData = await verifyRes.json();
    console.log('Verify response:', verifyData);
  }

  // 4. Suspend employee
  const eRes = await fetch('http://localhost:5000/api/v1/admin/employees', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const eData = await eRes.json();
  const emp = eData.data.find(e => e.role === 'EMPLOYEE' && e.status === 'ACTIVE');
  if (!emp) {
    console.log('No active employee found.');
    return;
  }
  
  console.log(`Suspending employee ${emp.id}...`);
  const sRes = await fetch(`http://localhost:5000/api/v1/admin/employees/${emp.id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ status: 'SUSPENDED' })
  });
  const sData = await sRes.json();
  console.log('Suspend response:', sData);
}

testAdmin();
