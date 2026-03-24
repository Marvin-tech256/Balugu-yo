import React, { useEffect, useState } from 'react'
import { Users, Wheat, Bell, Activity, TrendingUp, Shield } from 'lucide-react'
import Layout from '../components/Layout'
import api from '../api'

export default function Admin() {
  const [stats, setStats] = useState({ users: 0, farms: 0, predictions: 0, alerts: 0 })

  useEffect(() => {
    api.get('/auth/admin/stats').then(d => { if (d.success) setStats(d.stats) }).catch(() => { })
  }, [])

  const cards = [
    { icon: Users, label: 'Total Users', value: stats.users, color: 'var(--primary)', bg: 'var(--primary-bg)' },
    { icon: Wheat, label: 'Total Farms', value: stats.farms, color: 'var(--teal)', bg: 'var(--teal-light)' },
    { icon: TrendingUp, label: 'Predictions', value: stats.predictions, color: 'var(--gold)', bg: 'var(--gold-light)' },
    { icon: Bell, label: 'Alerts Sent', value: stats.alerts, color: '#7c3aed', bg: '#ede9fe' },
  ]

  return (
    <Layout>
      <div style={{ padding: '20px 24px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #14532d, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={20} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)' }}>Admin Dashboard</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 1 }}>System overview and statistics</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {cards.map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="card" style={{ padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={17} color={color} />
                </div>
                <Activity size={13} color="var(--border-2)" />
              </div>
              <div style={{ fontFamily: 'Poppins', fontSize: 26, fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Activity size={28} color="var(--border-2)" style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 13, fontWeight: 500 }}>More admin tools coming soon</div>
        </div>
      </div>
    </Layout>
  )
}
