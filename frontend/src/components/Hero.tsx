import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen w-full flex items-center pt-20 overflow-hidden bg-paper">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-90 scale-105"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        {/* Subtle gradient overlay to ensure text readability without hiding the video */}
        <div className="absolute inset-0 bg-gradient-to-r from-paper/95 via-paper/60 to-transparent w-full md:w-2/3" />
        <div className="absolute inset-0 bg-gradient-to-t from-paper/90 via-transparent to-paper/30" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        {/* Left Side: Typography */}
        <div className="w-full md:w-1/2 pr-0 md:pr-12 pt-12 md:pt-0 animate-fade-in">
          <div className="inline-block px-3 py-1 mb-6 border border-blood-800/20 bg-blood-800/5 rounded-full backdrop-blur-sm">
            <span className="text-xs font-semibold tracking-widest text-blood-900 uppercase">
              Predictive Logistics using Industrial AI
            </span>
          </div>
          
          <h1 className="font-editorial text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] text-ink-900 tracking-tight mb-8">
            Time <br/>
            Matters <br/>
            in Every <br/>
            <span className="text-blood-800">Drop.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-ink-700 max-w-md mb-10 font-medium leading-relaxed">
            AI that predicts. Logistics that delivers.<br/>
            Lives that continue.
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={() => navigate('/overview')}
              className="primary-btn flex items-center gap-2 px-8 py-3 text-base group"
            >
              Explore BloodChain
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="secondary-btn px-8 py-3 text-base bg-white/30 backdrop-blur-sm border-ink-900/10 hover:bg-white/50">
              See How It Works
            </button>
          </div>
        </div>


      </div>
    </section>
  );
};
