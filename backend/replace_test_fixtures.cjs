const fs = require('fs');

const files = [
  'test-booking-flows.js',
  'test-ride-flows.js',
  'verify-demo-flow.js'
];

files.forEach(f => {
  let txt = fs.readFileSync(f, 'utf8');

  // Replace Kudasan / Ch-0 / Acme with LDRP 
  txt = txt.replace(/sourceAddress:\s*['"][^'"]+['"],\s*sourceLatitude:\s*18\.52043,\s*sourceLongitude:\s*73\.856743,/g, 
    "sourceAddress: 'LDRP Institute, Gandhinagar',\n      sourceLatitude: 23.2385,\n      sourceLongitude: 72.6399,");

  // Replace destination with GIFT City
  txt = txt.replace(/destinationAddress:\s*['"][^'"]+['"],\s*destinationLatitude:\s*18\.52843,\s*destinationLongitude:\s*73\.868743,/g, 
    "destinationAddress: 'GIFT City, Gandhinagar',\n      destinationLatitude: 23.1619,\n      destinationLongitude: 72.6896,");

  // There's one case in verify-demo-flow.js where it uses 'latitude: 18.52043, longitude: 73.856743' for find-ride
  txt = txt.replace(/source:\s*{\s*latitude:\s*18\.52043,\s*longitude:\s*73\.856743\s*}/g, 
    "source: { latitude: 23.2385, longitude: 72.6399 }");
  txt = txt.replace(/destination:\s*{\s*latitude:\s*18\.52843,\s*longitude:\s*73\.868743\s*}/g, 
    "destination: { latitude: 23.1619, longitude: 72.6896 }");

  fs.writeFileSync(f, txt);
});
console.log("Test fixtures updated!");
