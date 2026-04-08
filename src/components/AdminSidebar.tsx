import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../lib/auth';
import {
  LayoutDashboard, FileText, Users, User, LogOut,
  ChevronRight, Shield, Settings
} from 'lucide-react';

const navItems = [
  { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/applications', icon: FileText, label: 'Manage Applications' },
  { path: '/admin/profile', icon: User, label: 'My Profile' },
];

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="sidebar">
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px', boxShadow: '0 4px 12px rgba(245,158,11,0.4)'
          }}>
            ⚙️
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: '15px', fontFamily: 'Sora, sans-serif' }}>e-Governance</div>
            <div style={{ color: '#64748b', fontSize: '11px', fontWeight: 500 }}>Admin Console</div>
          </div>
        </div>
      </div>

      {/* Admin Info */}
      <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: '18px', flexShrink: 0
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ color: 'white', fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b' }}></div>
              <span style={{ color: '#94a3b8', fontSize: '11px' }}>Administrator</span>
            </div>
          </div>
        </div>
        {user?.department && (
          <div style={{ marginTop: 10, background: 'rgba(245,158,11,0.1)', borderRadius: 8, padding: '6px 10px' }}>
            <span style={{ color: '#fbbf24', fontSize: '11px', fontWeight: 600 }}>🏢 {user.department}</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px', borderRadius: '12px', marginBottom: '4px',
                textDecoration: 'none', transition: 'all 0.2s ease',
                background: active ? 'linear-gradient(135deg, rgba(245,158,11,0.25), rgba(239,68,68,0.15))' : 'transparent',
                color: active ? 'white' : '#94a3b8',
                borderLeft: active ? '3px solid #f59e0b' : '3px solid transparent',
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
          background: 'rgba(245,158,11,0.1)', borderRadius: 12, padding: '12px 16px',
          marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8
        }}>
          <Shield size={14} style={{ color: '#f59e0b' }} />
          <span style={{ color: '#94a3b8', fontSize: '12px' }}>Admin Access</span>
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
}
