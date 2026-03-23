import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Wheat, Trash2, Sprout, X } from 'lucide-react'
import Layout from '../components/Layout'
import { useToast } from '../components/Toast'
import api from '../api'

const districts = ['Buikwe', 'Bukunja', 'Mukono', 'Kampala', 'Jinja', 'Mbale', 'Masaka', 'Mbarara', 'Other']
const soils = [{ val: 'loam', label: 'Loam' }, { val: 'clay', label: 'Clay' }, { val: 'sandy', label: 'Sandy' }]

export default function MyFarms() {
    const [farms, setFarms] = useState([])
    const [query, setQuery] = useState('')
    const [modal, setModal] = useState(false)
    const [soil, setSoil] = useState('loam')
    const [form, setForm] = useState({ farm_name: '', district: '', location: '', size_acres: '' })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const showToast = useToast()

    const load = async () => {
        const d = await api.get('/farms/my').catch(() => null)
        if (d?.success) {
            const seen = new Set(); const unique = []
            d.farms.forEach(f => { if (!seen.has(f.farm_id)) { seen.add(f.farm_id); unique.push(f) } })
            setFarms(unique)
        }
    }

    useEffect(() => { load() }, [])

    const filtered = farms.filter(f =>
        f.farm_name.toLowerCase().includes(query.toLowerCase()) ||
        f.district.toLowerCase().includes(query.toLowerCase())
    )

    const totalAcres = farms.reduce((s, f) => s + parseFloat(f.size_acres || 0), 0)
    const soon = farms.filter(f => f.days_remaining > 0 && f.days_remaining <= 30).length

    const handleAdd = async () => {
        if (!form.farm_name) { showToast('Enter farm name', 'error'); return }
        if (!form.district) { showToast('Select district', 'error'); return }
        setLoading(true)
        const d = await api.post('/farms', { ...form, size_acres: parseFloat(form.size_acres) || null, soil_type: soil }).catch(() => null)
        if (d?.success) { showToast('Farm added!'); setModal(false); setForm({ farm_name: '', district: '', location: '', size_acres: '' }); load() }
        else showToast(d?.message || 'Failed', 'error')
        setLoading(false)
    }

    const handleDelete = async (id, name) => {
        if (!confirm(`Delete "${name}"?`)) return
        const d = await api.delete(`/farms/${id}`).catch(() => null)
        if (d?.success) { showToast('Farm deleted'); load() }
        else showToast('Failed to delete', 'error')
    }

    return (
        <Layout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: 22 }}>My Farms</h2>
                <button onClick={() => setModal(true)} style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 20, fontFamily: 'Poppins', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Sprout size={16} /> Add Farm
                </button>
            </div>

            {/* Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
                {[{ val: farms.length, label: 'Total Farms' }, { val: totalAcres.toFixed(1), label: 'Total Acres' }, { val: soon, label: 'Harvest Soon' }].map(s => (
                    <div key={s.label} style={{ background: 'var(--bg)', borderRadius: 'var(--radius)', padding: '14px 10px', textAlign: 'center' }}>
                        <div style={{ fontFamily: 'Poppins', fontSize: 22, fontWeight: 700, color: 'var(--primary)' }}>{s.val}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-gray)', marginTop: 2 }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: 20 }}>
                <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-gray)' }} />
                <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search farms..." style={{ width: '100%', padding: '13px 16px 13px 44px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 14, outline: 'none' }} />
            </div>

            {/* Farm cards */}
            {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-gray)' }}>
                    <Wheat size={48} style={{ marginBottom: 12, opacity: 0.4 }} />
                    <h3 style={{ marginBottom: 8 }}>No farms yet</h3>
                    <p>Add your first farm to get started</p>
                </div>
            ) : filtered.map(f => (
                <div key={f.farm_id} style={{ background: 'white', borderRadius: 'var(--radius)', padding: 18, boxShadow: 'var(--shadow)', marginBottom: 14, borderLeft: `4px solid var(--primary)` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <div>
                            <div style={{ fontFamily: 'Poppins', fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{f.farm_name}</div>
                            <div style={{ fontSize: 13, color: 'var(--text-gray)' }}>{f.location} {f.district}</div>
                        </div>
                        <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: f.days_remaining <= 30 && f.days_remaining > 0 ? '#FFF8E1' : '#E8F5E9', color: f.days_remaining <= 30 && f.days_remaining > 0 ? '#F57F17' : 'var(--primary)' }}>
                            {f.days_remaining <= 30 && f.days_remaining > 0 ? 'Harvest Soon' : 'Growing'}
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 14 }}>
                        {[{ label: `${f.size_acres || '—'} acres` }, { label: `${f.soil_type || '—'} soil` }, { label: f.yam_variety || 'Not planted' }].map(m => (
                            <div key={m.label} style={{ fontSize: 13, color: 'var(--text-gray)' }}>{m.label}</div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>
                            {f.predicted_harvest_date ? `Harvest: ${f.predicted_harvest_date} (${f.days_remaining} days)` : 'No planting recorded'}
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={() => navigate(`/add-planting?farm_id=${f.farm_id}`)} style={{ padding: '6px 14px', borderRadius: 20, background: '#E8F5E9', color: 'var(--primary)', fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer' }}>+ Plant</button>
                            <button onClick={() => handleDelete(f.farm_id, f.farm_name)} style={{ padding: '6px 10px', borderRadius: 20, background: '#FFEBEE', color: '#C62828', fontSize: 12, border: 'none', cursor: 'pointer' }}><Trash2 size={14} /></button>
                        </div>
                    </div>
                </div>
            ))}

            {/* Add Farm Modal */}
            {modal && (
                <div onClick={e => e.target === e.currentTarget && setModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                    <div style={{ background: 'white', borderRadius: '24px 24px 0 0', padding: '28px 24px 40px', width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <h3 style={{ fontSize: 18 }}>Add New Farm</h3>
                            <button onClick={() => setModal(false)} style={{ background: 'var(--bg)', border: 'none', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
                        </div>
                        {[{ id: 'farm_name', label: 'Farm Name', placeholder: 'e.g. Bukunja Plot A' },
                        { id: 'location', label: 'Village / Area', placeholder: 'e.g. Bukunja Village' },
                        { id: 'size_acres', label: 'Farm Size (acres)', placeholder: 'e.g. 2.5', type: 'number' }].map(f => (
                            <div key={f.id} style={{ marginBottom: 18 }}>
                                <label style={lbl}>{f.label}</label>
                                <input type={f.type || 'text'} value={form[f.id]} onChange={e => setForm(p => ({ ...p, [f.id]: e.target.value }))} placeholder={f.placeholder} style={inp} />
                            </div>
                        ))}
                        <div style={{ marginBottom: 18 }}>
                            <label style={lbl}>District</label>
                            <select value={form.district} onChange={e => setForm(p => ({ ...p, district: e.target.value }))} style={inp}>
                                <option value="">Select district</option>
                                {districts.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div style={{ marginBottom: 18 }}>
                            <label style={lbl}>Soil Type</label>
                            <div style={{ display: 'flex', gap: 10 }}>
                                {soils.map(s => (
                                    <button key={s.val} onClick={() => setSoil(s.val)} style={{ padding: '10px 18px', borderRadius: 20, border: `2px solid ${soil === s.val ? 'var(--primary)' : 'var(--border)'}`, background: soil === s.val ? '#E8F5E9' : 'white', color: soil === s.val ? 'var(--primary)' : 'var(--text)', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>{s.label}</button>
                                ))}
                            </div>
                        </div>
                        <button onClick={handleAdd} disabled={loading} style={{ width: '100%', padding: 13, background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'Poppins', fontWeight: 600, fontSize: 15, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                            {loading ? 'Adding...' : 'Add Farm'}
                        </button>
                    </div>
                </div>
            )}
        </Layout>
    )
}

const lbl = { display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-gray)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }
const inp = { width: '100%', padding: '13px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 15, outline: 'none', background: 'white' }
