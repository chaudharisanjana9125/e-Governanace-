import React, { useState , useEffect } from 'react';
import CitizenSidebar from '../../components/CitizenSidebar';
import { supabase } from '../../lib/supabaseClient';
import Notification from '../../components/Notification';
import { User, Mail, Phone, MapPin, CreditCard, Calendar, Edit3, Save, X, Shield, Lock } from 'lucide-react';

export default function CitizenProfile() {
 type Profile = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  aadhaar?: string;
  dob?: string;
  gender?: string;
  createdAt?: string;
};

const [user, setUser] = useState<Profile | null>(null);

useEffect(() => {
  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", user.id)
  .single();

if (!error && data) {
  setUser({
    id: data.id,
    name: data.name || "User", // fallback
    email: data.email,
    phone: data.phone,
    address: data.address,
    aadhaar: data.aadhaar,
    dob: data.dob,
    gender: data.gender,
    createdAt: data.created_at, // ✅ FIX
  });
} else {
  console.error(error);
}
  };

  fetchUser();
}, []);
  const [editing, setEditing] = useState(false);
  
useEffect(() => {
  if (user) {
    setForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      aadhaar: user.aadhaar || '',
      dob: user.dob || '',
      gender: user.gender || '',
    });
  }
}, [user]);
  const [passForm, setPassForm] = useState({ current: '', newPass: '', confirm: '' });
  const [showPassSection, setShowPassSection] = useState(false);
  const [notif, setNotif] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(false);

 const handleSave = async () => {
  if (!user) return;

  setLoading(true);

  const { error } = await supabase
    .from("profiles")
    .update({
      name: form.name,
      email: form.email,   // ✅ ADD THIS
      phone: form.phone,
      address: form.address,
      aadhaar: form.aadhaar,
      dob: form.dob,
      gender: form.gender,
      updated_at: new Date().toISOString(), // ✅ ADD THIS
    })
    .eq("id", user.id);

  if (error) {
    setNotif({ msg: 'Update failed', type: 'error' });
  } else {
    setUser({ ...user, ...form });
    setNotif({ msg: 'Profile updated successfully!', type: 'success' });
  }

  setEditing(false);
  setLoading(false);
};

 const handlePassChange = async () => {
  if (passForm.newPass !== passForm.confirm) {
    setNotif({ msg: 'Passwords do not match', type: 'error' });
    return;
  }

  if (passForm.newPass.length < 6) {
    setNotif({ msg: 'Password must be at least 6 characters', type: 'error' });
    return;
  }

  const { error } = await supabase.auth.updateUser({
    password: passForm.newPass,
  });

  if (error) {
    setNotif({ msg: error.message, type: 'error' });
  } else {
    setNotif({ msg: 'Password updated successfully!', type: 'success' });
    setPassForm({ current: '', newPass: '', confirm: '' });
    setShowPassSection(false);
  }
};

  // ✅ Step 1: Form Type
type FormType = {
  name: string;
  email: string;   // ✅ ADD THIS
  phone: string;
  address: string;
  aadhaar: string;
  dob: string;
  gender: string;
};

// ✅ Step 2: useState with type
const [form, setForm] = useState({
  name: '',
  email: '',   // ✅ ADD THIS
  phone: '',
  address: '',
  aadhaar: '',
  dob: '',
  gender: '',
});

// ✅ Step 4: Component
type InfoRowProps = {
  icon: React.ReactNode;
  label: string;
  value?: string;
  field?: keyof FormType;
  type?: 'text' | 'textarea' | 'select' | 'tel' | 'date';
  editing: boolean;
  form: FormType;
  setForm: React.Dispatch<React.SetStateAction<FormType>>;
};

const InfoRow = ({ icon, label, value, field, type = 'text', editing, form, setForm }: InfoRowProps) => {

  const handleChange = (e: any) => {
    if (!field) return;

    setForm((prev) => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <div style={{ display: 'flex', gap: 16, padding: '16px 0' }}>
      
      <div>{icon}</div>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12 }}>{label}</div>

        {editing && field ? (
          type === 'select' ? (
            <select value={field ? form[field] : ''} onChange={handleChange}>
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          ) : type === 'textarea' ? (
            <textarea value={form[field]} onChange={handleChange} />
          ) : (
            <input type={type} value={form[field]} onChange={handleChange} />
          )
        ) : (
          <div>{value || 'Not provided'}</div>
        )}
      </div>
    </div>
  );
};
  return (
    <div style={{ display: 'flex', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <CitizenSidebar user={user} />
      {notif && <Notification message={notif.msg} type={notif.type} onClose={() => setNotif(null)} />}
      <div className="main-content" style={{ flex: 1, padding: 32 }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>My Profile</h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>Manage your personal information</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
          {/* Main Profile Card */}
          <div 
  className="card" 
  style={{ padding: 0, overflow: 'hidden' }}
  onClick={(e) => e.stopPropagation()}   // 🔥 MAIN FIX
>
            {/* Profile Header */}
            <div style={{
              background: 'linear-gradient(135deg, #0f172a, #1e293b)',
              padding: '32px 32px 80px', position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1a56db, #0ea5e9)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 800, fontSize: 28,
                    boxShadow: '0 8px 24px rgba(26,86,219,0.4)'
                  }}>{user?.name?.charAt(0)}</div>
                  <div>
                    <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 22, fontWeight: 800, color: 'white' }}>{user?.name}</div>
                    <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>{user?.email}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                      <span style={{ color: '#10b981', fontSize: 12, fontWeight: 600 }}>Verified Citizen</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {editing ? (
                    <>
                      <button 
  onClick={(e) => {
    e.stopPropagation();   // 🔥 IMPORTANT
    setEditing(false);
  }}
 style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, padding: '8px 16px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontFamily: 'Plus Jakarta Sans' }}>
                        <X size={14} /> Cancel
                      </button>
                      <button
  onClick={(e) => {
    e.stopPropagation();   // 🔥 IMPORTANT
    handleSave();
  }}
 disabled={loading} style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: 10, padding: '8px 16px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, fontFamily: 'Plus Jakarta Sans' }}>
                        <Save size={14} /> {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </>
                  ) : (
                    <button
  onClick={(e) => {
    e.stopPropagation();   // 🔥 IMPORTANT
    setEditing(true);
  }}
 style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, padding: '8px 16px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontFamily: 'Plus Jakarta Sans' }}>
                      <Edit3 size={14} /> Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Info */}
            <div style={{ padding: '0 32px 32px', marginTop: -40 }}>
              <div style={{ background: 'white', borderRadius: 16, padding: '0 8px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9' }}>
               <InfoRow 
  icon={<User size={18} style={{ color: '#1a56db' }} />}
  label="Full Name" 
  value={user?.name} 
  field="name"
  editing={editing}
  form={form}
  setForm={setForm}
/>

<InfoRow 
  icon={<Mail size={18} style={{ color: '#8b5cf6' }} />}
  label="Email Address" 
  value={user?.email} 
  field="email"
  editing={editing}
  form={form}
  setForm={setForm}
/>

<InfoRow 
  icon={<Phone size={18} style={{ color: '#10b981' }} />}
  label="Mobile Number" 
  value={user?.phone} 
  field="phone"
  type="tel"
  editing={editing}
  form={form}
  setForm={setForm}
/>

<InfoRow 
  icon={<CreditCard size={18} style={{ color: '#f59e0b' }} />}
  label="Aadhaar Number" 
  value={user?.aadhaar} 
  field="aadhaar"
  editing={editing}
  form={form}
  setForm={setForm}
/>

<InfoRow 
  icon={<Calendar size={18} style={{ color: '#0ea5e9' }} />}
  label="Date of Birth" 
  value={user?.dob} 
  field="dob"
  type="date"
  editing={editing}
  form={form}
  setForm={setForm}
/>

<InfoRow 
  icon={<User size={18} style={{ color: '#ec4899' }} />}
  label="Gender" 
  value={user?.gender} 
  field="gender"
  type="select"
  editing={editing}
  form={form}
  setForm={setForm}
/>

<InfoRow 
  icon={<MapPin size={18} style={{ color: '#ef4444' }} />}
  label="Address" 
  value={user?.address} 
  field="address"
  type="textarea"
  editing={editing}
  form={form}
  setForm={setForm}
/>              </div>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Account Info */}
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 16px' }}>Account Information</h3>
              {[
                { label: 'Account Type', value: 'Citizen', color: '#1a56db' },
                { label: 'Member Since', value: user?.createdAt
  ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
  : 'N/A' },
                { label: 'Account Status', value: 'Active', color: '#10b981' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: 13, color: '#64748b' }}>{item.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: item.color || '#0f172a' }}>{item.value}</span>
                </div>
              ))}
            </div>

            {/* Change Password */}
            <div className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showPassSection ? 16 : 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Lock size={18} style={{ color: '#f59e0b' }} />
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>Change Password</h3>
                </div>
                <button onClick={() => setShowPassSection(!showPassSection)}
                  style={{ background: '#fef3c7', border: 'none', borderRadius: 8, padding: '6px 12px', color: '#92400e', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans' }}>
                  {showPassSection ? 'Cancel' : 'Change'}
                </button>
              </div>
              {showPassSection && (
                <>
                  {['current', 'newPass', 'confirm'].map((f, i) => (
                    <div key={f} style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                        {['Current Password', 'New Password', 'Confirm New Password'][i]}
                      </label>
                      <input type="password" className="input-field" style={{ padding: '10px 14px', fontSize: 13 }}
                        placeholder={['Enter current password', 'Enter new password', 'Confirm new password'][i]}
                        value={(passForm as any)[f]}
                        onChange={e => setPassForm({ ...passForm, [f]: e.target.value })} />
                    </div>
                  ))}
                  <button onClick={handlePassChange} className="btn-warning" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
                    Update Password
                  </button>
                </>
              )}
            </div>

            {/* Security */}
            <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <Shield size={18} style={{ color: '#10b981' }} />
                <span style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>Security Status</span>
              </div>
              {[
                { label: 'Email Verified', status: true },
                { label: 'Phone Verified', status: !!user?.phone },
                { label: 'Aadhaar Linked', status: !!user?.aadhaar },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#94a3b8', fontSize: 13 }}>{item.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: item.status ? '#10b981' : '#ef4444' }}>
                    {item.status ? '✅ Done' : '❌ Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
