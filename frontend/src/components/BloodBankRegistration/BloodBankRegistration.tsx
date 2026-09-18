import React, { useState, useRef, useEffect } from 'react';
import { Building2, FileText, Mail, User, Phone, MapPin, Map, Home, Package, Lock, Eye, EyeOff, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { indianStatesAndDistricts, indianStates } from '../../data/indianDistricts';

export const BloodBankRegistration: React.FC = () => {
  const navigate = useNavigate();
  
  // Stages: 1 = initial, 'otp' = verification, 2 = final fields, 'confirm-password' = verify password, 'success' = done
  const [stage, setStage] = useState<1 | 'otp' | 2 | 'confirm-password' | 'success'>(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    bloodBankName: '',
    bloodBankType: '',
    registrationNumber: '',
    officialEmail: '',
    contactPerson: '',
    phone: '',
    state: '',
    district: '',
    city: '',
    fullAddress: '',
    pincode: '',
    password: '',
    confirmPassword: ''
  });

  // State Options (Now pulled from real data)
  const stateOptions = indianStates;
  const districtOptions = indianStatesAndDistricts;

  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  
  // Autocomplete State
  const [districtSearch, setDistrictSearch] = useState('');
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  
  // OTP State
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [cooldown, setCooldown] = useState(0);
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (name === 'password') {
      setIsPasswordVerified(false);
    }
  };

  const changeStageSmoothly = (newStage: 1 | 'otp' | 2 | 'confirm-password' | 'success') => {
    setIsTransitioning(true);
    setTimeout(() => {
      setStage(newStage);
      setIsTransitioning(false);
    }, 400); // 400ms CSS transition match
  };

  const validateStage1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.bloodBankName.trim()) newErrors.bloodBankName = 'Blood Bank Name is required';
    if (!formData.bloodBankType) newErrors.bloodBankType = 'Please select a type';
    if (!formData.registrationNumber.trim()) newErrors.registrationNumber = 'Registration number is required';
    if (!formData.officialEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.officialEmail)) {
      newErrors.officialEmail = 'Valid official email is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToOtp = async () => {
    if (!validateStage1()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:3001/api/auth/send-registration-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.officialEmail })
      });
      const data = await res.json();
      if (res.ok) {
        setCooldown(60);
        setOtp(Array(6).fill('')); // Explicitly clear OTP state to remove any lingering or autofilled numbers
        changeStageSmoothly('otp');
      } else {
        setErrors({ submit: data.message || 'Failed to send OTP' });
      }
    } catch (err) {
      setErrors({ submit: 'Network error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (errors.otp) setErrors(prev => ({ ...prev, otp: '' }));
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setErrors({ otp: 'Please enter a 6-digit OTP' });
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:3001/api/auth/verify-registration-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.officialEmail, otp: otpString })
      });
      const data = await res.json();
      if (res.ok) {
        setVerificationToken(data.verificationToken);
        // Show success state briefly before transitioning
        changeStageSmoothly(2);
      } else {
        setErrors({ otp: data.message || 'Invalid OTP' });
        setOtp(Array(6).fill(''));
        otpRefs.current[0]?.focus();
      }
    } catch (err) {
      setErrors({ otp: 'Network error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    setIsSubmitting(true);
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
      } else {
        const data = await res.json();
        setErrors({ otp: data.message || 'Failed to resend' });
      }
    } catch (err) {
      setErrors({ otp: 'Network error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateStage2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Required';
    if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Valid 10-digit number required';
    if (!formData.state) newErrors.state = 'Required';
    if (!formData.district) newErrors.district = 'Required';
    if (!formData.city.trim()) newErrors.city = 'Required';
    if (!formData.fullAddress.trim()) newErrors.fullAddress = 'Required';
    if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Valid 6-digit pincode required';
    if (formData.password.length < 6) newErrors.password = 'Min 6 characters required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateAccount = async () => {
    if (!validateStage2()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:3001/api/auth/complete-blood-bank-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          email: formData.officialEmail,
          otpVerificationToken: verificationToken
        })
      });
      const data = await res.json();
      if (res.ok) {
        changeStageSmoothly('success');
        setTimeout(() => {
          navigate('/overview'); // Navigate to dashboard after success
        }, 2000);
      } else {
        setErrors({ submit: data.message || 'Failed to create account' });
      }
    } catch (err) {
      setErrors({ submit: 'Network error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper for rendering input fields perfectly styled to match the reference
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
              value={formData[name]}
              onChange={handleInputChange}
              className={`w-full bg-transparent border ${errors[name] ? 'border-[#981b1b]' : 'border-[#d5ccbe]'} rounded-md pl-11 pr-10 py-3 text-[14px] text-[#333] appearance-none focus:outline-none focus:border-[#581c1c] transition-colors cursor-pointer`}
            >
              <option value="" disabled>{placeholder}</option>
              {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          ) : isSelect === 'autocomplete' ? (
            <div className="relative w-full">
              <input
                type="text"
                name={name}
                value={name === 'district' ? (showDistrictDropdown ? districtSearch : formData.district) : formData[name]}
                onChange={(e) => {
                  if (name === 'district') {
                    setDistrictSearch(e.target.value);
                    if (!showDistrictDropdown) setShowDistrictDropdown(true);
                  }
                }}
                onFocus={() => {
                  if (name === 'district') {
                    setDistrictSearch(''); // Clear search on focus to show all options
                    setShowDistrictDropdown(true);
                  }
                }}
                onBlur={() => {
                  setTimeout(() => setShowDistrictDropdown(false), 200);
                }}
                placeholder={placeholder}
                className={`w-full bg-transparent border ${errors[name] ? 'border-[#981b1b]' : 'border-[#d5ccbe]'} rounded-md pl-11 pr-10 py-3 text-[14px] text-[#333] placeholder:text-[#9a9a9a] focus:outline-none focus:border-[#581c1c] transition-colors`}
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[#7a7a7a]">
                <ChevronDown size={18} strokeWidth={1.5} />
              </div>
              
              {name === 'district' && showDistrictDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#d5ccbe] rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
                  {options
                    .filter(opt => opt.toLowerCase().includes(districtSearch.toLowerCase()))
                    .map(opt => (
                      <div 
                        key={opt}
                        className="px-4 py-2 text-[13px] text-[#333] hover:bg-[#f7f5ef] cursor-pointer border-b border-[#f7f5ef] last:border-0"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, district: opt }));
                          setDistrictSearch('');
                          setShowDistrictDropdown(false);
                          if (errors.district) setErrors(prev => ({ ...prev, district: '' }));
                        }}
                      >
                        {opt}
                      </div>
                  ))}
                  {options.filter(opt => opt.toLowerCase().includes(districtSearch.toLowerCase())).length === 0 && (
                    <div className="px-4 py-2 text-[13px] text-[#7a7a7a]">No districts found</div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleInputChange}
              placeholder={placeholder}
              className={`w-full bg-transparent border ${errors[name] ? 'border-[#981b1b]' : 'border-[#d5ccbe]'} rounded-md pl-11 pr-3 py-3 text-[14px] text-[#333] placeholder:text-[#9a9a9a] focus:outline-none focus:border-[#581c1c] transition-colors`}
            />
          )}
          
          {isSelect === true && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[#7a7a7a]">
              <ChevronDown size={18} strokeWidth={1.5} />
            </div>
          )}
          {name.includes('assword') && (
            <button 
              type="button" 
              onClick={() => name === 'password' ? setShowPassword(!showPassword) : setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#7a7a7a] hover:text-[#333] cursor-pointer"
            >
              {((name === 'password' && showPassword) || (name === 'confirmPassword' && showConfirmPassword)) ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
            </button>
          )}
        </div>
        {errors[name] && <span className="text-[10px] text-[#981b1b] mt-1 absolute -bottom-4">{errors[name]}</span>}
        
        {name === 'officialEmail' && !isSubmitting && formData[name].length > 0 && (
          <div className="absolute top-full right-0 mt-2 flex justify-end">
            <button 
              type="button" 
              onClick={handleContinueToOtp} 
              className="text-[10.5px] font-bold text-[#581c1c] uppercase tracking-widest hover:underline cursor-pointer"
            >
              VERIFY EMAIL &rarr;
            </button>
          </div>
        )}
        {name === 'password' && !isPasswordVerified && formData[name].length >= 6 && (
          <div className="absolute top-full right-0 mt-2 flex justify-end">
            <button 
              type="button" 
              onClick={(e) => {
                e.preventDefault();
                if (validateStage2()) changeStageSmoothly('confirm-password');
              }} 
              className="text-[10.5px] font-bold text-[#581c1c] uppercase tracking-widest hover:underline cursor-pointer"
            >
              VERIFY PASSWORD &rarr;
            </button>
          </div>
        )}
        {name === 'officialEmail' && isSubmitting && (
          <div className="absolute top-full right-0 mt-2 flex justify-end">
            <span className="text-[10.5px] font-bold text-[#7a7a7a] uppercase tracking-widest">SENDING...</span>
          </div>
        )}
      </div>
    );
  };
  const getContainerHeight = () => {
    if (stage === 1) return '350px';
    if (stage === 'otp') return '340px';
    if (stage === 2) return '520px';
    if (stage === 'confirm-password') return '400px';
    return '300px'; // success
  };

  return (
    <div 
      className="w-full max-w-[550px] relative bg-[#f7f5ef]/95 backdrop-blur-md rounded-xl p-8 border border-[#e5e0d8] shadow-[0_15px_50px_rgba(0,0,0,0.08)] overflow-hidden transition-[min-height] duration-500 ease-in-out"
      style={{ minHeight: getContainerHeight() }}
    >
      
      {/* Title inside card */}
      <div className={`transition-opacity duration-300 ${stage === 'success' ? 'opacity-0' : 'opacity-100'} mb-6`}>
        <span className="text-[10px] font-bold tracking-[0.15em] text-[#581c1c] uppercase">CREATE YOUR BLOOD BANK ACCOUNT</span>
      </div>

      {/* Global Error Banner */}
      {errors.submit && (
        <div className="mb-4 p-3 bg-red-50/80 border border-red-200 rounded-md text-[#981b1b] text-xs font-semibold relative z-20">
          {errors.submit}
        </div>
      )}

      {/* STAGE 1: Initial Fields */}
      <div 
        className={`absolute top-20 left-8 right-8 transition-all duration-500 ease-in-out ${
          stage === 1 && !isTransitioning ? 'opacity-100 translate-y-0 pointer-events-auto z-10' : 'opacity-0 -translate-y-8 pointer-events-none z-0'
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
          {renderField('bloodBankName', 'Blood bank name', Building2)}
          {renderField('bloodBankType', 'Select type', Building2, 'text', true, ['Government', 'Private', 'NGO', 'Hospital Attached'])}
          {renderField('registrationNumber', 'Registration number', FileText)}
          {renderField('officialEmail', 'Official email address', Mail, 'email')}
        </div>

        <div className="mt-8 flex flex-col items-center">
          <button 
            onClick={handleContinueToOtp}
            disabled={isSubmitting}
            className="w-full py-3 bg-[#4c1616] text-white rounded-md font-bold tracking-wide uppercase text-[13px] hover:bg-[#380e0e] transition-colors disabled:opacity-70 shadow-sm"
          >
            {isSubmitting ? 'SENDING CODE...' : 'CONTINUE \u2192'}
          </button>
          
          <div className="w-full text-center mt-4">
            <button 
              onClick={() => navigate('/auth?type=bank')}
              className="text-[12px] font-semibold text-[#4a4a4a] hover:text-[#1a1a1a] transition-colors"
            >
              &larr; BACK TO HOME
            </button>
          </div>
        </div>
      </div>

      {/* OTP VERIFICATION */}
      <div 
        className={`absolute top-20 left-8 right-8 transition-all duration-500 ease-in-out ${
          stage === 'otp' && !isTransitioning ? 'opacity-100 translate-y-0 pointer-events-auto z-10' : 
          stage === 1 ? 'opacity-0 translate-y-8 pointer-events-none z-0' : 'opacity-0 -translate-y-8 pointer-events-none z-0'
        }`}
      >
        <div className="max-w-[400px]">
          <p className="text-[14px] text-[#4a4a4a] mb-6 leading-relaxed">
            We sent a verification code to<br />
            <span className="font-semibold text-[#1a1a1a]">{formData.officialEmail}</span>
          </p>

          <div className="flex gap-2 mb-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => { otpRefs.current[index] = el; }}
                name={`otp-digit-${index}`}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                onFocus={e => e.target.select()}
                onChange={e => handleOtpChange(index, e.target.value)}
                onKeyDown={e => handleOtpKeyDown(index, e)}
                className="w-12 h-12 text-center text-lg font-bold bg-transparent border border-[#d5ccbe] rounded-md focus:border-[#581c1c] focus:outline-none focus:ring-1 focus:ring-[#581c1c] text-[#333]"
              />
            ))}
          </div>
          {errors.otp && <p className="text-[11px] text-[#981b1b] mt-1 mb-4">{errors.otp}</p>}

          <div className="flex flex-col gap-4 mt-6">
            <button 
              onClick={handleVerifyOtp}
              disabled={isSubmitting || otp.join('').length !== 6}
              className="w-full py-3 bg-[#4c1616] text-white rounded-md font-bold tracking-wide uppercase text-[13px] hover:bg-[#380e0e] transition-colors disabled:opacity-70 shadow-sm"
            >
              {isSubmitting ? 'VERIFYING...' : 'VERIFY EMAIL \u2192'}
            </button>
            
            <div className="flex justify-between items-center text-[12px] mt-2">
              <button 
                onClick={() => changeStageSmoothly(1)} 
                className="font-semibold text-[#4a4a4a] hover:text-[#1a1a1a] transition-colors flex items-center gap-1"
              >
                &larr; Edit details
              </button>
              
              <button 
                onClick={handleResendOtp}
                disabled={cooldown > 0 || isSubmitting}
                className={`font-semibold transition-colors ${cooldown > 0 ? 'text-[#9a9a9a]' : 'text-[#581c1c] hover:underline'}`}
              >
                {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* STAGE 2: Remaining Details */}
      <div 
        className={`absolute top-20 left-8 right-8 transition-all duration-500 ease-in-out ${
          stage === 2 && !isTransitioning ? 'opacity-100 translate-y-0 pointer-events-auto z-10' : 
          stage === 'success' ? 'opacity-0 -translate-y-8 pointer-events-none z-0' :
          'opacity-0 translate-y-8 pointer-events-none z-0'
        }`}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2 text-green-700 bg-green-50/50 px-4 py-2 rounded-md border border-green-200 inline-flex">
            <CheckCircle2 size={16} />
            <span className="text-[11px] font-bold tracking-wide uppercase">EMAIL VERIFIED</span>
          </div>
          {isPasswordVerified && (
            <div className="flex items-center gap-2 text-green-700 bg-green-50/50 px-4 py-2 rounded-md border border-green-200 inline-flex">
              <CheckCircle2 size={16} />
              <span className="text-[11px] font-bold tracking-wide uppercase">PASSWORD VERIFIED</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {renderField('contactPerson', 'Contact person name', User)}
          {renderField('phone', 'Phone number', Phone, 'tel')}
          
          {renderField('state', 'Select state', MapPin, 'text', true, stateOptions)}
          {renderField('district', 'Select district', MapPin, 'text', 'autocomplete', formData.state ? districtOptions[formData.state] : [])}
          
          {renderField('fullAddress', 'Full address', Home)}
          {renderField('city', 'City', MapPin)}
          
          {renderField('pincode', 'Pincode', Package)}
          {renderField('password', 'Create password', Lock, showPassword ? 'text' : 'password')}
        </div>
        
        <div className="mt-8 flex flex-col items-center">
          <button 
            onClick={handleCreateAccount}
            disabled={isSubmitting || !isPasswordVerified}
            className="w-full py-3 bg-[#4c1616] text-white rounded-md font-bold tracking-wide uppercase text-[13px] hover:bg-[#380e0e] transition-colors disabled:opacity-70 shadow-sm"
          >
            {isSubmitting ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT \u2192'}
          </button>
          
          <div className="w-full text-center mt-4">
            <button 
              onClick={() => navigate('/auth?type=bank')}
              className="text-[12px] font-semibold text-[#4a4a4a] hover:text-[#1a1a1a] transition-colors"
            >
              &larr; BACK TO HOME
            </button>
          </div>
        </div>
      </div>

      {/* CONFIRM PASSWORD STAGE */}
      <div 
        className={`absolute top-20 left-8 right-8 transition-all duration-500 ease-in-out ${
          stage === 'confirm-password' && !isTransitioning ? 'opacity-100 translate-y-0 pointer-events-auto z-10' : 
          stage === 2 ? 'opacity-0 translate-y-8 pointer-events-none z-0' : 'opacity-0 -translate-y-8 pointer-events-none z-0'
        }`}
      >
        <div className="max-w-[400px]">
          <div className="mb-6">
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#581c1c] uppercase">VERIFY YOUR PASSWORD</span>
          </div>
          <p className="text-[14px] text-[#4a4a4a] mb-6 leading-relaxed">
            Please confirm the password you just created.
          </p>
          
          <div className="mb-2">
            {renderField('confirmPassword', 'Confirm password', Lock, showConfirmPassword ? 'text' : 'password')}
          </div>
          {errors.confirmPassword && <p className="text-[11px] text-[#981b1b] mt-1 mb-4">{errors.confirmPassword}</p>}

          <div className="flex flex-col gap-4 mt-8">
            <button 
              disabled={!formData.confirmPassword}
              onClick={() => {
                if (formData.password !== formData.confirmPassword) {
                  setErrors({ confirmPassword: 'Passwords must match' });
                } else {
                  setErrors({ confirmPassword: '' });
                  setIsPasswordVerified(true);
                  changeStageSmoothly(2);
                }
              }}
              className="w-full py-3 bg-[#4c1616] text-white rounded-md font-bold tracking-wide uppercase text-[13px] hover:bg-[#380e0e] transition-colors disabled:opacity-60 shadow-sm"
            >
              VERIFY PASSWORD &rarr;
            </button>
            
            <div className="flex justify-center mt-4">
              <button 
                onClick={() => changeStageSmoothly(2)} 
                className="text-[12px] font-bold text-[#7a7a7a] hover:text-[#333] transition-colors tracking-widest uppercase"
              >
                &larr; BACK
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* SUCCESS STATE */}
      <div 
        className={`absolute top-0 left-0 right-0 transition-all duration-500 ease-in-out flex flex-col items-center justify-center py-12 ${
          stage === 'success' && !isTransitioning ? 'opacity-100 translate-y-0 pointer-events-auto z-10' : 'opacity-0 translate-y-8 pointer-events-none z-0'
        }`}
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 size={32} className="text-green-600" />
        </div>
        <h3 className="font-editorial text-3xl text-[#1a1a1a] font-bold mb-2">Registration Complete</h3>
        <p className="text-[#4a4a4a] text-sm">Welcome to BloodChain AI. Redirecting to your dashboard...</p>
      </div>

    </div>
  );
};
