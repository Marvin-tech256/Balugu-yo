import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Search, Wheat, Trash2, Sprout } from 'lucide-react'
import Layout from '../components/Layout'
import { useToast } from '../components/Toast'
import api from '../api'

const DISTRICTS = ['Buikwe', 'Bukunja', 'Mukono', 'Kampala', 'Jinja', 'Mbale', 'Masaka', 'Mbarara', 'Other']
const SOILS = [{ val: 'loam', label: 'Loam' }, { val: 'clay', label: 'Clay' }, { val: 'sandy', label: 'Sandy' }]

export default function MyFarms() {
    const navigate = useNavigate()
    const showToast = useToast()
    const [allFarms, setAllFarms] = useState([])
    const [filtered, setFiltered] = useState([])
    const [search, setSearch] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [form, setForm] = useState({ farm_name: '', district: '', location: '', size_acres: '', soil_type: 'loam' })
    const [loading, setLoading] = useState(false)

    useEffect(() => { loadFarms() }, [])
    useEffect(() => {
        const q = search.toLowerCase()
        setFiltered(allFarms.filter(f => f.farm_name.toLowerCase().includes(q) || f.district.toLowerCase().includes(q) || (f.location || '').toLowerCase().includes(q)))
    }, [search, allFarms])

    async function loadFarms() {
        const data = await api.get('/farms/my')
        if (!data.success) return
        const seen = new Set(); const unique = []
        data.farms.forEach(f => { if (!seen.has(f.farm_id)) { seen.add(f.farm_id); unique.push(f) } })
        setAllFarms(unique)
    }

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
    const totalAcres = allFarms.reduce((s, f) => s + parseFloat(f.size_acres || 0), 0).toFixed(1)
    const harvestSoon = allFarms.filter(f => f.days_remaining && f.days_remaining <= 30 && f.days_remaining > 0).length

    async function handleAddFarm() {
        if (!form.farm_name.trim()) { showToast('Enter a farm name', 'error'); return }
        if (!form.district) { showToast('Select a district', 'error'); return }
        setLoading(true)
        const data = await api.post('/farms', { ...form, size_acres: parseFloat(form.size_acres) || null })
        if (data.success) {
            showToast('Farm added!')
            setModalOpen(false)
            setForm({ farm_name: '', district: '', location: '', size_acres: '', soil_type: 'loam' })
            loadFarms()
        } else {
            showToast(data.message || 'Failed to add farm', 'error')
        }
        setLoading(false)
    }

    async function deleteFarm(id, name) {
        if (!window.confirm('Delete "' + name + '"? This cannot be undone.')) return
        const data = await api.delete('/farms/' + id)
        if (data.success) { showToast('Farm deleted'); loadFarms() }
        else showToast(data.message || 'Failed to delete', 'error')
    }

    return (
        <Layout>
            <div style={{ background: 'linear-gradient(135deg,#1B5E20,#2E7D32)', padding: '20px 24px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ArrowLeft size={18} />
                    </button>
                    <h1 style={{ fontFamily: 'Poppins', fontSize: 20, color: 'white' }}>My Farms</h1>
                </div>
                <button onClick={() => setModalOpen(true)} style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', color: 'white', padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins' }}>
                    + Add Farm
                </button>
            </div>

            <div style={{ background: 'white', borderRadius: '20px 20px 0 0', marginTop: -12, padding: '24px 20px 100px', maxWidth: 600, margin: '-12px auto 0', minHeight: 'calc(100vh - 80px)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
                    {[{ value: allFarms.length, label: 'Total Farms' }, { value: totalAcres, label: 'Total Acres' }, { value: harvestSoon, label: 'Harvest Soon' }].map(({ value, label }) => (
                        <div key={label} style={{ background: 'var(--bg)', borderRadius: 'var(--radius)', padding: '14px 10px', textAlign: 'center' }}>
                            <div style={{ fontFamily: 'Poppins', fontSize: 22, fontWeight: 700, color: 'var(--primary)' }}>{value}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-gray)', marginTop: 2 }}>{label}</div>
                        </div>
                    ))}
                </div>

                <div style={{ position: 'relative', marginBottom: 20 }}>
                    <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-gray)' }} />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search farms..."
                        style={{ width: '100%', padding: '13px 16px 13px 44px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 14, outline: 'none', fontFamily: 'Inter' }} />
                </div>

                {filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-gray)' }}>
                        <Wheat size={48} color="var(--border)" style={{ marginBottom: 16 }} />
                        <h3 style={{ fontSize: 18, marginBottom: 8 }}>No farms yet</h3>
                        <p>Add your first farm to get started</p>
                        <button onClick={() => setModalOpen(true)} style={{ marginTop: 16, background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius)', padding: '12px 24px', fontFamily: 'Poppins', fontWeight: 600, cursor: 'pointer' }}>Add Farm</button>
                    </div>
                ) : filtered.map(f => (
                    <div key={f.farm_id} style={{ background: 'white', borderRadius: 'var(--radius)', padding: 18, boxShadow: 'var(--shadow)', marginBottom: 14, borderLeft: '4px solid var(--primary)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                            <div>
                                <div style={{ fontFamily: 'Poppins', fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{f.farm_name}</div>
                                <div style={{ fontSize: 13, color: 'var(--text-gray)' }}>{f.location || ''} {f.district}</div>
                            </div>
                            <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: f.days_remaining <= 30 && f.days_remaining > 0 ? '#FFF8E1' : '#E8F5E9', color: f.days_remaining <= 30 && f.days_remaining > 0 ? '#F57F17' : 'var(--primary)' }}>
                                {f.days_remaining <= 30 && f.days_remaining > 0 ? 'Harvest Soon' : 'Growing'}
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 14 }}>
                            {[{ label: f.size_acres + ' acres' }, { label: f.soil_type + ' soil' }, { label: f.yam_variety || 'Not planted' }].map(({ label }) => (
                                <div key={label} style={{ fontSize: 13, color: 'var(--text-gray)' }}>{label}</div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>
                                {f.predicted_harvest_date ? 'Harvest: ' + f.predicted_harvest_date + ' (' + f.days_remaining + ' days)' : 'No planting recorded'}
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button onClick={() => navigate('/add-planting?farm_id=' + f.farm_id)} style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none', background: '#E8F5E9', color: 'var(--primary)', fontFamily: 'Poppins' }}>+ Plant</button>
                                <button onClick={() => deleteFarm(f.farm_id, f.farm_name)} style={{ padding: '6px 10px', borderRadius: 20, fontSize: 12, cursor: 'pointer', border: 'none', background: '#FFEBEE', color: '#C62828', display: 'flex', alignItems: 'center' }}>
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {modalOpen && (
                <div onClick={e => e.target === e.currentTarget && setModalOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                    <div style={{ background: 'white', borderRadius: '24px 24px 0 0', padding: '28px 24px 40px', width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <h3 style={{ fontFamily: 'Poppins', fontSize: 18 }}>Add New Farm</h3>
                            <button onClick={() => setModalOpen(false)} style={{ background: 'var(--bg)', border: 'none', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: 16 }}>✕</button>
                        </div>
                        {[{ id: 'farm_name', label: 'Farm Name', placeholder: 'e.g. Bukunja Plot A', type: 'text' }, { id: 'location', label: 'Village / Area', placeholder: 'e.g. Bukunja Village', type: 'text' }, { id: 'size_acres', label: 'Farm Size (acres)', placeholder: 'e.g. 2.5', type: 'number' }].map(({ id, label, placeholder, type }) => (
                            <div key={id} style={{ marginBottom: 18 }}>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-gray)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</label>
                                <input type={type} value={form[id]} onChange={e => set(id, e.target.value)} placeholder={placeholder}
                                    style={{ width: '100%', padding: '13px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 15, outline: 'none', fontFamily: 'Inter' }} />
                            </div>
                        ))}
                        <div style={{ marginBottom: 18 }}>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-gray)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>District</label>
                            <select value={form.district} onChange={e => set('district', e.target.value)} style={{ width: '100%', padding: '13px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 15, outline: 'none', fontFamily: 'Inter', background: 'white' }}>
                                <option value="">Select district</option>
                                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div style={{ marginBottom: 18 }}>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-gray)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Soil Type</label>
                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                {SOILS.map(s => (
                                    <div key={s.val} onClick={() => set('soil_type', s.val)} style={{ padding: '10px 18px', borderRadius: 20, border: '2px solid ' + (form.soil_type === s.val ? 'var(--primary)' : 'var(--border)'), background: form.soil_type === s.val ? '#E8F5E9' : 'white', color: form.soil_type === s.val ? 'var(--primary)' : 'inherit', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
                                        {s.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button onClick={handleAddFarm} disabled={loading} style={{ width: '100%', padding: '13px 24px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'Poppins', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
                            {loading ? 'Adding...' : 'Add Farm'}
                        </button>
                    </div>
                </div>
            )}
        </Layout>
    )
}
