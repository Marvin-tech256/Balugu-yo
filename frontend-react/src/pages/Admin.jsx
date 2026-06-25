import React, { useEffect, useState } from 'react'
import { Users, Wheat, Bell, Activity, Shield, Phone, MapPin, ChevronDown, ChevronUp } from 'lucide-react'
import Layout from '../components/Layout'
import api from '../api'

const ROLE_BADGE = {
  farmer: { label: 'Farmer', cls: 'badge-green' },
  extension_officer: { label: 'Ext. Officer', cls: 'badge-teal' },
  admin: { label: 'Admin', cls: 'badge-amber' },
}

export default function Admin() {
  const [stats, setStats] = useState({ users: 0, farms: 0, alerts: 0 })
  const [users, setUsers] = useState([])
  const [showUsers, setShowUsers] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)

  useEffect(() => {
    api.get('/auth/admin/stats').then(d => { if (d.success) setStats(d.stats) }).catch(() => { })
  }, [])

  async function loadUsers() {
    if (users.length > 0) { setShowUsers(v => !v); return }
    setLoadingUsers(true)
    const d = await api.get('/auth/admin/users').catch(() => ({ success: false }))
    if (d.success) setUsers(d.users || [])
    setLoadingUsers(false)
    setShowUsers(true)
  }

  const cards = [
    { icon: Users, label: 'Total Users', value: stats.users, color: 'var(--primary)', bg: 'var(--primary-bg)' },
    { icon: Wheat, label: 'Total Farms', value: stats.farms, color: 'var(--teal)', bg: 'var(--teal-light)' },
    { icon: Bell, label: 'Alerts Sent', value: stats.alerts, color: '#7c3aed', bg: '#ede9fe' },
  ]

  return (
    <Layout>
      <div style={{ padding: '20px 24px', maxWidth: 960, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #14532d, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={20} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)' }}>Admin Dashboard</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 1 }}>System overview and user management</p>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
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

        {/* User management */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div onClick={loadUsers} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', cursor: 'pointer', borderBottom: showUsers ? '1px solid var(--border)' : 'none' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Users size={16} color="var(--primary)" />
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>User Management</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--surface-2)', padding: '2px 8px', borderRadius: 20 }}>{stats.users} users</span>
            </div>
            {loadingUsers
              ? <span className="spinner" style={{ borderTopColor: 'var(--primary)', borderColor: 'var(--border)' }} />
              : showUsers ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
          </div>

          {showUsers && (
            <div>
              {users.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No users found</div>
              ) : users.map((u, i) => (
                <div key={u.user_id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 18px', borderBottom: i < users.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--teal))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                    {u.full_name?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{u.full_name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Phone size={10} /> {u.phone}</span>
                      {u.district && <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><MapPin size={10} /> {u.district}</span>}
                    </div>
                  </div>
                  <span className={`badge ${ROLE_BADGE[u.role]?.cls || 'badge-green'}`}>{ROLE_BADGE[u.role]?.label || u.role}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(u.created_at).toLocaleDateString('en-UG', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
