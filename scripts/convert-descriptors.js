const fs = require('fs');
const path = require('path');

// Source directory (PAPI descriptors)
const SOURCE_DIR = path.join('.papi', 'descriptors', 'dist');

// Output directory for Deno-compatible descriptors
const OUTPUT_DIR = path.join('public', 'descriptors');

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// List of chains to convert
const CHAINS = [
  "dot", "ksm", "wnd", "roc", "paseo", 
  "polkadotAssetHub", "kusamaAssetHub"
];

// Convert each chain
for (const chain of CHAINS) {
  try {
    // Import the descriptor
    const descriptor = require(`@polkadot-api/descriptors`)[chain];
    
    // Write to output directory
    fs.writeFileSync(
      path.join(OUTPUT_DIR, `${chain}.json`),
      JSON.stringify(descriptor)
    );
    
    console.log(`Converted ${chain} descriptor`);
  } catch (error) {
    console.error(`Error converting ${chain} descriptor:`, error);
  }
}
