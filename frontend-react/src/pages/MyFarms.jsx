import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
<<<<<<< HEAD
import { Search, Wheat, Trash2, Sprout, X } from 'lucide-react'
=======
import { Plus, Search, Wheat, Trash2, Sprout, MapPin, Layers, X, History, ChevronDown } from 'lucide-react'
>>>>>>> main
import Layout from '../components/Layout'
import { useToast } from '../components/Toast'
import api from '../api'

<<<<<<< HEAD
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
=======
const DISTRICTS = ['Buikwe', 'Bukunja', 'Mukono', 'Kampala', 'Jinja', 'Mbale', 'Masaka', 'Mbarara', 'Other']
const SOILS = [{ val: 'loam', label: 'Loam' }, { val: 'clay', label: 'Clay' }, { val: 'sandy', label: 'Sandy' }]

export default function MyFarms() {
    const navigate = useNavigate()
    const showToast = useToast()
    const [tab, setTab] = useState('farms') // 'farms' | 'history'
    const [allFarms, setAllFarms] = useState([])
    const [filtered, setFiltered] = useState([])
    const [plantings, setPlantings] = useState([])
    const [search, setSearch] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [form, setForm] = useState({ farm_name: '', district: '', location: '', size_acres: '', soil_type: 'loam' })
    const [loading, setLoading] = useState(false)

    useEffect(() => { loadFarms() }, [])
    useEffect(() => {
        if (tab === 'history' && plantings.length === 0) loadHistory()
    }, [tab])
    useEffect(() => {
        const q = search.toLowerCase()
        setFiltered(allFarms.filter(f =>
            f.farm_name.toLowerCase().includes(q) ||
            f.district.toLowerCase().includes(q) ||
            (f.location || '').toLowerCase().includes(q)
        ))
    }, [search, allFarms])

    async function loadFarms() {
        const data = await api.get('/farms/my')
        if (!data.success) return
        const seen = new Set(); const unique = []
        data.farms.forEach(f => { if (!seen.has(f.farm_id)) { seen.add(f.farm_id); unique.push(f) } })
        setAllFarms(unique)
    }

    async function loadHistory() {
        const data = await api.get('/predictions/my-plantings')
        if (data.success) setPlantings(data.plantings || [])
    }

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
    const totalAcres = allFarms.reduce((s, f) => s + parseFloat(f.size_acres || 0), 0).toFixed(1)
    const harvestSoon = allFarms.filter(f => f.days_remaining && f.days_remaining <= 30 && f.days_remaining > 0).length
    const fmtDate = d => d ? new Date(d).toLocaleDateString('en-UG', { day: 'numeric', month: 'short', year: 'numeric' }) : null

    async function handleAddFarm() {
        if (!form.farm_name.trim()) { showToast('Enter a farm name', 'error'); return }
        if (!form.district) { showToast('Select a district', 'error'); return }
        setLoading(true)
        const data = await api.post('/farms', { ...form, size_acres: parseFloat(form.size_acres) || null })
        if (data.success) {
            showToast('Farm added')
            setModalOpen(false)
            setForm({ farm_name: '', district: '', location: '', size_acres: '', soil_type: 'loam' })
            loadFarms()
        } else showToast(data.message || 'Failed to add farm', 'error')
        setLoading(false)
    }

    async function deleteFarm(id, name) {
        if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
        const data = await api.delete('/farms/' + id)
        if (data.success) { showToast('Farm deleted'); loadFarms() }
        else showToast(data.message || 'Failed to delete', 'error')
>>>>>>> main
    }

    return (
        <Layout>
<<<<<<< HEAD
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
=======
            <div style={{ padding: '20px 24px', maxWidth: 900, margin: '0 auto' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <div>
                        <h1 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)' }}>My Farms</h1>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Manage your registered farm plots</p>
                    </div>
                    <button onClick={() => setModalOpen(true)} className="btn btn-primary">
                        <Plus size={15} /> Add Farm
                    </button>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'var(--surface-2)', borderRadius: 10, padding: 4, width: 'fit-content' }}>
                    {[{ id: 'farms', label: 'Farms', icon: Wheat }, { id: 'history', label: 'Planting History', icon: History }].map(t => (
                        <button key={t.id} onClick={() => setTab(t.id)}
                            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s', background: tab === t.id ? 'white' : 'transparent', color: tab === t.id ? 'var(--text)' : 'var(--text-muted)', boxShadow: tab === t.id ? 'var(--shadow-sm)' : 'none' }}>
                            <t.icon size={14} /> {t.label}
                        </button>
                    ))}
                </div>

                {/* Stats row — only on farms tab */}
                {tab === 'farms' && <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>                    {[
                        { value: allFarms.length, label: 'Total Farms', color: 'var(--primary)', bg: 'var(--primary-bg)' },
                        { value: totalAcres, label: 'Total Acres', color: 'var(--teal)', bg: 'var(--teal-light)' },
                        { value: harvestSoon, label: 'Harvest Soon', color: 'var(--gold)', bg: 'var(--gold-light)' },
                    ].map(({ value, label, color, bg }) => (
                        <div key={label} className="stat-card" style={{ textAlign: 'center' }}>
                            <div style={{ fontFamily: 'Poppins', fontSize: 24, fontWeight: 700, color }}>{value}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
                        </div>
                    ))}
                    </div>

                    {/* Search */}
                    <div style={{ position: 'relative', marginBottom: 16 }}>
                        <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search farms..."
                            className="form-input" style={{ paddingLeft: 36 }} />
                    </div>

                    {/* Farm list */}
                    {filtered.length === 0 ? (
                        <div className="card empty-state" style={{ padding: '48px 20px' }}>
                            <Wheat size={40} color="var(--border)" style={{ marginBottom: 12 }} />
                            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>No farms yet</div>
                            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Add your first farm to get started</div>
                            <button onClick={() => setModalOpen(true)} className="btn btn-primary"><Plus size={14} /> Add Farm</button>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                            {filtered.map(f => {
                                const soon = f.days_remaining && f.days_remaining <= 30 && f.days_remaining > 0
                                return (
                                    <div key={f.farm_id} className="card" style={{ padding: 16, borderLeft: `3px solid ${soon ? 'var(--gold)' : 'var(--primary)'}` }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.farm_name}</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
                                                    <MapPin size={11} /> {f.location ? `${f.location}, ` : ''}{f.district}
                                                </div>
                                            </div>
                                            <span className={`badge ${soon ? 'badge-amber' : 'badge-green'}`} style={{ marginLeft: 8, flexShrink: 0 }}>
                                                {soon ? 'Soon' : 'Growing'}
                                            </span>
                                        </div>

                                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)', background: 'var(--surface-2)', padding: '3px 8px', borderRadius: 20 }}>
                                                <Layers size={10} /> {f.size_acres || '—'} acres
                                            </span>
                                            <span style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--surface-2)', padding: '3px 8px', borderRadius: 20 }}>
                                                {f.soil_type} soil
                                            </span>
                                            {f.yam_variety && (
                                                <span style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--surface-2)', padding: '3px 8px', borderRadius: 20 }}>
                                                    {f.yam_variety}
                                                </span>
                                            )}
                                        </div>

                                        <div style={{ fontSize: 12, color: f.predicted_harvest_date ? (soon ? 'var(--gold-dark)' : 'var(--primary-mid)') : 'var(--text-muted)', marginBottom: 12, fontWeight: f.predicted_harvest_date ? 600 : 400 }}>
                                            {f.predicted_harvest_date
                                                ? `Harvest: ${fmtDate(f.predicted_harvest_date)} (${f.days_remaining}d)`
                                                : 'No planting recorded'}
                                        </div>

                                        <div style={{ display: 'flex', gap: 8, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                                            <button onClick={() => navigate('/add-planting?farm_id=' + f.farm_id)}
                                                className="btn btn-ghost" style={{ flex: 1, fontSize: 12, padding: '6px 10px' }}>
                                                <Sprout size={13} /> Plant
                                            </button>
                                            <button onClick={() => deleteFarm(f.farm_id, f.farm_name)}
                                                className="btn btn-danger" style={{ padding: '6px 10px' }}>
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </>}

                {/* Planting History Tab */}
                {tab === 'history' && (
                    <div>
                        {plantings.length === 0 ? (
                            <div className="card empty-state" style={{ padding: '48px 20px' }}>
                                <History size={36} color="var(--border)" style={{ marginBottom: 10 }} />
                                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>No planting history yet</div>
                                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>Add a planting to start tracking your history</div>
                                <button onClick={() => navigate('/add-planting')} className="btn btn-primary"><Sprout size={14} /> Add Planting</button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {plantings.map(p => (
                                    <div key={p.planting_id} className="card" style={{ padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'center' }}>
                                        <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Sprout size={16} color="var(--primary)" />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{p.yam_variety || 'Unknown variety'}</div>
                                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                                                Planted: {fmtDate(p.planting_date)}
                                                {p.farm_name && ` · ${p.farm_name}`}
                                                {p.number_of_mounds && ` · ${p.number_of_mounds} mounds`}
                                            </div>
                                        </div>
                                        {p.predicted_harvest_date && (
                                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary-mid)' }}>{fmtDate(p.predicted_harvest_date)}</div>
                                                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{p.days_remaining > 0 ? `${p.days_remaining}d left` : 'Harvested'}</div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Add Farm Modal */}
            {modalOpen && (
                <div onClick={e => e.target === e.currentTarget && setModalOpen(false)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(2px)' }}>
                    <div className="card animate-in" style={{ width: '100%', maxWidth: 440, padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <h3 style={{ fontFamily: 'Poppins', fontSize: 16, fontWeight: 600 }}>Add New Farm</h3>
                            <button onClick={() => setModalOpen(false)} style={{ background: 'var(--surface-2)', border: 'none', width: 28, height: 28, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                <X size={14} />
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label className="form-label">Farm Name</label>
                                <input className="form-input" value={form.farm_name} onChange={e => set('farm_name', e.target.value)} placeholder="e.g. Bukunja Plot A" />
                            </div>
                            <div>
                                <label className="form-label">Village / Area</label>
                                <input className="form-input" value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Bukunja" />
                            </div>
                            <div>
                                <label className="form-label">Size (acres)</label>
                                <input className="form-input" type="number" value={form.size_acres} onChange={e => set('size_acres', e.target.value)} placeholder="e.g. 2.5" />
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label className="form-label">District</label>
                                <select className="form-input" value={form.district} onChange={e => set('district', e.target.value)}>
                                    <option value="">Select district</option>
                                    {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                        </div>

                        <div style={{ marginBottom: 20 }}>
                            <label className="form-label">Soil Type</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                                {SOILS.map(s => (
                                    <button key={s.val} onClick={() => set('soil_type', s.val)}
                                        className={`chip-option${form.soil_type === s.val ? ' active' : ''}`} style={{ flex: 1 }}>
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button onClick={handleAddFarm} disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '10px' }}>
                            {loading ? <><span className="spinner" /> Adding...</> : <><Plus size={15} /> Add Farm</>}
>>>>>>> main
                        </button>
                    </div>
                </div>
            )}
        </Layout>
    )
}
<<<<<<< HEAD

const lbl = { display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-gray)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }
const inp = { width: '100%', padding: '13px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 15, outline: 'none', background: 'white' }
=======
>>>>>>> main
