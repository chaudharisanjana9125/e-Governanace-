import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import { supabase } from '../../lib/supabaseClient';
import type { Application } from '../../lib/store';
import {
  FileText, Users, CheckCircle, XCircle, Clock, AlertCircle,
  TrendingUp, ArrowRight, ChevronRight, BarChart3
} from 'lucide-react';

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem('admin') || 'null');
  const [apps, setApps] = useState<Application[]>([]);
  const [citizens, setCitizens] = useState(0);

  useEffect(() => {
  const fetchData = async () => {
    // 🔹 fetch applications
    const { data: appData, error: appError } = await supabase
      .from('applications')
      .select('*');

   if (!appError && appData) {
  setApps(
  appData.map(app => ({
    id: app.id,

    citizenId: app.user_id || '',
    citizenName: app.full_name || '',
    citizenEmail: app.citizen_email || '',

    serviceType: app.service_name || '',
    serviceId: app.service_id || '',

    status: app.status,
    priority: app.priority || 
          (typeof app.details === "string" 
            ? JSON.parse(app.details)?.priority 
            : app.details?.priority) 
          || 'normal',

    details: app.details || {},

    submittedAt: app.created_at,
    updatedAt: app.updated_at || app.created_at,

    referenceNo: app.reference_no,

    timeline: app.timeline || [],

    adminNote: app.admin_note || '',
    assignedTo: app.assigned_to || ''
  }))
);
}

    // 🔹 fetch citizens count
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('*');

    if (!userError && userData) {
      const citizensOnly = userData.filter(u => u.role === 'citizen');
      setCitizens(citizensOnly.length);
    }
  };

  fetchData();

  const interval = setInterval(fetchData, 3000);

  return () => clearInterval(interval);
}, []);

  const counts = {
    total: apps.length,
    pending: apps.filter(a => a.status === 'pending').length,
    processing: apps.filter(a => a.status === 'processing').length,
    approved: apps.filter(a => a.status === 'approved').length,
    rejected: apps.filter(a => a.status === 'rejected').length,
    urgent: apps.filter(a => a.priority === 'urgent' && a.status === 'pending').length,
  };

  const statusConfig = {
    pending: { label: 'Pending', color: '#f59e0b', bg: '#fef3c7', icon: Clock },
    processing: { label: 'Processing', color: '#1a56db', bg: '#dbeafe', icon: AlertCircle },
    approved: { label: 'Approved', color: '#10b981', bg: '#d1fae5', icon: CheckCircle },
    rejected: { label: 'Rejected', color: '#ef4444', bg: '#fee2e2', icon: XCircle },
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  // Service distribution
  const serviceCount: Record<string, number> = {};
  apps.forEach(a => { serviceCount[a.serviceType] = (serviceCount[a.serviceType] || 0) + 1; });
  const topServices = Object.entries(serviceCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxCount = topServices[0]?.[1] || 1;

  return (
    <div style={{ display: 'flex', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <AdminSidebar />
      <div className="main-content" style={{ flex: 1, padding: 32 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500, marginBottom: 6 }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Admin Dashboard ⚙️
            </h1>
            <p style={{ color: '#64748b', fontSize: 14, margin: '6px 0 0' }}>{user?.department || 'Government Administration'}</p>
          </div>
          <Link to="/admin/applications" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            color: 'white', padding: '12px 24px', borderRadius: 12,
            textDecoration: 'none', fontSize: 14, fontWeight: 700,
            boxShadow: '0 6px 20px rgba(245,158,11,0.35)',
            fontFamily: 'Plus Jakarta Sans, sans-serif'
          }}>
            <FileText size={18} /> Manage Applications
          </Link>
        </div>

        {/* Stats Row 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 20 }}>
          {[
            { label: 'Total Applications', value: counts.total, color: '#1a56db', bg: '#dbeafe', icon: FileText, cls: 'blue' },
            { label: 'Registered Citizens', value: citizens, color: '#8b5cf6', bg: '#ede9fe', icon: Users, cls: 'blue' },
            { label: 'Approved Today', value: counts.approved, color: '#10b981', bg: '#d1fae5', icon: CheckCircle, cls: 'green' },
            { label: 'Urgent Pending', value: counts.urgent, color: '#ef4444', bg: '#fee2e2', icon: AlertCircle, cls: 'red' },
          ].map(s => (
            <div key={s.label} className={`stat-card ${s.cls}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ color: '#64748b', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 36, fontWeight: 800, color: '#0f172a' }}>{s.value}</div>
                </div>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <s.icon size={22} style={{ color: s.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Row 2 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 28 }}>
          {[
            { label: 'Pending', value: counts.pending, color: '#f59e0b', bg: '#fef3c7', pct: counts.total ? Math.round(counts.pending / counts.total * 100) : 0 },
            { label: 'Processing', value: counts.processing, color: '#1a56db', bg: '#dbeafe', pct: counts.total ? Math.round(counts.processing / counts.total * 100) : 0 },
            { label: 'Approved', value: counts.approved, color: '#10b981', bg: '#d1fae5', pct: counts.total ? Math.round(counts.approved / counts.total * 100) : 0 },
            { label: 'Rejected', value: counts.rejected, color: '#ef4444', bg: '#fee2e2', pct: counts.total ? Math.round(counts.rejected / counts.total * 100) : 0 },
          ].map(s => (
            <div key={s.label} style={{ background: 'white', borderRadius: 14, padding: '18px 20px', boxShadow: '0 4px 16px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>{s.label}</span>
                <span style={{ background: s.bg, color: s.color, fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 100 }}>{s.pct}%</span>
              </div>
              <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>{s.value}</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${s.pct}%`, background: `linear-gradient(90deg, ${s.color}, ${s.color}aa)` }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
          {/* Recent Applications */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', margin: 0 }}>Recent Applications</h2>
              <Link to="/admin/applications" style={{ color: '#f59e0b', fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                View All <ChevronRight size={14} />
              </Link>
            </div>
            {apps.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📥</div>
                <div style={{ color: '#64748b', fontSize: 14 }}>No applications yet</div>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ref No.</th>
                    <th>Citizen</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.slice(0, 6).map(app => {
                    const cfg = statusConfig[app.status];
                    return (
                      <tr key={app.id}>
                        <td style={{ fontWeight: 600, color: '#1a56db', fontSize: 12 }}>{app.referenceNo}</td>
                        <td>
                          <div style={{ fontWeight: 500, fontSize: 13 }}>{app.citizenName}</div>
                          <div style={{ color: '#94a3b8', fontSize: 11 }}>{app.citizenEmail}</div>
                        </td>
                        <td style={{ fontSize: 13 }}>{app.serviceType}</td>
                        <td style={{ color: '#64748b', fontSize: 12 }}>{formatDate(app.submittedAt)}</td>
                        <td>
                          <span className="badge" style={{ background: cfg.bg, color: cfg.color }}>
                            {cfg.label}
                          </span>
                          {app.priority === 'urgent' && (
                            <span style={{ display: 'block', background: '#fee2e2', color: '#991b1b', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 100, marginTop: 3 }}>⚡ URGENT</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Service Distribution */}
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <BarChart3 size={18} style={{ color: '#1a56db' }} /> Service Distribution
              </h3>
              {topServices.length === 0 ? (
                <div style={{ color: '#64748b', fontSize: 13, textAlign: 'center', padding: 20 }}>No data yet</div>
              ) : (
                topServices.map(([service, count]) => (
                  <div key={service} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 500, color: '#374151' }}>{service}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#1a56db' }}>{count}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${(count / maxCount) * 100}%` }} />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick Actions */}
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 16px' }}>Quick Actions</h3>
              {[
                { label: 'Review Pending', count: counts.pending, color: '#f59e0b', path: '/admin/applications' },
                { label: 'Urgent Applications', count: counts.urgent, color: '#ef4444', path: '/admin/applications' },
                { label: 'Processing Queue', count: counts.processing, color: '#1a56db', path: '/admin/applications' },
              ].map(action => (
                <Link key={action.label} to={action.path} style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 16px', borderRadius: 10, marginBottom: 8,
                    background: '#f8fafc', border: '1px solid #f1f5f9',
                    transition: 'all 0.2s', cursor: 'pointer'
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{action.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ background: `${action.color}20`, color: action.color, fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 100 }}>{action.count}</span>
                      <ArrowRight size={14} style={{ color: '#94a3b8' }} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
