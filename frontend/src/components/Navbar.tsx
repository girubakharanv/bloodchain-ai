import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-paper-100/90 backdrop-blur-md shadow-sm border-b border-white/20' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-blood-800 rounded-sm flex items-center justify-center text-white font-bold font-editorial text-xl">B</div>
            <span className={`font-bold tracking-tight text-xl ${isScrolled ? 'text-ink-900' : 'text-ink-900'}`}>BLOODCHAIN <span className="font-light">AI</span></span>
          </div>

          {/* Nav links and buttons have been removed */}
        </div>
      </div>
    </nav>
  );
};
