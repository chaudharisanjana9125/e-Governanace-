import React, { useState , useEffect} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../lib/auth';
import {
  LayoutDashboard, FileText, Search, User, LogOut,
  ChevronRight, Bell, Shield, Menu, X
} from 'lucide-react';

const navItems = [
  { path: '/citizen/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/citizen/apply', icon: FileText, label: 'Apply for Service' },
  { path: '/citizen/track', icon: Search, label: 'Track Application' },
  { path: '/citizen/profile', icon: User, label: 'My Profile' },
];

export default function CitizenSidebar({ user }: { user: any }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: 'linear-gradient(135deg, #1a56db, #0ea5e9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px', boxShadow: '0 4px 12px rgba(26,86,219,0.4)'
          }}>
            🏛️
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: '15px', fontFamily: 'Sora, sans-serif' }}>e-Governance</div>
            <div style={{ color: '#64748b', fontSize: '11px', fontWeight: 500 }}>Citizen Portal</div>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'linear-gradient(135deg, #1a56db, #0ea5e9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: '18px',
            flexShrink: 0
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ color: 'white', fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }}></div>
              <span style={{ color: '#94a3b8', fontSize: '11px' }}>Citizen</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px', borderRadius: '12px', marginBottom: '4px',
                textDecoration: 'none', transition: 'all 0.2s ease',
                background: active ? 'linear-gradient(135deg, rgba(26,86,219,0.3), rgba(14,165,233,0.2))' : 'transparent',
                color: active ? 'white' : '#94a3b8',
                borderLeft: active ? '3px solid #1a56db' : '3px solid transparent',
              }}
            >
              <item.icon size={18} />
              <span style={{ fontSize: '14px', fontWeight: active ? 600 : 400 }}>{item.label}</span>
              {active && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{
          background: 'rgba(26,86,219,0.15)', borderRadius: 12, padding: '12px 16px',
          marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8
        }}>
          <Shield size={14} style={{ color: '#1a56db' }} />
          <span style={{ color: '#94a3b8', fontSize: '12px' }}>Secure Connection</span>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px 16px', borderRadius: '12px', border: 'none',
            background: 'rgba(239,68,68,0.1)', color: '#f87171',
            cursor: 'pointer', fontSize: '14px', fontWeight: 500,
            fontFamily: 'Plus Jakarta Sans, sans-serif', transition: 'all 0.2s'
          }}
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{
          display: 'none', position: 'fixed', top: 16, left: 16, zIndex: 100,
          background: '#1e293b', border: 'none', borderRadius: 8,
          padding: '8px', cursor: 'pointer', color: 'white'
        }}
        className="mobile-menu-btn"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div className="sidebar">
        <SidebarContent />
      </div>
    </>
  );
}
