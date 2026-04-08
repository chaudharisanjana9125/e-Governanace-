import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Landing from './pages/Landing';
import CitizenLogin from './pages/citizen/CitizenLogin';
import CitizenRegister from './pages/citizen/CitizenRegister';
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import ApplyService from './pages/citizen/ApplyService';
import TrackApplication from './pages/citizen/TrackApplication';
import CitizenProfile from './pages/citizen/CitizenProfile';
import AdminLogin from './pages/admin/AdminLogin';
import AdminRegister from './pages/admin/AdminRegister';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageApplications from './pages/admin/ManageApplications';
import AdminProfile from './pages/admin/AdminProfile';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  useEffect(() => {
  const alreadySeeded = localStorage.getItem("seeded");

  if (!alreadySeeded) {
    
    localStorage.setItem("seeded", "true");
  }
}, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />

        {/* Citizen Auth */}
        <Route path="/citizen/login" element={<CitizenLogin />} />
        <Route path="/citizen/register" element={<CitizenRegister />} />

        {/* Citizen Protected */}
        <Route path="/citizen/dashboard" element={
          <ProtectedRoute role="citizen"><CitizenDashboard /></ProtectedRoute>
        } />
        <Route path="/citizen/apply" element={
          <ProtectedRoute role="citizen"><ApplyService /></ProtectedRoute>
        } />
        <Route path="/citizen/track" element={
          <ProtectedRoute role="citizen"><TrackApplication /></ProtectedRoute>
        } />
        <Route path="/citizen/profile" element={
          <ProtectedRoute role="citizen"><CitizenProfile /></ProtectedRoute>
        } />

        {/* Admin Auth */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />

        {/* Admin Protected */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/applications" element={
          <ProtectedRoute role="admin"><ManageApplications /></ProtectedRoute>
        } />
        <Route path="/admin/profile" element={
          <ProtectedRoute role="admin"><AdminProfile /></ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
