import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { CMSContext } from '../../context/CMSContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { adminUser, authLoading } = useContext(CMSContext);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-heading">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
          <p className="font-handwriting text-xl">Securing session...</p>
        </div>
      </div>
    );
  }

  if (!adminUser) {
    return <Navigate to="/admin/login" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
