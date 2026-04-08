import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Shield, Clock, CheckCircle, Users, FileText,
  Star, ChevronRight, Globe, Lock, Zap, Award, Phone, Mail,
  MapPin, TrendingUp, BarChart3, Building2, Landmark
} from 'lucide-react';

const stats = [
  { value: '2.4M+', label: 'Citizens Served', icon: Users, color: '#1a56db' },
  { value: '98.7%', label: 'Satisfaction Rate', icon: Star, color: '#10b981' },
  { value: '48hrs', label: 'Avg Processing Time', icon: Clock, color: '#f59e0b' },
  { value: '150+', label: 'Services Available', icon: FileText, color: '#8b5cf6' },
];

const services = [
  { icon: '👶', name: 'Birth Certificate', dept: 'Civil Registration', time: '7-10 days', color: '#dbeafe', accent: '#1a56db' },
  { icon: '💰', name: 'Income Certificate', dept: 'Revenue Dept', time: '5-7 days', color: '#d1fae5', accent: '#10b981' },
  { icon: '📋', name: 'Caste Certificate', dept: 'Revenue Dept', time: '10-15 days', color: '#ede9fe', accent: '#8b5cf6' },
  { icon: '🏠', name: 'Domicile Certificate', dept: 'Revenue Dept', time: '7-10 days', color: '#fef3c7', accent: '#f59e0b' },
  { icon: '🚗', name: 'Driving License', dept: 'Transport Dept', time: '20-30 days', color: '#ccfbf1', accent: '#0d9488' },
  { icon: '🍚', name: 'Ration Card', dept: 'Food & Supplies', time: '30-45 days', color: '#ffedd5', accent: '#ea580c' },
];

const features = [
  { icon: Zap, title: 'Instant Application', desc: 'Submit applications online 24/7 without visiting government offices', color: '#1a56db' },
  { icon: Shield, title: 'Secure & Verified', desc: 'Bank-grade security with Aadhaar-based identity verification', color: '#10b981' },
  { icon: Clock, title: 'Real-time Tracking', desc: 'Track your application status at every stage of processing', color: '#f59e0b' },
  { icon: Globe, title: 'Paperless Process', desc: 'Go green with fully digital documentation and certificates', color: '#8b5cf6' },
];

const testimonials = [
  { name: 'Amit Patel', city: 'Ahmedabad', text: 'Got my income certificate in just 4 days! The tracking feature kept me updated throughout.', rating: 5 },
  { name: 'Sunita Rao', city: 'Hyderabad', text: 'Applied for birth certificate from home. No more standing in long queues at the collector office.', rating: 5 },
  { name: 'Rahul Singh', city: 'Lucknow', text: 'The admin team is very responsive. My driving license application was processed quickly.', rating: 4 },
];

export default function Landing() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', background: '#f0f4ff', minHeight: '100vh' }}>
      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrollY > 50 ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: scrollY > 50 ? 'blur(20px)' : 'none',
        borderBottom: scrollY > 50 ? '1px solid rgba(226,232,240,0.8)' : 'none',
        transition: 'all 0.3s ease',
        padding: '16px 0'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'linear-gradient(135deg, #1a56db, #0ea5e9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', boxShadow: '0 4px 12px rgba(26,86,219,0.3)'
            }}>🏛️</div>
            <div>
              <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 18, color: scrollY > 50 ? '#0f172a' : 'white' }}>e-Governance</div>
              <div style={{ fontSize: 10, color: scrollY > 50 ? '#64748b' : 'rgba(255,255,255,0.7)', fontWeight: 600 }}>DIGITAL INDIA SERVICES</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to="/citizen/login" style={{
              padding: '9px 20px', borderRadius: 10,
              border: `2px solid ${scrollY > 50 ? '#1a56db' : 'rgba(255,255,255,0.5)'}`,
              color: scrollY > 50 ? '#1a56db' : 'white',
              textDecoration: 'none', fontSize: 14, fontWeight: 600,
              transition: 'all 0.2s'
            }}>Citizen Login</Link>
            <Link to="/admin/login" style={{
              padding: '9px 20px', borderRadius: 10,
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              color: 'white', textDecoration: 'none', fontSize: 14, fontWeight: 600,
              boxShadow: '0 4px 12px rgba(245,158,11,0.3)'
            }}>Admin</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #1a3a8f 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex', alignItems: 'center'
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(26,86,219,0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(14,165,233,0.1) 0%, transparent 50%),
            radial-gradient(circle at 60% 80%, rgba(139,92,246,0.08) 0%, transparent 50%)`,
        }} />
        {/* Grid pattern */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '120px 24px 80px', position: 'relative', zIndex: 1, width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(26,86,219,0.2)', border: '1px solid rgba(26,86,219,0.4)',
                borderRadius: 100, padding: '6px 16px', marginBottom: 24
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }} />
                <span style={{ color: '#93c5fd', fontSize: 13, fontWeight: 600 }}>Digital India Initiative — Gov 3.0</span>
              </div>

              <h1 style={{
                fontFamily: 'Sora, sans-serif', fontSize: 56, fontWeight: 800,
                color: 'white', lineHeight: 1.1, margin: '0 0 24px'
              }}>
                Your Government,<br />
                <span style={{
                  background: 'linear-gradient(135deg, #60a5fa, #0ea5e9)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                }}>Digitally Yours</span>
              </h1>

              <p style={{ color: '#94a3b8', fontSize: 18, lineHeight: 1.7, margin: '0 0 40px', maxWidth: 480 }}>
                Apply for government certificates, track your applications in real-time,
                and receive services without stepping out of your home.
              </p>

              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <Link to="/citizen/register" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'linear-gradient(135deg, #1a56db, #0ea5e9)',
                  color: 'white', padding: '15px 32px', borderRadius: 14,
                  textDecoration: 'none', fontSize: 16, fontWeight: 700,
                  boxShadow: '0 8px 24px rgba(26,86,219,0.4)', transition: 'all 0.3s'
                }}>
                  Get Started as Citizen <ArrowRight size={18} />
                </Link>
                <Link to="/citizen/track" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white', padding: '15px 32px', borderRadius: 14,
                  textDecoration: 'none', fontSize: 16, fontWeight: 600
                }}>
                  Track Application <ChevronRight size={18} />
                </Link>
              </div>

              <div style={{ display: 'flex', gap: 32, marginTop: 48 }}>
                {[{ v: '2.4M+', l: 'Citizens' }, { v: '150+', l: 'Services' }, { v: '98%', l: 'Satisfaction' }].map(s => (
                  <div key={s.l}>
                    <div style={{ color: 'white', fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 800 }}>{s.v}</div>
                    <div style={{ color: '#64748b', fontSize: 13, fontWeight: 500 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Visual */}
            <div style={{ position: 'relative' }}>
              <div style={{
                background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24,
                padding: 32, animation: 'float 4s ease-in-out infinite'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📊</div>
                  <div>
                    <div style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>Application Status</div>
                    <div style={{ color: '#94a3b8', fontSize: 12 }}>Real-time tracking</div>
                  </div>
                </div>
                {[
                  { ref: 'EGS2024001234', service: 'Income Certificate', status: 'Approved', color: '#10b981', bg: '#d1fae5' },
                  { ref: 'EGS2024005678', service: 'Birth Certificate', status: 'Processing', color: '#1a56db', bg: '#dbeafe' },
                  { ref: 'EGS2024009012', service: 'Driving License', status: 'Pending', color: '#f59e0b', bg: '#fef3c7' },
                ].map(app => (
                  <div key={app.ref} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '12px 16px', marginBottom: 8
                  }}>
                    <div>
                      <div style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>{app.service}</div>
                      <div style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>{app.ref}</div>
                    </div>
                    <span style={{
                      background: app.bg, color: app.color,
                      padding: '4px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700
                    }}>{app.status}</span>
                  </div>
                ))}
              </div>

              {/* Floating card */}
              <div style={{
                position: 'absolute', top: -20, right: -20,
                background: 'white', borderRadius: 16, padding: '16px 20px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                display: 'flex', alignItems: 'center', gap: 10
              }}>
                <CheckCircle size={20} style={{ color: '#10b981' }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Certificate Ready!</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Income Certificate</div>
                </div>
              </div>

              <div style={{
                position: 'absolute', bottom: -20, left: -20,
                background: 'white', borderRadius: 16, padding: '16px 20px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                display: 'flex', alignItems: 'center', gap: 10
              }}>
                <Shield size={20} style={{ color: '#1a56db' }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Secure & Verified</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>256-bit Encryption</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
            <path d="M0 80L60 66.7C120 53.3 240 26.7 360 20C480 13.3 600 26.7 720 33.3C840 40 960 40 1080 36.7C1200 33.3 1320 26.7 1380 23.3L1440 20V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="#f0f4ff"/>
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '60px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {stats.map((stat, i) => (
            <div key={i} className="card" style={{ padding: 28, textAlign: 'center' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
                background: `${stat.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <stat.icon size={26} style={{ color: stat.color }} />
              </div>
              <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 32, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>{stat.value}</div>
              <div style={{ color: '#64748b', fontSize: 14, fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section style={{ padding: '40px 24px 80px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ display: 'inline-block', background: '#dbeafe', color: '#1a56db', padding: '6px 16px', borderRadius: 100, fontSize: 13, fontWeight: 700, marginBottom: 16 }}>OUR SERVICES</div>
          <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 42, fontWeight: 800, color: '#0f172a', margin: '0 0 16px' }}>Popular Government Services</h2>
          <p style={{ color: '#64748b', fontSize: 17, maxWidth: 560, margin: '0 auto' }}>Access all essential government services from one unified platform</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {services.map((s, i) => (
            <div key={i} className="card" style={{ padding: 28, cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16, background: s.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26, flexShrink: 0
                }}>{s.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: '#0f172a', marginBottom: 4 }}>{s.name}</div>
                  <div style={{ color: '#64748b', fontSize: 12, marginBottom: 12 }}>{s.dept}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={12} style={{ color: s.accent }} />
                    <span style={{ fontSize: 12, color: s.accent, fontWeight: 600 }}>{s.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Link to="/citizen/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'linear-gradient(135deg, #1a56db, #0ea5e9)',
            color: 'white', padding: '14px 32px', borderRadius: 14,
            textDecoration: 'none', fontSize: 15, fontWeight: 700,
            boxShadow: '0 8px 24px rgba(26,86,219,0.3)'
          }}>
            View All Services <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section style={{ background: '#0f172a', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ display: 'inline-block', background: 'rgba(26,86,219,0.2)', color: '#60a5fa', padding: '6px 16px', borderRadius: 100, fontSize: 13, fontWeight: 700, marginBottom: 16 }}>WHY CHOOSE US</div>
            <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 42, fontWeight: 800, color: 'white', margin: '0 0 16px' }}>Built for Every Citizen</h2>
            <p style={{ color: '#64748b', fontSize: 17, maxWidth: 560, margin: '0 auto' }}>Modern technology meets government efficiency for seamless service delivery</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {features.map((f, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 20, padding: 32, transition: 'all 0.3s'
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: `${f.color}20`, border: `1px solid ${f.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20
                }}>
                  <f.icon size={24} style={{ color: f.color }} />
                </div>
                <h3 style={{ color: 'white', fontSize: 18, fontWeight: 700, margin: '0 0 12px' }}>{f.title}</h3>
                <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ display: 'inline-block', background: '#d1fae5', color: '#065f46', padding: '6px 16px', borderRadius: 100, fontSize: 13, fontWeight: 700, marginBottom: 16 }}>HOW IT WORKS</div>
          <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 42, fontWeight: 800, color: '#0f172a', margin: '0 0 16px' }}>Simple 4-Step Process</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, position: 'relative' }}>
          {[
            { step: '01', title: 'Register', desc: 'Create your citizen account with Aadhaar verification', icon: Users, color: '#1a56db' },
            { step: '02', title: 'Apply', desc: 'Select the service and fill the application form', icon: FileText, color: '#8b5cf6' },
            { step: '03', title: 'Track', desc: 'Monitor your application status in real-time', icon: TrendingUp, color: '#f59e0b' },
            { step: '04', title: 'Receive', desc: 'Download your certificate or collect from office', icon: Award, color: '#10b981' },
          ].map((step, i) => (
            <div key={i} style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: `${step.color}15`, border: `2px solid ${step.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px', position: 'relative'
              }}>
                <step.icon size={28} style={{ color: step.color }} />
                <div style={{
                  position: 'absolute', top: -8, right: -8,
                  width: 24, height: 24, borderRadius: '50%',
                  background: step.color, color: 'white',
                  fontSize: 10, fontWeight: 800, display: 'flex',
                  alignItems: 'center', justifyContent: 'center'
                }}>{step.step}</div>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>{step.title}</h3>
              <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ background: 'linear-gradient(135deg, #1a56db, #0ea5e9)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 42, fontWeight: 800, color: 'white', margin: '0 0 16px' }}>Trusted by Millions</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 17 }}>What citizens are saying about e-Governance</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, padding: 28
              }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                  {Array(t.rating).fill(0).map((_, j) => (
                    <Star key={j} size={16} fill="#fbbf24" style={{ color: '#fbbf24' }} />
                  ))}
                </div>
                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 15, lineHeight: 1.7, margin: '0 0 20px' }}>"{ t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, fontSize: 16
                  }}>{t.name.charAt(0)}</div>
                  <div>
                    <div style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          background: 'linear-gradient(135deg, #0f172a, #1e293b)',
          borderRadius: 28, padding: '60px 40px', position: 'relative', overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(26,86,219,0.15) 0%, transparent 60%), radial-gradient(circle at 70% 50%, rgba(14,165,233,0.1) 0%, transparent 60%)'
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏛️</div>
            <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 42, fontWeight: 800, color: 'white', margin: '0 0 16px' }}>
              Start Your Digital Journey Today
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 18, maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}>
              Join millions of citizens who are already experiencing the convenience of digital government services.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/citizen/register" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'linear-gradient(135deg, #1a56db, #0ea5e9)',
                color: 'white', padding: '16px 36px', borderRadius: 14,
                textDecoration: 'none', fontSize: 16, fontWeight: 700,
                boxShadow: '0 8px 24px rgba(26,86,219,0.4)'
              }}>Register as Citizen <ArrowRight size={18} /></Link>
              <Link to="/admin/register" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                color: 'white', padding: '16px 36px', borderRadius: 14,
                textDecoration: 'none', fontSize: 16, fontWeight: 600
              }}>Admin Portal <ChevronRight size={18} /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0f172a', padding: '48px 24px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ fontSize: 24 }}>🏛️</div>
                <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 18, color: 'white' }}>e-Governance</div>
              </div>
              <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7, maxWidth: 280 }}>
                Empowering citizens through digital governance. Making government services accessible, transparent, and efficient.
              </p>
            </div>
            {[
              { title: 'Services', links: ['Birth Certificate', 'Income Certificate', 'Caste Certificate', 'Driving License'] },
              { title: 'Portal', links: ['Citizen Login', 'Admin Login', 'Track Application', 'Register'] },
              { title: 'Support', links: ['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Use'] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ color: 'white', fontWeight: 700, fontSize: 15, margin: '0 0 16px' }}>{col.title}</h4>
                {col.links.map(link => (
                  <div key={link} style={{ color: '#64748b', fontSize: 14, marginBottom: 8, cursor: 'pointer' }}>{link}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: '#475569', fontSize: 13 }}>© 2024 e-Governance Portal. Government of India. All rights reserved.</div>
            <div style={{ display: 'flex', gap: 16 }}>
              {['Privacy', 'Terms', 'Accessibility'].map(l => (
                <span key={l} style={{ color: '#475569', fontSize: 13, cursor: 'pointer' }}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
