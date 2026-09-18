import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { 
  LayoutDashboard, 
  Droplet, 
  Activity, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Timer,
  Clock,
  Network,
  Route,
  ShieldAlert,
  FileSignature,
  BrainCircuit,
  Bell,
  ArrowLeftRight,
  ThermometerSnowflake,
  Compass,
  History,
  CreditCard,
  Fingerprint,
  Target
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { profile, signOut } = useAuth();

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const navigation = [
    { name: 'Platform Overview', href: '/', icon: LayoutDashboard },
    { name: 'Expiry Echo™', href: '/expiry-intelligence', icon: Timer },
    { name: 'Network Time Machine™', href: '/network-twin', icon: Clock },
    { name: 'BloodFlow Negotiator™', href: '/bloodflow-negotiator', icon: Network },
    { name: 'Rescue Route™', href: '/rescue-route', icon: Route },
    { name: 'Cold Chain Sentinel™', href: '/cold-chain', icon: ThermometerSnowflake },
    { name: 'Collection Compass™', href: '/collection-compass', icon: Compass },
    { name: 'Supply Stress Simulator™', href: '/supply-stress', icon: Activity },
    { name: 'Blood Passport™', href: '/blood-passport', icon: CreditCard },
    { name: 'Decision DNA™', href: '/decision-dna', icon: Fingerprint },
    { name: 'Impact Map™', href: '/impact-map', icon: Target },
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-ink-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-paper border-r border-ink-200/30 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center px-6 border-b border-ink-200/30">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blood-800 rounded-sm flex items-center justify-center text-white font-bold font-editorial text-xl">B</div>
            <span className="font-bold tracking-tight text-xl text-ink-900">BLOODCHAIN <span className="font-light">AI</span></span>
          </Link>
        </div>

        <div className="px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                  isActive 
                    ? 'bg-blood-50 text-blood-900' 
                    : 'text-ink-600 hover:bg-ink-100/50 hover:text-ink-900'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${isActive ? 'text-blood-700' : 'text-ink-400 group-hover:text-ink-600'}`} />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-ink-200/30 bg-paper space-y-1">
          <button className="flex items-center px-3 py-2 w-full text-sm font-medium text-ink-600 hover:text-ink-900 hover:bg-ink-100/50 rounded-md transition-colors">
            <Settings className="mr-3 h-5 w-5 text-ink-400" />
            Settings
          </button>
          <button onClick={signOut} className="flex items-center px-3 py-2 w-full text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors">
            <LogOut className="mr-3 h-5 w-5 text-red-500" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-20 flex-shrink-0 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-paper/80 backdrop-blur-md border-b border-ink-200/30 z-30 relative">
          <button
            className="lg:hidden p-2 text-ink-600 hover:text-ink-900 hover:bg-ink-100 rounded-md"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex-1 flex justify-end items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blood-50 border border-blood-100 rounded-full text-xs font-bold text-blood-800 tracking-wider">
              <span className="relative flex h-2 w-2 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blood-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blood-600"></span>
              </span>
              LIVE NETWORK
            </div>
            
            <button className="p-2 text-ink-500 hover:text-ink-900 transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-blood-600 rounded-full border-2 border-paper"></span>
            </button>
            
            <div className="h-8 w-8 rounded-full bg-ink-900 flex items-center justify-center text-white text-sm font-bold ml-2 shadow-inner" title={profile?.full_name || 'User'}>
              {getInitials(profile?.full_name)}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
