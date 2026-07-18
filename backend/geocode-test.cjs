const apiKey = "YVi3enSH4zcTEekiGj4WTeJAi02HCYBc8Upv6xdM";
const addresses = [
  "Kudasan, Gandhinagar, Gujarat",
  "LDRP Institute of Technology and Research, KH-5, Gandhinagar, Gujarat",
  "CH-0 Circle, Gandhinagar, Gujarat",
  "KH-5, Gandhinagar, Gujarat",
  "Acme HQ Building A",
  "City Central Station"
];

async function geocode(address) {
  try {
    const res = await fetch(`https://api.olamaps.io/places/v1/autocomplete?input=${encodeURIComponent(address)}&api_key=${apiKey}`);
    if (!res.ok) throw new Error(`API failed with status ${res.status}`);
    const data = await res.json();
    if (data.predictions && data.predictions.length > 0) {
      const bestMatch = data.predictions[0];
      const loc = bestMatch.geometry.location;
      console.log(`\nInput address: "${address}"`);
      console.log(`Resolved formatted address: "${bestMatch.description}"`);
      console.log(`Latitude: ${loc.lat}`);
      console.log(`Longitude: ${loc.lng}`);
      return loc;
    } else {
      console.log(`\nInput address: "${address}"`);
      console.log(`Resolved formatted address: NOT FOUND`);
    }
  } catch (err) {
    console.error(`\nInput address: "${address}" -> ERROR: ${err.message}`);
  }
  return null;
}

async function main() {
  console.log("=== GEOCODING TRACE ===");
  for (const addr of addresses) {
    await geocode(addr);
  }
}

main();
