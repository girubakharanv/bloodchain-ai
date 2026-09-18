import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { HospitalRegistration } from '../../components/HospitalRegistration/HospitalRegistration';

export const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialView = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const [view, setView] = useState<'login' | 'register'>(initialView);
  const [registerStep, setRegisterStep] = useState<1 | 2 | 3>(1);
  const [dob, setDob] = useState('');

  // Password Verification State
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // OTP Verification State
  const [email, setEmail] = useState('');
  const [verificationState, setVerificationState] = useState<'idle' | 'sending' | 'awaiting_otp' | 'verifying' | 'verified'>('idle');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [otpError, setOtpError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [verificationToken, setVerificationToken] = useState<string | null>(null);

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setOtpError(null);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).replace(/\D/g, '');
    if (pastedData) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      setOtpError(null);
      const focusIndex = Math.min(pastedData.length, 5);
      otpRefs.current[focusIndex]?.focus();
    }
  };

  const handleSendOtp = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setRegisterError('Please enter a valid email address.');
      return;
    }
    setVerificationState('sending');
    setRegisterError(null);
    try {
      const res = await fetch('http://localhost:3001/api/auth/send-registration-otp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setVerificationState('awaiting_otp');
        setRegisterStep(2);
        setCooldown(60);
      } else {
        setVerificationState('idle');
        setRegisterError(data.message || 'Failed to send OTP.');
      }
    } catch (err) {
      setVerificationState('idle');
      setRegisterError('An error occurred while connecting to the server.');
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setOtpError('Please enter a 6-digit verification code.');
      return;
    }
    setVerificationState('verifying');
    try {
      const res = await fetch('http://localhost:3001/api/auth/verify-registration-otp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, otp: otpString })
      });
      const data = await res.json();
      if (res.ok) {
        setVerificationState('verified');
        setVerificationToken(data.verificationToken);
        setRegisterStep(1);
        setOtpError(null);
      } else {
        setVerificationState('awaiting_otp');
        if (data.error === 'OTP_INVALID') {
          setOtpError('Incorrect verification code.\nPlease try again.');
          setOtp(Array(6).fill(''));
          otpRefs.current[0]?.focus();
        } else if (data.error === 'OTP_EXPIRED') {
          setOtpError('This verification code has expired.\nPlease request a new code.');
        } else if (data.error === 'OTP_ATTEMPTS_EXCEEDED') {
          setOtpError('Too many incorrect attempts.\nPlease request a new verification code.');
        } else {
          setOtpError(data.message || 'Verification failed.');
        }
      }
    } catch (err) {
      setVerificationState('awaiting_otp');
      setOtpError('An error occurred while verifying the OTP.');
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    setVerificationState('sending');
    setOtpError(null);
    try {
      const res = await fetch('http://localhost:3001/api/auth/resend-registration-otp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setVerificationState('awaiting_otp');
        setCooldown(60);
        setOtp(Array(6).fill(''));
        otpRefs.current[0]?.focus();
      } else {
        setVerificationState('awaiting_otp');
        setOtpError(data.message || 'Failed to resend OTP.');
      }
    } catch (err) {
      setVerificationState('awaiting_otp');
      setOtpError('An error occurred while resending the OTP.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (verificationState !== 'verified' || !verificationToken) {
      setRegisterError('Please verify your email before creating your account.');
      return;
    }
    if (!passwordVerified) {
      setRegisterError('Please verify your password before creating your account.');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const fullName = formData.get('fullName') as string;
    const phone = formData.get('phone') as string;
    const bloodGroup = formData.get('bloodGroup') as string;
    const termsAccepted = formData.get('termsAccepted') === 'on';

    try {
      const res = await fetch('http://localhost:3001/api/auth/complete-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          dateOfBirth: dob,
          bloodGroup,
          password,
          termsAccepted,
          otpVerificationToken: verificationToken
        })
      });
      if (res.ok) {
        navigate('/Overview');
      } else {
        const data = await res.json();
        setRegisterError(data.message || 'Failed to create account.');
      }
    } catch (err) {
      setRegisterError('An error occurred while creating your account.');
    }
  };

  const handleChangeEmail = () => {
    setVerificationState('idle');
    setOtp(Array(6).fill(''));
    setOtpError(null);
    setRegisterStep(1);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setLoginError('Please enter both email and password.');
      return;
    }

    setLoginError(null);
    setLoginLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim().toLowerCase(),
        password: loginPassword
      });

      if (error) {
        // We catch all Supabase errors and show a generic one
        setLoginError('Invalid email or password.');
      } else {
        navigate('/overview');
      }
    } catch (err) {
      setLoginError('Unable to connect. Please check your connection and try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, ''); // remove non-digits
    if (val.length > 8) val = val.slice(0, 8);

    if (val.length >= 5) {
      val = `${val.slice(0, 2)}/${val.slice(2, 4)}/${val.slice(4)}`;
    } else if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setDob(val);
  };
  if (searchParams.get('type') === 'bank') {
    return (
      <div className="relative w-screen h-screen overflow-hidden bg-[#efece6] font-sans text-ink-900 selection:bg-blood-800/20 selection:text-blood-900">
        <video
          src="/auth-bg.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-90"
        />

        {/* Wrapper — identical structure to Donor login */}
        <div className="relative z-10 w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 pointer-events-none">

          {/* Top-Left Logo */}
          <div className="absolute top-8 left-8 md:left-12 lg:left-16 flex items-center gap-3 pointer-events-auto z-20">
            <div className="w-10 h-10 bg-[#581c1c] flex items-center justify-center text-white font-editorial text-2xl font-bold">B</div>
            <span className="font-bold tracking-tight text-lg text-[#1a1a1a]">BLOODCHAIN <span className="font-light">AI</span></span>
          </div>

          {/* Top-Right Register */}
          <div className="absolute top-8 right-8 md:right-12 lg:right-16 flex items-center gap-4 pointer-events-auto z-20">
            <button onClick={() => navigate('/?showBankRegister=true')} className="px-5 py-2 rounded-full border border-[#bfae9e] text-[13px] font-semibold text-[#581c1c] hover:bg-[#581c1c]/5 transition-colors cursor-pointer">
              Register &rarr;
            </button>
          </div>

          {/* Full-width heading */}
          <div className="pointer-events-auto mb-12 mt-10">
            <h1 className="font-editorial text-5xl md:text-6xl lg:text-[5rem] font-bold tracking-tight text-[#1a1a1a] leading-[1.05]">
              Every unit matters.<br />
              Every second counts.
            </h1>
          </div>

          {/* Bottom row: diagram LEFT, card RIGHT */}
          <div className="flex flex-col relative mt-4 md:pl-[240px] pointer-events-auto">
            {/* Network diagram — same size as Donor login */}
            <div className="hidden md:block absolute left-0 top-12 w-[220px] h-[220px] shrink-0 pointer-events-none">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 220 220" overflow="visible">
                <line x1="30" y1="30" x2="140" y2="110" stroke="#712e2e" strokeWidth="0.5" strokeOpacity="0.4" />
                <line x1="30" y1="30" x2="220" y2="80" stroke="#712e2e" strokeWidth="0.5" strokeOpacity="0.4" />
                <line x1="30" y1="30" x2="220" y2="150" stroke="#712e2e" strokeWidth="0.5" strokeOpacity="0.4" />
                <line x1="140" y1="110" x2="220" y2="50" stroke="#712e2e" strokeWidth="0.5" strokeOpacity="0.4" />
                <line x1="140" y1="110" x2="220" y2="110" stroke="#712e2e" strokeWidth="0.5" strokeOpacity="0.4" />
                <line x1="140" y1="110" x2="220" y2="180" stroke="#712e2e" strokeWidth="0.5" strokeOpacity="0.4" />
                <line x1="30" y1="190" x2="140" y2="110" stroke="#712e2e" strokeWidth="0.5" strokeOpacity="0.4" />
                <line x1="30" y1="190" x2="220" y2="110" stroke="#712e2e" strokeWidth="0.5" strokeOpacity="0.4" />
                <image href="/new_avatar.png" x="18" y="18" width="24" height="24" preserveAspectRatio="xMidYMid slice" />
                <text x="30" y="12" fontSize="10" fill="#333" textAnchor="middle" fontWeight="bold">DONOR</text>
                <image href="/new_avatar.png" x="128" y="98" width="24" height="24" preserveAspectRatio="xMidYMid slice" />
                <text x="156" y="113" fontSize="10" fill="#333" fontWeight="bold">NETWORK</text>
                <image href="/new_avatar.png" x="18" y="178" width="24" height="24" preserveAspectRatio="xMidYMid slice" />
                <text x="30" y="206" fontSize="10" fill="#333" textAnchor="middle" fontWeight="bold">HOSPITAL</text>
              </svg>
            </div>

            {/* Login Card */}
            <div className="bg-[#f7f5ef]/95 backdrop-blur-md rounded-xl p-6 w-full max-w-[400px] shadow-[0_15px_50px_rgba(0,0,0,0.08)] border border-[#e5e0d8] relative z-10">
              <form className="space-y-4" onSubmit={handleLoginSubmit}>
                {loginError && (
                  <div className="mb-2 p-2 bg-red-50/50 border border-red-200 rounded text-red-600 text-[11px] font-medium text-center">
                    {loginError}
                  </div>
                )}
                <div>
                  <label className="block text-[13px] font-semibold text-[#4a4a4a] mb-1">Email address</label>
                  <input type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} disabled={loginLoading} className="w-full bg-[#eaf0fb] border border-[#bfae9e] rounded-md px-3 py-2 text-[#333] focus:outline-none focus:border-[#581c1c] focus:ring-1 focus:ring-[#581c1c] transition-colors disabled:opacity-60" />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#4a4a4a] mb-1">Password</label>
                  <div className="relative">
                    <input type={showLoginPassword ? "text" : "password"} required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} disabled={loginLoading} className="w-full bg-[#eaf0fb] border border-[#e0d6cb] rounded-md px-3 py-2 pr-10 text-[#333] focus:outline-none focus:border-[#581c1c] focus:ring-1 focus:ring-[#581c1c] transition-colors disabled:opacity-60" />
                    <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" disabled={loginLoading}>
                      {showLoginPassword ? (
                        <svg className="h-4 w-4 text-[#7a7a7a] hover:text-[#333] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4 text-[#7a7a7a] hover:text-[#333] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-[#bfae9e] text-[#581c1c] focus:ring-[#581c1c] bg-transparent cursor-pointer" />
                    <span className="text-[13px] font-medium text-[#4a4a4a]">Remember me</span>
                  </label>
                  <a href="#" className="text-[13px] text-[#581c1c] hover:underline font-semibold">Forgot password?</a>
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  <button type="submit" disabled={loginLoading} className="w-full py-3 bg-[#4c1616] text-white rounded-md font-semibold tracking-wide text-[13px] hover:bg-[#380e0e] transition-colors shadow-md disabled:opacity-70">
                    {loginLoading ? 'AUTHENTICATING...' : 'ENTER BLOODCHAIN \u2192'}
                  </button>
                  <button type="button" onClick={() => window.location.href = '/'} disabled={loginLoading} className="w-full py-2 bg-transparent text-[#4a4a4a] font-semibold tracking-wide text-[12px] hover:text-[#581c1c] transition-colors disabled:opacity-70">
                    &larr; BACK TO HOME
                  </button>
                </div>
              </form>
            </div>

            {/* Below card link */}
            <div className="mt-5 text-center w-full max-w-[400px]">
              <button onClick={() => navigate('/?showBankRegister=true')} className="text-[12px] font-medium text-[#1a1a1a] hover:text-[#581c1c] transition-colors pointer-events-auto cursor-pointer">
                New to BloodChain? <span className="font-semibold text-[#581c1c]">Create your bank account &rarr;</span>
              </button>
            </div>
          </div>

          {/* Far-Right Floating Text — beside the blood bag */}
          <div className="hidden lg:flex absolute right-16 xl:right-24 top-[35%] -translate-y-1/2 flex-col items-start gap-0 pointer-events-none z-20">
            <div className="flex flex-col text-[13px] font-bold tracking-[0.3em] text-[#2a2a2a] uppercase leading-[2.8]">
              <span>EVERY</span>
              <span>UNIT</span>
              <span>MOVES</span>
              <span>WITH</span>
              <span>PURPOSE.</span>
            </div>
            <div className="w-8 h-[2px] bg-[#981b1b] mt-3"></div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black font-sans text-ink-900 selection:bg-blood-800/20 selection:text-blood-900">
      {/* Full screen background video */}
      <video
        key={searchParams.get('type') === 'hospital' ? 'hospital-bg' : 'default-bg'}
        src={searchParams.get('type') === 'hospital' ? "/hospital_bg.mp4" : "/InShot_20260913_104034655.mp4"}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {view === 'login' ? (
        /* Login View (Unchanged design, just updated Link to button) */
        <div className="relative z-10 w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 pointer-events-none">
          {/* Top Logo */}
          <div className="absolute top-8 left-8 md:left-12 lg:left-16 flex items-center gap-3 pointer-events-auto z-20">
            <div className="w-10 h-10 bg-[#581c1c] flex items-center justify-center text-white font-editorial text-2xl font-bold">B</div>
            <span className="font-bold tracking-tight text-lg text-[#1a1a1a]">BLOODCHAIN <span className="font-light">AI</span></span>
          </div>

          {/* Top Right Register */}
          <div className="absolute top-8 right-8 md:right-12 lg:right-16 flex items-center gap-4 pointer-events-auto z-20">
            <button onClick={() => { setView('register'); setRegisterStep(1); }} className="px-5 py-2 rounded-full border border-[#bfae9e] text-[13px] font-semibold text-[#581c1c] hover:bg-[#581c1c]/5 transition-colors cursor-pointer">
              Register &rarr;
            </button>
          </div>

          <div className="max-w-[850px] pointer-events-auto relative mt-4">
            <div className={searchParams.get('type') === 'hospital' ? "pointer-events-auto mb-12" : "mb-4"}>
              <h1 className={`font-editorial font-bold tracking-tight text-[#1a1a1a] leading-[1.05] ${searchParams.get('type') === 'hospital' ? 'text-5xl md:text-6xl lg:text-[5rem]' : 'text-5xl md:text-6xl lg:text-[4.5rem]'}`}>
                {searchParams.get('type') === 'hospital' ? (
                  <>
                    Care connects.<br />
                    <span className="text-[#581c1c]">Every need, anticipated.</span>
                  </>
                ) : (
                  <>
                    One network.<br />
                    Every drop connected.
                  </>
                )}
              </h1>
            </div>

            <div className="flex flex-col relative mt-16 md:pl-[240px]">
              {/* Network Visualization */}
              <div className="hidden md:block absolute left-0 top-12 w-[220px] h-[220px] shrink-0 pointer-events-none">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 220 220" overflow="visible">
                  <line x1="30" y1="30" x2="140" y2="110" stroke="#712e2e" strokeWidth="0.5" strokeOpacity="0.4" />
                  <line x1="30" y1="30" x2="220" y2="80" stroke="#712e2e" strokeWidth="0.5" strokeOpacity="0.4" />
                  <line x1="30" y1="30" x2="220" y2="150" stroke="#712e2e" strokeWidth="0.5" strokeOpacity="0.4" />
                  <line x1="140" y1="110" x2="220" y2="50" stroke="#712e2e" strokeWidth="0.5" strokeOpacity="0.4" />
                  <line x1="140" y1="110" x2="220" y2="110" stroke="#712e2e" strokeWidth="0.5" strokeOpacity="0.4" />
                  <line x1="140" y1="110" x2="220" y2="180" stroke="#712e2e" strokeWidth="0.5" strokeOpacity="0.4" />
                  <line x1="30" y1="190" x2="140" y2="110" stroke="#712e2e" strokeWidth="0.5" strokeOpacity="0.4" />
                  <line x1="30" y1="190" x2="220" y2="110" stroke="#712e2e" strokeWidth="0.5" strokeOpacity="0.4" />
                  {/* Replace dots with avatar images */}
                  <image href="/new_avatar.png" x="18" y="18" width="24" height="24" preserveAspectRatio="xMidYMid slice" />
                  <text x="30" y="12" fontSize="10" fill="#333" textAnchor="middle" fontWeight="bold">DONOR</text>

                  <image href="/new_avatar.png" x="128" y="98" width="24" height="24" preserveAspectRatio="xMidYMid slice" />
                  <text x="156" y="113" fontSize="10" fill="#333" fontWeight="bold">NETWORK</text>

                  <image href="/new_avatar.png" x="18" y="178" width="24" height="24" preserveAspectRatio="xMidYMid slice" />
                  <text x="30" y="206" fontSize="10" fill="#333" textAnchor="middle" fontWeight="bold">HOSPITAL</text>
                </svg>
              </div>

              {/* Login Card */}
              <div className="bg-[#f7f5ef]/95 backdrop-blur-md rounded-xl p-6 w-full max-w-[400px] shadow-[0_15px_50px_rgba(0,0,0,0.08)] border border-[#e5e0d8] relative z-10">
                <form className="space-y-4" onSubmit={handleLoginSubmit}>
                  {loginError && (
                    <div className="mb-2 p-2 bg-red-50/50 border border-red-200 rounded text-red-600 text-[11px] font-medium text-center">
                      {loginError}
                    </div>
                  )}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#4a4a4a] mb-1">Email address</label>
                    <input type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} disabled={loginLoading} className="w-full bg-transparent border border-[#bfae9e] rounded-md px-3 py-2 text-[#333] focus:outline-none focus:border-[#581c1c] focus:ring-1 focus:ring-[#581c1c] transition-colors disabled:opacity-60" />
                  </div>
                  <div className="relative">
                    <label className="block text-[13px] font-semibold text-[#4a4a4a] mb-1">Password</label>
                    <div className="relative">
                      <input type={showLoginPassword ? "text" : "password"} required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} disabled={loginLoading} className="w-full bg-transparent border border-[#e0d6cb] rounded-md px-3 py-2 pr-10 text-[#333] focus:outline-none focus:border-[#581c1c] focus:ring-1 focus:ring-[#581c1c] transition-colors disabled:opacity-60" />
                      <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer disabled:opacity-60" disabled={loginLoading}>
                        {showLoginPassword ? (
                          <svg className="h-4 w-4 text-[#7a7a7a] hover:text-[#333] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4 text-[#7a7a7a] hover:text-[#333] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-[#bfae9e] text-[#581c1c] focus:ring-[#581c1c] bg-transparent cursor-pointer" />
                      <span className="text-[13px] font-medium text-[#4a4a4a]">Remember me</span>
                    </label>
                    <a href="#" className="text-[13px] text-[#581c1c] hover:underline font-semibold">Forgot password?</a>
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    <button type="submit" disabled={loginLoading} className="w-full py-3 bg-[#4c1616] text-white rounded-md font-semibold tracking-wide text-[13px] hover:bg-[#380e0e] transition-colors shadow-md disabled:opacity-70">
                      {loginLoading ? 'AUTHENTICATING...' : 'ENTER BLOODCHAIN \u2192'}
                    </button>
                    <button type="button" onClick={() => window.location.href = '/'} disabled={loginLoading} className="w-full py-2 bg-transparent text-[#4a4a4a] font-semibold tracking-wide text-[12px] hover:text-[#581c1c] transition-colors disabled:opacity-70">
                      &larr; BACK TO HOME
                    </button>
                  </div>
                </form>
              </div>

              <div className="mt-5 text-center w-full max-w-[400px]">
                <button onClick={() => { setView('register'); setRegisterStep(1); }} className="text-[12px] font-medium text-[#1a1a1a] hover:text-[#581c1c] transition-colors pointer-events-auto cursor-pointer">
                  New to BloodChain? <span className="font-semibold text-[#581c1c]">Create your donor account &rarr;</span>
                </button>
              </div>
            </div>
          </div>

          {/* Floating text on the right side */}
          {searchParams.get('type') !== 'hospital' && (
            <div className="hidden lg:block absolute right-16 top-[35%] -translate-y-1/2 pointer-events-none">
              <div className="flex flex-col text-[12px] font-bold tracking-[0.35em] text-[#333333] uppercase leading-[2.8]">
                <span>A</span>
                <span>SAFER</span>
                <span>TOMORROW</span>
                <span>FLOWS</span>
                <span>THROUGH</span>
                <span>PEOPLE</span>
                <span>LIKE YOU.</span>
              </div>
              <div className="w-8 h-[2px] bg-[#712e2e] mt-6"></div>
            </div>
          )}

        </div>
      ) : (
        /* Register View (New Design from Reference) */
        <div className="relative z-10 w-full h-full flex pointer-events-none">
          {/* Top Logo */}
          <div className="absolute top-8 left-8 md:left-12 lg:left-16 flex items-center gap-3 pointer-events-auto z-20">
            <div className="w-10 h-10 bg-[#581c1c] flex items-center justify-center text-white font-editorial text-2xl font-bold">B</div>
            <span className="font-bold tracking-tight text-lg text-[#1a1a1a]">BLOODCHAIN <span className="font-light">AI</span></span>
          </div>

          {/* Top Right Sign In */}
          <div className="absolute top-8 right-8 md:right-12 lg:right-16 flex items-center gap-4 pointer-events-auto z-20">
            <button onClick={() => { setView('login'); setRegisterStep(1); }} className="px-5 py-2 rounded-full border border-[#bfae9e] text-[13px] font-semibold text-[#581c1c] hover:bg-[#581c1c]/5 transition-colors cursor-pointer">
              Sign In &rarr;
            </button>
          </div>

          {/* Full-width heading — same style as Donor Login */}
          <div className="absolute top-28 left-8 md:left-16 lg:left-24 right-0 pointer-events-auto pr-[30%]">
            <h1 className="font-editorial text-5xl md:text-6xl lg:text-[4.5rem] font-bold tracking-tight text-[#1a1a1a] leading-[1.05]">
              {searchParams.get('type') === 'hospital' ? (
                <>Better care starts<br />with visibility.</>
              ) : (
                <>Be the reason<br />the network moves.</>
              )}
            </h1>
          </div>

          {/* Left Side: Form Content */}
          <div className="w-[50%] h-full flex flex-col justify-start pl-8 md:pl-16 lg:pl-24 pointer-events-auto relative pt-[18rem] pb-8">
            <div className="max-w-[480px]">

              {searchParams.get('type') === 'hospital' ? (
                <HospitalRegistration />
              ) : (
                /* Donor Register Card with smooth transition */
                <div className="relative w-full h-[420px] bg-[#f7f5ef]/95 backdrop-blur-md rounded-xl shadow-[0_15px_50px_rgba(0,0,0,0.08)] border border-[#e5e0d8] z-10 overflow-hidden">

                  {/* Step 1: Details */}
                  <div className={`absolute inset-0 p-6 transition-all duration-500 ease-in-out flex flex-col ${registerStep === 1 ? 'opacity-100 translate-x-0 z-10 pointer-events-auto' : 'opacity-0 -translate-x-full z-0 pointer-events-none'}`}>
                    <div className="mb-4">
                      <span className="text-[10px] font-bold tracking-[0.15em] text-[#581c1c] uppercase">CREATE YOUR DONOR ACCOUNT</span>
                    </div>
                    <form className="space-y-6 flex-1 flex flex-col" onSubmit={handleRegisterSubmit}>
                      {registerError && (
                        <div className="mb-2 p-2 bg-red-50/50 border border-red-200 rounded text-red-600 text-[11px] font-medium text-center">
                          {registerError}
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg className="h-4 w-4 text-[#7a7a7a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <input type="text" name="fullName" placeholder="Full name" required className="w-full bg-transparent border border-[#d5ccbe] rounded-md pl-10 pr-3 py-2.5 text-[13px] text-[#333] placeholder-[#7a7a7a] focus:outline-none focus:border-[#581c1c] focus:ring-1 focus:ring-[#581c1c] transition-colors" />
                          </div>
                        </div>
                        <div className="flex flex-col relative">
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg className="h-4 w-4 text-[#7a7a7a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} disabled={verificationState === 'verified' || verificationState === 'sending' || verificationState === 'awaiting_otp' || verificationState === 'verifying'} required className="w-full bg-transparent border border-[#d5ccbe] rounded-md pl-10 pr-3 py-2.5 text-[13px] text-[#333] placeholder-[#7a7a7a] focus:outline-none focus:border-[#581c1c] focus:ring-1 focus:ring-[#581c1c] transition-colors disabled:opacity-60" />
                          </div>

                          <div className="absolute top-full right-0 mt-1 flex justify-end pointer-events-auto">
                            {verificationState === 'idle' && email.length > 0 && (
                              <button type="button" onClick={handleSendOtp} className="text-[10px] font-bold text-[#581c1c] uppercase tracking-wide hover:underline cursor-pointer">VERIFY EMAIL &rarr;</button>
                            )}
                            {verificationState === 'sending' && (
                              <span className="text-[10px] font-bold text-[#7a7a7a] uppercase tracking-wide">SENDING...</span>
                            )}
                            {verificationState === 'verifying' && (
                              <span className="text-[10px] font-bold text-[#7a7a7a] uppercase tracking-wide">VERIFYING...</span>
                            )}
                            {verificationState === 'verified' && (
                              <span className="text-[10px] font-bold text-green-600 uppercase tracking-wide flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                VERIFIED
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {verificationState === 'awaiting_otp' && (
                        <div className="p-4 bg-white/50 border border-[#d5ccbe] rounded-md shadow-sm">
                          <p className="text-[11px] font-medium text-[#4a4a4a] mb-3 text-center">
                            Enter the 6-digit code sent to <span className="font-bold text-[#1a1a1a]">{email}</span>
                          </p>
                          <div className="flex gap-2 justify-center mb-3">
                            {otp.map((digit, index) => (
                              <input
                                key={index}
                                ref={el => { otpRefs.current[index] = el; }}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={e => {
                                  const val = e.target.value.replace(/\D/g, '');
                                  const newOtp = [...otp];
                                  newOtp[index] = val;
                                  setOtp(newOtp);
                                  if (val && index < 5) otpRefs.current[index + 1]?.focus();
                                }}
                                onKeyDown={e => {
                                  if (e.key === 'Backspace' && !otp[index] && index > 0) {
                                    otpRefs.current[index - 1]?.focus();
                                  }
                                }}
                                className="w-8 h-10 bg-white border border-[#d5ccbe] rounded text-center text-sm font-bold text-[#333] focus:outline-none focus:border-[#581c1c] focus:ring-1 focus:ring-[#581c1c] transition-all"
                              />
                            ))}
                          </div>
                          {otpError && <p className="text-[#981b1b] text-[10px] font-semibold text-center mb-2">{otpError}</p>}
                          <div className="flex justify-center gap-4 mt-2">
                            <button type="button" onClick={handleVerifyOtp} disabled={otp.join('').length !== 6 || (verificationState as string) === 'verifying'} className="text-[11px] font-bold text-white bg-[#581c1c] px-4 py-1.5 rounded hover:bg-[#3d1313] transition-colors disabled:opacity-50">
                              VERIFY CODE
                            </button>
                            <button type="button" onClick={handleSendOtp} disabled={cooldown > 0} className="text-[11px] font-semibold text-[#581c1c] hover:underline disabled:text-[#7a7a7a] disabled:no-underline">
                              {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-[#7a7a7a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <input type="tel" name="phone" placeholder="Phone number" required className="w-full bg-transparent border border-[#d5ccbe] rounded-md pl-10 pr-3 py-2.5 text-[13px] text-[#333] placeholder-[#7a7a7a] focus:outline-none focus:border-[#581c1c] focus:ring-1 focus:ring-[#581c1c] transition-colors" />
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-auto cursor-pointer z-20">
                          <svg className="h-4 w-4 text-[#7a7a7a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <input
                            type="date"
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            onChange={(e) => {
                              const d = new Date(e.target.value);
                              if (!isNaN(d.getTime())) {
                                const formatted = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
                                setDob(formatted);
                              }
                            }}
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="DD/MM/YYYY"
                          value={dob}
                          onChange={handleDobChange}
                          required
                          className="w-full bg-transparent border border-[#d5ccbe] rounded-md pl-10 pr-3 py-2.5 text-[13px] text-[#333] placeholder-[#7a7a7a] focus:outline-none focus:border-[#581c1c] focus:ring-1 focus:ring-[#581c1c] transition-colors relative z-10"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-4 w-4 text-[#7a7a7a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                          </svg>
                        </div>
                        <select name="bloodGroup" defaultValue="" required className="w-full bg-transparent border border-[#d5ccbe] rounded-md pl-10 pr-8 py-2.5 text-[13px] text-[#333] appearance-none focus:outline-none focus:border-[#581c1c] focus:ring-1 focus:ring-[#581c1c] transition-colors cursor-pointer">
                          <option value="" disabled>Blood group</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg className="h-4 w-4 text-[#7a7a7a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      <div className="relative flex flex-col">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-[#7a7a7a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                          <input type={showRegisterPassword ? "text" : "password"} name="password" placeholder="Create password" value={password} onChange={(e) => { setPassword(e.target.value); setPasswordVerified(false); }} disabled={passwordVerified} required className="w-full bg-transparent border border-[#d5ccbe] rounded-md pl-10 pr-10 py-2.5 text-[13px] text-[#333] placeholder-[#7a7a7a] focus:outline-none focus:border-[#581c1c] focus:ring-1 focus:ring-[#581c1c] transition-colors disabled:opacity-60" />
                          <button type="button" onClick={() => setShowRegisterPassword(!showRegisterPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer pointer-events-auto">
                            {showRegisterPassword ? (
                              <svg className="h-4 w-4 text-[#7a7a7a] hover:text-[#333] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                              </svg>
                            ) : (
                              <svg className="h-4 w-4 text-[#7a7a7a] hover:text-[#333] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            )}
                          </button>
                        </div>
                        <div className="absolute top-full right-0 mt-1 flex justify-end pointer-events-auto">
                          {passwordVerified ? (
                            <span className="text-[10px] font-bold text-green-700 uppercase tracking-wide">&#10003; PASSWORD VERIFIED</span>
                          ) : password.length > 0 ? (
                            <button type="button" onClick={() => setRegisterStep(3)} className="text-[10px] font-bold text-[#581c1c] uppercase tracking-wide hover:underline cursor-pointer">VERIFY PASSWORD &rarr;</button>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center pt-1 pb-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="termsAccepted" required className="w-3.5 h-3.5 rounded-sm border-[#bfae9e] text-[#581c1c] focus:ring-[#581c1c] bg-transparent cursor-pointer" />
                        <span className="text-[11px] font-medium text-[#4a4a4a]">I agree to the <a href="#" className="text-[#581c1c] hover:underline">Terms of Service</a> and <a href="#" className="text-[#581c1c] hover:underline">Privacy Policy</a></span>
                      </label>
                    </div>

                    <div className="mt-auto flex flex-col gap-2">
                      <button type="submit" className="w-full py-3 bg-[#4c1616] text-white rounded-md font-semibold tracking-wide text-[13px] hover:bg-[#380e0e] transition-colors shadow-md">
                        CREATE ACCOUNT &rarr;
                      </button>
                      <button type="button" onClick={() => window.location.href = '/'} className="w-full py-2 bg-transparent text-[#4a4a4a] font-semibold tracking-wide text-[12px] hover:text-[#581c1c] transition-colors">
                        &larr; BACK TO HOME
                      </button>
                    </div>
                  </form>
                </div>

                {/* Step 2: OTP Verification */}
                <div className={`absolute inset-0 p-6 transition-all duration-500 ease-in-out flex flex-col justify-center ${registerStep === 2 ? 'opacity-100 translate-x-0 z-10 pointer-events-auto' : 'opacity-0 translate-x-full z-0 pointer-events-none'}`}>
                  <div className="mb-6">
                    <span className="text-[10px] font-bold tracking-[0.15em] text-[#581c1c] uppercase">VERIFY YOUR EMAIL</span>
                  </div>

                  <div className="mb-6">
                    <p className="text-[13px] text-[#4a4a4a]">
                      We sent a 6-digit verification code to<br />
                      <span className="font-semibold text-[#1a1a1a]">{email}</span>
                    </p>
                  </div>

                  <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleVerifyOtp(); }}>
                    <div>
                      <div className="flex gap-2 justify-center mb-2">
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            ref={el => { otpRefs.current[index] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            onPaste={handleOtpPaste}
                            disabled={verificationState === 'verifying' || otpError === 'Too many incorrect attempts.\nPlease request a new verification code.'}
                            className={`w-10 h-12 text-center text-lg font-bold bg-transparent border ${otpError ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-[#d5ccbe] focus:border-[#581c1c] focus:ring-[#581c1c]'} rounded-md text-[#333] focus:outline-none focus:ring-1 shadow-sm transition-colors`}
                          />
                        ))}
                      </div>

                      {otpError && (
                        <p className="text-red-500 text-[11px] font-medium text-center mt-2 whitespace-pre-line">{otpError}</p>
                      )}
                    </div>

                    <button type="submit" disabled={verificationState === 'verifying' || otp.some(d => !d) || otpError === 'Too many incorrect attempts.\nPlease request a new verification code.'} className="w-full py-3 bg-[#4c1616] text-white rounded-md font-semibold tracking-wide text-[13px] hover:bg-[#380e0e] transition-colors shadow-md mt-4 disabled:opacity-50">
                      {verificationState === 'verifying' ? 'VERIFYING...' : 'VERIFY CODE \u2192'}
                    </button>

                    <div className="flex flex-col items-center gap-3 mt-4">
                      <button type="button" onClick={handleResendOtp} disabled={cooldown > 0 || verificationState === 'sending'} className="text-[11px] font-bold text-[#581c1c] uppercase tracking-wide hover:underline disabled:opacity-50 disabled:hover:no-underline cursor-pointer">
                        {cooldown > 0 ? `Resend available in ${cooldown}s` : 'RESEND CODE \u2192'}
                      </button>
                      <button type="button" onClick={handleChangeEmail} className="text-[10px] font-bold text-[#8a8a8a] hover:text-[#581c1c] uppercase tracking-wide transition-colors cursor-pointer mt-2">
                        &larr; CHANGE EMAIL
                      </button>
                    </div>
                  </form>
                </div>

                {/* Step 3: Password Verification */}
                <div className={`absolute inset-0 p-6 transition-all duration-500 ease-in-out flex flex-col justify-center ${registerStep === 3 ? 'opacity-100 translate-x-0 z-10 pointer-events-auto' : 'opacity-0 translate-x-full z-0 pointer-events-none'}`}>
                  <div className="mb-6">
                    <span className="text-[10px] font-bold tracking-[0.15em] text-[#581c1c] uppercase">VERIFY YOUR PASSWORD</span>
                  </div>

                  <div className="mb-6">
                    <p className="text-[13px] text-[#4a4a4a]">
                      Please confirm the password you just created.
                    </p>
                  </div>

                  <form className="space-y-6" onSubmit={(e) => {
                    e.preventDefault();
                    if (confirmPassword === password) {
                      setPasswordVerified(true);
                      setPasswordError(null);
                      setRegisterStep(1);
                    } else {
                      setPasswordError('Passwords do not match. Please try again.');
                    }
                  }}>
                    <div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-4 w-4 text-[#7a7a7a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <input type={showRegisterPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(null); }} placeholder="Confirm password" required className={`w-full bg-transparent border ${passwordError ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-[#d5ccbe] focus:border-[#581c1c] focus:ring-[#581c1c]'} rounded-md pl-10 pr-10 py-2.5 text-[13px] text-[#333] placeholder-[#7a7a7a] focus:outline-none focus:ring-1 transition-colors`} />
                        <button type="button" onClick={() => setShowRegisterPassword(!showRegisterPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer pointer-events-auto">
                          {showRegisterPassword ? (
                            <svg className="h-4 w-4 text-[#7a7a7a] hover:text-[#333] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <svg className="h-4 w-4 text-[#7a7a7a] hover:text-[#333] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>

                      {passwordError && (
                        <p className="text-red-500 text-[11px] font-medium text-center mt-2 whitespace-pre-line">{passwordError}</p>
                      )}
                    </div>

                    <button type="submit" disabled={!confirmPassword} className="w-full py-3 bg-[#4c1616] text-white rounded-md font-semibold tracking-wide text-[13px] hover:bg-[#380e0e] transition-colors shadow-md mt-4 disabled:opacity-50">
                      VERIFY PASSWORD &rarr;
                    </button>

                    <div className="flex flex-col items-center gap-3 mt-4">
                      <button type="button" onClick={() => { setRegisterStep(1); setConfirmPassword(''); setPasswordError(null); }} className="text-[10px] font-bold text-[#8a8a8a] hover:text-[#581c1c] uppercase tracking-wide transition-colors cursor-pointer mt-2">
                        &larr; BACK
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              )}

              {/* Bottom Left Text */}
              <div className="absolute -bottom-16 left-8 flex items-center gap-3">
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#1a1a1a] uppercase">PREDICT</span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#1a1a1a] uppercase">MOVE</span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#1a1a1a] uppercase">DELIVER</span>
                <div className="h-[1px] w-24 bg-[#bfae9e] ml-2"></div>
              </div>
            </div>
          </div>

          {/* Middle: Timeline (Takes up ~25% of width) */}
          {searchParams.get('type') !== 'hospital' && (
            <div className="hidden lg:flex w-[25%] h-full flex-col justify-center items-start pointer-events-none z-0 -ml-16">
              <div className="relative flex flex-col justify-center py-2 gap-12">
                {/* Vertical connecting line */}
                <div className="absolute left-[23.5px] top-[24px] bottom-[24px] w-[1px] bg-[#712e2e]/40 z-0"></div>

                {/* 01 GIVE */}
                <div className="flex items-start gap-5 bg-transparent relative z-10">
                  <div className="w-12 h-12 rounded-full border border-[#712e2e] flex-shrink-0 flex items-center justify-center text-[#581c1c] bg-[#f7f5ef]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </div>
                  <div className="flex flex-col mt-0.5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[12px] font-bold text-[#1a1a1a] leading-tight">01</span>
                      <span className="text-[14px] font-bold text-[#581c1c] tracking-widest leading-none">GIVE</span>
                    </div>
                    <span className="text-[13px] text-[#4a4a4a] leading-snug w-40">Your donation starts the journey.</span>
                  </div>
                </div>

                {/* 02 FOLLOW */}
                <div className="flex items-start gap-5 bg-transparent relative z-10">
                  <div className="w-12 h-12 rounded-full border border-[#712e2e] flex-shrink-0 flex items-center justify-center text-[#581c1c] bg-[#f7f5ef]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                  </div>
                  <div className="flex flex-col mt-0.5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[12px] font-bold text-[#1a1a1a] leading-tight">02</span>
                      <span className="text-[14px] font-bold text-[#581c1c] tracking-widest leading-none">FOLLOW</span>
                    </div>
                    <span className="text-[13px] text-[#4a4a4a] leading-snug w-40">Track your contribution.</span>
                  </div>
                </div>

                {/* 03 IMPACT */}
                <div className="flex items-start gap-5 bg-transparent relative z-10">
                  <div className="w-12 h-12 rounded-full border border-[#712e2e] flex-shrink-0 flex items-center justify-center text-[#581c1c] bg-[#f7f5ef]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </div>
                  <div className="flex flex-col mt-0.5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[12px] font-bold text-[#1a1a1a] leading-tight">03</span>
                      <span className="text-[14px] font-bold text-[#581c1c] tracking-widest leading-none">IMPACT</span>
                    </div>
                    <span className="text-[13px] text-[#4a4a4a] leading-snug w-40">Be part of a stronger tomorrow.</span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Right Side: Spacer for Video (Takes up ~25% of width) */}
          <div className="hidden lg:flex w-[25%] h-full relative pointer-events-none">
          </div>

          {/* Floating text on the right side */}
          {searchParams.get('type') !== 'hospital' && (
            <div className="hidden lg:block absolute right-16 top-[35%] -translate-y-1/2 pointer-events-none">
              <div className="flex flex-col text-[12px] font-bold tracking-[0.35em] text-[#333333] uppercase leading-[2.8]">
                <span>A</span>
                <span>SAFER</span>
                <span>TOMORROW</span>
                <span>FLOWS</span>
                <span>THROUGH</span>
                <span>PEOPLE</span>
                <span>LIKE YOU.</span>
              </div>
              <div className="w-8 h-[2px] bg-[#712e2e] mt-6"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
