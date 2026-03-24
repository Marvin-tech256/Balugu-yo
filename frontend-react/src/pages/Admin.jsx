import React, { useEffect, useState } from 'react'
import { Users, Wheat, Bell, Activity } from 'lucide-react'
import Layout from '../components/Layout'
import api from '../api'

export default function Admin() {
    const [stats, setStats] = useState({ users: 0, farms: 0, predictions: 0, alerts: 0 })

    useEffect(() => {
        api.get('/auth/admin/stats').then(d => { if (d.success) setStats(d.stats) }).catch(() => { })
    }, [])

    return (
        <Layout>
            <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px 16px 80px' }}>
                <h2 style={{ fontFamily: 'Poppins', fontSize: 22, marginBottom: 4 }}>Admin Dashboard</h2>
                <p style={{ color: 'var(--text-gray)', fontSize: 14, marginBottom: 24 }}>System overview</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12, marginBottom: 24 }}>
                    {[
                        { icon: Users, label: 'Total Users', value: stats.users },
                        { icon: Wheat, label: 'Total Farms', value: stats.farms },
                        { icon: Activity, label: 'Predictions', value: stats.predictions },
                        { icon: Bell, label: 'Alerts Sent', value: stats.alerts },
                    ].map(({ icon: Icon, label, value }) => (
                        <div key={label} style={{ background: 'white', borderRadius: 'var(--radius)', padding: 20, boxShadow: 'var(--shadow)', display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Icon size={24} color="var(--primary)" />
                            </div>
                            <div>
                                <div style={{ fontFamily: 'Poppins', fontSize: 24, fontWeight: 700, color: 'var(--primary)' }}>{value}</div>
                                <div style={{ fontSize: 13, color: 'var(--text-gray)' }}>{label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    )
}
