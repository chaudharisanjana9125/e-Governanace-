import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Eye, EyeOff, ArrowLeft, Shield, Mail, Lock } from 'lucide-react';
import Notification from '../../components/Notification';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  const { data, error } = await supabase
    .from('admin_profiles')
    .select('*')
    .eq('email', form.email)
    .eq('password', form.password)
    .single();

  if (error || !data) {
    setNotif({ msg: 'Invalid email or password', type: 'error' });
    setLoading(false);
  } else {
    setNotif({ msg: 'Admin login successful!', type: 'success' });

    // ✅ store admin session
    localStorage.setItem('user', JSON.stringify({
  ...data,
  role: 'admin'
}));

    setLoading(false);

   
      navigate('/admin/dashboard');
   
  }
};

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #1a1a2e 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, fontFamily: 'Plus Jakarta Sans, sans-serif', position: 'relative'
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(245,158,11,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(239,68,68,0.06) 0%, transparent 50%)'
      }} />
      {notif && <Notification message={notif.msg} type={notif.type} onClose={() => setNotif(null)} />}

      <div style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 1 }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#64748b', textDecoration: 'none', fontSize: 14, fontWeight: 500, marginBottom: 32 }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div style={{
          background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: 40
        }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 20,
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', fontSize: 28, boxShadow: '0 8px 24px rgba(245,158,11,0.3)'
            }}>⚙️</div>
            <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 26, fontWeight: 800, color: 'white', margin: '0 0 8px' }}>Admin Console</h1>
            <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>Restricted access — authorized personnel only</p>
          </div>

          <div style={{
            background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: 12, padding: '12px 16px', marginBottom: 24
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#fbbf24', marginBottom: 4 }}>💡 Demo Admin Credentials</div>
            <div style={{ fontSize: 12, color: '#fde68a' }}>Email: <strong>admin@egov.in</strong> | Password: <strong>admin123</strong></div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#cbd5e1', marginBottom: 8 }}>Admin Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input type="email" required
                  style={{
                    width: '100%', padding: '12px 16px 12px 44px',
                    background: 'rgba(255,255,255,0.08)', border: '2px solid rgba(255,255,255,0.1)',
                    borderRadius: 12, fontSize: 15, color: 'white',
                    outline: 'none', fontFamily: 'Plus Jakarta Sans',
                    boxSizing: 'border-box'
                  }}
                  placeholder="admin@egov.in"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  onFocus={e => e.target.style.borderColor = '#f59e0b'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#cbd5e1', marginBottom: 8 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input type={showPass ? 'text' : 'password'} required
                  style={{
                    width: '100%', padding: '12px 44px 12px 44px',
                    background: 'rgba(255,255,255,0.08)', border: '2px solid rgba(255,255,255,0.1)',
                    borderRadius: 12, fontSize: 15, color: 'white',
                    outline: 'none', fontFamily: 'Plus Jakarta Sans',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Enter password"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{
                width: '100%', padding: '14px',
                background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                border: 'none', borderRadius: 12, color: 'white',
                fontSize: 16, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'Plus Jakarta Sans', boxShadow: '0 8px 24px rgba(245,158,11,0.3)',
                transition: 'all 0.3s'
              }}>
              {loading ? 'Authenticating...' : 'Access Admin Console'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <p style={{ color: '#64748b', fontSize: 14 }}>
              New admin?{' '}
              <Link to="/admin/register" style={{ color: '#f59e0b', fontWeight: 600, textDecoration: 'none' }}>Register here</Link>
            </p>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 24, paddingTop: 24, textAlign: 'center' }}>
            <Link to="/citizen/login" style={{ color: '#64748b', fontSize: 13, textDecoration: 'none' }}>
              👤 Are you a Citizen? <span style={{ color: '#1a56db', fontWeight: 600 }}>Login here</span>
            </Link>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 20 }}>
          <Shield size={14} style={{ color: '#475569' }} />
          <span style={{ color: '#475569', fontSize: 12 }}>Restricted Government Portal</span>
        </div>
      </div>
    </div>
  );
}
