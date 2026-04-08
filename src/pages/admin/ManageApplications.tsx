import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { getCurrentUser } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import type { Application } from '../../lib/store';
import Notification from '../../components/Notification';
import {
  Search, CheckCircle, XCircle, Clock, AlertCircle,
  ChevronDown, ChevronUp, Filter, Eye
} from 'lucide-react';

const statusConfig = {
  pending: { label: 'Pending', color: '#f59e0b', bg: '#fef3c7', icon: Clock },
  processing: { label: 'Processing', color: '#1a56db', bg: '#dbeafe', icon: AlertCircle },
  approved: { label: 'Approved', color: '#10b981', bg: '#d1fae5', icon: CheckCircle },
  rejected: { label: 'Rejected', color: '#ef4444', bg: '#fee2e2', icon: XCircle },
};

export default function ManageApplications() {
  const admin = getCurrentUser();
  const [apps, setApps] = useState<Application[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [noteMap, setNoteMap] = useState<Record<string, string>>({});
  const [notif, setNotif] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

 useEffect(() => {
  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
        return;
      }
  setApps(
    (data || []).map(app => ({
      id: app.id,

      citizenId: app.user_id || '',
      citizenName: app.full_name || '',
      citizenEmail: '',

      serviceType: app.service_name || '',
      serviceId: '',

      status: app.status,
      priority: 'normal',

      details: app.details || {},

      submittedAt: app.created_at,
      updatedAt: app.updated_at || app.created_at,

      referenceNo: app.reference_no,

      timeline: app.timeline || [],

      adminNote: app.admin_note || '',
      assignedTo: app.assigned_to || ''
    }))
  );
} catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  fetchApplications();
}, []);
  const handleAction = async (
  appId: string,
  newStatus: Application['status'],
  note?: string
) => {
  if (!admin) return;

  try {
    console.log("Updating ID 👉", appId);
    const { error } = await supabase
  .from('applications')
  .update({
  status: newStatus,
  admin_note: note || '',
  assigned_to: admin?.name || '',
  updated_at: new Date().toISOString()
})
  .eq('id', appId);

    if (error) {
  console.error("UPDATE ERROR 👉", error);
  setNotif({ msg: error.message, type: 'error' });
  return;
}

    // 🔄 UI refresh
    setApps(prev =>
      prev.map(app =>
        app.id === appId
          ? {
              ...app,
              status: newStatus,
              adminNote: note,
              assignedTo: admin.name
            }
          : app
      )
    );

    setNotif({
      msg: `Application ${newStatus} successfully!`,
      type: newStatus === 'approved' ? 'success' : 'error'
    });

    setExpanded(null);

  } catch (err) {
    console.error(err);
    setNotif({ msg: 'Something went wrong', type: 'error' });
  }
};

  const filtered = apps.filter(a => {
    const matchSearch = a.referenceNo.toLowerCase().includes(search.toLowerCase()) ||
      a.citizenName.toLowerCase().includes(search.toLowerCase()) ||
      a.serviceType.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || a.status === filter;
    return matchSearch && matchFilter;
  });

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div style={{ display: 'flex', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <AdminSidebar />
      {notif && <Notification message={notif.msg} type={notif.type} onClose={() => setNotif(null)} />}
      <div className="main-content" style={{ flex: 1, padding: 32 }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>Manage Applications</h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>Review, approve or reject citizen applications</p>
        </div>

        {/* Summary bar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          {Object.entries(statusConfig).map(([status, cfg]) => {
            const count = apps.filter(a => a.status === status).length;
            return (
              <div key={status} style={{
                background: 'white', borderRadius: 12, padding: '12px 20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9',
                display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                borderBottom: filter === status ? `3px solid ${cfg.color}` : '3px solid transparent',
                transition: 'all 0.2s'
              }} onClick={() => setFilter(filter === status ? 'all' : status)}>
                <cfg.icon size={16} style={{ color: cfg.color }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{cfg.label}</span>
                <span style={{ background: cfg.bg, color: cfg.color, fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 100 }}>{count}</span>
              </div>
            );
          })}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 24, maxWidth: 480 }}>
          <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input className="input-field" style={{ paddingLeft: 48 }}
            placeholder="Search by reference, citizen name, or service..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Applications List */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>📥</div>
            <div style={{ fontWeight: 600, fontSize: 18, color: '#0f172a', marginBottom: 8 }}>No applications found</div>
            <div style={{ color: '#64748b', fontSize: 14 }}>Try adjusting your search or filter</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(app => {
              const cfg = statusConfig[app.status];
              const isExpanded = expanded === app.id;
              const note = noteMap[app.id] || '';

              return (
                <div key={app.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  {/* Header Row */}
                  <div style={{
                    padding: '18px 24px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    cursor: 'pointer'
                  }} onClick={() => setExpanded(isExpanded ? null : app.id)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <cfg.icon size={20} style={{ color: cfg.color }} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>{app.serviceType}</span>
                          {app.priority === 'urgent' && (
                            <span style={{ background: '#fee2e2', color: '#991b1b', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100 }}>⚡ URGENT</span>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ fontSize: 12, color: '#1a56db', fontWeight: 600 }}>{app.referenceNo}</span>
                          <span style={{ fontSize: 12, color: '#64748b' }}>{app.citizenName}</span>
                          <span style={{ fontSize: 12, color: '#94a3b8' }}>{formatDate(app.submittedAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span className="badge" style={{ background: cfg.bg, color: cfg.color }}>
                        <cfg.icon size={12} /> {cfg.label}
                      </span>
                      {isExpanded ? <ChevronUp size={18} style={{ color: '#64748b' }} /> : <ChevronDown size={18} style={{ color: '#64748b' }} />}
                    </div>
                  </div>

                  {/* Expanded Panel */}
                  {isExpanded && (
                    <div style={{ borderTop: '1px solid #f1f5f9', padding: 24 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
                        {/* Citizen Info */}
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>Citizen Information</div>
                          {[
                            { label: 'Name', value: app.citizenName },
                            { label: 'Email', value: app.citizenEmail },
                            { label: 'Priority', value: app.priority },
                            { label: 'Submitted', value: formatDate(app.submittedAt) },
                          ].map(item => (
                            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f8fafc' }}>
                              <span style={{ fontSize: 12, color: '#64748b' }}>{item.label}</span>
                              <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', textTransform: 'capitalize' }}>{item.value}</span>
                            </div>
                          ))}
                        </div>

                        {/* Application Details */}
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>Application Details</div>
                         {Object.entries(app.details || {}).map(([key, val]) => (
                            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f8fafc' }}>
                              <span style={{ fontSize: 12, color: '#64748b', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                              <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', maxWidth: '55%', textAlign: 'right' }}>{val}</span>
                            </div>
                          ))}
                        </div>

                        {/* Admin Actions */}
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>Admin Actions</div>

                          {app.status === 'pending' && (
                            <button className="btn-warning" style={{ width: '100%', justifyContent: 'center', marginBottom: 10 }}
                              onClick={() => handleAction(app.id, 'processing')}>
                              🔄 Mark as Processing
                            </button>
                          )}

                          {(app.status === 'pending' || app.status === 'processing') && (
                            <>
                              <div style={{ marginBottom: 10 }}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Admin Note / Reason</label>
                                <textarea
                                  style={{ width: '100%', padding: '10px 12px', border: '2px solid #e2e8f0', borderRadius: 10, fontSize: 13, fontFamily: 'Plus Jakarta Sans', resize: 'vertical', minHeight: 70, outline: 'none', boxSizing: 'border-box' }}
                                  placeholder="Add note or reason..."
                                  value={note}
                                  onChange={e => setNoteMap({ ...noteMap, [app.id]: e.target.value })}
                                />
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                <button className="btn-success" style={{ justifyContent: 'center' }}
                                  onClick={() => handleAction(app.id, 'approved', note)}>
                                  ✅ Approve
                                </button>
                                <button className="btn-danger" style={{ justifyContent: 'center' }}
                                  onClick={() => handleAction(app.id, 'rejected', note)}>
                                  ❌ Reject
                                </button>
                              </div>
                            </>
                          )}

                          {(app.status === 'approved' || app.status === 'rejected') && (
                            <div style={{
                              background: app.status === 'approved' ? '#d1fae5' : '#fee2e2',
                              borderRadius: 12, padding: 16
                            }}>
                              <div style={{ fontSize: 12, fontWeight: 700, color: app.status === 'approved' ? '#065f46' : '#991b1b', marginBottom: 6 }}>
                                {app.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                              </div>
                              {app.adminNote && (
                                <div style={{ fontSize: 13, color: app.status === 'approved' ? '#065f46' : '#991b1b' }}>{app.adminNote}</div>
                              )}
                              {app.assignedTo && (
                                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>by {app.assignedTo}</div>
                              )}
                            </div>
                          )}

                          {/* Timeline */}
                          <div style={{ marginTop: 16 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 10 }}>Timeline</div>
                            {app.timeline?.map((event, i) => (
                              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1a56db', marginTop: 5, flexShrink: 0 }} />
                                <div>
                                  <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', textTransform: 'capitalize' }}>{event.status}</div>
                                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{new Date(event.timestamp).toLocaleDateString('en-IN')}</div>
                                </div>
                              </div>
                            ))}
                          </div>
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
