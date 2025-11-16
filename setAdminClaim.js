#!/usr/bin/env node
/**
 * setAdminClaim.js
 * 
 * Sets the custom 'admin' claim for a Firebase user.
 * 
 * Usage:
 *   node setAdminClaim.js <USER_UID>
 * 
 * Example:
 *   node setAdminClaim.js abc123xyz789
 * 
 * Note: Requires serviceAccountKey.json in the same directory.
 * Download from Firebase Console > Project Settings > Service Accounts > Generate New Private Key
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Load service account key
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error(`❌ Error: serviceAccountKey.json not found at ${serviceAccountPath}`);
  console.error('Download it from: Firebase Console > Project Settings > Service Accounts > Generate New Private Key');
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Get UID from command line
const uid = process.argv[2];

if (!uid) {
  console.error('Usage: node setAdminClaim.js <USER_UID>');
  console.error('Example: node setAdminClaim.js abc123xyz789');
  process.exit(1);
}

// Set the admin custom claim
admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log(`✅ Successfully set admin=true for UID: ${uid}`);
    console.log('Next step: Force refresh the user\'s token in the app or sign out and back in.');
    process.exit(0);
  })
  .catch(err => {
    console.error(`❌ Error setting custom claim for UID ${uid}:`);
    console.error(err.message);
    process.exit(1);
  });
