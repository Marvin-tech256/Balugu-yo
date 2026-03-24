import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Bell, Leaf, CloudRain, AlertTriangle, Settings, Trash2, Check } from 'lucide-react'
import Layout from '../components/Layout'
import { useToast } from '../components/Toast'
import api from '../api'

const TYPE_ICONS = {
    harvest: { icon: Leaf, bg: '#E8F5E9', color: 'var(--primary)' },
    weather: { icon: CloudRain, bg: '#E0F2F1', color: 'var(--accent)' },
    warning: { icon: AlertTriangle, bg: '#FFF8E1', color: '#F57F17' },
    system: { icon: Settings, bg: '#F3F4F6', color: 'var(--text-gray)' },
}
const FILTERS = ['all', 'harvest', 'weather', 'warning', 'system']

function formatTime(dateStr) {
    const date = new Date(dateStr), now = new Date()
    const diff = Math.floor((now - date) / 1000)
    if (diff < 60) return 'Just now'
    if (diff < 3600) return Math.floor(diff / 60) + ' min ago'
    if (diff < 86400) return Math.floor(diff / 3600) + ' hours ago'
    if (diff < 604800) return Math.floor(diff / 86400) + ' days ago'
    return date.toLocaleDateString()
}

export default function Alerts() {
    const navigate = useNavigate()
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
            <div style={{ background: 'linear-gradient(135deg,#1B5E20,#2E7D32)', padding: '20px 24px 48px', color: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ArrowLeft size={18} />
                        </button>
                        <h1 style={{ fontFamily: 'Poppins', fontSize: 20, color: 'white' }}>Alerts</h1>
                    </div>
                    <button onClick={markAllRead} style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', color: 'white', padding: '8px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins' }}>
                        ✓ Mark all read
                    </button>
                </div>
                <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
                    {FILTERS.map(f => (
                        <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 16px', borderRadius: 20, border: '1.5px solid ' + (f === filter ? 'white' : 'rgba(255,255,255,0.4)'), color: f === filter ? '#1B5E20' : 'rgba(255,255,255,0.85)', background: f === filter ? 'white' : 'transparent', fontSize: 13, fontWeight: f === filter ? 700 : 500, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'Inter', textTransform: 'capitalize' }}>
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ background: 'var(--bg)', borderRadius: '20px 20px 0 0', marginTop: -24, padding: '24px 20px 100px', maxWidth: 600, margin: '-24px auto 0', minHeight: 'calc(100vh - 140px)' }}>
                {unreadCount > 0 && (
                    <div style={{ background: '#E8F5E9', border: '1px solid var(--primary)', borderRadius: 'var(--radius)', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <span style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>{unreadCount} unread alert{unreadCount > 1 ? 's' : ''}</span>
                        <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins' }}>Mark all as read</button>
                    </div>
                )}

                {filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <Bell size={56} color="var(--border)" style={{ marginBottom: 16 }} />
                        <h3 style={{ fontSize: 18, marginBottom: 8 }}>No alerts here</h3>
                        <p style={{ color: 'var(--text-gray)', fontSize: 14 }}>You're all caught up!</p>
                    </div>
                ) : filtered.map(a => {
                    const ti = TYPE_ICONS[a.type] || TYPE_ICONS.system
                    const Icon = ti.icon
                    return (
                        <div key={a.notif_id} style={{ background: 'white', borderRadius: 'var(--radius)', padding: 16, marginBottom: 10, boxShadow: 'var(--shadow)', display: 'flex', gap: 14, alignItems: 'flex-start', borderLeft: !a.is_read ? '4px solid var(--primary)' : '4px solid transparent', position: 'relative' }}>
                            {!a.is_read && <div style={{ position: 'absolute', top: 16, right: 16, width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)' }} />}
                            <div style={{ width: 44, height: 44, borderRadius: 12, background: ti.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Icon size={20} color={ti.color} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontFamily: 'Poppins', fontSize: 14, fontWeight: 600, marginBottom: 4, paddingRight: 16 }}>{a.title}</div>
                                <div style={{ fontSize: 13, color: 'var(--text-gray)', lineHeight: 1.5, marginBottom: 8 }}>{a.message}</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: 11, color: 'var(--text-gray)' }}>{formatTime(a.sent_at)}</span>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        {!a.is_read && (
                                            <button onClick={() => markRead(a.notif_id)} style={{ padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: 'none', background: '#E8F5E9', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <Check size={12} /> Read
                                            </button>
                                        )}
                                        <button onClick={() => deleteAlert(a.notif_id)} style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, cursor: 'pointer', border: 'none', background: '#F3F4F6', color: 'var(--text-gray)', display: 'flex', alignItems: 'center' }}>
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </Layout>
    )
}
