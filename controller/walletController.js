
const speakeasy = require('speakeasy');

// Generate an OTP secret
const secret = speakeasy.generateSecret({ length: 20 });
console.log(secret.base32);  // Outputs the OTP secret in base32 format

// Generate an OTP token
const token = speakeasy.totp({
  secret: secret.base32,
  encoding: 'base32'
});
console.log(token);  // Outputs the OTP token

// Verify an OTP token
const verified = speakeasy.totp.verify({
  secret: secret.base32,
  encoding: 'base32',
  token: 'ENTER TOKEN HERE',
  window: 2  // Allow for a 2-step window of time for the token to be verified
});
console.log(verified); 