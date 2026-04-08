import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Notification from '../../components/Notification';

const DEPARTMENTS = [
  'Revenue Department', 'Civil Registration', 'Transport Department',
  'Food & Civil Supplies', 'Municipal Services', 'Health Department',
  'Education Department', 'Social Welfare'
];

export default function AdminRegister() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPass: '',
    phone: '', address: '', department: '', gender: ''
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (form.password !== form.confirmPass) {
    setNotif({ msg: 'Passwords do not match', type: 'error' });
    return;
  }

  setLoading(true);

  const { error } = await supabase
    .from('admin_profiles')
    .insert([
      {
        name: form.name,
        email: form.email,
        password: form.password,
        mobile: form.phone,
        department: form.department,
        gender: form.gender,
        office_address: form.address
      }
    ]);

  if (error) {
    console.error(error);

    if (error.code === '23505') {
  setNotif({ msg: 'Admin already exists', type: 'error' });
} else {
      setNotif({ msg: 'Something went wrong', type: 'error' });
    }

    setLoading(false);
  } else {
    setNotif({ msg: 'Admin account created!', type: 'success' });
    setLoading(false); // ADD THIS
    setTimeout(() => {
      navigate('/admin/login'); // ✅ correct flow
    }, 1000);
  }
};

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #1a1a2e 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, fontFamily: 'Plus Jakarta Sans, sans-serif'
    }}>
      {notif && <Notification message={notif.msg} type={notif.type} onClose={() => setNotif(null)} />}
      <div style={{ width: '100%', maxWidth: 520 }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#64748b', textDecoration: 'none', fontSize: 14, fontWeight: 500, marginBottom: 32 }}>
          <ArrowLeft size={16} /> Back
        </Link>
        <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: 40 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg, #f59e0b, #ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 28, boxShadow: '0 8px 24px rgba(245,158,11,0.3)' }}>🛡️</div>
            <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 26, fontWeight: 800, color: 'white', margin: '0 0 8px' }}>Register as Admin</h1>
            <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>Create your government admin account</p>
          </div>

          <form onSubmit={handleSubmit}>
            {[['Full Name', 'name', 'text'], ['Email Address', 'email', 'email'], ['Mobile Number', 'phone', 'tel']].map(([label, field, type]) => (
              <div key={field} style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#cbd5e1', marginBottom: 8 }}>{label}</label>
                <input type={type} required
                  style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.08)', border: '2px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 14, color: 'white', outline: 'none', fontFamily: 'Plus Jakarta Sans', boxSizing: 'border-box' }}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  value={(form as any)[field]}
                  onChange={e => setForm({ ...form, [field]: e.target.value })}
                />
              </div>
            ))}

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#cbd5e1', marginBottom: 8 }}>Department</label>
              <select required
                style={{ width: '100%', padding: '12px 16px', background: 'rgba(30,41,59,0.9)', border: '2px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 14, color: 'white', outline: 'none', fontFamily: 'Plus Jakarta Sans' }}
                value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}>
                <option value="">Select department</option>
                {DEPARTMENTS.map(d => <option key={d} style={{ background: '#1e293b' }}>{d}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#cbd5e1', marginBottom: 8 }}>Gender</label>
              <select required
                style={{ width: '100%', padding: '12px 16px', background: 'rgba(30,41,59,0.9)', border: '2px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 14, color: 'white', outline: 'none', fontFamily: 'Plus Jakarta Sans' }}
                value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                <option value="">Select gender</option>
                <option style={{ background: '#1e293b' }}>Male</option>
                <option style={{ background: '#1e293b' }}>Female</option>
                <option style={{ background: '#1e293b' }}>Other</option>
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#cbd5e1', marginBottom: 8 }}>Office Address</label>
              <textarea required
                style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.08)', border: '2px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 14, color: 'white', outline: 'none', fontFamily: 'Plus Jakarta Sans', minHeight: 70, resize: 'vertical', boxSizing: 'border-box' }}
                placeholder="Enter office address"
                value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#cbd5e1', marginBottom: 8 }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPass ? 'text' : 'password'} required
                    style={{ width: '100%', padding: '12px 40px 12px 14px', background: 'rgba(255,255,255,0.08)', border: '2px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 14, color: 'white', outline: 'none', fontFamily: 'Plus Jakarta Sans', boxSizing: 'border-box' }}
                    placeholder="Create password"
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#cbd5e1', marginBottom: 8 }}>Confirm Password</label>
                <input type="password" required
                  style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.08)', border: '2px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 14, color: 'white', outline: 'none', fontFamily: 'Plus Jakarta Sans', boxSizing: 'border-box' }}
                  placeholder="Confirm password"
                  value={form.confirmPass} onChange={e => setForm({ ...form, confirmPass: e.target.value })} />
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #f59e0b, #ef4444)', border: 'none', borderRadius: 12, color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans', boxShadow: '0 8px 24px rgba(245,158,11,0.3)' }}>
              {loading ? 'Creating Account...' : 'Create Admin Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <p style={{ color: '#64748b', fontSize: 14 }}>Already have an account?{' '}
              <Link to="/admin/login" style={{ color: '#f59e0b', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
