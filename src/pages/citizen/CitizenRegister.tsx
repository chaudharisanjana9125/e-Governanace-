import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from "../../lib/auth"
import { ArrowLeft, Shield, Eye, EyeOff, User, Mail, Phone, MapPin, CreditCard, Calendar } from 'lucide-react';
import Notification from '../../components/Notification';


export default function CitizenRegister() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPass: '',
    phone: '', address: '', aadhaar: '', dob: '', gender: ''
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [notif, setNotif] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const navigate = useNavigate();

  const handleNext = async (e: React.FormEvent) => {
  e.preventDefault();

  if (step === 1) {
    if (form.password !== form.confirmPass) {
      setNotif({ msg: 'Passwords do not match', type: 'error' });
      return;
    }
    setStep(2);
  } else {
    setLoading(true);

    try {
     const res = await register({
  name: form.name,
  email: form.email,
  password: form.password,
  phone: form.phone,
  address: form.address,
  aadhaar: form.aadhaar,
  dob: form.dob,
  gender: form.gender
});

if (!res.success) {
  setNotif({ msg: res.message, type: 'error' });
  setLoading(false);
  return;
}

setNotif({ msg: 'Account created successfully!', type: 'success' });
setLoading(false);
setTimeout(() => navigate('/citizen/login'), 1000);
    } catch (error) {
      console.error(error);
      setNotif({ msg: 'Server error', type: 'error' });
      setLoading(false);
    }
  }
};

  const inp = (label: string, name: string, type = 'text', icon: React.ReactNode, placeholder = '') => (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>{icon}</div>
        <input
          type={type} className="input-field" style={{ paddingLeft: 44 }}
          placeholder={placeholder || label}
          value={(form as any)[name]}
          onChange={e => setForm({ ...form, [name]: e.target.value })}
          required
        />
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f4ff 0%, #e0eaff 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, fontFamily: 'Plus Jakarta Sans, sans-serif'
    }}>
      {notif && <Notification message={notif.msg} type={notif.type} onClose={() => setNotif(null)} />}

      <div style={{ width: '100%', maxWidth: 520 }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#64748b', textDecoration: 'none', fontSize: 14, fontWeight: 500, marginBottom: 32 }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="card" style={{ padding: 40 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 20,
              background: 'linear-gradient(135deg, #1a56db, #0ea5e9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', fontSize: 28, boxShadow: '0 8px 24px rgba(26,86,219,0.3)'
            }}>👥</div>
            <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 26, fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>Create Citizen Account</h1>
            <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>Register to access government services</p>
          </div>

          {/* Step indicator */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
            {[1, 2].map(s => (
              <div key={s} style={{
                flex: 1, height: 4, borderRadius: 100,
                background: s <= step ? 'linear-gradient(90deg, #1a56db, #0ea5e9)' : '#e2e8f0',
                transition: 'all 0.3s'
              }} />
            ))}
          </div>
          <div style={{ marginBottom: 24, fontSize: 13, color: '#64748b', fontWeight: 500 }}>
            Step {step} of 2 — {step === 1 ? 'Account Details' : 'Personal Information'}
          </div>

          <form onSubmit={handleNext}>
            {step === 1 ? (
              <>
                {inp('Full Name', 'name', 'text', <User size={16} />, 'Enter your full name')}
                {inp('Email Address', 'email', 'email', <Mail size={16} />, 'Enter your email')}
                {inp('Mobile Number', 'phone', 'tel', <Phone size={16} />, '10-digit mobile number')}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showPass ? 'text' : 'password'} className="input-field" placeholder="Create password" required
                      value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Confirm Password</label>
                  <input type="password" className="input-field" placeholder="Confirm password" required
                    value={form.confirmPass} onChange={e => setForm({ ...form, confirmPass: e.target.value })} />
                </div>
              </>
            ) : (
              <>
                {inp('Aadhaar Number', 'aadhaar', 'text', <CreditCard size={16} />, 'XXXX-XXXX-XXXX')}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Date of Birth</label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input type="date" className="input-field" style={{ paddingLeft: 44 }} required
                      value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} />
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Gender</label>
                  <select className="input-field" required value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                    <option value="">Select gender</option>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Residential Address</label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={16} style={{ position: 'absolute', left: 14, top: 14, color: '#94a3b8' }} />
                    <textarea className="input-field" style={{ paddingLeft: 44, minHeight: 80, resize: 'vertical' }}
                      placeholder="Enter complete address" required
                      value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                  </div>
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: 12 }}>
              {step === 2 && (
                <button type="button" onClick={() => setStep(1)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '14px' }}>
                  Back
                </button>
              )}
              <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '14px', fontSize: 15 }}>
                {loading ? 'Creating Account...' : step === 1 ? 'Continue →' : 'Create Account'}
              </button>
            </div>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <p style={{ color: '#64748b', fontSize: 14 }}>
              Already registered?{' '}
              <Link to="/citizen/login" style={{ color: '#1a56db', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 20 }}>
          <Shield size={14} style={{ color: '#94a3b8' }} />
          <span style={{ color: '#94a3b8', fontSize: 12 }}>Your data is protected and encrypted</span>
        </div>
      </div>
    </div>
  );
}
