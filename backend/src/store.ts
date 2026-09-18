export interface OtpSession {
  hashedOtp: string;
  expiresAt: number;
  attempts: number;
  lastSentAt: number;
  email: string;
}

// Store for registered users (since there is no existing DB)
export const registeredUsersStore = new Set<string>();

// Store for emails that have successfully passed OTP verification but haven't created an account yet
export const verifiedEmailsStore = new Set<string>();

// Store for active OTP sessions
export const otpStore = new Map<string, OtpSession>();
