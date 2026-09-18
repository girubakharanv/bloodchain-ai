import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useSearchParams } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BloodWorkflow } from './components/BloodWorkflow/BloodWorkflow';
import { BloodBankRegistration } from './components/BloodBankRegistration/BloodBankRegistration';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ExpiryIntelligence } from './pages/ExpiryIntelligence/ExpiryIntelligence';
import { NetworkTwin } from './pages/NetworkTwin/NetworkTwin';
import { BloodFlowNegotiator } from './pages/BloodFlowNegotiator/BloodFlowNegotiator';
import { Overview } from './pages/Overview/Overview';
import { RescueRoute } from './components/RescueRoute/RescueRoute';
import { ColdChainSentinel } from './pages/ColdChainSentinel/ColdChainSentinel';
import { CollectionCompass } from './pages/CollectionCompass/CollectionCompass';
import { SupplyStressSimulator } from './pages/SupplyStressSimulator/SupplyStressSimulator';
import { BloodPassportLedger } from './pages/BloodPassportLedger/BloodPassportLedger';
import { DecisionDNA } from './pages/DecisionDNA/DecisionDNA';
import { ImpactMap } from './pages/ImpactMap/ImpactMap';
import { AuthPage } from './pages/Auth/AuthPage';
import { AuthProvider } from './auth/AuthProvider';
import { ProtectedRoute } from './components/ProtectedRoute';

const Landing = () => {
  const [searchParams] = useSearchParams();
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (searchParams.get('showBankRegister') === 'true') {
      setShowVideo(true);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-paper font-sans text-ink-900 overflow-clip selection:bg-blood-800/20 selection:text-blood-900">
      <Navbar />
      
      <main>
        <Hero />
        <BloodWorkflow />
        
        {/* Blood Donor Call to Action Section */}
        <section className="w-full bg-white py-32 flex justify-center items-center px-6 border-t border-ink-100">
          <div className="max-w-4xl w-full text-center">
            <h3 className="font-editorial text-5xl font-bold text-blood-800 mb-6">Blood Donor</h3>
            <p className="text-lg text-ink-600 mb-12 max-w-2xl mx-auto">
              Join our predictive logistics network. Your contribution ensures a stable, life-saving supply chain during critical emergencies.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/auth" className="inline-block px-12 py-4 bg-blood-600 text-white rounded-full font-bold uppercase tracking-widest text-sm hover:bg-red-600 transition-all shadow-lg shadow-blood-600/30 active:scale-95 text-center">
                Login
              </Link>
              <Link to="/auth?mode=register" className="inline-block px-12 py-4 bg-white text-blood-600 border-2 border-blood-200 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-blood-50 hover:border-blood-400 transition-all active:scale-95 text-center">
                Register
              </Link>
            </div>
          </div>
        </section>

        {/* Blood Bank Call to Action Section */}
        <section className="w-full bg-ink-50 py-32 flex justify-center items-center px-6 border-t border-ink-100">
          <div className="max-w-4xl w-full text-center">
            <h3 className="font-editorial text-5xl font-bold text-blood-800 mb-6">Blood Bank</h3>
            <p className="text-lg text-ink-600 mb-12 max-w-2xl mx-auto">
              Empower your facility with AI-driven inventory management. Optimize supply distribution, minimize wastage, and maintain critical resilience.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/auth?type=bank" className="inline-block px-12 py-4 bg-blood-600 text-white rounded-full font-bold uppercase tracking-widest text-sm hover:bg-red-600 transition-all shadow-lg shadow-blood-600/30 active:scale-95 text-center">
                Login
              </Link>
              <button onClick={() => setShowVideo(true)} className="inline-block px-12 py-4 bg-white text-blood-600 border-2 border-blood-200 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-blood-50 hover:border-blood-400 transition-all active:scale-95 text-center">
                Register
              </button>
            </div>
          </div>
        </section>

        {/* Hospital Call to Action Section */}
        <section className="w-full bg-white py-32 flex justify-center items-center px-6 border-t border-ink-100">
          <div className="max-w-4xl w-full text-center">
            <h3 className="font-editorial text-5xl font-bold text-blood-800 mb-6">Hospital</h3>
            <p className="text-lg text-ink-600 mb-12 max-w-2xl mx-auto">
              Secure critical blood units instantly. Connect directly with our intelligent network for real-time tracking, prioritized emergency dispatch, and guaranteed supply during critical shortages.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/auth?type=hospital" className="inline-block px-12 py-4 bg-blood-600 text-white rounded-full font-bold uppercase tracking-widest text-sm hover:bg-red-600 transition-all shadow-lg shadow-blood-600/30 active:scale-95 text-center">
                Login
              </Link>
              <Link to="/auth?mode=register&type=hospital" className="inline-block px-12 py-4 bg-white text-blood-600 border-2 border-blood-200 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-blood-50 hover:border-blood-400 transition-all active:scale-95 text-center">
                Register
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-ink-900 text-white py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blood-800 rounded-sm flex items-center justify-center text-white font-bold font-editorial text-xs">B</div>
            <span className="font-bold tracking-tight text-sm">BLOODCHAIN <span className="font-light">AI</span></span>
          </div>
          <p className="text-ink-400 text-xs">
            © {new Date().getFullYear()} BloodChain AI. Predictive Logistics using Industrial AI.
          </p>
        </div>
      </footer>
      
      {showVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
          <video 
            src="/blood_flow.mp4" 
            autoPlay 
            muted 
            loop 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 z-20 flex flex-col px-8 md:px-16 lg:px-24 pointer-events-none overflow-y-auto">
            {/* Top-Left Logo (Fixed to screen) */}
            <div className="fixed top-8 left-8 md:left-12 lg:left-16 flex items-center gap-3 pointer-events-auto z-30">
              <div className="w-10 h-10 bg-[#581c1c] flex items-center justify-center text-white font-editorial text-2xl font-bold">B</div>
              <span className="font-bold tracking-tight text-lg text-[#1a1a1a]">BLOODCHAIN <span className="font-light">AI</span></span>
            </div>

            {/* Main Content (Safely centered) */}
            <div className="my-auto pt-[100px] pb-12 flex flex-col pointer-events-none">
              {/* Main heading formatted like Login page */}
              <div className="pointer-events-auto mb-12">
                <h2 className="font-editorial text-5xl md:text-6xl lg:text-[5rem] font-bold tracking-tight text-[#1a1a1a] leading-[1.05]">
                  Stronger blood networks <br/>
                  <span className="text-[#581c1c]">start with you.</span>
                </h2>
              </div>

              <div className="w-full max-w-[700px] pointer-events-auto">
                <BloodBankRegistration />
              </div>
            </div>
          </div>

          {/* Right Side Stacked Text (Below Login Button) */}
          <div className="hidden lg:flex absolute right-16 xl:right-24 top-[35%] -translate-y-1/2 flex-col items-start gap-0 pointer-events-none z-20">
            <div className="flex flex-col text-[13px] font-bold tracking-[0.3em] text-[#2a2a2a] uppercase leading-[2.8]">
              <span>SAFE</span>
              <span>SUPPLY</span>
              <span>STRONGER</span>
              <span>TOMORROW.</span>
            </div>
            <div className="w-8 h-[2px] bg-[#981b1b] mt-3"></div>
          </div>

          {/* Top Right Login Button */}
          <div className="absolute top-8 right-8 md:right-12 lg:right-16 flex items-center gap-4 pointer-events-auto z-20">
            <Link 
              to="/auth?type=bank" 
              onClick={() => setShowVideo(false)}
              className="px-5 py-2 rounded-full border border-[#bfae9e] text-[13px] font-semibold text-[#581c1c] hover:bg-[#581c1c]/5 transition-colors cursor-pointer bg-transparent"
            >
              Login &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Intelligence Dashboard */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/overview" element={<Overview />} />
              <Route path="/expiry-intelligence" element={<ExpiryIntelligence />} />
              <Route path="/network-twin" element={<NetworkTwin />} />
              <Route path="/bloodflow-negotiator" element={<BloodFlowNegotiator />} />
              <Route path="/rescue-route" element={<RescueRoute />} />
              <Route path="/cold-chain" element={<ColdChainSentinel />} />
              <Route path="/collection-compass" element={<CollectionCompass />} />
              <Route path="/supply-stress" element={<SupplyStressSimulator />} />
              <Route path="/blood-passport" element={<BloodPassportLedger />} />
              <Route path="/decision-dna" element={<DecisionDNA />} />
              <Route path="/impact-map" element={<ImpactMap />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
