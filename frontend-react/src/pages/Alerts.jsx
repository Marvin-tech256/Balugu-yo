import React, { useEffect, useState } from 'react'
<<<<<<< HEAD
import { Bell, Trash2, Check } from 'lucide-react'
=======
import { Bell, Leaf, CloudRain, AlertTriangle, Settings, Trash2, Check, CheckCheck } from 'lucide-react'
>>>>>>> main
import Layout from '../components/Layout'
import { useToast } from '../components/Toast'
import api from '../api'

<<<<<<< HEAD
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
=======
const TYPE_CONFIG = {
    harvest: { icon: Leaf, color: 'var(--primary)', bg: 'var(--primary-bg)' },
    weather: { icon: CloudRain, color: 'var(--teal)', bg: 'var(--teal-light)' },
    warning: { icon: AlertTriangle, color: 'var(--gold)', bg: 'var(--gold-light)' },
    system: { icon: Settings, color: 'var(--text-muted)', bg: 'var(--surface-2)' },
}
const FILTERS = ['all', 'harvest', 'weather', 'warning', 'system']

function formatTime(dateStr) {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
    return new Date(dateStr).toLocaleDateString()
}

export default function Alerts() {
    const showToast = useToast()
    const [allAlerts, setAllAlerts] = useState([])
    const [filter, setFilter] = useState('all')
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => { loadAlerts() }, [])

    async function loadAlerts() {
        const data = await api.get('/alerts')
        if (!data.success) return
        setAllAlerts(data.notifications || [])
        setUnreadCount(data.unread_count || 0)
        if ((data.notifications || []).length === 0) {
            await api.get('/alerts/test')
            const fresh = await api.get('/alerts')
            setAllAlerts(fresh.notifications || [])
            setUnreadCount(fresh.unread_count || 0)
        }
    }

    const filtered = filter === 'all' ? allAlerts : allAlerts.filter(a => a.type === filter)

    async function markRead(id) {
        await api.put('/alerts/' + id + '/read')
        setAllAlerts(prev => prev.map(a => a.notif_id === id ? { ...a, is_read: true } : a))
        setUnreadCount(c => Math.max(0, c - 1))
    }

    async function markAllRead() {
        await api.put('/alerts/read-all')
        setAllAlerts(prev => prev.map(a => ({ ...a, is_read: true })))
        setUnreadCount(0)
        showToast('All alerts marked as read')
    }

    async function deleteAlert(id) {
        await api.delete('/alerts/' + id)
        setAllAlerts(prev => prev.filter(a => a.notif_id !== id))
>>>>>>> main
        showToast('Alert dismissed')
    }

    return (
        <Layout>
<<<<<<< HEAD
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
=======
            <div style={{ padding: '20px 24px', maxWidth: 720, margin: '0 auto' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div>
                        <h1 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)' }}>Alerts</h1>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                            {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <button onClick={markAllRead} className="btn btn-ghost" style={{ fontSize: 12 }}>
                            <CheckCheck size={14} /> Mark all read
                        </button>
                    )}
                </div>

                {/* Filter tabs */}
                <div style={{ display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4, marginBottom: 16 }}>
                    {FILTERS.map(f => {
                        const count = f === 'all' ? allAlerts.length : allAlerts.filter(a => a.type === f).length
                        return (
                            <button key={f} onClick={() => setFilter(f)}
                                className={`chip-option${f === filter ? ' active' : ''}`}
                                style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5 }}>
                                <span style={{ textTransform: 'capitalize' }}>{f}</span>
                                {count > 0 && (
                                    <span style={{ background: f === filter ? 'var(--primary)' : 'var(--border)', color: f === filter ? 'white' : 'var(--text-muted)', borderRadius: 20, padding: '0 5px', fontSize: 10, fontWeight: 700 }}>
                                        {count}
                                    </span>
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* Alert list */}
                {filtered.length === 0 ? (
                    <div className="card empty-state">
                        <Bell size={36} color="var(--border)" style={{ marginBottom: 10 }} />
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-2)', marginBottom: 4 }}>No alerts here</div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>You're all caught up</div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {filtered.map(a => {
                            const cfg = TYPE_CONFIG[a.type] || TYPE_CONFIG.system
                            const Icon = cfg.icon
                            return (
                                <div key={a.notif_id} className="card" style={{
                                    padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'flex-start',
                                    borderLeft: `3px solid ${a.is_read ? 'transparent' : cfg.color}`,
                                    opacity: a.is_read ? 0.8 : 1,
                                }}>
                                    <div style={{ width: 36, height: 36, borderRadius: 9, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Icon size={16} color={cfg.color} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 3 }}>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', lineHeight: 1.3 }}>{a.title}</div>
                                            {!a.is_read && <div style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.color, flexShrink: 0, marginTop: 3 }} />}
                                        </div>
                                        <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 8 }}>{a.message}</div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatTime(a.sent_at)}</span>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                {!a.is_read && (
                                                    <button onClick={() => markRead(a.notif_id)}
                                                        style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: 'none', background: 'var(--primary-bg)', color: 'var(--primary-mid)' }}>
                                                        <Check size={11} /> Read
                                                    </button>
                                                )}
                                                <button onClick={() => deleteAlert(a.notif_id)}
                                                    style={{ display: 'flex', alignItems: 'center', padding: '3px 8px', borderRadius: 20, fontSize: 11, cursor: 'pointer', border: 'none', background: 'var(--surface-2)', color: 'var(--text-muted)' }}>
                                                    <Trash2 size={11} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
>>>>>>> main
        </Layout>
    )
}
