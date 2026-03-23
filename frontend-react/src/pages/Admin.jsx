import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Wheat, Sprout, CalendarDays, RefreshCw, LogOut, LayoutDashboard, Activity } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import api from '../api'

const sections = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'users', label: 'Users', icon: <Users size={18} /> },
    { id: 'farms', label: 'Farms', icon: <Wheat size={18} /> },
    { id: 'predictions', label: 'Predictions', icon: <Sprout size={18} /> },
    { id: 'health', label: 'System Health', icon: <Activity size={18} /> },
]

export default function Admin() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const showToast = useToast()
    const [section, setSection] = useState('overview')
    const [stats, setStats] = useState({ users: 0, farms: 0, predictions: 0, soon: 0 })
    const [farms, setFarms] = useState([])
    const [districtData, setDistrictData] = useState({})
    const [weatherStatus, setWeatherStatus] = useState('Checking...')

    const handleLogout = () => { logout(); showToast('Logged out'); navigate('/login') }

    const loadAll = async () => {
        try {
            const d = await api.get('/farms/all')
            if (!d.success) return
            const seen = new Set(); const unique = []
            d.farms.forEach(f => { if (!seen.has(f.farm_id)) { seen.add(f.farm_id); unique.push(f) } })
            setFarms(unique)
            const farmers = [...new Map(d.farms.map(f => [f.user_id, f])).values()]
            const soon = unique.filter(f => f.days_remaining > 0 && f.days_remaining <= 30).length
            setStats({ users: farmers.length, farms: unique.length, predictions: unique.filter(f => f.predicted_harvest_date).length, soon })
            const dm = {}; farmers.forEach(f => { const k = f.user_district || 'Other'; dm[k] = (dm[k] || 0) + 1 })
            setDistrictData(dm)
            const w = await api.get('/weather/current/Buikwe').catch(() => null)
            setWeatherStatus(w?.weather && !w.weather.note ? 'Live Data' : 'Fallback Data')
        } catch { }
    }

    useEffect(() => { loadAll() }, [])

    const sidebarLink = (s) => ({
        display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px',
        color: section === s.id ? 'white' : 'rgba(255,255,255,0.65)',
        fontSize: 14, fontWeight: 500, cursor: 'pointer',
        background: section === s.id ? 'rgba(255,255,255,0.08)' : 'transparent',
        borderLeft: section === s.id ? '3px solid #A5D6A7' : '3px solid transparent',
    })

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <div style={{ width: 240, background: '#1A1A2E', color: 'white', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', top: 0, left: 0, zIndex: 99 }}>
                <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontFamily: 'Poppins', fontSize: 20, fontWeight: 700 }}>Balugu <span style={{ color: '#A5D6A7' }}>Yo</span></div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>Admin Panel</div>
                </div>
                <nav style={{ flex: 1, paddingTop: 16 }}>
                    {sections.map(s => <div key={s.id} onClick={() => setSection(s.id)} style={sidebarLink(s)}>{s.icon} {s.label}</div>)}
                </nav>
                <div style={{ padding: 20, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{user?.full_name?.charAt(0)}</div>
                        <div>
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>{user?.full_name}</div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>Administrator</div>
                        </div>
                    </div>
                    <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 13, cursor: 'pointer' }}><LogOut size={14} /> Logout</button>
                </div>
            </div>

            {/* Main */}
            <div style={{ flex: 1, marginLeft: 240, background: 'var(--bg)', minHeight: '100vh' }}>
                <div style={{ background: 'white', padding: '16px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 50 }}>
                    <h1 style={{ fontSize: 20 }}>{sections.find(s => s.id === section)?.label}</h1>
                    <button onClick={loadAll} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg)', border: '1px solid var(--border)', padding: '8px 16px', borderRadius: 20, fontSize: 13, cursor: 'pointer', fontWeight: 500 }}><RefreshCw size={14} /> Refresh</button>
                </div>

                <div style={{ padding: '24px 28px' }}>
                    {section === 'overview' && (
                        <>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
                                {[{ label: 'Total Users', val: stats.users, icon: <Users size={20} />, bg: '#E8F5E9' },
                                { label: 'Total Farms', val: stats.farms, icon: <Wheat size={20} />, bg: '#E0F2F1' },
                                { label: 'Predictions', val: stats.predictions, icon: <Sprout size={20} />, bg: '#FFF8E1' },
                                { label: 'Harvest Soon', val: stats.soon, icon: <CalendarDays size={20} />, bg: '#E3F2FD' }].map(s => (
                                    <div key={s.label} style={{ background: 'white', borderRadius: 'var(--radius)', padding: 20, boxShadow: 'var(--shadow)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                            <div style={{ fontSize: 12, color: 'var(--text-gray)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</div>
                                            <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>{s.icon}</div>
                                        </div>
                                        <div style={{ fontFamily: 'Poppins', fontSize: 28, fontWeight: 700 }}>{s.val}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: 20, boxShadow: 'var(--shadow)' }}>
                                    <div style={{ fontFamily: 'Poppins', fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Farmers by District</div>
                                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 120 }}>
                                        {Object.entries(districtData).map(([d, count]) => {
                                            const max = Math.max(...Object.values(districtData), 1)
                                            const h = Math.round((count / max) * 100)
                                            return (
                                                <div key={d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                                                    <div style={{ fontSize: 11, fontWeight: 600 }}>{count}</div>
                                                    <div style={{ width: '100%', background: 'var(--primary)', borderRadius: '6px 6px 0 0', height: h }} />
                                                    <div style={{ fontSize: 11, color: 'var(--text-gray)' }}>{d.substring(0, 6)}</div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div style={{ background: 'white', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
                                    <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)', fontFamily: 'Poppins', fontSize: 15, fontWeight: 600 }}>System Health</div>
                                    {[{ label: 'API Server', status: 'Online', ok: true },
                                    { label: 'Database', status: 'Connected', ok: true },
                                    { label: 'Weather API', status: weatherStatus, ok: weatherStatus === 'Live Data' },
                                    { label: 'Auth Service', status: 'Active', ok: true }].map(h => (
                                        <div key={h.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
                                            <div style={{ fontSize: 14 }}>{h.label}</div>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: h.ok ? '#2E7D32' : '#F57F17' }}>● {h.status}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {(section === 'users' || section === 'farms' || section === 'predictions') && (
                        <div style={{ background: 'white', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
                            <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)', fontFamily: 'Poppins', fontSize: 15, fontWeight: 600 }}>
                                {section === 'users' ? `${stats.users} Users` : section === 'farms' ? `${stats.farms} Farms` : `${stats.predictions} Predictions`}
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: 'var(--bg)' }}>
                                            {section === 'users' && ['Name', 'Phone', 'District'].map(h => <th key={h} style={th}>{h}</th>)}
                                            {section === 'farms' && ['Farm', 'District', 'Size', 'Soil', 'Harvest', 'Status'].map(h => <th key={h} style={th}>{h}</th>)}
                                            {section === 'predictions' && ['Farm', 'Variety', 'Harvest Date', 'Days Left', 'Confidence'].map(h => <th key={h} style={th}>{h}</th>)}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {section === 'users' && [...new Map(farms.map(f => [f.user_id, f])).values()].map(f => (
                                            <tr key={f.user_id}><td style={td}>{f.full_name}</td><td style={td}>{f.phone}</td><td style={td}>{f.user_district || '—'}</td></tr>
                                        ))}
                                        {section === 'farms' && farms.map(f => (
                                            <tr key={f.farm_id}><td style={td}>{f.farm_name}</td><td style={td}>{f.district}</td><td style={td}>{f.size_acres || '—'} ac</td><td style={td}>{f.soil_type || '—'}</td><td style={td}>{f.predicted_harvest_date || 'Not planted'}</td>
                                                <td style={td}><span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: f.days_remaining > 0 && f.days_remaining <= 30 ? '#FFF8E1' : '#E8F5E9', color: f.days_remaining > 0 && f.days_remaining <= 30 ? '#F57F17' : 'var(--primary)' }}>{f.days_remaining > 0 && f.days_remaining <= 30 ? 'Soon' : 'Growing'}</span></td></tr>
                                        ))}
                                        {section === 'predictions' && farms.filter(f => f.predicted_harvest_date).map(f => (
                                            <tr key={f.farm_id}><td style={td}>{f.farm_name}</td><td style={td}>{f.yam_variety || '—'}</td><td style={td}>{f.predicted_harvest_date}</td>
                                                <td style={td}><strong style={{ color: f.days_remaining > 0 ? 'var(--primary)' : '#C62828' }}>{f.days_remaining > 0 ? `${f.days_remaining}d` : 'Past'}</strong></td>
                                                <td style={td}><strong style={{ color: 'var(--primary)' }}>{f.confidence_percent || 85}%</strong></td></tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {section === 'health' && (
                        <div style={{ background: 'white', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
                            {[{ label: 'API Server', status: 'Online — Port 5000', ok: true },
                            { label: 'MySQL Database', status: 'Connected — balugu_yo', ok: true },
                            { label: 'Weather API', status: weatherStatus, ok: weatherStatus === 'Live Data' },
                            { label: 'JWT Auth', status: 'Active — 7 day tokens', ok: true },
                            { label: 'Notifications', status: 'Active', ok: true },
                            { label: 'Node.js', status: 'v22.17.0', ok: true }].map(h => (
                                <div key={h.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                                    <div style={{ fontSize: 14 }}>{h.label}</div>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: h.ok ? '#2E7D32' : '#F57F17' }}>● {h.status}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const th = { padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--text-gray)' }
const td = { padding: '14px 16px', fontSize: 13, borderBottom: '1px solid var(--border)' }
