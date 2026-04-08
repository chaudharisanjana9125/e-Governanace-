import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Shield, Mail, Lock } from 'lucide-react';
import Notification from '../../components/Notification';
import { supabase } from "../../lib/supabaseClient"

export default function CitizenLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password
    });

    if (error) {
      setNotif({ msg: error.message, type: 'error' });
      setLoading(false);
      return;
    }

    if (data.user) {
  setNotif({ msg: 'Login successful!', type: 'success' });

  localStorage.setItem("user", JSON.stringify({
    id: data.user.id,
    email: data.user.email,
    role: "citizen"
  }));

  setLoading(false);

  setTimeout(() => navigate('/citizen/dashboard'), 1000);
}

  } catch (error) {
  console.error(error);
  setNotif({ msg: 'Server error', type: 'error' });
  setLoading(false); // ✅ correct
}
};
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f4ff 0%, #e0eaff 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, fontFamily: 'Plus Jakarta Sans, sans-serif'
    }}>
      {notif && <Notification message={notif.msg} type={notif.type} onClose={() => setNotif(null)} />}

      <div style={{ width: '100%', maxWidth: 460 }}>
        <Link to="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          color: '#64748b', textDecoration: 'none', fontSize: 14,
          fontWeight: 500, marginBottom: 32
        }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="card" style={{ padding: 40 }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 20,
              background: 'linear-gradient(135deg, #1a56db, #0ea5e9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', fontSize: 28,
              boxShadow: '0 8px 24px rgba(26,86,219,0.3)'
            }}>👤</div>
            <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 26, fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>Citizen Login</h1>
            <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>Access your e-Governance services</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="email" required
                  className="input-field"
                  style={{ paddingLeft: 44 }}
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type={showPass ? 'text' : 'password'} required
                  className="input-field"
                  style={{ paddingLeft: 44, paddingRight: 44 }}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 16 }}>
              {loading ? 'Signing in...' : 'Sign In to Portal'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <p style={{ color: '#64748b', fontSize: 14 }}>
              New citizen?{' '}
              <Link to="/citizen/register" style={{ color: '#1a56db', fontWeight: 600, textDecoration: 'none' }}>Create Account</Link>
            </p>
          </div>

          <div style={{ borderTop: '1px solid #f1f5f9', marginTop: 24, paddingTop: 24, textAlign: 'center' }}>
            <Link to="/admin/login" style={{ color: '#64748b', fontSize: 13, textDecoration: 'none' }}>
              ⚙️ Are you an Admin? <span style={{ color: '#f59e0b', fontWeight: 600 }}>Login here</span>
            </Link>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 20 }}>
          <Shield size={14} style={{ color: '#94a3b8' }} />
          <span style={{ color: '#94a3b8', fontSize: 12 }}>Secured by 256-bit SSL Encryption</span>
        </div>
      </div>
    </div>
  );

}
