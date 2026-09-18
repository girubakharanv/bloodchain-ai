import crypto from 'crypto';

export function generateSecureOTP(): string {
  // Generate a random integer between 100000 and 999999 (inclusive)
  const otp = crypto.randomInt(100000, 1000000);
  return otp.toString();
}

export function hashOTP(otp: string, email: string): string {
  // Use email as salt for hashing to prevent rainbow table attacks
  const hmac = crypto.createHmac('sha256', email);
  hmac.update(otp);
  return hmac.digest('hex');
}
