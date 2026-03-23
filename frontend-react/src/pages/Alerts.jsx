import React, { useEffect, useState } from 'react'
import { Bell, Trash2, Check } from 'lucide-react'
import Layout from '../components/Layout'
import { useToast } from '../components/Toast'
import api from '../api'

const tabs = ['all', 'harvest', 'weather', 'warning', 'system']
const typeIcon = { harvest: '🌿', weather: '🌧️', warning: '⚠️', system: '⚙️' }
const typeBg = { harvest: '#E8F5E9', weather: '#E0F2F1', warning: '#FFF8E1', system: '#F3F4F6' }

function timeAgo(dateStr) {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
    return `${Math.floor(diff / 86400)} days ago`
}

export default function Alerts() {
    const [alerts, setAlerts] = useState([])
    const [filter, setFilter] = useState('all')
    const [unread, setUnread] = useState(0)
    const showToast = useToast()

    const load = async () => {
        const d = await api.get('/alerts').catch(() => null)
        if (d?.success) { setAlerts(d.notifications); setUnread(d.unread_count) }
    }

    useEffect(() => { load() }, [])

    const filtered = filter === 'all' ? alerts : alerts.filter(a => a.type === filter)

    const markRead = async (id) => {
        await api.put(`/alerts/${id}/read`).catch(() => { })
        setAlerts(a => a.map(x => x.notif_id === id ? { ...x, is_read: true } : x))
        setUnread(u => Math.max(0, u - 1))
    }

    const markAll = async () => {
        await api.put('/alerts/read-all').catch(() => { })
        setAlerts(a => a.map(x => ({ ...x, is_read: true })))
        setUnread(0)
        showToast('All alerts marked as read')
    }

    const del = async (id) => {
        await api.delete(`/alerts/${id}`).catch(() => { })
        setAlerts(a => a.filter(x => x.notif_id !== id))
        showToast('Alert dismissed')
    }

    return (
        <Layout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ fontSize: 22 }}>Alerts</h2>
                {unread > 0 && <button onClick={markAll} style={{ background: 'none', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Mark all read</button>}
            </div>

            {unread > 0 && (
                <div style={{ background: '#E8F5E9', border: '1px solid var(--primary)', borderRadius: 'var(--radius)', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <span style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>{unread} unread alert{unread > 1 ? 's' : ''}</span>
                    <button onClick={markAll} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Mark all as read</button>
                </div>
            )}

            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 20, scrollbarWidth: 'none' }}>
                {tabs.map(t => (
                    <button key={t} onClick={() => setFilter(t)} style={{ padding: '8px 16px', borderRadius: 20, border: 'none', background: filter === t ? 'var(--primary)' : 'white', color: filter === t ? 'white' : 'var(--text-gray)', fontSize: 13, fontWeight: filter === t ? 700 : 500, cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: 'var(--shadow)' }}>
                        {t === 'all' ? 'All' : `${typeIcon[t]} ${t.charAt(0).toUpperCase() + t.slice(1)}`}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-gray)' }}>
                    <Bell size={56} style={{ marginBottom: 16, opacity: 0.3 }} />
                    <h3 style={{ marginBottom: 8 }}>No alerts here</h3>
                    <p style={{ fontSize: 14 }}>You're all caught up!</p>
                </div>
            ) : filtered.map(a => (
                <div key={a.notif_id} style={{ background: a.is_read ? 'white' : '#FAFFFE', borderRadius: 'var(--radius)', padding: 16, marginBottom: 10, boxShadow: 'var(--shadow)', display: 'flex', gap: 14, borderLeft: a.is_read ? 'none' : '4px solid var(--primary)' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: typeBg[a.type] || '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                        {typeIcon[a.type] || '⚙️'}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'Poppins', fontSize: 14, fontWeight: 600, marginBottom: 4, paddingRight: 16 }}>{a.title}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-gray)', lineHeight: 1.5, marginBottom: 8 }}>{a.message}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 11, color: 'var(--text-gray)' }}>{timeAgo(a.sent_at)}</span>
                            <div style={{ display: 'flex', gap: 8 }}>
                                {!a.is_read && <button onClick={() => markRead(a.notif_id)} style={{ padding: '4px 12px', borderRadius: 20, background: '#E8F5E9', color: 'var(--primary)', fontSize: 11, fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><Check size={12} />Read</button>}
                                <button onClick={() => del(a.notif_id)} style={{ padding: '4px 10px', borderRadius: 20, background: '#F3F4F6', color: 'var(--text-gray)', fontSize: 11, border: 'none', cursor: 'pointer' }}><Trash2 size={12} /></button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </Layout>
    )
}
