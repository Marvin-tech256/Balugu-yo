import React, { useEffect, useState } from 'react'
import { Wheat, Users, Bell, MapPin, Layers, TrendingUp } from 'lucide-react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import api from '../api'

export default function ExtDashboard() {
    const { user } = useAuth()
    const [farms, setFarms] = useState([])

    useEffect(() => {
        api.get('/farms/my').then(d => { if (d.success) setFarms(d.farms || []) }).catch(() => { })
    }, [])

    const firstName = user?.full_name?.split(' ')[0] || 'Officer'
    const harvestSoon = farms.filter(f => f.days_remaining && f.days_remaining <= 30 && f.days_remaining > 0).length

    return (
        <Layout>
            <div style={{ padding: '20px 24px', maxWidth: 900, margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: 20 }}>
                    <h1 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)' }}>Extension Dashboard</h1>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Welcome back, {firstName}</p>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
                    {[
                        { icon: Wheat, label: 'Farms', value: farms.length, color: 'var(--primary)', bg: 'var(--primary-bg)' },
                        { icon: TrendingUp, label: 'Harvest Soon', value: harvestSoon, color: 'var(--gold)', bg: 'var(--gold-light)' },
                        { icon: Bell, label: 'Alerts', value: 0, color: 'var(--teal)', bg: 'var(--teal-light)' },
                    ].map(({ icon: Icon, label, value, color, bg }) => (
                        <div key={label} className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 38, height: 38, borderRadius: 9, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Icon size={17} color={color} />
                            </div>
                            <div>
                                <div style={{ fontFamily: 'Poppins', fontSize: 22, fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>{value}</div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Farm list */}
                <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>Monitored Farms</div>
                    {farms.length === 0 ? (
                        <div className="card empty-state">
                            <Wheat size={32} color="var(--border)" style={{ marginBottom: 8 }} />
                            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>No farms assigned yet</div>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
                            {farms.map(f => {
                                const soon = f.days_remaining && f.days_remaining <= 30 && f.days_remaining > 0
                                return (
                                    <div key={f.farm_id} className="card" style={{ padding: '14px 16px', borderLeft: `3px solid ${soon ? 'var(--gold)' : 'var(--primary)'}` }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{f.farm_name}</div>
                                            {soon && <span className="badge badge-amber">Soon</span>}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                                            <MapPin size={11} /> {f.district}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                                            <Layers size={11} /> {f.size_acres} acres
                                        </div>
                                        {f.days_remaining > 0 && (
                                            <div style={{ fontSize: 12, fontWeight: 600, color: soon ? 'var(--gold-dark)' : 'var(--primary-mid)' }}>
                                                {f.days_remaining} days to harvest
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    )
}
