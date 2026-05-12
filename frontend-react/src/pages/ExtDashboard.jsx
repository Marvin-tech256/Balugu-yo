import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Users, Wheat, Sprout, BarChart3, Phone, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import api from '../api'

export default function ExtDashboard() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const showToast = useToast()
    const [farmers, setFarmers] = useState([])
    const [query, setQuery] = useState('')
    const [district, setDistrict] = useState('all')
    const [districts, setDistricts] = useState([])
    const [stats, setStats] = useState({ farmers: 0, farms: 0, soon: 0 })

    const handleLogout = () => { logout(); showToast('Logged out'); navigate('/login') }

    useEffect(() => {
        api.get('/farms/all').then(d => {
            if (!d.success) return
            const map = {}
            d.farms.forEach(f => {
                if (!map[f.user_id]) map[f.user_id] = { user_id: f.user_id, full_name: f.full_name, phone: f.phone, district: f.user_district, farms: [], total_acres: 0, harvest_soon: 0 }
                map[f.user_id].farms.push(f)
                map[f.user_id].total_acres += parseFloat(f.size_acres || 0)
                if (f.days_remaining > 0 && f.days_remaining <= 30) map[f.user_id].harvest_soon++
            })
            const list = Object.values(map)
            setFarmers(list)
            setStats({ farmers: list.length, farms: d.farms.length, soon: list.filter(f => f.harvest_soon > 0).length })
            setDistricts([...new Set(list.map(f => f.district).filter(Boolean))])
        }).catch(() => { })
    }, [])

    const filtered = farmers.filter(f => {
        const matchD = district === 'all' || f.district === district
        const matchQ = !query || f.full_name.toLowerCase().includes(query.toLowerCase()) || (f.district || '').toLowerCase().includes(query.toLowerCase())
        return matchD && matchQ
    })

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg,#00695C,#00897B)', padding: '20px 24px 48px', color: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ fontFamily: 'Poppins', fontSize: 20, fontWeight: 700 }}>Balugu <span style={{ color: '#A5D6A7' }}>Yo</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Extension Officer</div>
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)' }}>{user?.full_name?.split(' ')[0]}</div>
                        </div>
                        <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{user?.full_name?.charAt(0)}</div>
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
                    {[{ icon: <Users size={22} color="var(--primary)" />, val: stats.farmers, label: 'Total Farmers', bg: 'var(--primary-bg)' },
                    { icon: <Wheat size={22} color="var(--gold)" />, val: stats.soon, label: 'Harvesting Soon', bg: 'var(--gold-light)' },
                    { icon: <Sprout size={22} color="var(--teal)" />, val: stats.farms, label: 'Total Farms', bg: 'var(--teal-light)' },
                    { icon: <BarChart3 size={22} color="#7c3aed" />, val: '87%', label: 'Avg Accuracy', bg: '#ede9fe' }].map(s => (
                        <div key={s.label} style={{ background: 'white', borderRadius: 'var(--radius)', padding: '14px 12px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: 'var(--shadow)', minWidth: 0 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.icon}</div>
                            <div style={{ minWidth: 0 }}>
                                <div style={{ fontFamily: 'Poppins', fontSize: 'clamp(16px, 4vw, 22px)', fontWeight: 700, lineHeight: 1, color: 'var(--text)' }}>{s.val}</div>
                                <div style={{ fontSize: 'clamp(10px, 2.5vw, 12px)', color: 'var(--text-muted)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ background: 'var(--bg)', borderRadius: '20px 20px 0 0', marginTop: -24, padding: '24px 20px 80px' }}>
                <div style={{ maxWidth: 700, margin: '0 auto' }}>
                    {stats.soon > 0 && (
                        <div style={{ background: '#FFF8E1', border: '1px solid var(--amber)', borderRadius: 'var(--radius)', padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
                            <span style={{ fontSize: 24 }}>⚠️</span>
                            <div style={{ fontSize: 13, lineHeight: 1.5 }}>
                                <strong style={{ color: '#F57F17' }}>{stats.soon} farmer{stats.soon > 1 ? 's' : ''}</strong> have harvests due within 30 days. Consider scheduling field visits.
                            </div>
                        </div>
                    )}

                    {/* Search */}
                    <div style={{ position: 'relative', marginBottom: 16 }}>
                        <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-gray)' }} />
                        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search farmers by name or district..." style={{ width: '100%', padding: '12px 16px 12px 44px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 14, outline: 'none', background: 'white' }} />
                    </div>

                    {/* District filter */}
                    <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 16, scrollbarWidth: 'none' }}>
                        {['all', ...districts].map(d => (
                            <button key={d} onClick={() => setDistrict(d)} style={{ padding: '7px 14px', borderRadius: 20, border: `1.5px solid ${district === d ? 'var(--teal)' : 'var(--border)'}`, background: district === d ? 'var(--teal-light)' : 'white', color: district === d ? 'var(--teal)' : 'var(--text-muted)', fontSize: 12, fontWeight: district === d ? 700 : 500, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                {d === 'all' ? 'All Districts' : d}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                        <h3 style={{ fontSize: 16 }}>Farmers in Your Area</h3>
                        <span style={{ fontSize: 13, color: 'var(--text-gray)' }}>{filtered.length} farmer{filtered.length !== 1 ? 's' : ''}</span>
                    </div>

                    {filtered.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-gray)' }}>
                            <Users size={48} style={{ marginBottom: 12, opacity: 0.4 }} /><h3>No farmers found</h3>
                        </div>
                    ) : filtered.map(f => {
                        const nearest = f.farms.filter(fm => fm.days_remaining > 0).sort((a, b) => a.days_remaining - b.days_remaining)[0]
                        return (
                            <div key={f.user_id} style={{ background: 'white', borderRadius: 'var(--radius)', padding: 16, boxShadow: 'var(--shadow)', marginBottom: 12, borderLeft: '4px solid var(--teal)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                                    <div>
                                        <div style={{ fontFamily: 'Poppins', fontSize: 15, fontWeight: 600, marginBottom: 3 }}>{f.full_name}</div>
                                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{f.district || 'Unknown'} • {f.phone}</div>
                                    </div>
                                    <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: f.harvest_soon > 0 ? '#FFF8E1' : '#E8F5E9', color: f.harvest_soon > 0 ? '#F57F17' : 'var(--primary)' }}>
                                        {f.harvest_soon > 0 ? 'Harvest Soon' : 'Growing'}
                                    </span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 12 }}>
                                    {[{ val: f.farms.length, label: 'Farms' }, { val: f.total_acres.toFixed(1), label: 'Acres' }, { val: f.harvest_soon, label: 'Due Soon' }].map(s => (
                                        <div key={s.label} style={{ background: 'var(--bg)', borderRadius: 8, padding: 8, textAlign: 'center' }}>
                                            <div style={{ fontFamily: 'Poppins', fontSize: 15, fontWeight: 700, color: 'var(--primary)' }}>{s.val}</div>
                                            <div style={{ fontSize: 10, color: 'var(--text-gray)', marginTop: 2 }}>{s.label}</div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--teal)' }}>
                                        {nearest ? `Next harvest in ${nearest.days_remaining} days` : 'No active planting'}
                                    </div>
                                    <a href={`tel:${f.phone}`} style={{ padding: '6px 14px', borderRadius: 20, background: 'var(--teal-light)', color: 'var(--teal)', fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
                                        <Phone size={12} /> Call
                                    </a>
                                </div>
                            </div>
                        )
                    })}

                    <div style={{ textAlign: 'center', paddingTop: 20 }}>
                        <button onClick={handleLogout} style={{ background: 'none', border: '1px solid var(--border)', padding: '10px 24px', borderRadius: 20, color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                            <LogOut size={14} /> Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )}
