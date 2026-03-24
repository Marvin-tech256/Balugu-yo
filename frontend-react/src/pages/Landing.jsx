import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, CloudRain, Bell, ArrowRight, TrendingUp, Shield } from 'lucide-react'

const features = [
    { icon: CalendarDays, title: 'Harvest Prediction', desc: 'AI-powered dates based on your planting data and local weather' },
    { icon: CloudRain, title: 'Live Weather', desc: 'Real-time conditions across all major Ugandan districts' },
    { icon: Bell, title: 'Smart Alerts', desc: 'Get notified when harvest is approaching or weather changes' },
    { icon: TrendingUp, title: 'Farm Analytics', desc: 'Track performance across all your farms in one place' },
]

export default function Landing() {
    const navigate = useNavigate()

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #052e16 0%, #14532d 30%, #065f46 65%, #0f3460 100%)',
            position: 'relative', overflow: 'hidden',
        }}>
            {/* Background texture circles */}
            <div style={{ position: 'absolute', top: -120, right: -120, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(22,163,74,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -80, left: -80, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,148,136,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '40%', left: '20%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(217,119,6,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

            {/* Grid pattern overlay */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '32px 20px' }}>

                {/* Hero section */}
                <div style={{ textAlign: 'center', marginBottom: 40, maxWidth: 560 }}>
                    {/* Badge */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(22,163,74,0.2)', border: '1px solid rgba(22,163,74,0.4)', borderRadius: 20, padding: '5px 14px', marginBottom: 20 }}>
                        <Shield size={12} color="#6ee7b7" />
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#6ee7b7', letterSpacing: 0.5 }}>TRUSTED BY UGANDAN FARMERS</span>
                    </div>

                    <h1 style={{ fontFamily: 'Poppins', fontSize: 'clamp(32px, 6vw, 52px)', fontWeight: 700, color: 'white', lineHeight: 1.15, marginBottom: 16 }}>
                        Know exactly when to<br />
                        <span style={{ background: 'linear-gradient(90deg, #6ee7b7, #34d399, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                            harvest your yams
                        </span>
                    </h1>
                    <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, maxWidth: 420, margin: '0 auto 32px' }}>
                        Balugu Yo uses weather data and planting records to predict your harvest date with precision. Built for Uganda's yam farmers.
                    </p>

                    {/* CTA buttons */}
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button onClick={() => navigate('/register')} style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            background: 'linear-gradient(135deg, #16a34a, #0d9488)',
                            color: 'white', border: 'none', borderRadius: 10,
                            padding: '12px 24px', fontSize: 14, fontWeight: 600,
                            cursor: 'pointer', boxShadow: '0 4px 20px rgba(22,163,74,0.4)',
                            transition: 'transform 0.15s, box-shadow 0.15s',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(22,163,74,0.5)' }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(22,163,74,0.4)' }}>
                            Get Started Free <ArrowRight size={15} />
                        </button>
                        <button onClick={() => navigate('/login')} style={{
                            background: 'rgba(255,255,255,0.08)', color: 'white',
                            border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10,
                            padding: '12px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                            backdropFilter: 'blur(8px)', transition: 'background 0.15s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
                            Sign In
                        </button>
                    </div>
                </div>

                {/* Stats row */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 40, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {[{ value: '2,400+', label: 'Farmers' }, { value: '98%', label: 'Accuracy' }, { value: '12', label: 'Districts' }].map(({ value, label }) => (
                        <div key={label} style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '14px 24px', textAlign: 'center', minWidth: 100 }}>
                            <div style={{ fontFamily: 'Poppins', fontSize: 22, fontWeight: 700, color: 'white' }}>{value}</div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{label}</div>
                        </div>
                    ))}
                </div>

                {/* Feature cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, maxWidth: 720, width: '100%' }}>
                    {features.map(({ icon: Icon, title, desc }) => (
                        <div key={title} style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '18px 16px', transition: 'background 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}>
                            <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(22,163,74,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                                <Icon size={18} color="#6ee7b7" />
                            </div>
                            <div style={{ fontFamily: 'Poppins', fontSize: 13, fontWeight: 600, color: 'white', marginBottom: 4 }}>{title}</div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{desc}</div>
                        </div>
                    ))}
                </div>

                <p style={{ marginTop: 32, color: 'rgba(255,255,255,0.25)', fontSize: 11 }}>
                    Balugu Yo v1.0 · Makerere University 2025
                </p>
            </div>
        </div>
    )
}
