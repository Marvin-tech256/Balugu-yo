import React, { useEffect, useState } from 'react'
import { Wheat, Users, Bell } from 'lucide-react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import api from '../api'

export default function ExtDashboard() {
    const { user } = useAuth()
    const [farms, setFarms] = useState([])

    useEffect(() => {
        api.get('/farms/my').then(d => { if (d.success) setFarms(d.farms || []) }).catch(() => { })
    }, [])

    return (
        <Layout>
            <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px 16px 80px' }}>
                <h2 style={{ fontFamily: 'Poppins', fontSize: 22, marginBottom: 4 }}>Extension Dashboard</h2>
                <p style={{ color: 'var(--text-gray)', fontSize: 14, marginBottom: 24 }}>
                    Welcome, {user?.full_name?.split(' ')[0]}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 24 }}>
                    {[{ icon: Wheat, label: 'Farms', value: farms.length }, { icon: Users, label: 'Farmers', value: 0 }, { icon: Bell, label: 'Alerts', value: 0 }].map(({ icon: Icon, label, value }) => (
                        <div key={label} style={{ background: 'white', borderRadius: 'var(--radius)', padding: '14px 10px', textAlign: 'center', boxShadow: 'var(--shadow)' }}>
                            <Icon size={22} color="var(--primary)" style={{ marginBottom: 4 }} />
                            <div style={{ fontFamily: 'Poppins', fontSize: 18, fontWeight: 700, color: 'var(--primary)' }}>{value}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-gray)', marginTop: 2 }}>{label}</div>
                        </div>
                    ))}
                </div>

                {farms.map(f => (
                    <div key={f.farm_id} style={{ background: 'white', borderRadius: 'var(--radius)', padding: 18, boxShadow: 'var(--shadow)', marginBottom: 12, borderLeft: '4px solid var(--primary)' }}>
                        <div style={{ fontFamily: 'Poppins', fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{f.farm_name}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-gray)' }}>{f.district} — {f.size_acres} acres</div>
                        {f.days_remaining && <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)', marginTop: 8 }}>{f.days_remaining} days to harvest</div>}
                    </div>
                ))}
            </div>
        </Layout>
    )
}
