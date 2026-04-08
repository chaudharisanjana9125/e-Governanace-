import React, { useState, useEffect } from 'react';
import CitizenSidebar from '../../components/CitizenSidebar';
import { supabase } from '../../lib/supabaseClient'
import type { Application } from '../../lib/store';
import { Search, CheckCircle, Clock, XCircle, AlertCircle, ChevronDown, ChevronUp, FileText } from 'lucide-react';

const statusConfig = {
  pending: { label: 'Pending', color: '#f59e0b', bg: '#fef3c7', dotColor: '#f59e0b', icon: Clock, step: 1 },
  processing: { label: 'Processing', color: '#1a56db', bg: '#dbeafe', dotColor: '#1a56db', icon: AlertCircle, step: 2 },
  approved: { label: 'Approved', color: '#10b981', bg: '#d1fae5', dotColor: '#10b981', icon: CheckCircle, step: 3 },
  rejected: { label: 'Rejected', color: '#ef4444', bg: '#fee2e2', dotColor: '#ef4444', icon: XCircle, step: 3 },
};

export default function TrackApplication() {
  type AuthUser = {
  id: string;
};

const [user, setUser] = useState<any>(null);
  const [apps, setApps] = useState<Application[]>([]);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | number | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
  const fetchApplications = async () => {
    // Step 1: get logged in user
  const { data: { user: authUser } } = await supabase.auth.getUser();

if (!authUser) return;

// 👉 profile ke liye
const { data: profile } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", authUser.id)
  .single();

// 👉 sidebar ke liye
setUser({
  name: profile?.name || "User",
  email: authUser.email,
});

// 👉 applications ke liye (IMPORTANT)
// ✅ ONLY ONE QUERY (correct)
const { data, error } = await supabase
  .from("applications")
  .select("*")
  .eq("user_id", authUser.id) // ✅ ALWAYS authUser.id use karo
  .order("created_at", { ascending: false });

if (error) {
  console.error(error);
} else {
  const formatted: Application[] = data.map((app: any) => ({
  id: app.id,

  citizenId: app.user_id || '',
  citizenName: app.full_name || '',
  citizenEmail: app.citizen_email || '',

  serviceType: app.service_name || '',
  serviceId: app.service_id || '',

  status: app.status,
  priority: app.priority || app.details?.priority || 'normal',

  details: typeof app.details === "string"
    ? JSON.parse(app.details)
    : app.details || {},

  submittedAt: app.created_at,
  updatedAt: app.updated_at || app.created_at,

  referenceNo: app.reference_no,

  timeline: app.timeline || [
    {
      status: app.status,
      message: "Application submitted",
      timestamp: app.created_at
    }
  ],

  adminNote: app.admin_note || "",
  assignedTo: app.assigned_to || ""
}));

  setApps(formatted);
}
  };

  fetchApplications();
}, []);
  const filtered = apps.filter(a => {
    const matchSearch =
  (a.referenceNo || '').toLowerCase().includes(search.toLowerCase()) ||
  (a.serviceType || '').toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || a.status === filter;
    return matchSearch && matchFilter;
  });

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const timelineSteps = ['Submitted', 'Under Review', 'Decision Made'];

  return (
    <div style={{ display: 'flex', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <CitizenSidebar user={user} />
      <div className="main-content" style={{ flex: 1, padding: 32 }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>Track Applications</h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>Monitor the status of all your applications</p>
        </div>

        {/* Search & Filter */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
            <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input className="input-field" style={{ paddingLeft: 48 }}
              placeholder="Search by reference number or service..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['all', 'pending', 'processing', 'approved', 'rejected'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{
                  padding: '10px 16px', borderRadius: 10, border: 'none',
                  background: filter === f ? '#1a56db' : 'white',
                  color: filter === f ? 'white' : '#64748b',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  textTransform: 'capitalize', transition: 'all 0.2s',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}>{f === 'all' ? 'All' : f}</button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
            <div style={{ fontWeight: 600, fontSize: 18, color: '#0f172a', marginBottom: 8 }}>No applications found</div>
            <div style={{ color: '#64748b', fontSize: 14 }}>Try adjusting your search or apply for a new service</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filtered.map((app: Application) => {
              const cfg = statusConfig[app.status] || statusConfig.pending;
              const isExpanded = expanded === app.id;
              return (
                <div key={app.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  {/* Header */}
                  <div
                    style={{ padding: '20px 24px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    onClick={() => setExpanded(isExpanded ? null : app.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <cfg.icon size={22} style={{ color: cfg.color }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 16, color: '#0f172a', marginBottom: 4 }}>{app.serviceType}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ fontSize: 12, color: '#1a56db', fontWeight: 600 }}>{app.referenceNo}</span>
                          {app.priority === 'urgent' && (
                            <span style={{ background: '#fee2e2', color: '#991b1b', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 100 }}>⚡ URGENT</span>
                          )}
                          <span style={{ fontSize: 12, color: '#64748b' }}>
  Submitted: {app.submittedAt 
    ? new Date(app.submittedAt).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'N/A'}
</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <span className="badge" style={{ background: cfg.bg, color: cfg.color }}>
                        <cfg.icon size={12} /> {cfg.label}
                      </span>
                      {isExpanded ? <ChevronUp size={18} style={{ color: '#64748b' }} /> : <ChevronDown size={18} style={{ color: '#64748b' }} />}
                    </div>
                  </div>

                  {/* Expanded */}
                  {isExpanded && (
                    <div style={{ borderTop: '1px solid #f1f5f9', padding: '24px' }}>
                      {/* Progress Steps */}
                      <div style={{ marginBottom: 28 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 16 }}>Application Progress</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                          {timelineSteps.map((step, i) => {
                            const stepNum = i + 1;
                            const active = cfg.step >= stepNum;
                            const isLast = i === timelineSteps.length - 1;
                            return (
                              <React.Fragment key={step}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                  <div style={{
                                    width: 36, height: 36, borderRadius: '50%',
                                    background: active ? cfg.color : '#e2e8f0',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: active ? 'white' : '#94a3b8', fontSize: 14, fontWeight: 700,
                                    transition: 'all 0.3s'
                                  }}>
                                    {active ? <CheckCircle size={18} /> : stepNum}
                                  </div>
                                  <span style={{ fontSize: 11, color: active ? cfg.color : '#94a3b8', fontWeight: active ? 600 : 400, whiteSpace: 'nowrap' }}>{step}</span>
                                </div>
                                {!isLast && (
                                  <div style={{
                                    flex: 1, height: 2, marginBottom: 20,
                                    background: cfg.step > stepNum ? cfg.color : '#e2e8f0',
                                    transition: 'all 0.3s'
                                  }} />
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                        {/* Timeline */}
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 16 }}>Activity Timeline</div>
                          {(app.timeline || []).map((event: any, i: number) => (
                            <div key={i} className="timeline-item">
                              <div className="timeline-dot" style={{ color: cfg.color }} />
                              <div style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 14px' }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', textTransform: 'capitalize', marginBottom: 4 }}>{event.status.replace('_', ' ')}</div>
                                <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5, marginBottom: 6 }}>{event.message}</div>
                                <div style={{ fontSize: 11, color: '#94a3b8' }}>{formatDate(event.timestamp)}</div>
                                {event.by && <div style={{ fontSize: 11, color: '#1a56db', fontWeight: 600, marginTop: 4 }}>by {event.by}</div>}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Application Details */}
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 16 }}>Application Details</div>
                          <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16 }}>
                            {Object.entries(app.details || {}).map(([key, val]: any) => (
                              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                                <span style={{ fontSize: 12, color: '#64748b', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', maxWidth: '60%', textAlign: 'right' }}>{val}</span>
                              </div>
                            ))}
                          </div>
                          {app.adminNote && (
                            <div style={{ marginTop: 16, background: app.status === 'approved' ? '#d1fae5' : '#fee2e2', borderRadius: 12, padding: 16 }}>
                              <div style={{ fontSize: 12, fontWeight: 700, color: app.status === 'approved' ? '#065f46' : '#991b1b', marginBottom: 6 }}>
                                {app.status === 'approved' ? '✅ Admin Note' : '❌ Rejection Reason'}
                              </div>
                              <div style={{ fontSize: 13, color: app.status === 'approved' ? '#065f46' : '#991b1b' }}>{app.adminNote}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
