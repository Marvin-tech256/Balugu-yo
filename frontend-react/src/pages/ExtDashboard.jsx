import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Users, Wheat, Sprout, BarChart3, Phone, LogOut, MessageSquare, X, ChevronDown, History } from 'lucide-react'
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
    const [adviceRequests, setAdviceRequests] = useState([])
    const [selectedAdvice, setSelectedAdvice] = useState(null)
    const [responseText, setResponseText] = useState('')
    const [submittingResponse, setSubmittingResponse] = useState(false)
    const [showAdviceTab, setShowAdviceTab] = useState(false)
    const [expandedFarmer, setExpandedFarmer] = useState(null)
    const [expandedFarmerTab, setExpandedFarmerTab] = useState('active')

    const handleLogout = () => { logout(); showToast('Logged out'); navigate('/login') }

    useEffect(() => {
        api.get('/farms/all').then(d => {
            if (!d.success) return
            const map = {}
            d.farms.forEach(f => {
                if (!map[f.user_id]) map[f.user_id] = { user_id: f.user_id, full_name: f.full_name, phone: f.phone, district: f.user_district, farms: [], total_acres: 0, harvest_soon: 0 }
                if(f.farm_id) { map[f.user_id].farms.push(f); }
                map[f.user_id].total_acres += parseFloat(f.size_acres || 0)
                if (f.days_remaining > 0 && f.days_remaining <= 30) map[f.user_id].harvest_soon++
            })
            const list = Object.values(map)
            setFarmers(list)
            setStats({ farmers: list.length, farms: d.farms.length, soon: list.filter(f => f.harvest_soon > 0).length })
            setDistricts([...new Set(list.map(f => f.district).filter(Boolean))])
        }).catch(() => { })
        
        // Load advice requests
        api.get('/advice/requests').then(d => {
            if (d.success) setAdviceRequests(d.requests || [])
        }).catch(() => { })
    }, [])

    const filtered = farmers.filter(f => {
        const matchD = district === 'all' || f.district === district
        const matchQ = !query || f.full_name.toLowerCase().includes(query.toLowerCase()) || (f.district || '').toLowerCase().includes(query.toLowerCase())
        return matchD && matchQ
    })

    async function handleRespondToAdvice() {
        if (!responseText.trim()) {
            showToast('Please enter your response', 'error')
            return
        }
        setSubmittingResponse(true)
        try {
            const res = await api.post('/advice/respond', {
                advice_id: selectedAdvice.advice_id,
                response: responseText.trim(),
            })
            if (res.success) {
                showToast('Response sent to farmer')
                setAdviceRequests(adviceRequests.map(a => 
                    a.advice_id === selectedAdvice.advice_id ? { ...a, status: 'answered', response: responseText.trim() } : a
                ))
                setSelectedAdvice(null)
                setResponseText('')
            } else {
                showToast(res.message || 'Failed to send response', 'error')
            }
        } catch (e) {
            showToast('Error sending response', 'error')
        }
        setSubmittingResponse(false)
    }

    const toggleFarmer = (userId) => {
        setExpandedFarmer(prev => prev === userId ? null : userId)
        if (expandedFarmer !== userId) {
            // Reset to active tab when opening a new farmer
            setExpandedFarmerTab('active')
        }
    }

    const fmtDate = d => d ? new Date(d).toLocaleDateString('en-UG', { day: 'numeric', month: 'short', year: 'numeric' }) : null

    const calculateDaysSincePlanted = (plantingDate) => {
        if (!plantingDate) return null;
        const planted = new Date(plantingDate);
        const today = new Date();
        const diffTime = today.getTime() - planted.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

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
                    { icon: <Sprout size={22} color="var(--teal)" />, val: stats.farms, label: 'Total Farms', bg: 'var(--teal-light)' }].map(s => (
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
                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                        <button onClick={() => setShowAdviceTab(false)} style={{
                            padding: '10px 16px', borderRadius: 20, border: `1.5px solid ${!showAdviceTab ? 'var(--teal)' : 'var(--border)'}`,
                            background: !showAdviceTab ? 'var(--teal-light)' : 'white', color: !showAdviceTab ? 'var(--teal)' : 'var(--text-muted)',
                            fontSize: 13, fontWeight: !showAdviceTab ? 700 : 500, cursor: 'pointer'
                        }}>
                            👨‍🌾 Farmers
                        </button>
                        <button onClick={() => setShowAdviceTab(true)} style={{
                            padding: '10px 16px', borderRadius: 20, border: `1.5px solid ${showAdviceTab ? 'var(--teal)' : 'var(--border)'}`,
                            background: showAdviceTab ? 'var(--teal-light)' : 'white', color: showAdviceTab ? 'var(--teal)' : 'var(--text-muted)',
                            fontSize: 13, fontWeight: showAdviceTab ? 700 : 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
                        }}>
                            <MessageSquare size={14} /> Questions ({adviceRequests.filter(a => a.status === 'pending').length})
                        </button>
                    </div>

                    {!showAdviceTab ? (
                        <>
                            {/* Farmers Tab */}


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
                                    <Users size={48} style={{ marginBottom: 12, opacity: 0.4 }} /><h3>No farmers found for this filter.</h3>
                                </div>
                            ) : filtered.map(f => {
                        const mostRecent = f.farms.filter(fm => fm.planting_date).sort((a, b) => new Date(b.planting_date) - new Date(a.planting_date))[0]
                        const daysSincePlanted = mostRecent ? Math.floor((Date.now() - new Date(mostRecent.planting_date)) / 86400000) : null
                        const isExpanded = expandedFarmer === f.user_id
                        return (
                            <div key={f.user_id} onClick={() => toggleFarmer(f.user_id)} style={{ background: 'white', borderRadius: 'var(--radius)', padding: 16, boxShadow: 'var(--shadow)', marginBottom: 12, borderLeft: '4px solid var(--teal)', cursor: 'pointer' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                                    <div>
                                        <div style={{ fontFamily: 'Poppins', fontSize: 15, fontWeight: 600, marginBottom: 3 }}>{f.full_name}</div>
                                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{f.district || 'Unknown'} • {f.phone}</div>
                                    </div>
                                    <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: '#E8F5E9', color: 'var(--primary)' }}>
                                        Growing
                                    </span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8, marginBottom: 12 }}>
                                    {[{ val: f.farms.length, label: 'Farms' }, { val: f.total_acres.toFixed(1), label: 'Acres' }].map(s => (
                                        <div key={s.label} style={{ background: 'var(--bg)', borderRadius: 8, padding: 8, textAlign: 'center' }}>
                                            <div style={{ fontFamily: 'Poppins', fontSize: 15, fontWeight: 700, color: 'var(--primary)' }}>{s.val}</div>
                                            <div style={{ fontSize: 10, color: 'var(--text-gray)', marginTop: 2 }}>{s.label}</div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--teal)' }}>
                                        {daysSincePlanted !== null ? `${daysSincePlanted} days since planted` : 'No active planting'}
                                    </div>
                                    <a href={`tel:${f.phone}`} style={{ padding: '6px 14px', borderRadius: 20, background: 'var(--teal-light)', color: 'var(--teal)', fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
                                        <Phone size={12} /> Call
                                    </a>
                                </div>
                                {isExpanded && (
                                    <div style={{ background: 'var(--bg)', padding: '8px 16px 16px' }}>
                                        <div style={{ display: 'flex', gap: 4, marginBottom: 12, borderBottom: '1px solid var(--border)' }}>
                                            {[{ id: 'active', label: 'Active' }, { id: 'history', label: 'History' }].map(t => (
                                                <button key={t.id} onClick={(e) => { e.stopPropagation(); setExpandedFarmerTab(t.id); }} style={{
                                                    background: 'none', border: 'none', padding: '6px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                                                    color: expandedFarmerTab === t.id ? 'var(--teal)' : 'var(--text-muted)',
                                                    borderBottom: `2px solid ${expandedFarmerTab === t.id ? 'var(--teal)' : 'transparent'}`,
                                                    marginBottom: -1
                                                }}>{t.label}</button>
                                            ))}
                                        </div>

                                        {expandedFarmerTab === 'active' && (
                                            f.farms.filter(farm => farm.planting_date && farm.days_remaining > 0).length === 0 ? (
                                                <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>No active plantings.</div>
                                            ) : (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                                    {f.farms.filter(farm => farm.planting_date && farm.days_remaining > 0).map(p => (
                                                        <div key={p.planting_id} style={{ background: 'white', borderRadius: 8, padding: '10px 12px', border: '1px solid var(--border)' }}>
                                                            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{p.farm_name} - {p.yam_variety}</div>
                                                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Planted: {fmtDate(p.planting_date)}</div>
                                                            <div style={{ fontSize: 11, color: 'var(--primary-mid)', fontWeight: 600, marginTop: 4 }}>{calculateDaysSincePlanted(p.planting_date)}d since planted</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )
                                        )}
                                        {expandedFarmerTab === 'history' && (
                                            f.farms.filter(farm => farm.planting_date).length === 0 ? (
                                                <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>No planting history found.</div>
                                            ) : (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                                    {f.farms.filter(farm => farm.planting_date).sort((a,b) => new Date(b.planting_date) - new Date(a.planting_date)).map(p => (
                                                        <div key={p.planting_id} style={{ background: 'white', borderRadius: 8, padding: '10px 12px', border: '1px solid var(--border)', opacity: p.days_remaining > 0 ? 1 : 0.6 }}>
                                                            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{p.farm_name} - {p.yam_variety}</div>
                                                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Planted: {fmtDate(p.planting_date)}</div>
                                                            <div style={{ fontSize: 11, color: p.days_remaining > 0 ? 'var(--primary-mid)' : 'var(--text-muted)', fontWeight: 600, marginTop: 4 }}>
                                                                {p.days_remaining > 0 ? `Harvest: ${fmtDate(p.predicted_harvest_date)}` : `Harvested around ${fmtDate(p.predicted_harvest_date)}`}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                        </>
                    ) : (
                        <>
                            {/* Questions Tab */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                                <h3 style={{ fontSize: 16 }}>Farmer Questions</h3>
                                <span style={{ fontSize: 13, color: 'var(--text-gray)' }}>{adviceRequests.length} total</span>
                            </div>

                            {adviceRequests.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-gray)' }}>
                                    <MessageSquare size={48} style={{ marginBottom: 12, opacity: 0.4 }} />
                                    <h3>No questions yet</h3>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {adviceRequests.map(a => (
                                        <div key={a.advice_id} onClick={() => setSelectedAdvice(a)} style={{
                                            background: 'white', borderRadius: 'var(--radius)', padding: 16, boxShadow: 'var(--shadow)',
                                            borderLeft: `4px solid ${a.status === 'answered' ? '#10b981' : '#f59e0b'}`, cursor: 'pointer',
                                            transition: 'all 0.15s'
                                        }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontFamily: 'Poppins', fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{a.farmer_name}</div>
                                                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.farmer_phone} • {a.farm_name || 'No farm selected'}</div>
                                                </div>
                                                <span style={{
                                                    padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600,
                                                    background: a.status === 'answered' ? '#d1fae5' : '#fef3c7', color: a.status === 'answered' ? '#10b981' : '#f59e0b'
                                                }}>
                                                    {a.status === 'answered' ? 'Answered' : 'Pending'}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 6, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {a.question}
                                            </div>
                                            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                                                {new Date(a.created_at).toLocaleDateString('en-UG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    <div style={{ textAlign: 'center', paddingTop: 20 }}>
                        <button onClick={handleLogout} style={{ background: 'none', border: '1px solid var(--border)', padding: '10px 24px', borderRadius: 20, color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                            <LogOut size={14} /> Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Response Modal */}
            {selectedAdvice && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
                    <div style={{ background: 'white', borderRadius: 16, maxWidth: 500, width: '90%', padding: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>Respond to {selectedAdvice.farmer_name}</h2>
                            <button onClick={() => setSelectedAdvice(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 16 }}>
                            <div style={{ background: 'var(--bg)', borderRadius: 8, padding: 12, borderLeft: '3px solid var(--teal)' }}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Question:</div>
                                <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>{selectedAdvice.question}</div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>Your Response</label>
                                <textarea value={responseText} onChange={e => setResponseText(e.target.value)} placeholder="Provide advice and guidance to help this farmer..." rows={4}
                                    style={{
                                        width: '100%', padding: '12px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none',
                                        fontFamily: 'inherit', resize: 'vertical', background: 'white', color: 'var(--text)'
                                    }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 12 }}>
                            <button onClick={() => setSelectedAdvice(null)} style={{
                                flex: 1, padding: '10px', borderRadius: 8, border: '1.5px solid var(--border)', background: 'white',
                                color: 'var(--text)', fontWeight: 600, fontSize: 13, cursor: 'pointer'
                            }}>Cancel</button>
                            <button onClick={handleRespondToAdvice} disabled={submittingResponse} style={{
                                flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: submittingResponse ? 'var(--border)' : 'var(--teal)',
                                color: 'white', fontWeight: 600, fontSize: 13, cursor: submittingResponse ? 'not-allowed' : 'pointer'
                            }}>{submittingResponse ? 'Sending...' : 'Send Response'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )}
