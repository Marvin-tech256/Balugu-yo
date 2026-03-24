import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, CloudRain, Bell, ArrowRight, TrendingUp, Shield, Sprout, Users, MapPin, CheckCircle } from 'lucide-react'

// Floating particle component
function Particle({ style }) {
    return (
        <div style={{
            position: 'absolute', borderRadius: '50%',
            background: 'rgba(110,231,183,0.15)',
            pointerEvents: 'none',
            ...style,
        }} />
    )
}

const features = [
    { icon: CalendarDays, title: 'Harvest Prediction', desc: 'AI-powered dates based on planting data and local weather patterns', color: '#6ee7b7' },
    { icon: CloudRain, title: 'Live Weather', desc: 'Real-time conditions across all major Ugandan districts', color: '#67e8f9' },
    { icon: Bell, title: 'Smart Alerts', desc: 'SMS & push notifications 2 weeks before harvest', color: '#fbbf24' },
    { icon: TrendingUp, title: 'Farm Analytics', desc: 'Track performance across all your plots in one place', color: '#c4b5fd' },
    { icon: Users, title: 'Extension Officers', desc: 'Regional advisors can monitor and guide farmers', color: '#f9a8d4' },
    { icon: Shield, title: 'Offline Ready', desc: 'Works without internet — credentials stored locally', color: '#86efac' },
]

export default function Landing() {
    const navigate = useNavigate()

    return (
        <div style={{ minHeight: '100vh', background: '#050f05', position: 'relative', overflow: 'hidden' }}>

            {/* Farm background image with overlay */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80)',
                backgroundSize: 'cover', backgroundPosition: 'center 40%',
                filter: 'brightness(0.25) saturate(1.2)',
            }} />

            {/* Gradient overlay on top of image */}
            <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg, rgba(5,46,22,0.7) 0%, rgba(5,15,5,0.85) 40%, rgba(5,15,5,0.95) 100%)',
            }} />

            {/* Animated glow orbs */}
            <div style={{ position: 'absolute', top: '10%', left: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(22,163,74,0.12) 0%, transparent 70%)', animation: 'floatSlow 8s ease-in-out infinite', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,148,136,0.1) 0%, transparent 70%)', animation: 'floatSlow 10s ease-in-out infinite reverse', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(217,119,6,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

            {/* Floating particles */}
            {[
                { width: 8, height: 8, top: '15%', left: '12%', animationDelay: '0s', animationDuration: '4s' },
                { width: 5, height: 5, top: '25%', left: '80%', animationDelay: '1s', animationDuration: '5s' },
                { width: 10, height: 10, top: '60%', left: '8%', animationDelay: '2s', animationDuration: '6s' },
                { width: 6, height: 6, top: '70%', left: '88%', animationDelay: '0.5s', animationDuration: '4.5s' },
                { width: 4, height: 4, top: '40%', left: '92%', animationDelay: '1.5s', animationDuration: '5.5s' },
                { width: 7, height: 7, top: '85%', left: '30%', animationDelay: '3s', animationDuration: '4s' },
            ].map((p, i) => (
                <Particle key={i} style={{ ...p, animation: `float ${p.animationDuration} ease-in-out infinite`, animationDelay: p.animationDelay }} />
            ))}

            {/* Grid overlay */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

            {/* Navbar */}
            <nav style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #16a34a, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="anim-pulse-glow">
                        <Sprout size={18} color="white" />
                    </div>
                    <span style={{ fontFamily: 'Poppins', fontSize: 20, fontWeight: 700, color: 'white' }}>
                        Balugu <span style={{ color: '#6ee7b7' }}>Yo</span>
                    </span>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => navigate('/login')} style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 500, cursor: 'pointer', backdropFilter: 'blur(8px)', transition: 'all 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
                        Sign In
                    </button>
                    <button onClick={() => navigate('/register')} style={{ background: 'linear-gradient(135deg, #16a34a, #0d9488)', color: 'white', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 16px rgba(22,163,74,0.35)', transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(22,163,74,0.5)' }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(22,163,74,0.35)' }}>
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <div style={{ position: 'relative', zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '60px 24px 40px' }}>

                {/* Trust badge */}
                <div className="anim-scale-in" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.35)', borderRadius: 20, padding: '5px 14px', marginBottom: 24 }}>
                    <CheckCircle size={12} color="#6ee7b7" />
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#6ee7b7', letterSpacing: 0.8 }}>TRUSTED BY UGANDAN FARMERS</span>
                </div>

                {/* Main headline */}
                <h1 className="anim-slide-left" style={{ fontFamily: 'Poppins', fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800, color: 'white', lineHeight: 1.1, marginBottom: 20, maxWidth: 700 }}>
                    Know exactly when to<br />
                    <span className="hero-gradient-text">harvest your yams</span>
                </h1>

                <p className="anim-slide-right" style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, maxWidth: 500, marginBottom: 36 }}>
                    Balugu Yo combines weather data, soil conditions, and planting records to predict your harvest date with precision. Built for Uganda's yam farmers.
                </p>

                {/* CTA */}
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 56 }}>
                    <button onClick={() => navigate('/register')} style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        background: 'linear-gradient(135deg, #16a34a, #0d9488)',
                        color: 'white', border: 'none', borderRadius: 12,
                        padding: '14px 28px', fontSize: 15, fontWeight: 700,
                        cursor: 'pointer', boxShadow: '0 6px 24px rgba(22,163,74,0.45)',
                        transition: 'all 0.2s',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(22,163,74,0.55)' }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(22,163,74,0.45)' }}>
                        Start for Free <ArrowRight size={16} />
                    </button>
                    <button onClick={() => navigate('/login')} style={{
                        background: 'rgba(255,255,255,0.07)', color: 'white',
                        border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: 12,
                        padding: '14px 28px', fontSize: 15, fontWeight: 600, cursor: 'pointer',
                        backdropFilter: 'blur(12px)', transition: 'all 0.2s',
                    }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.13)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}>
                        Sign In
                    </button>
                </div>

                {/* Stats row */}
                <div style={{ display: 'flex', gap: 2, marginBottom: 64, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, overflow: 'hidden' }}>
                    {[
                        { value: '2,400+', label: 'Farmers', color: '#6ee7b7' },
                        { value: '98%', label: 'Accuracy', color: '#fbbf24' },
                        { value: '12', label: 'Districts', color: '#67e8f9' },
                        { value: '270', label: 'Avg. Days', color: '#c4b5fd' },
                    ].map(({ value, label, color }, i) => (
                        <div key={label} style={{ padding: '16px 28px', textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                            <div className="stat-counter" style={{ fontFamily: 'Poppins', fontSize: 22, fontWeight: 700, color, animationDelay: `${i * 0.1}s` }}>{value}</div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{label}</div>
                        </div>
                    ))}
                </div>

                {/* Feature grid */}
                <div style={{ maxWidth: 900, width: '100%', marginBottom: 48 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 20 }}>Everything you need</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                        {features.map(({ icon: Icon, title, desc, color }, i) => (
                            <div key={title} className="feature-card" style={{
                                background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '18px 16px',
                                animationDelay: `${i * 0.08}s`,
                            }}>
                                <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                                    <Icon size={18} color={color} />
                                </div>
                                <div style={{ fontFamily: 'Poppins', fontSize: 13, fontWeight: 600, color: 'white', marginBottom: 5 }}>{title}</div>
                                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{desc}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom CTA strip */}
                <div style={{ background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.25)', borderRadius: 16, padding: '24px 32px', maxWidth: 560, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ fontFamily: 'Poppins', fontSize: 16, fontWeight: 600, color: 'white', marginBottom: 4 }}>Ready to predict your harvest?</div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Free for all Ugandan farmers. No smartphone required.</div>
                    </div>
                    <button onClick={() => navigate('/register')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#16a34a', color: 'white', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
                        Register Now <ArrowRight size={14} />
                    </button>
                </div>

                <p style={{ marginTop: 32, color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>
                    Balugu Yo v1.0
                </p>
            </div>
        </div>
    )
}
