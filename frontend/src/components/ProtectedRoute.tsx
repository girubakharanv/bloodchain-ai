import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export const ProtectedRoute: React.FC = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 bg-[#581c1c] flex items-center justify-center text-white font-editorial text-2xl font-bold animate-pulse">B</div>
          <p className="text-[#e5e0d8] text-sm tracking-widest uppercase font-semibold animate-pulse">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  return <Outlet />;
};
