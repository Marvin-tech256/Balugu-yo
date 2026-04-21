import React, { useEffect, useState } from 'react'
import { Bell, Leaf, CloudRain, AlertTriangle, Settings, Trash2, Check, CheckCheck } from 'lucide-react'
import Layout from '../components/Layout'
import { useToast } from '../components/Toast'
import api from '../api'

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
        showToast('Alert dismissed')
    }

    return (
        <Layout>
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
        </Layout>
    )
}
