import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SERVICES } from '../../lib/store';
import CitizenSidebar from '../../components/CitizenSidebar';
type AppType = {
  id: string;
  referenceNo: string;
  serviceType: string;
  submittedAt: string;
  status: string;
  details?: any;
  fullName?: string;
  phone?: string;
  address?: string;
};
import { supabase } from "../../lib/supabaseClient"
import {
  FileText, Search, Clock, CheckCircle, XCircle, AlertCircle,
  ArrowRight, Plus, TrendingUp, Bell, Calendar, ChevronRight
} from 'lucide-react';

export default function CitizenDashboard() {
 const [user, setUser] = React.useState<any>(null);


  const [apps, setApps] = useState<AppType[]>([]);

useEffect(() => {
  const fetchData = async () => {
    try {
      // ✅ logged in user
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData?.user) {
        console.error(userError);
        window.location.href = "/citizen/login"; // ✅ redirect
        return;
      }

      const currentUser = userData.user;

      // ✅ user set
      // ✅ fetch profile from table
const { data: profile, error: profileError } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", currentUser.id)
  .single();

if (profileError) {
  console.error(profileError);
}

setUser({
  name: profile?.name || "User",
  email: currentUser.email,
  phone: profile?.phone || "",
  aadhaar: profile?.aadhaar || ""
});

      // ✅ applications fetch
      const { data: appsData, error: appError } = await supabase
        .from("applications")
        .select("*")
        .eq("user_id", currentUser.id);

      if (appError) {
        console.error(appError);
        return;
      }

      console.log("Apps:", appsData);

const formattedApps: AppType[] = (appsData || []).map((app: any) => ({
  id: app.id,

  referenceNo: app.reference_no,
  serviceType: app.service_name,
  submittedAt: app.created_at,

  status: app.status,
  details: app.details,

  fullName: app.full_name,
  phone: app.phone,
  address: app.address,
}));

setApps(formattedApps);

    } catch (err) {
      console.error("Error:", err);
    }
  };

  fetchData();
}, []);


  const counts = {
    total: apps.length,
    pending: apps.filter(a => !a.status || a.status === 'pending').length,
    processing: apps.filter(a => a.status === 'processing').length,
    approved: apps.filter(a => a.status === 'approved').length,
    rejected: apps.filter(a => a.status === 'rejected').length,
  };

  const statusConfig = {
    pending: { label: 'Pending', color: '#f59e0b', bg: '#fef3c7', icon: Clock },
    processing: { label: 'Processing', color: '#1a56db', bg: '#dbeafe', icon: AlertCircle },
    approved: { label: 'Approved', color: '#10b981', bg: '#d1fae5', icon: CheckCircle },
    rejected: { label: 'Rejected', color: '#ef4444', bg: '#fee2e2', icon: XCircle },
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const quickServices = SERVICES.slice(0, 4);

  return (
    <div style={{ display: 'flex', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <CitizenSidebar user={user} />
      <div className="main-content" style={{ flex: 1, padding: 32 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500, marginBottom: 6 }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p style={{ color: '#64748b', fontSize: 14, margin: '6px 0 0' }}>Here's an overview of your applications</p>
          </div>
          <Link to="/citizen/apply" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'linear-gradient(135deg, #1a56db, #1e40af)',
            color: 'white', padding: '12px 24px', borderRadius: 12,
            textDecoration: 'none', fontSize: 14, fontWeight: 700,
            boxShadow: '0 6px 20px rgba(26,86,219,0.35)',
            fontFamily: 'Plus Jakarta Sans, sans-serif'
          }}>
            <Plus size={18} /> New Application
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
          {[
            { label: 'Total Applications', value: counts.total, color: '#1a56db', bg: '#dbeafe', icon: FileText, cls: 'blue' },
            { label: 'Pending Review', value: counts.pending, color: '#f59e0b', bg: '#fef3c7', icon: Clock, cls: 'amber' },
            { label: 'Approved', value: counts.approved, color: '#10b981', bg: '#d1fae5', icon: CheckCircle, cls: 'green' },
            { label: 'Rejected', value: counts.rejected, color: '#ef4444', bg: '#fee2e2', icon: XCircle, cls: 'red' },
          ].map(s => (
            <div key={s.label} className={`stat-card ${s.cls}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ color: '#64748b', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 36, fontWeight: 800, color: '#0f172a' }}>{s.value}</div>
                </div>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <s.icon size={22} style={{ color: s.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
          {/* Recent Applications */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', margin: 0 }}>Recent Applications</h2>
              <Link to="/citizen/track" style={{ color: '#1a56db', fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                View All <ChevronRight size={14} />
              </Link>
            </div>
            {apps.length === 0 ? (
              <div style={{ padding: 48, textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📤</div>
                <div style={{ color: '#0f172a', fontWeight: 600, marginBottom: 8 }}>No applications yet</div>
                <div style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>Start by applying for a government service</div>
               <Link to="/citizen/apply" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'linear-gradient(135deg, #1a56db, #0ea5e9)',
                  color: 'white', padding: '12px 24px', borderRadius: 12,
                  textDecoration: 'none', fontSize: 14, fontWeight: 700,
                  boxShadow: '0 6px 20px rgba(26,86,219,0.3)',
                  fontFamily: 'Plus Jakarta Sans, sans-serif'
                }}>Apply Now</Link>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Reference No.</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.slice(0, 5).map(app => {
                     const cfg = statusConfig[app.status as keyof typeof statusConfig] || statusConfig.pending;
                    return (
                      <tr key={app.id}>
                        <td style={{ fontWeight: 600, color: '#1a56db', fontSize: 13 }}>{app.referenceNo || "N/A"}</td>
                        <td style={{ fontWeight: 500 }}> {app.serviceType || "N/A"}</td>
                        <td style={{ color: '#64748b' }}>
  {app.submittedAt ? formatDate(app.submittedAt) : "N/A"}
</td>
                        <td>
                          <span className="badge" style={{ background: cfg.bg, color: cfg.color }}>
                            <cfg.icon size={12} /> {cfg.label}
                          </span>
                        </td>
                        <td>
                          <Link to="/citizen/track" style={{ color: '#1a56db', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>Track →</Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Quick Apply */}
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 16px' }}>Quick Apply</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {quickServices.map(s => (
                  <Link key={s.id} to="/citizen/apply" style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: '#f8fafc', borderRadius: 12, padding: '12px 10px',
                      textAlign: 'center', cursor: 'pointer', border: '1px solid #f1f5f9',
                      transition: 'all 0.2s'
                    }}>
                      <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#374151', lineHeight: 1.3 }}>{s.name}</div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link to="/citizen/apply" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                marginTop: 14, color: '#1a56db', fontSize: 13, fontWeight: 600, textDecoration: 'none'
              }}>
                View All Services <ArrowRight size={14} />
              </Link>
            </div>

            {/* Profile Summary */}
            <div className="card" style={{ padding: 24, background: 'linear-gradient(135deg, #0f172a, #1e293b)', border: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1a56db, #0ea5e9)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 800, fontSize: 20
                }}>{user?.name?.charAt(0)}</div>
                <div>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>{user?.name}</div>
                  <div style={{ color: '#64748b', fontSize: 12 }}>{user?.email}</div>
                </div>
              </div>
              {[
                { label: 'Phone', value: user?.phone || 'Not set' },
                { label: 'Aadhaar', value: user?.aadhaar ? '****-****-' + user.aadhaar.slice(-4) : 'Not set' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#64748b', fontSize: 12 }}>{item.label}</span>
                  <span style={{ color: '#94a3b8', fontSize: 12, fontWeight: 500 }}>{item.value}</span>
                </div>
              ))}
              <Link to="/citizen/profile" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                marginTop: 16, background: 'rgba(26,86,219,0.2)', border: '1px solid rgba(26,86,219,0.3)',
                borderRadius: 10, padding: '10px', color: '#60a5fa',
                fontSize: 13, fontWeight: 600, textDecoration: 'none'
              }}>Edit Profile <ArrowRight size={14} /></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
