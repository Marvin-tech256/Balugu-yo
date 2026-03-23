import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, CloudRain, Bell, Leaf } from 'lucide-react'

export default function Landing() {
    const navigate = useNavigate()
    return (
        <div style={{ background: 'linear-gradient(160deg,#1B5E20 0%,#2E7D32 50%,#00897B 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 24, padding: '48px 32px', textAlign: 'center', maxWidth: 400, width: '100%' }}>
                <Leaf size={64} color="white" style={{ marginBottom: 16 }} />
                <h1 style={{ fontFamily: 'Poppins', fontSize: 36, fontWeight: 700, color: 'white', marginBottom: 8 }}>Balugu Yo</h1>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, marginBottom: 40 }}>
                    Know exactly when to harvest your climbing yams.<br />Powered by data. Built for Uganda farmers.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 40 }}>
                    {[{ icon: <CalendarDays size={28} color="white" />, label: 'Harvest Date' },
                    { icon: <CloudRain size={28} color="white" />, label: 'Weather Data' },
                    { icon: <Bell size={28} color="white" />, label: 'Smart Alerts' }].map(f => (
                        <div key={f.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: 500 }}>
                            {f.icon}{f.label}
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <button onClick={() => navigate('/register')} style={{ background: 'white', color: 'var(--primary-dark)', fontFamily: 'Poppins', fontWeight: 600, padding: 14, borderRadius: 12, border: 'none', fontSize: 16, cursor: 'pointer' }}>
                        Get Started — Register
                    </button>
                    <button onClick={() => navigate('/login')} style={{ background: 'transparent', color: 'white', border: '2px solid rgba(255,255,255,0.5)', fontFamily: 'Poppins', fontWeight: 600, padding: 14, borderRadius: 12, fontSize: 16, cursor: 'pointer' }}>
                        I already have an account
                    </button>
                </div>
                <p style={{ marginTop: 24, color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Balugu Yo v1.0 — Makerere University 2025</p>
            </div>
        </div>
    )
}
