import React, { useState, useRef, useEffect } from 'react';
import {
  Building2, FileText, Mail, User, Phone, MapPin, Map, Home,
  Package, Lock, Eye, EyeOff, CheckCircle2, ShieldPlus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { indianStatesAndDistricts, indianStates } from '../../data/indianDistricts';

export const HospitalRegistration: React.FC = () => {
  const navigate = useNavigate();

  // Stages: 1, 'otp', 2, 3, 4, 5, 'success'
  const [stage, setStage] = useState<1 | 'otp' | 2 | 3 | 4 | 5 | 'success'>(1);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  // Form Data
  const [formData, setFormData] = useState({
    hospitalName: '',
    hospitalType: '',
    registrationNumber: '',
    officialEmail: '',

    contactPersonName: '',
    designation: '',
    phoneNumber: '',
    alternatePhone: '',

    state: '',
    district: '',
    city: '',
    pincode: '',
    fullAddress: '',

    numberOfBeds: '',
    hospitalCategory: '',
    emergencyServices: '',
    departmentsRequiringBlood: '',

    password: '',
    confirmPassword: '',
    termsAccepted: false
  });

  const stateOptions = indianStates;
  const districtOptions = indianStatesAndDistricts;

  const [errors, setErrors] = useState<Record<string, string>>({});

  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Autocomplete State
  const [districtSearch, setDistrictSearch] = useState('');
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);

  // OTP State
  const [verificationState, setVerificationState] = useState<'idle' | 'sending' | 'awaiting_otp' | 'verifying' | 'verified'>('idle');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [cooldown, setCooldown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [verificationToken, setVerificationToken] = useState<string | null>(null);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const changeStageSmoothly = (newStage: typeof stage, dir: 'forward' | 'backward') => {
    if (stage === newStage) return;
    setDirection(dir);

    // Quick fade out
    setTimeout(() => {
      setStage(newStage);
    }, 300);
  };

  // -------------------------------------------------------------
  // Validation Methods
  // -------------------------------------------------------------

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.hospitalName.trim()) newErrors.hospitalName = 'Required';
    if (!formData.hospitalType) newErrors.hospitalType = 'Required';
    if (!formData.registrationNumber.trim()) newErrors.registrationNumber = 'Required';
    if (!formData.officialEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.officialEmail)) {
      newErrors.officialEmail = 'Valid email required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.contactPersonName.trim()) newErrors.contactPersonName = 'Required';
    if (!formData.designation) newErrors.designation = 'Required';
    if (!/^\d{10}$/.test(formData.phoneNumber)) newErrors.phoneNumber = 'Valid 10-digit number required';
    if (formData.alternatePhone && !/^\d{10}$/.test(formData.alternatePhone)) {
      newErrors.alternatePhone = 'Valid 10-digit number required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.state) newErrors.state = 'Required';
    if (!formData.district) newErrors.district = 'Required';
    if (!formData.city.trim()) newErrors.city = 'Required';
    if (!formData.fullAddress.trim()) newErrors.fullAddress = 'Required';
    if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Valid 6-digit pincode required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.numberOfBeds || parseInt(formData.numberOfBeds) <= 0) newErrors.numberOfBeds = 'Valid number required';
    if (!formData.hospitalCategory) newErrors.hospitalCategory = 'Required';
    if (!formData.emergencyServices) newErrors.emergencyServices = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep5 = () => {
    const newErrors: Record<string, string> = {};
    if (formData.password.length < 6) newErrors.password = 'Min 6 characters required';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -------------------------------------------------------------
  // OTP & Submission Methods
  // -------------------------------------------------------------

  const handleSendOtp = async () => {
    if (!formData.officialEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.officialEmail)) {
      setErrors({ officialEmail: 'Valid email required' });
      return;
    }
    setVerificationState('sending');
    try {
      const res = await fetch('http://localhost:3001/api/auth/send-registration-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.officialEmail })
      });
      const data = await res.json();
      if (res.ok) {
        setCooldown(60);
        setVerificationState('awaiting_otp');
        setErrors({ otp: '' });
        changeStageSmoothly('otp', 'forward');
      } else {
        setErrors({ officialEmail: data.message || 'Failed to send OTP' });
        setVerificationState('idle');
      }
    } catch (err) {
      console.error(err);
      setErrors({ officialEmail: 'Network error occurred.' });
      setVerificationState('idle');
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setErrors({ otp: 'Please enter a 6-digit OTP' });
      return;
    }
    setVerificationState('verifying');
    try {
      const res = await fetch('http://localhost:3001/api/auth/verify-registration-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.officialEmail, otp: otpString })
      });
      const data = await res.json();
      if (res.ok) {
        setVerificationToken(data.verificationToken || null);
        setVerificationState('verified');
        setErrors({ otp: '' });
        changeStageSmoothly(1, 'backward');
      } else {
        setErrors({ otp: data.message || 'Invalid OTP' });
        setOtp(Array(6).fill(''));
        otpRefs.current[0]?.focus();
        setVerificationState('awaiting_otp');
      }
    } catch (err) {
      console.error(err);
      setErrors({ otp: 'Network error' });
      setVerificationState('awaiting_otp');
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    setVerificationState('sending');
    try {
      const res = await fetch('http://localhost:3001/api/auth/resend-registration-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.officialEmail })
      });
      if (res.ok) {
        setCooldown(60);
        setOtp(Array(6).fill(''));
        otpRefs.current[0]?.focus();
        setErrors({ otp: '' });
        setVerificationState('awaiting_otp');
      } else {
        const data = await res.json();
        setErrors({ otp: data.message || 'Failed to resend' });
        setVerificationState('awaiting_otp');
      }
    } catch (err) {
      console.error(err);
      setErrors({ otp: 'Network error' });
      setVerificationState('awaiting_otp');
    }
  };

  const handleCreateAccount = async () => {
    if (!validateStep5()) return;
    setIsSubmitting(true);

    try {
      // Send all form data to backend, which uses admin.createUser
      // (email_confirm: true) — no confirmation email is sent by Supabase.
      // This avoids the "email rate limit exceeded" error from signUp().
      const res = await fetch('http://localhost:3001/api/auth/complete-hospital-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hospitalName:               formData.hospitalName,
          hospitalType:               formData.hospitalType,
          registrationNumber:         formData.registrationNumber,
          email:                      formData.officialEmail,
          contactPersonName:          formData.contactPersonName,
          designation:                formData.designation,
          phoneNumber:                formData.phoneNumber,
          alternatePhone:             formData.alternatePhone || null,
          state:                      formData.state,
          district:                   formData.district,
          city:                       formData.city,
          pincode:                    formData.pincode,
          fullAddress:                formData.fullAddress,
          numberOfBeds:               parseInt(formData.numberOfBeds),
          hospitalCategory:           formData.hospitalCategory,
          emergencyServices:          formData.emergencyServices,
          departmentsRequiringBlood:  formData.departmentsRequiringBlood || null,
          password:                   formData.password,
          termsAccepted:              formData.termsAccepted,
          otpVerificationToken:       verificationToken,
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Account creation failed.');
      }

      changeStageSmoothly('success', 'forward');

    } catch (err: any) {
      setErrors({ submit: err.message || 'An error occurred during account creation.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------

  const getTransitionClasses = (currentStage: typeof stage) => {
    if (stage === currentStage) {
      return 'opacity-100 translate-x-0 z-10 pointer-events-auto';
    }
    if (direction === 'forward') {
      return 'opacity-0 -translate-x-full z-0 pointer-events-none';
    } else {
      return 'opacity-0 translate-x-full z-0 pointer-events-none';
    }
  };

  const getIndicatorColor = (step: number) => {
    const numericStage = stage === 'otp' ? 1 : stage === 'success' ? 5 : stage;
    if (step < numericStage) return 'bg-[#581c1c] text-white border-[#581c1c]';
    if (step === numericStage) return 'bg-[#581c1c] text-white border-[#581c1c] ring-2 ring-[#581c1c]/20 ring-offset-1';
    return 'bg-transparent text-[#7a7a7a] border-[#d5ccbe]';
  };

  const getLineColor = (step: number) => {
    const numericStage = stage === 'otp' ? 1 : stage === 'success' ? 5 : stage;
    return step < numericStage ? 'bg-[#581c1c]' : 'bg-[#d5ccbe]';
  };

  const renderField = (
    name: keyof typeof formData,
    placeholder: string,
    Icon: React.ElementType,
    type: string = 'text',
    isSelect: boolean | 'autocomplete' = false,
    options: string[] = []
  ) => {
    return (
      <div className="flex flex-col relative w-full">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#7a7a7a]">
            <Icon size={18} strokeWidth={1.5} />
          </div>
          {isSelect === true ? (
            <select
              name={name}
              value={formData[name] as string}
              onChange={handleInputChange}
              className={`w-full bg-transparent border ${errors[name] ? 'border-[#981b1b]' : 'border-[#d5ccbe]'} rounded-md pl-11 pr-10 py-3 text-[14px] text-[#333] appearance-none focus:outline-none focus:border-[#581c1c] transition-colors cursor-pointer`}
            >
              <option value="" disabled>{placeholder}</option>
              {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          ) : isSelect === 'autocomplete' ? (
            <div className="relative">
              <input
                type="text"
                name={name}
                value={name === 'district' ? districtSearch : (formData[name] as string)}
                onChange={(e) => {
                  if (name === 'district') {
                    setDistrictSearch(e.target.value);
                    setShowDistrictDropdown(true);
                  } else {
                    handleInputChange(e);
                  }
                }}
                onFocus={() => name === 'district' && setShowDistrictDropdown(true)}
                placeholder={placeholder}
                className={`w-full bg-transparent border ${errors[name] ? 'border-[#981b1b]' : 'border-[#d5ccbe]'} rounded-md pl-11 pr-10 py-3 text-[14px] text-[#333] focus:outline-none focus:border-[#581c1c] transition-colors`}
              />
              {name === 'district' && showDistrictDropdown && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-[#d5ccbe] rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {options.filter(opt => opt.toLowerCase().includes(districtSearch.toLowerCase())).map(opt => (
                    <div
                      key={opt}
                      className="px-4 py-2 hover:bg-[#f7f5ef] cursor-pointer text-[13px] text-[#333]"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, district: opt }));
                        setDistrictSearch(opt);
                        setShowDistrictDropdown(false);
                      }}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : type === 'textarea' ? (
            <textarea
              name={name}
              value={formData[name] as string}
              onChange={(e) => handleInputChange(e as any)}
              placeholder={placeholder}
              rows={2}
              className={`w-full bg-transparent border ${errors[name] ? 'border-[#981b1b]' : 'border-[#d5ccbe]'} rounded-md pl-11 pr-4 py-3 text-[14px] text-[#333] placeholder-[#7a7a7a] focus:outline-none focus:border-[#581c1c] transition-colors resize-none`}
            />
          ) : (
            <input
              type={type}
              name={name}
              value={formData[name] as string}
              onChange={handleInputChange}
              placeholder={placeholder}
              className={`w-full bg-transparent border ${errors[name] ? 'border-[#981b1b]' : 'border-[#d5ccbe]'} rounded-md pl-11 pr-4 py-3 text-[14px] text-[#333] placeholder-[#7a7a7a] focus:outline-none focus:border-[#581c1c] transition-colors`}
            />
          )}
        </div>
        {errors[name] && <span className="absolute -bottom-5 left-0 text-[10px] font-semibold text-[#981b1b]">{errors[name]}</span>}
      </div>
    );
  };

  // ... Continuation of rendering ...
  return (
    <div className="relative w-full h-[480px] bg-[#f7f5ef]/95 backdrop-blur-md rounded-xl shadow-[0_15px_50px_rgba(0,0,0,0.08)] border border-[#e5e0d8] z-10 overflow-hidden flex flex-col">

      {/* Progress Indicator */}
      {stage !== 'success' && (
        <div className="flex justify-center items-center py-6 px-8 border-b border-[#e5e0d8]">
          <div className="flex items-center w-full max-w-[400px] justify-between relative">
            {[1, 2, 3, 4, 5].map((step, index) => (
              <React.Fragment key={step}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold border transition-colors duration-300 z-10 ${getIndicatorColor(step)}`}>
                  {step < (stage !== 'otp' ? stage as number : 0) ? <CheckCircle2 size={16} /> : step}
                </div>
                {index < 4 && (
                  <div className="flex-1 h-[2px] mx-2 relative z-0">
                    <div className={`absolute inset-0 transition-colors duration-300 ${getLineColor(step)}`}></div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <div className="relative flex-1">
        {/* Step 1: Hospital Basic Information */}
        <div className={`absolute inset-0 px-8 pt-8 pb-6 transition-all duration-500 ease-in-out flex flex-col ${getTransitionClasses(1)}`}>
          <div className="mb-6">
            <h2 className="text-xl font-editorial font-bold text-[#1a1a1a]">Hospital Basic Information</h2>
            <p className="text-[13px] text-[#7a7a7a]">Let's start with your hospital details.</p>
          </div>

          <div className="space-y-6 flex-1 flex flex-col">
            <div className="grid grid-cols-2 gap-5">
              {renderField('hospitalName', 'Hospital Name *', Building2)}
              {renderField('hospitalType', 'Hospital Type *', Building2, 'text', true, ['Government', 'Private', 'Trust/Charity'])}
            </div>
            <div className="grid grid-cols-2 gap-5">
              {renderField('registrationNumber', 'Registration Number *', FileText)}
              <div className="flex flex-col relative w-full">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#7a7a7a]">
                    <Mail size={18} strokeWidth={1.5} />
                  </div>
                  <input
                    type="email"
                    name="officialEmail"
                    value={formData.officialEmail}
                    onChange={handleInputChange}
                    placeholder="Official Email Address *"
                    disabled={verificationState === 'verified' || verificationState === 'sending' || verificationState === 'awaiting_otp' || verificationState === 'verifying'}
                    className={`w-full bg-transparent border ${errors.officialEmail ? 'border-[#981b1b]' : 'border-[#d5ccbe]'} rounded-md pl-11 pr-4 py-3 text-[14px] text-[#333] placeholder-[#7a7a7a] focus:outline-none focus:border-[#581c1c] transition-colors disabled:opacity-60`}
                  />
                </div>
                {errors.officialEmail && <span className="absolute -bottom-5 left-0 text-[10px] font-semibold text-[#981b1b]">{errors.officialEmail}</span>}
                <div className="absolute top-full right-0 mt-1 flex justify-end pointer-events-auto z-20">
                  {verificationState === 'sending' && (
                    <span className="text-[10px] font-bold text-[#7a7a7a] uppercase tracking-wide">SENDING...</span>
                  )}
                  {verificationState === 'verifying' && (
                    <span className="text-[10px] font-bold text-[#7a7a7a] uppercase tracking-wide">VERIFYING...</span>
                  )}
                  {verificationState === 'verified' && (
                    <span className="text-[10px] font-bold text-green-700 uppercase tracking-wide flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      VERIFIED
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-auto pt-4 flex flex-col gap-3">
              <button onClick={() => { if (verificationState === 'verified') { if (validateStep1()) changeStageSmoothly(2, 'forward'); } else { if (validateStep1()) handleSendOtp(); } }} disabled={verificationState === 'sending' || verificationState === 'verifying'} className="w-full py-3 bg-[#3d0f0f] text-white rounded-md font-bold tracking-wide uppercase text-[13px] hover:bg-[#2d0a0a] transition-colors shadow-sm">
                CONTINUE
              </button>
            </div>
          </div>
        </div>

        {/* OTP Verification Step */}
        <div className={`absolute inset-0 px-8 pt-8 pb-6 transition-all duration-500 ease-in-out flex flex-col ${getTransitionClasses('otp')}`}>
          <div className="mb-6">
            <h2 className="text-[10px] font-bold tracking-[0.15em] text-[#581c1c] uppercase">VERIFY YOUR EMAIL</h2>
          </div>

          <div className="mb-6">
            <p className="text-[13px] text-[#4a4a4a]">
              We sent a 6-digit verification code to<br />
              <span className="font-semibold text-[#1a1a1a]">{formData.officialEmail}</span>
            </p>
          </div>

          <div className="flex-1 flex flex-col space-y-6">
            <div>
              <div className="flex gap-2 mb-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => { otpRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
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
                    disabled={verificationState === 'verifying'}
                    className={`w-10 h-12 bg-transparent border ${errors.otp ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-[#d5ccbe] focus:border-[#581c1c] focus:ring-[#581c1c]'} rounded-md text-center text-lg font-bold text-[#333] focus:outline-none focus:ring-1 transition-colors`}
                  />
                ))}
              </div>

              {errors.otp && <p className="text-red-500 text-[11px] font-medium mt-2 whitespace-pre-line">{errors.otp}</p>}
            </div>

            <button type="button" onClick={handleVerifyOtp} disabled={isSubmitting || otp.join('').length !== 6 || verificationState === 'verifying'} className="w-full py-3 bg-[#3d0f0f] hover:bg-[#2d0a0a] text-white rounded-md font-semibold tracking-wide text-[13px] transition-colors disabled:opacity-50">
              {verificationState === 'verifying' ? 'VERIFYING...' : 'VERIFY CODE \u2192'}
            </button>

            <div className="flex flex-col items-center gap-4 mt-2">
              <button type="button" onClick={handleResendOtp} disabled={cooldown > 0} className="text-[11px] font-bold text-[#a68a8a] uppercase tracking-wide hover:text-[#8f7575] disabled:opacity-50">
                {cooldown > 0 ? `RESEND AVAILABLE IN ${cooldown}S` : 'RESEND CODE'}
              </button>

              <button type="button" onClick={() => { setVerificationState('idle'); changeStageSmoothly(1, 'backward'); }} disabled={isSubmitting} className="text-[11px] font-bold text-[#7a7a7a] uppercase tracking-wide hover:text-[#333] transition-colors">
                &larr; CHANGE EMAIL
              </button>
            </div>
          </div>
        </div>

        {/* Step 2: Contact Information */}
        <div className={`absolute inset-0 px-8 pt-8 pb-6 transition-all duration-500 ease-in-out flex flex-col ${getTransitionClasses(2)}`}>
          <div className="mb-6">
            <h2 className="text-xl font-editorial font-bold text-[#1a1a1a]">Contact Information</h2>
            <p className="text-[13px] text-[#7a7a7a]">Add the primary contact details for your hospital.</p>
          </div>

          <div className="space-y-6 flex-1 flex flex-col">
            <div className="grid grid-cols-2 gap-5">
              {renderField('contactPersonName', 'Contact Person Name *', User)}
              {renderField('designation', 'Designation *', User, 'text', true, ['Medical Director', 'Hospital Administrator', 'Blood Bank Officer', 'Chief Medical Officer'])}
            </div>
            <div className="grid grid-cols-2 gap-5">
              {renderField('phoneNumber', 'Phone Number *', Phone, 'tel')}
              {renderField('alternatePhone', 'Alternate Phone (Optional)', Phone, 'tel')}
            </div>

            <div className="mt-auto pt-4 flex flex-col gap-3">
              <button type="button" onClick={() => { if (validateStep2()) changeStageSmoothly(3, 'forward'); }} className="w-full py-3 bg-[#581c1c] text-white rounded-md font-bold tracking-wide uppercase text-[13px] hover:bg-[#4c1616] transition-colors shadow-sm">
                CONTINUE
              </button>
              <div className="flex justify-center">
                <button type="button" onClick={() => changeStageSmoothly(1, 'backward')} className="px-6 py-2 text-[#4a4a4a] font-semibold tracking-wide text-[12px] hover:text-[#1a1a1a] transition-colors">
                  &larr; BACK
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Location Details */}
        <div className={`absolute inset-0 px-8 pt-8 pb-6 transition-all duration-500 ease-in-out flex flex-col ${getTransitionClasses(3)}`}>
          <div className="mb-3">
            <h2 className="text-xl font-editorial font-bold text-[#1a1a1a]">Location Details</h2>
            <p className="text-[13px] text-[#7a7a7a]">Provide your hospital's location.</p>
          </div>

          <div className="space-y-4 flex-1 flex flex-col">
            <div className="grid grid-cols-2 gap-5">
              {renderField('state', 'State *', MapPin, 'text', true, stateOptions)}
              {renderField('district', 'District *', Map, 'text', 'autocomplete', formData.state ? districtOptions[formData.state] || [] : [])}
            </div>
            <div className="grid grid-cols-2 gap-5">
              {renderField('city', 'City *', Building2)}
              {renderField('pincode', 'Pincode *', MapPin)}
            </div>
            <div>
              {renderField('fullAddress', 'Full Address *', Home, 'textarea')}
            </div>

            <div className="mt-auto pt-2 flex flex-col gap-2">
              <button type="button" onClick={() => { if (validateStep3()) changeStageSmoothly(4, 'forward'); }} className="w-full py-3 bg-[#581c1c] text-white rounded-md font-bold tracking-wide uppercase text-[13px] hover:bg-[#4c1616] transition-colors shadow-sm">
                CONTINUE
              </button>
              <div className="flex justify-center">
                <button type="button" onClick={() => changeStageSmoothly(2, 'backward')} className="px-6 py-2 text-[#4a4a4a] font-semibold tracking-wide text-[12px] hover:text-[#1a1a1a] transition-colors">
                  &larr; BACK
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Step 4: Hospital Details */}
        <div className={`absolute inset-0 px-8 pt-8 pb-6 transition-all duration-500 ease-in-out flex flex-col ${getTransitionClasses(4)}`}>
          <div className="mb-3">
            <h2 className="text-xl font-editorial font-bold text-[#1a1a1a]">Hospital Details</h2>
            <p className="text-[13px] text-[#7a7a7a]">Help us understand your hospital's capacity and services.</p>
          </div>

          <div className="space-y-4 flex-1 flex flex-col">
            <div className="grid grid-cols-2 gap-5">
              {renderField('numberOfBeds', 'Number of Beds *', Package, 'number')}
              {renderField('hospitalCategory', 'Hospital Category *', Building2, 'text', true, ['General Hospital', 'Specialty Hospital', 'Multi-Specialty', 'Clinic'])}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-semibold text-[#1a1a1a]">24×7 Emergency Services *</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#333]">
                  <input type="radio" name="emergencyServices" value="Yes" checked={formData.emergencyServices === 'Yes'} onChange={handleInputChange} className="accent-[#581c1c]" /> Yes
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#333]">
                  <input type="radio" name="emergencyServices" value="No" checked={formData.emergencyServices === 'No'} onChange={handleInputChange} className="accent-[#581c1c]" /> No
                </label>
              </div>
              {errors.emergencyServices && <span className="text-[10px] font-semibold text-[#981b1b] mt-1">{errors.emergencyServices}</span>}
            </div>

            <div>
              {renderField('departmentsRequiringBlood', 'Departments Requiring Blood (Optional)', ShieldPlus, 'text')}
              <p className="text-[11px] text-[#7a7a7a] mt-1 ml-1">e.g. Trauma, Surgery, Oncology</p>
            </div>

            <div className="mt-auto pt-2 flex flex-col gap-2">
              <button type="button" onClick={() => { if (validateStep4()) changeStageSmoothly(5, 'forward'); }} className="w-full py-3 bg-[#581c1c] text-white rounded-md font-bold tracking-wide uppercase text-[13px] hover:bg-[#4c1616] transition-colors shadow-sm">
                CONTINUE
              </button>
              <div className="flex justify-center">
                <button type="button" onClick={() => changeStageSmoothly(3, 'backward')} className="px-6 py-2 text-[#4a4a4a] font-semibold tracking-wide text-[12px] hover:text-[#1a1a1a] transition-colors">
                  &larr; BACK
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Step 5: Account Security */}
        <div className={`absolute inset-0 px-8 pt-8 pb-6 transition-all duration-500 ease-in-out flex flex-col ${getTransitionClasses(5)}`}>
          <div className="mb-3">
            <h2 className="text-xl font-editorial font-bold text-[#1a1a1a]">Account Security</h2>
            <p className="text-[13px] text-[#7a7a7a]">Set a strong password to secure your account.</p>
          </div>

          <div className="space-y-3 flex-1 flex flex-col">
            <div className="flex flex-col relative w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#7a7a7a]">
                  <Lock size={18} strokeWidth={1.5} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create Password *"
                  className={`w-full bg-transparent border ${errors.password ? 'border-[#981b1b]' : 'border-[#d5ccbe]'} rounded-md pl-11 pr-12 py-3 text-[14px] text-[#333] placeholder-[#7a7a7a] focus:outline-none focus:border-[#581c1c] transition-colors`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#7a7a7a] hover:text-[#1a1a1a]">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className="absolute -bottom-5 left-0 text-[10px] font-semibold text-[#981b1b]">{errors.password}</span>}
            </div>

            <div className="flex flex-col relative w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#7a7a7a]">
                  <Lock size={18} strokeWidth={1.5} />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password *"
                  className={`w-full bg-transparent border ${errors.confirmPassword ? 'border-[#981b1b]' : 'border-[#d5ccbe]'} rounded-md pl-11 pr-12 py-3 text-[14px] text-[#333] placeholder-[#7a7a7a] focus:outline-none focus:border-[#581c1c] transition-colors`}
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#7a7a7a] hover:text-[#1a1a1a]">
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <span className="absolute -bottom-5 left-0 text-[10px] font-semibold text-[#981b1b]">{errors.confirmPassword}</span>}
            </div>

            <div className="mt-2 flex flex-col">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-0.5">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleInputChange}
                    className="peer sr-only"
                  />
                  <div className={`w-4 h-4 border ${errors.termsAccepted ? 'border-[#981b1b]' : 'border-[#bfae9e]'} rounded-sm flex items-center justify-center peer-checked:bg-[#581c1c] peer-checked:border-[#581c1c] transition-colors`}>
                    <CheckCircle2 size={12} className="text-white opacity-0 peer-checked:opacity-100" strokeWidth={3} />
                  </div>
                </div>
                <span className="text-[12px] text-[#4a4a4a] group-hover:text-[#1a1a1a] transition-colors leading-relaxed">
                  I agree to the Terms of Service and Privacy Policy
                </span>
              </label>
              {errors.termsAccepted && <span className="text-[10px] font-semibold text-[#981b1b] mt-1 ml-7">{errors.termsAccepted}</span>}
            </div>

            {errors.submit && (
              <div className="mt-2 p-3 bg-red-50/50 border border-red-200 rounded text-red-600 text-[11px] font-medium text-center">
                {errors.submit}
              </div>
            )}

            <div className="mt-auto pt-2 flex flex-col gap-2">
              <button type="button" onClick={handleCreateAccount} disabled={isSubmitting} className="w-full py-3 bg-[#4c1616] text-white rounded-md font-bold tracking-wide uppercase text-[13px] hover:bg-[#380e0e] transition-colors disabled:opacity-70 shadow-sm">
                {isSubmitting ? 'CREATING...' : 'ENTER BLOODCHAIN \u2192'}
              </button>
              <div className="flex justify-center">
                <button type="button" onClick={() => changeStageSmoothly(4, 'backward')} disabled={isSubmitting} className="px-6 py-2 text-[#4a4a4a] font-semibold tracking-wide text-[12px] hover:text-[#1a1a1a] transition-colors">
                  &larr; BACK
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Success State */}
        <div className={`absolute inset-0 px-8 pt-8 pb-6 transition-all duration-500 ease-in-out flex flex-col items-center justify-center text-center ${getTransitionClasses('success')}`}>
          <div className="w-20 h-20 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-600 mb-6 mx-auto">
            <CheckCircle2 size={40} strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-editorial font-bold text-[#1a1a1a] mb-2 uppercase tracking-wide">Hospital Account Created</h2>
          <p className="text-[14px] text-[#4a4a4a] mb-10">Your hospital is now connected to BloodChain AI.</p>

          <button onClick={() => navigate('/overview')} className="px-8 py-3.5 bg-[#4c1616] text-white rounded-full font-bold tracking-widest text-[12px] uppercase hover:bg-[#380e0e] transition-colors shadow-sm">
            CONTINUE TO HOSPITAL DASHBOARD &rarr;
          </button>
        </div>

      </div>
    </div>
  );
};
