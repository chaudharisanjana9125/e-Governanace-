import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { supabase } from '../../lib/supabase';
import Notification from '../../components/Notification';
import { User, Mail, Phone, MapPin, Building2, Edit3, Save, X, Shield, Lock } from 'lucide-react';

const DEPARTMENTS = [
  'Revenue Department', 'Civil Registration', 'Transport Department',
  'Food & Civil Supplies', 'Municipal Services', 'Health Department',
  'Education Department', 'Social Welfare'
];

export default function AdminProfile() {
  const [user, setUser] = useState<any>(null);

useEffect(() => {
  const fetchUser = async () => {
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) {
      console.error("Auth Error:", authError);
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (error) {
      console.error("Profile Fetch Error:", error);
      return;
    }

    if (data) {
      setUser(data);
    }
  };

  fetchUser();
}, []);
  const [editing, setEditing] = useState(false);
 const [form, setForm] = useState({
  name: '',
  phone: '',
  address: '',
  department: '',
  gender: '',
});

useEffect(() => {
  if (user && !editing) {
    setForm({
      name: user.name || '',
      phone: user.phone || '',
      address: user.address || '',
      department: user.department || '',
      gender: user.gender || '',
    });
  }
}, [user, editing]);
  const [passForm, setPassForm] = useState({ current: '', newPass: '', confirm: '' });
  const [showPassSection, setShowPassSection] = useState(false);
  const [notif, setNotif] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(false);
const handleSave = async () => {
  try {

    // ✅ 1. BEFORE update (check what you are sending)
    console.log("FORM DATA:", form);

    const { data, error } = await supabase
      .from('profiles') // ✔ correct
      .update({
        name: form.name,
        phone: form.phone,
        address: form.address,
        department: form.department,
        gender: form.gender,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select();

    // ✅ 2. AFTER update (check response)
    console.log("UPDATE RESPONSE:", data);
    console.log("UPDATE ERROR:", error);

    if (error) throw error;

    if (data && data.length > 0) {
      setUser(data[0]);  // update UI
    }

    setEditing(false);

  } catch (err) {
    console.error("SAVE ERROR:", err);
  }
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
    password: passForm.newPass
  });

  if (error) {
    setNotif({ msg: 'Password update failed', type: 'error' });
  } else {
    setPassForm({ current: '', newPass: '', confirm: '' });
    setShowPassSection(false);
    setNotif({ msg: 'Password changed!', type: 'success' });
  }
};
if (!user) return <div>Loading profile...</div>;
  return (
    <div style={{ display: 'flex', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <AdminSidebar />
      {notif && <Notification message={notif.msg} type={notif.type} onClose={() => setNotif(null)} />}
      <div className="main-content" style={{ flex: 1, padding: 32 }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>Admin Profile</h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>Manage your admin account</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', padding: '32px 32px 80px', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 800, fontSize: 28,
                    boxShadow: '0 8px 24px rgba(245,158,11,0.4)'
                  }}>{user?.name?.charAt(0)}</div>
                  <div>
                    <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 22, fontWeight: 800, color: 'white' }}>{editing ? form.name : user?.name}</div>
                    <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>{user?.email}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
                      <span style={{ color: '#fbbf24', fontSize: 12, fontWeight: 600 }}>Administrator</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {editing ? (
                    <>
                      <button onClick={() => {
  setEditing(false);
  if (user) {
    setForm({
      name: user.name || '',
      phone: user.phone || '',
      address: user.address || '',
      department: user.department || '',
      gender: user.gender || '',
    });
  }
}} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, padding: '8px 16px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontFamily: 'Plus Jakarta Sans' }}>
                        <X size={14} /> Cancel
                      </button>
                      <button onClick={handleSave} disabled={loading} style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: 10, padding: '8px 16px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, fontFamily: 'Plus Jakarta Sans' }}>
                        <Save size={14} />{loading ? 'Saving...' : 'Save'} save
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setEditing(true)} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, padding: '8px 16px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontFamily: 'Plus Jakarta Sans' }}>
                      <Edit3 size={14} /> Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div style={{ padding: '0 32px 32px', marginTop: -40 }}>
              <div style={{ background: 'white', borderRadius: 16, padding: '0 8px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9' }}>
                {[
                  { icon: <User size={18} style={{ color: '#f59e0b' }} />, label: 'Full Name', value: user?.name, field: 'name', type: 'text' },
                  { icon: <Mail size={18} style={{ color: '#8b5cf6' }} />, label: 'Email', value: user?.email, field: null, type: 'text' },
                  { icon: <Phone size={18} style={{ color: '#10b981' }} />, label: 'Phone', value: user?.phone, field: 'phone', type: 'tel' },
                  { icon: <Building2 size={18} style={{ color: '#1a56db' }} />, label: 'Department', value: user?.department, field: 'department', type: 'select' },
                  { icon: <MapPin size={18} style={{ color: '#ef4444' }} />, label: 'Office Address', value: user?.address, field: 'address', type: 'textarea' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '16px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f0f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{row.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{row.label}</div>
                      {editing && row.field ? (
                        row.type === 'select' ? (
                          <select className="input-field" style={{ padding: '8px 12px', fontSize: 14 }}
                            value={(form as any)[row.field] ?? ''} onChange={e => setForm({ ...form, [row.field!]: e.target.value })}>
                            <option value="">Select department</option>
                            {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                          </select>
                        ) : row.type === 'textarea' ? (
                          <textarea className="input-field" style={{ padding: '8px 12px', fontSize: 14, minHeight: 70, resize: 'vertical' }}
                            value={(form as any)[row.field] ?? ''} onChange={e => setForm({ ...form, [row.field!]: e.target.value })} />
                        ) : (
                          <input type={row.type} className="input-field" style={{ padding: '8px 12px', fontSize: 14 }}
                            value={(form as any)[row.field] ?? ''} onChange={e => setForm({ ...form, [row.field!]: e.target.value })} />
                        )
                      ) : (
                        <div style={{ fontSize: 15, fontWeight: 500, color: row.value ? '#0f172a' : '#94a3b8' }}>
  {editing && row.field
    ? (form as any)[row.field] || 'Not provided'
    : (row.value || 'Not provided')}
</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 16px' }}>Account Details</h3>
              {[
                { label: 'Role', value: 'Administrator', color: '#f59e0b' },
                { label: 'Department', value: user?.department || 'Not set' },
                { label: 'Status', value: 'Active', color: '#10b981' },
                { label: 'Member Since', value: user?.created_at
  ? new Date(user.created_at).toLocaleDateString('en-IN', {
      month: 'long',
      year: 'numeric'
    })
  : 'N/A' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: 13, color: '#64748b' }}>{item.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: (item as any).color || '#0f172a' }}>{item.value}</span>
                </div>
              ))}
            </div>

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
                        {['Current Password', 'New Password', 'Confirm Password'][i]}
                      </label>
                      <input type="password" className="input-field" style={{ padding: '10px 14px', fontSize: 13 }}
                        placeholder={['Current', 'New', 'Confirm'][i]}
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

            <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <Shield size={18} style={{ color: '#f59e0b' }} />
                <span style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>Admin Privileges</span>
              </div>
              {['Review Applications', 'Approve/Reject', 'Manage Citizens', 'View Reports'].map(priv => (
                <div key={priv} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b' }} />
                  <span style={{ color: '#94a3b8', fontSize: 13 }}>{priv}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
