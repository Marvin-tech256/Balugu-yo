import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wheat, Sprout, Bell, Plus, CloudRain, CalendarDays } from 'lucide-react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import api from '../api'

export default function Dashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [farms, setFarms] = useState([])
    const [predictions, setPredictions] = useState([])
    const [alerts, setAlerts] = useState([])
    const [notifCount, setNotifCount] = useState(0)

    const hour = new Date().getHours()
    const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

    useEffect(() => {
        api.get('/farms/my').then(d => { if (d.success) setFarms(d.farms) }).catch(() => { })
        api.get('/predictions/my-predictions').then(d => { if (d.success) setPredictions(d.predictions) }).catch(() => { })
        api.get('/alerts/unread').then(d => { if (d.success) { setNotifCount(d.count); setAlerts(d.notifications || []) } }).catch(() => { })
    }, [])

    const upcoming = predictions.filter(p => p.days_remaining > 0).sort((a, b) => a.days_remaining - b.days_remaining)[0] || predictions[0]
    const progress = upcoming?.days_remaining > 0 ? Math.round(((270 - upcoming.days_remaining) / 270) * 100) : 100

    return (
        <Layout notifCount={notifCount}>
            <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 20 }}>{greet}! 👋</h2>
                <p style={{ fontSize: 13, color: 'var(--text-gray)', marginTop: 2 }}>Welcome back, {user?.full_name?.split(' ')[0]}</p>
            </div>

            {/* Hero card */}
            {upcoming ? (
                <div style={{ background: 'linear-gradient(135deg,#1B5E20,#2E7D32,#00897B)', borderRadius: 20, padding: 24, color: 'white', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', right: -10, top: -10, fontSize: 100, opacity: 0.1 }}>🌿</div>
                    <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: 'rgba(255,255,255,0.75)', marginBottom: 6 }}>Your Next Harvest</div>
                    <div style={{ fontFamily: 'Poppins', fontSize: 52, fontWeight: 700, lineHeight: 1, marginBottom: 4 }}>
                        {upcoming.days_remaining > 0 ? `${upcoming.days_remaining} Days` : 'Ready!'}
                    </div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', marginBottom: 16 }}>
                        {upcoming.farm_name} — {upcoming.yam_variety}
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 20, height: 8, marginBottom: 6 }}>
                        <div style={{ background: '#A5D6A7', borderRadius: 20, height: 8, width: `${Math.min(progress, 100)}%`, transition: 'width 1s ease' }} />
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Planted</span><span>{upcoming.confidence_percent}% confidence</span><span>Harvest</span>
                    </div>
                    <div style={{ marginTop: 16, display: 'inline-block', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', color: 'white', padding: '10px 20px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
                        <CalendarDays size={14} style={{ display: 'inline', marginRight: 6 }} />{upcoming.predicted_harvest_date}
                    </div>
                </div>
            ) : (
                <div style={{ background: 'linear-gradient(135deg,#E8F5E9,#E0F2F1)', borderRadius: 20, padding: '32px 24px', textAlign: 'center', marginBottom: 20, border: '2px dashed var(--primary)' }}>
                    <Sprout size={48} color="var(--primary)" style={{ marginBottom: 12 }} />
                    <h3 style={{ color: 'var(--primary)', marginBottom: 8 }}>No Active Planting</h3>
                    <p style={{ color: 'var(--text-gray)', fontSize: 13, marginBottom: 16 }}>Add your first yam planting to get your harvest prediction!</p>
                    <button onClick={() => navigate('/add-planting')} style={{ padding: '12px 24px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'Poppins', fontWeight: 600, cursor: 'pointer' }}>Add Planting</button>
                </div>
            )}

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
                {[{ icon: <Wheat size={22} color="var(--primary)" />, val: farms.length, label: 'My Farms' },
                { icon: <Sprout size={22} color="var(--primary)" />, val: predictions.length, label: 'Plantings' },
                { icon: <Bell size={22} color="var(--primary)" />, val: notifCount, label: 'Alerts' }].map(s => (
                    <div key={s.label} style={{ background: 'white', borderRadius: 'var(--radius)', padding: '14px 10px', textAlign: 'center', boxShadow: 'var(--shadow)' }}>
                        <div style={{ marginBottom: 4 }}>{s.icon}</div>
                        <div style={{ fontFamily: 'Poppins', fontSize: 18, fontWeight: 700, color: 'var(--primary)' }}>{s.val}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-gray)', marginTop: 2 }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Quick actions */}
            <h3 style={{ fontSize: 16, marginBottom: 12 }}>Quick Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12, marginBottom: 20 }}>
                {[{ icon: <Sprout size={28} />, title: 'Add Planting', sub: 'Record new yam planting', to: '/add-planting' },
                { icon: <CloudRain size={28} />, title: 'Weather', sub: 'Check conditions', to: '/weather' },
                { icon: <Wheat size={28} />, title: 'My Farms', sub: 'View all farms', to: '/my-farms' },
                { icon: <Bell size={28} />, title: 'Alerts', sub: 'View notifications', to: '/alerts' }].map(a => (
                    <button key={a.to} onClick={() => navigate(a.to)} style={{ background: 'white', borderRadius: 'var(--radius)', padding: '18px 14px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: 'var(--shadow)', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                        <span style={{ color: 'var(--primary)' }}>{a.icon}</span>
                        <div>
                            <div style={{ fontFamily: 'Poppins', fontSize: 13, fontWeight: 600 }}>{a.title}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-gray)', marginTop: 2 }}>{a.sub}</div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Recent alerts */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontSize: 16 }}>Recent Alerts</h3>
                <a href="/alerts" style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500 }}>View all</a>
            </div>
            {alerts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 20px', color: 'var(--text-gray)' }}>
                    <Bell size={40} style={{ marginBottom: 12, opacity: 0.4 }} /><p>No alerts yet</p>
                </div>
            ) : alerts.slice(0, 3).map(a => (
                <div key={a.notif_id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 14, background: 'white', borderRadius: 'var(--radius)', marginBottom: 10, boxShadow: 'var(--shadow)' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', marginTop: 4, flexShrink: 0, background: a.type === 'harvest' ? 'var(--primary)' : a.type === 'weather' ? 'var(--accent)' : 'var(--amber)' }} />
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{a.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-gray)', lineHeight: 1.5 }}>{a.message}</div>
                    </div>
                </div>
            ))}
        </Layout>
    )
}
