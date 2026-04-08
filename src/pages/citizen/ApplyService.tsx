import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Service } from '../../lib/services';
import CitizenSidebar from '../../components/CitizenSidebar';
import { supabase } from "../../lib/supabaseClient"
import { SERVICES } from '../../lib/services';
import Notification from '../../components/Notification';
import { Search, Clock, ChevronRight, CheckCircle, X, ArrowLeft } from 'lucide-react';
import { generateRefNo } from '../../lib/utils';

const colorMap: Record<string, { bg: string; accent: string; badge: string }> = {
  blue:   { bg: '#dbeafe', accent: '#1a56db', badge: '#eff6ff' },
  green:  { bg: '#d1fae5', accent: '#10b981', badge: '#f0fdf4' },
  purple: { bg: '#ede9fe', accent: '#8b5cf6', badge: '#f5f3ff' },
  amber:  { bg: '#fef3c7', accent: '#f59e0b', badge: '#fffbeb' },
  pink:   { bg: '#fce7f3', accent: '#ec4899', badge: '#fdf2f8' },
  teal:   { bg: '#ccfbf1', accent: '#0d9488', badge: '#f0fdfa' },
  orange: { bg: '#ffedd5', accent: '#ea580c', badge: '#fff7ed' },
  indigo: { bg: '#e0e7ff', accent: '#4f46e5', badge: '#eef2ff' },
};

export default function ApplyService() {
  // ✅ user state
type AuthUser = {
  id: string;
  email?: string;
  name?: string; // ✅ ADD THIS
};

const [user, setUser] = useState<AuthUser | null>(null);

// ✅ get logged-in user from Supabase
useEffect(() => {
  const fetchUser = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        window.location.href = "/citizen/login";
        return;
      }

      const currentUser = data.user;

      // 🔥 fetch profile (IMPORTANT)
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      setUser({
        id: currentUser.id,
        email: currentUser.email,
        name: profile?.name || "Citizen"
      });

    } catch (err) {
      console.error(err);
    }
  };

  fetchUser();
}, []);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Service | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');
  const [submitted, setSubmitted] = useState(false);
  const [refNo, setRefNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const filtered = SERVICES.filter((s: Service) =>
  s.name.toLowerCase().includes(search.toLowerCase()) ||
  s.category.toLowerCase().includes(search.toLowerCase())
);

  const handleSelectService = (service: Service) => {
    setSelected(service);
    setFormData({});
    setPriority('normal');
  };

  const handleFieldChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!selected) {
  setNotif({ msg: 'Please select a service', type: 'error' });
  return;
}

if (!user?.id) {
  setNotif({ msg: 'User not loaded yet. Try again.', type: 'error' });
  return;
}

const missingField = selected.fields.find(f => f.required && !formData[f.name]);

  if (missingField) {
    setNotif({ msg: `Please fill ${missingField.label}`, type: 'error' });
    return;
  }

  setLoading(true);

  try {
    const ref = generateRefNo();
    // 👇 yaha hona chahiye
  const appNo = `APP-${Date.now().toString().slice(-4)}`;

    const { error } = await supabase.from("applications").insert([
  {
    user_id: user.id,
    service_name: selected.name, // ✅ correct column

    full_name: formData.full_name || "", // ⚠️ form field name same hona chahiye
    address: formData.address || "",
    phone: formData.phone || "",

    status: "pending",
     priority: priority === 'urgent' ? 'urgent' : 'normal',
    details: formData, // extra data json me store ho jayega

    created_at: new Date().toISOString(), // ✅ correct column
    reference_no: ref,  // ✅ ADD THIS
    app_no: appNo   // ✅ readable ID
  }
]);
    if (error) {
      throw error;
    }

    setRefNo(ref);
    setNotif({ msg: 'Application submitted successfully!', type: 'success' });
    setSubmitted(true);

  } catch (err: any) {
  console.error("FULL ERROR:", err);
  setNotif({ msg: err.message || 'Failed to submit application', type: 'error' });
} finally {
    setLoading(false);
  }
};
  // ── SUCCESS SCREEN ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div style={{ display: 'flex', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        <CitizenSidebar user={user} />
        <div className="main-content" style={{
          flex: 1, display: 'flex', alignItems: 'center',
          justifyContent: 'center', padding: 32, minHeight: '100vh'
        }}>
          <div style={{ textAlign: 'center', maxWidth: 500 }}>
            <div style={{
              width: 96, height: 96, borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 28px', boxShadow: '0 12px 40px rgba(16,185,129,0.35)'
            }}>
              <CheckCircle size={48} color="white" />
            </div>
            <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 30, fontWeight: 800, color: '#0f172a', margin: '0 0 14px' }}>
              Application Submitted!
            </h2>
            <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
              Your application for <strong style={{ color: '#0f172a' }}>{selected?.name}</strong> has been submitted successfully and is awaiting review.
            </p>

            <div style={{
              background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
              border: '2px solid #bae6fd', borderRadius: 20, padding: '24px 28px', marginBottom: 36
            }}>
              <div style={{ fontSize: 11, color: '#0369a1', fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>
                YOUR REFERENCE NUMBER
              </div>
              <div style={{
                fontFamily: 'Sora, sans-serif', fontSize: 26, fontWeight: 800,
                color: '#1a56db', letterSpacing: 2, marginBottom: 10
              }}>{refNo}</div>
              <div style={{ fontSize: 12, color: '#0369a1' }}>
                📋 Save this number to track your application status
              </div>
            </div>

            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => { setSubmitted(false); setSelected(null); setFormData({}); setPriority('normal'); setRefNo('');}}
                style={{
                  padding: '13px 28px', borderRadius: 12, border: '2px solid #1a56db',
                  background: 'white', color: '#1a56db', fontSize: 14, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif'
                }}
              >
                Apply for Another
              </button>
              <button
                onClick={() => navigate('/citizen/track')}
                style={{
                  padding: '13px 28px', borderRadius: 12, border: 'none',
                  background: 'linear-gradient(135deg, #1a56db, #0ea5e9)',
                  color: 'white', fontSize: 14, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif',
                  boxShadow: '0 6px 20px rgba(26,86,219,0.35)'
                }}
              >
                Track Application →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN LAYOUT ─────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <CitizenSidebar user={user} />
      {notif && <Notification message={notif.msg} type={notif.type} onClose={() => setNotif(null)} />}

      <div className="main-content" style={{ flex: 1, padding: 32 }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          {selected && (
            <button
              onClick={() => setSelected(null)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#64748b', fontSize: 13, fontWeight: 500,
                fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: 12, padding: 0
              }}
            >
              <ArrowLeft size={15} /> Back to Services
            </button>
          )}
          <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
            {selected ? `Apply: ${selected.name}` : 'Apply for Service'}
          </h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>
            {selected ? 'Fill in the details below to submit your application' : 'Choose a government service to apply for'}
          </p>
        </div>

        {/* ── SERVICE SELECTION GRID ── */}
        {!selected && (
          <>
            <div style={{ position: 'relative', marginBottom: 28, maxWidth: 480 }}>
              <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
              <input
                className="input-field"
                style={{ paddingLeft: 48 }}
                placeholder="Search services by name or department..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
              {filtered.map(service => {
                const c = colorMap[service.color] || colorMap.blue;
                return (
                  <div
                    key={service.id}
                    className="card"
                    style={{ padding: 24, cursor: 'pointer' }}
                    onClick={() => handleSelectService(service)}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
                      <div style={{
                        width: 54, height: 54, borderRadius: 14, background: c.bg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 26, flexShrink: 0
                      }}>
                        {service.icon}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a', marginBottom: 5 }}>{service.name}</div>
                        <span style={{
                          fontSize: 11, color: c.accent, background: c.badge,
                          padding: '3px 10px', borderRadius: 100, fontWeight: 600
                        }}>{service.category}</span>
                      </div>
                    </div>
                    <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6, margin: '0 0 16px' }}>
                      {service.description}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Clock size={13} style={{ color: c.accent }} />
                        <span style={{ fontSize: 12, color: c.accent, fontWeight: 600 }}>{service.processingTime}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>Fee: {service.fee}</span>
                        <ChevronRight size={14} style={{ color: c.accent }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── APPLICATION FORM ── */}
        {selected && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>

            {/* Form Card */}
            <div style={{
              background: 'white', borderRadius: 20,
              boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
              border: '1px solid #e2e8f0', padding: 32
            }}>
              <form onSubmit={handleSubmit} noValidate={false}>

                {/* Priority Selection */}
                <div style={{ marginBottom: 28 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 12 }}>
                    Application Priority
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {(['normal', 'urgent'] as const).map(p => (
                      <label
                        key={p}
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center',
                          padding: '16px 12px', borderRadius: 14, cursor: 'pointer',
                          border: `2px solid ${priority === p
                            ? (p === 'urgent' ? '#ef4444' : '#1a56db')
                            : '#e2e8f0'}`,
                          background: priority === p
                            ? (p === 'urgent' ? '#fff0f0' : '#eff6ff')
                            : '#fafafa',
                          transition: 'all 0.2s'
                        }}
                      >
                        <input
                          type="radio"
                          name="priority"
                          value={p}
                          checked={priority === p}
                          onChange={() => setPriority(p)}
                          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                        />
                        <span style={{ fontSize: 22, marginBottom: 6 }}>{p === 'normal' ? '📋' : '⚡'}</span>
                        <span style={{
                          fontSize: 13, fontWeight: 700, textTransform: 'capitalize',
                          color: priority === p
                            ? (p === 'urgent' ? '#dc2626' : '#1d4ed8')
                            : '#64748b'
                        }}>{p}</span>
                        <span style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>
                          {p === 'normal' ? 'Standard processing' : 'Expedited review'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Dynamic Fields */}
                {selected.fields.map((field: Service["fields"][0]) => (
                  <div key={field.name} style={{ marginBottom: 20 }}>
                    <label
                      htmlFor={`field-${field.name}`}
                      style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}
                    >
                      {field.label}
                      {field.required && <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>}
                    </label>

                    {field.type === 'select' ? (
                      <select
                        id={`field-${field.name}`}
                        className="input-field"
                        required={field.required}
                        value={formData[field.name] || ''}
                        onChange={e => handleFieldChange(field.name, e.target.value)}
                      >
                        <option value="">— Select {field.label} —</option>
                        {field.options?.map((o: string) => (
  <option key={o} value={o}>{o}</option>
))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        id={`field-${field.name}`}
                        className="input-field"
                        required={field.required}
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                        value={formData[field.name] || ''}
                        onChange={e => handleFieldChange(field.name, e.target.value)}
                        style={{ minHeight: 90, resize: 'vertical', boxSizing: 'border-box' }}
                      />
                    ) : (
                      <input
                        id={`field-${field.name}`}
                        type={field.type}
                        className="input-field"
                        required={field.required}
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                        value={formData[field.name] || ''}
                        onChange={e => handleFieldChange(field.name, e.target.value)}
                      />
                    )}
                  </div>
                ))}

                {/* Declaration */}
                <div style={{
                  background: '#fffbeb', border: '1px solid #fde68a',
                  borderRadius: 12, padding: 16, marginBottom: 28
                }}>
                  <div style={{ fontSize: 12, color: '#92400e', fontWeight: 700, marginBottom: 6 }}>
                    ⚠️ Declaration
                  </div>
                  <div style={{ fontSize: 12, color: '#78350f', lineHeight: 1.6 }}>
                    I hereby declare that all information provided above is true, correct, and complete to the best of my knowledge and belief. I understand that providing false information may result in rejection or legal action.
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%', padding: '15px', borderRadius: 14, border: 'none',
                    background: loading
                      ? '#94a3b8'
                      : 'linear-gradient(135deg, #1a56db, #0ea5e9)',
                    color: 'white', fontSize: 16, fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    boxShadow: loading ? 'none' : '0 8px 24px rgba(26,86,219,0.35)',
                    transition: 'all 0.3s', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', gap: 8
                  }}
                >
                  {loading ? (
                    <>
                      <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                      Submitting Application...
                    </>
                  ) : (
                    <>✅ Submit Application</>
                  )}
                </button>
              </form>
            </div>

            {/* Sidebar Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 24 }}>
              {/* Service Summary */}
              <div style={{
                background: 'white', borderRadius: 18,
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                border: '1px solid #e2e8f0', padding: 24
              }}>
                <div style={{ fontSize: 40, marginBottom: 14, textAlign: 'center' }}>{selected.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: '0 0 6px', textAlign: 'center' }}>
                  {selected.name}
                </h3>
                <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6, margin: '0 0 18px', textAlign: 'center' }}>
                  {selected.description}
                </p>
                {[
                  { label: 'Department', value: selected.category, icon: '🏢' },
                  { label: 'Processing Time', value: selected.processingTime, icon: '⏱️' },
                  { label: 'Application Fee', value: selected.fee, icon: '💰' },
                  { label: 'Required Fields', value: `${selected.fields.filter((f: Service["fields"][0]) => f.required).length} mandatory`, icon: '📝' },
                ].map(item => (
                  <div key={item.label} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 0', borderBottom: '1px solid #f1f5f9'
                  }}>
                    <span style={{ fontSize: 12, color: '#64748b' }}>{item.icon} {item.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Tips */}
              <div style={{
                background: 'linear-gradient(135deg, #0f172a, #1e3a8a)',
                borderRadius: 18, padding: 22
              }}>
                <div style={{ color: 'white', fontWeight: 700, fontSize: 14, marginBottom: 14 }}>
                  💡 Tips for faster approval
                </div>
                {[
                  'Keep your Aadhaar card handy',
                  'Ensure all details match your ID',
                  'Double-check before submitting',
                  'Use your reference no. to track status',
                  'Urgent applications get priority review'
                ].map((tip, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(26,86,219,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <span style={{ color: '#93c5fd', fontSize: 10, fontWeight: 700 }}>{i + 1}</span>
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, lineHeight: 1.5 }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );

}
