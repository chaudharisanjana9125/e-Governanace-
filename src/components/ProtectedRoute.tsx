import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../lib/auth';

interface Props {
  children: React.ReactNode;
  role: 'citizen' | 'admin';
}

export default function ProtectedRoute({ children, role }: Props) {
  const user = getCurrentUser();
   console.log("USER IN PROTECTED ROUTE:", user); // 👈 ADD THIS
  if (!user) return <Navigate to={role === 'citizen' ? '/citizen/login' : '/admin/login'} replace />;
  if (user.role !== role) return <Navigate to={role === 'citizen' ? '/citizen/login' : '/admin/login'} replace />;
  return <>{children}</>;
}

