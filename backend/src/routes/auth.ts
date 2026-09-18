import { Router, Request, Response } from 'express';
import { registeredUsersStore, verifiedEmailsStore, otpStore, OtpSession } from '../store';
import { generateSecureOTP, hashOTP } from '../utils/crypto';
import { sendOtpEmail } from '../services/email';
import crypto from 'crypto';
import { supabase } from '../config/supabase';

const router = Router();

interface VerificationTokenData {
  token: string;
  expiresAt: number;
}
const verificationTokens = new Map<string, VerificationTokenData>();
const VERIFICATION_TOKEN_EXPIRY_MS = 15 * 60 * 1000; // 15 mins to complete registration

const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const OTP_COOLDOWN_MS = 60 * 1000; // 60 seconds
const MAX_ATTEMPTS = 5;

// Helper to validate and normalize email
function validateAndNormalizeEmail(email: any): string | null {
  if (typeof email !== 'string') return null;
  const trimmed = email.trim().toLowerCase();
  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) return null;
  return trimmed;
}

// POST /api/auth/send-registration-otp
router.post('/send-registration-otp', async (req: Request, res: Response) => {
  try {
    const rawEmail = req.body.email;
    const email = validateAndNormalizeEmail(rawEmail);

    if (!email) {
      return res.status(400).json({ error: 'INVALID_EMAIL', message: 'Invalid email address provided.' });
    }

    if (registeredUsersStore.has(email)) {
      return res.status(409).json({ error: 'EMAIL_ALREADY_REGISTERED', message: 'This email is already registered.' });
    }

    // Check cooldown
    const existingSession = otpStore.get(email);
    const now = Date.now();
    if (existingSession && (now - existingSession.lastSentAt < OTP_COOLDOWN_MS)) {
      return res.status(429).json({ 
        error: 'OTP_RESEND_COOLDOWN', 
        message: 'Please wait before requesting another OTP.' 
      });
    }

    const otp = generateSecureOTP();
    const hashedOtp = hashOTP(otp, email);

    // Save session
    const session: OtpSession = {
      email,
      hashedOtp,
      expiresAt: now + OTP_EXPIRY_MS,
      attempts: 0,
      lastSentAt: now
    };
    otpStore.set(email, session);

    // Send email via Brevo
    const emailSent = await sendOtpEmail(email, otp);

    if (!emailSent) {
      // Clean up session if email failed to send to avoid locking them out unnecessarily
      otpStore.delete(email);
      return res.status(500).json({ error: 'OTP_SEND_FAILED', message: 'Failed to send OTP email. Please try again later.' });
    }

    res.status(200).json({ message: 'OTP sent successfully.' });
  } catch (error) {
    console.error('Error in send-registration-otp:', error);
    res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred.' });
  }
});

// POST /api/auth/resend-registration-otp
router.post('/resend-registration-otp', async (req: Request, res: Response) => {
  try {
    const rawEmail = req.body.email;
    const email = validateAndNormalizeEmail(rawEmail);

    if (!email) {
      return res.status(400).json({ error: 'INVALID_EMAIL', message: 'Invalid email address provided.' });
    }

    if (registeredUsersStore.has(email)) {
      return res.status(409).json({ error: 'EMAIL_ALREADY_REGISTERED', message: 'This email is already registered.' });
    }

    const existingSession = otpStore.get(email);
    const now = Date.now();

    if (existingSession && (now - existingSession.lastSentAt < OTP_COOLDOWN_MS)) {
      return res.status(429).json({ 
        error: 'OTP_RESEND_COOLDOWN', 
        message: 'Please wait before requesting another OTP.' 
      });
    }

    const otp = generateSecureOTP();
    const hashedOtp = hashOTP(otp, email);

    const session: OtpSession = {
      email,
      hashedOtp,
      expiresAt: now + OTP_EXPIRY_MS,
      attempts: 0,
      lastSentAt: now
    };
    otpStore.set(email, session);

    const emailSent = await sendOtpEmail(email, otp);

    if (!emailSent) {
      // Revert to old session if possible, or delete. Deleting is safer.
      otpStore.delete(email);
      return res.status(500).json({ error: 'OTP_SEND_FAILED', message: 'Failed to send OTP email.' });
    }

    res.status(200).json({ message: 'OTP resent successfully.' });
  } catch (error) {
    console.error('Error in resend-registration-otp:', error);
    res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred.' });
  }
});

// POST /api/auth/verify-registration-otp
router.post('/verify-registration-otp', async (req: Request, res: Response) => {
  try {
    const rawEmail = req.body.email;
    const rawOtp = req.body.otp;
    const email = validateAndNormalizeEmail(rawEmail);

    if (!email) {
      return res.status(400).json({ error: 'INVALID_EMAIL', message: 'Invalid email address provided.' });
    }

    if (typeof rawOtp !== 'string' || !/^\d{6}$/.test(rawOtp)) {
      return res.status(400).json({ error: 'OTP_INVALID', message: 'OTP must be a 6-digit number.' });
    }

    if (registeredUsersStore.has(email)) {
      return res.status(409).json({ error: 'EMAIL_ALREADY_REGISTERED', message: 'This email is already registered.' });
    }

    const session = otpStore.get(email);

    if (!session) {
      return res.status(400).json({ error: 'EMAIL_NOT_VERIFIED', message: 'No active OTP session found for this email.' });
    }

    const now = Date.now();

    if (now > session.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ error: 'OTP_EXPIRED', message: 'The OTP has expired.' });
    }

    if (session.attempts >= MAX_ATTEMPTS) {
      otpStore.delete(email);
      return res.status(403).json({ error: 'OTP_ATTEMPTS_EXCEEDED', message: 'Too many incorrect attempts. Please request a new OTP.' });
    }

    const submittedHash = hashOTP(rawOtp, email);

    console.log(`[OTP DEBUG] email: ${email}, rawOtp: ${rawOtp}, submittedHash: ${submittedHash}, storedHash: ${session.hashedOtp}`);

    if (submittedHash !== session.hashedOtp) {
      session.attempts += 1;
      return res.status(400).json({ error: 'OTP_INVALID', message: 'Invalid OTP.' });
    }

    // OTP verified successfully
    const token = crypto.randomBytes(32).toString('hex');
    verificationTokens.set(email, {
      token,
      expiresAt: Date.now() + VERIFICATION_TOKEN_EXPIRY_MS
    });
    
    // Prevent reuse of verified OTP
    otpStore.delete(email);

    res.status(200).json({ message: 'Email verified successfully.', verificationToken: token });
  } catch (error) {
    console.error('Error in verify-registration-otp:', error);
    res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred.' });
  }
});
// POST /api/auth/complete-registration
router.post('/complete-registration', async (req: Request, res: Response) => {
  try {
    const { fullName, email: rawEmail, phone, dateOfBirth, bloodGroup, password, termsAccepted, otpVerificationToken } = req.body;
    
    const email = validateAndNormalizeEmail(rawEmail);
    if (!email) {
      return res.status(400).json({ error: 'INVALID_EMAIL', message: 'Please check your details and try again.' });
    }

    if (termsAccepted !== true) {
      return res.status(400).json({ error: 'TERMS_NOT_ACCEPTED', message: 'Please check your details and try again.' });
    }

    const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    if (!validBloodGroups.includes(bloodGroup)) {
      return res.status(400).json({ error: 'INVALID_BLOOD_GROUP', message: 'Please check your details and try again.' });
    }
    
    const parts = typeof dateOfBirth === 'string' ? dateOfBirth.split('/') : [];
    let parsedDate = NaN;
    let isoDateStr = '';
    if (parts.length === 3) {
      const [day, month, year] = parts;
      isoDateStr = `${year}-${month}-${day}`;
      parsedDate = Date.parse(isoDateStr);
    }

    if (isNaN(parsedDate)) {
      return res.status(400).json({ error: 'INVALID_DATE', message: 'Please check your details and try again.' });
    }

    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'INVALID_PASSWORD', message: 'Please check your details and try again.' });
    }

    const verificationData = verificationTokens.get(email);
    if (!verificationData || verificationData.token !== otpVerificationToken || Date.now() > verificationData.expiresAt) {
      return res.status(403).json({ error: 'EMAIL_NOT_VERIFIED', message: 'Please verify your email before creating your account.' });
    }

    // Attempt to create Supabase Auth User
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName }
    });

    if (authError) {
      if (authError.message.toLowerCase().includes('already registered') || authError.status === 422) {
        return res.status(409).json({ error: 'EMAIL_ALREADY_REGISTERED', message: 'This email is already registered. Please log in instead.' });
      }
      console.error('Supabase auth error:', authError);
      return res.status(500).json({ error: 'REGISTRATION_FAILED', message: 'We couldn\'t create your account right now. Please try again.' });
    }

    if (!authData.user) {
      return res.status(500).json({ error: 'REGISTRATION_FAILED', message: 'We couldn\'t create your account right now. Please try again.' });
    }

    const userId = authData.user.id;

    // Insert into donor_profiles
    const { error: dbError } = await supabase.from('donor_profiles').insert({
      user_id: userId,
      full_name: fullName,
      email,
      phone,
      date_of_birth: isoDateStr,
      blood_group: bloodGroup,
      email_verified: true
    });

    if (dbError) {
      console.error('Supabase db error:', dbError);
      // Rollback Auth user creation
      await supabase.auth.admin.deleteUser(userId);
      return res.status(500).json({ error: 'REGISTRATION_FAILED', message: 'We couldn\'t create your account right now. Please try again.' });
    }

    // Cleanup token
    verificationTokens.delete(email);

    res.status(200).json({ message: 'Account created successfully.' });
  } catch (error) {
    console.error('Error in complete-registration:', error);
    res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: 'We couldn\'t create your account right now. Please try again.' });
  }
});

// POST /api/auth/complete-blood-bank-registration
router.post('/complete-blood-bank-registration', async (req: Request, res: Response) => {
  try {
    const { 
      bloodBankName, 
      bloodBankType, 
      registrationNumber, 
      email: rawEmail, 
      contactPerson, 
      phone, 
      state, 
      district, 
      city, 
      fullAddress, 
      pincode, 
      password, 
      otpVerificationToken 
    } = req.body;
    
    const email = validateAndNormalizeEmail(rawEmail);
    if (!email) {
      return res.status(400).json({ error: 'INVALID_EMAIL', message: 'Please provide a valid official email.' });
    }

    if (!bloodBankName || !bloodBankType || !registrationNumber || !contactPerson || !phone || !state || !district || !city || !fullAddress || !pincode) {
      return res.status(400).json({ error: 'MISSING_FIELDS', message: 'All fields are required.' });
    }

    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'INVALID_PASSWORD', message: 'Password must be at least 6 characters.' });
    }

    const verificationData = verificationTokens.get(email);
    if (!verificationData || verificationData.token !== otpVerificationToken || Date.now() > verificationData.expiresAt) {
      return res.status(403).json({ error: 'EMAIL_NOT_VERIFIED', message: 'Please verify your email before creating your account.' });
    }

    // Attempt to create Supabase Auth User
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: bloodBankName, type: 'blood_bank' }
    });

    if (authError) {
      if (authError.message.toLowerCase().includes('already registered') || authError.status === 422) {
        return res.status(409).json({ error: 'EMAIL_ALREADY_REGISTERED', message: 'This email is already registered. Please log in instead.' });
      }
      console.error('Supabase auth error:', authError);
      return res.status(500).json({ error: 'REGISTRATION_FAILED', message: 'We couldn\'t create your account right now. Please try again.' });
    }

    if (!authData.user) {
      return res.status(500).json({ error: 'REGISTRATION_FAILED', message: 'We couldn\'t create your account right now. Please try again.' });
    }

    const userId = authData.user.id;

    // Insert into blood_bank_profiles
    const { error: dbError } = await supabase.from('blood_bank_profiles').insert({
      user_id: userId,
      blood_bank_name: bloodBankName,
      blood_bank_type: bloodBankType,
      registration_license_number: registrationNumber,
      official_email: email,
      contact_person: contactPerson,
      phone_number: phone,
      state: state,
      district: district,
      city: city,
      full_address: fullAddress,
      pincode: pincode,
      email_verified: true
    });

    if (dbError) {
      console.error('Supabase db error:', dbError);
      // Rollback Auth user creation
      await supabase.auth.admin.deleteUser(userId);
      return res.status(500).json({ error: 'REGISTRATION_FAILED', message: 'We couldn\'t create your account right now. Please try again.' });
    }

    // Cleanup token
    verificationTokens.delete(email);

    res.status(200).json({ message: 'Blood Bank Account created successfully.' });
  } catch (error) {
    console.error('Error in complete-blood-bank-registration:', error);
    res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: 'We couldn\'t create your account right now. Please try again.' });
  }
});

// POST /api/auth/complete-hospital-registration
router.post('/complete-hospital-registration', async (req: Request, res: Response) => {
  try {
    const {
      hospitalName,
      hospitalType,
      registrationNumber,
      email: rawEmail,
      contactPersonName,
      designation,
      phoneNumber,
      alternatePhone,
      state,
      district,
      city,
      pincode,
      fullAddress,
      numberOfBeds,
      hospitalCategory,
      emergencyServices,
      departmentsRequiringBlood,
      password,
      termsAccepted,
      otpVerificationToken,
    } = req.body;

    // ── Validate email ────────────────────────────────────────────────
    const email = validateAndNormalizeEmail(rawEmail);
    if (!email) {
      return res.status(400).json({ error: 'INVALID_EMAIL', message: 'Please provide a valid official email.' });
    }

    // ── Validate required fields ──────────────────────────────────────
    if (
      !hospitalName || !hospitalType || !registrationNumber ||
      !contactPersonName || !designation || !phoneNumber ||
      !state || !district || !city || !pincode || !fullAddress ||
      !numberOfBeds || !hospitalCategory || !emergencyServices
    ) {
      return res.status(400).json({ error: 'MISSING_FIELDS', message: 'All required fields must be filled.' });
    }

    // ── Validate password ─────────────────────────────────────────────
    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'INVALID_PASSWORD', message: 'Password must be at least 6 characters.' });
    }

    // ── Validate terms accepted ───────────────────────────────────────
    if (termsAccepted !== true) {
      return res.status(400).json({ error: 'TERMS_NOT_ACCEPTED', message: 'You must accept the Terms of Service.' });
    }

    // ── Validate OTP verification token ──────────────────────────────
    // This token was issued by /verify-registration-otp after successful OTP check.
    // Without a valid token the registration is rejected — prevents bypassing OTP.
    const verificationData = verificationTokens.get(email);
    if (
      !verificationData ||
      verificationData.token !== otpVerificationToken ||
      Date.now() > verificationData.expiresAt
    ) {
      return res.status(403).json({
        error: 'EMAIL_NOT_VERIFIED',
        message: 'Please verify your email before creating your account.'
      });
    }

    // ── Helper: build the profile insert payload ──────────────────────
    const buildProfilePayload = (userId: string) => ({
      user_id:                      userId,
      hospital_name:                hospitalName,
      hospital_type:                hospitalType,
      registration_number:          registrationNumber,
      official_email:               email,
      contact_person_name:          contactPersonName,
      designation:                  designation,
      phone_number:                 phoneNumber,
      alternate_phone:              alternatePhone || null,
      state:                        state,
      district:                     district,
      city:                         city,
      pincode:                      pincode,
      full_address:                 fullAddress,
      number_of_beds:               Number(numberOfBeds),
      hospital_category:            hospitalCategory,
      emergency_services_24x7:      emergencyServices,
      departments_requiring_blood:  departmentsRequiringBlood || null,
      email_verified:               true,
      terms_accepted:               termsAccepted,
    });

    // ── Try to create Supabase Auth user ──────────────────────────────
    // admin.createUser with email_confirm: true — no confirmation email sent.
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { hospital_name: hospitalName, type: 'hospital' }
    });

    // ── Handle "already registered" — check for orphaned auth user ───
    // A previous failed attempt (e.g. rate-limit hit on signUp) may have
    // created the auth user but never saved the hospital profile.
    // We detect this and complete the registration instead of blocking it.
    if (authError && (authError.message.toLowerCase().includes('already registered') || authError.status === 422)) {

      // Find the existing auth user by email
      const { data: listData, error: listError } = await supabase.auth.admin.listUsers({ perPage: 1000 });
      if (listError || !listData) {
        console.error('Failed to list users:', listError);
        return res.status(500).json({ error: 'REGISTRATION_FAILED', message: 'We couldn\'t complete registration. Please try again.' });
      }

      const existingAuthUser = listData.users.find(u => u.email?.toLowerCase() === email);
      if (!existingAuthUser) {
        return res.status(500).json({ error: 'REGISTRATION_FAILED', message: 'We couldn\'t complete registration. Please try again.' });
      }

      // Check if a hospital_profiles row already exists for this user
      const { data: existingProfile } = await supabase
        .from('hospital_profiles')
        .select('id')
        .eq('user_id', existingAuthUser.id)
        .maybeSingle();

      if (existingProfile) {
        // A complete profile exists — this is a genuine duplicate registration
        return res.status(409).json({
          error: 'EMAIL_ALREADY_REGISTERED',
          message: 'This email is already registered. Please log in instead.'
        });
      }

      // Orphaned auth user — profile was never created.
      // Reset the password to what the user just entered, then create the profile.
      await supabase.auth.admin.updateUserById(existingAuthUser.id, {
        password,
        email_confirm: true,
      });

      const { error: dbError } = await supabase
        .from('hospital_profiles')
        .insert(buildProfilePayload(existingAuthUser.id));

      if (dbError) {
        console.error('Supabase DB error (orphan recovery):', dbError);
        return res.status(500).json({
          error: 'REGISTRATION_FAILED',
          message: dbError.message || 'We couldn\'t save your profile. Please try again.'
        });
      }

      verificationTokens.delete(email);
      return res.status(200).json({ message: 'Hospital account created successfully.' });
    }

    // ── Other auth errors ─────────────────────────────────────────────
    if (authError) {
      console.error('Supabase auth error:', authError);
      return res.status(500).json({
        error: 'REGISTRATION_FAILED',
        message: 'We couldn\'t create your account right now. Please try again.'
      });
    }

    if (!authData.user) {
      return res.status(500).json({
        error: 'REGISTRATION_FAILED',
        message: 'We couldn\'t create your account right now. Please try again.'
      });
    }

    const userId = authData.user.id;

    // ── Insert hospital profile ───────────────────────────────────────
    const { error: dbError } = await supabase
      .from('hospital_profiles')
      .insert(buildProfilePayload(userId));

    if (dbError) {
      console.error('Supabase DB error:', dbError);
      // Rollback: delete the auth user so it doesn't become an orphan
      await supabase.auth.admin.deleteUser(userId);
      return res.status(500).json({
        error: 'REGISTRATION_FAILED',
        message: dbError.message || 'We couldn\'t save your profile. Please try again.'
      });
    }

    // ── Cleanup ───────────────────────────────────────────────────────
    verificationTokens.delete(email);

    res.status(200).json({ message: 'Hospital account created successfully.' });
  } catch (error) {
    console.error('Error in complete-hospital-registration:', error);
    res.status(500).json({
      error: 'INTERNAL_SERVER_ERROR',
      message: 'We couldn\'t create your account right now. Please try again.'
    });
  }
});

export default router;
