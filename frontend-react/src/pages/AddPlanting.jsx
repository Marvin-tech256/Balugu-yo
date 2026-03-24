import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Layout from '../components/Layout'
import { useToast } from '../components/Toast'
import api from '../api'

const SOILS = [{ val: 'loam', label: 'Loam' }, { val: 'clay', label: 'Clay' }, { val: 'sandy', label: 'Sandy' }]
const VARIETIES = ['Local Balugu', 'White Balugu', 'Yellow Balugu', 'Giant Balugu', 'Other']

export default function AddPlanting() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const showToast = useToast()
    const [farms, setFarms] = useState([])
    const [form, setForm] = useState({
        farm_id: searchParams.get('farm_id') || '',
        yam_variety: 'Local Balugu',
        planting_date: new Date().toISOString().split('T')[0],
        number_of_mounds: '',
        soil_type: 'loam',
        notes: '',
    })
    const [prediction, setPrediction] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => { loadFarms() }, [])

    async function loadFarms() {
        const data = await api.get('/farms/my')
        if (data.success && data.farms.length > 0) {
            const seen = new Set(); const unique = []
            data.farms.forEach(f => { if (!seen.has(f.farm_id)) { seen.add(f.farm_id); unique.push(f) } })
            setFarms(unique)
            if (!form.farm_id && unique.length > 0) setForm(f => ({ ...f, farm_id: unique[0].farm_id }))
        }
    }

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

    async function handleSubmit() {
        if (!form.farm_id) { showToast('Select a farm', 'error'); return }
        if (!form.planting_date) { showToast('Select a planting date', 'error'); return }
        setLoading(true)
        try {
            const data = await api.post('/predictions/plant', {
                farm_id: parseInt(form.farm_id),
                yam_variety: form.yam_variety,
                planting_date: form.planting_date,
                number_of_mounds: parseInt(form.number_of_mounds) || null,
                notes: form.notes,
            })
            if (data.success) {
                showToast('Harvest date predicted!')
                setPrediction(data.prediction)
            } else {
                showToast(data.message || 'Failed to save planting', 'error')
            }
        } catch (err) {
            showToast(err?.message || 'Connection error', 'error')
        }
        setLoading(false)
    }

    const SectionLabel = ({ children }) => (
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--accent)', marginBottom: 14, marginTop: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            {children}
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>
    )

    return (
        <Layout>
            <div style={{ background: 'linear-gradient(135deg,#1B5E20,#2E7D32)', padding: '20px 24px', color: 'white', display: 'flex', alignItems: 'center', gap: 12 }}>
                <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ArrowLeft size={18} />
                </button>
                <h1 style={{ fontFamily: 'Poppins', fontSize: 20, color: 'white' }}>Add New Planting</h1>
            </div>

            <div style={{ background: 'white', borderRadius: '20px 20px 0 0', marginTop: -12, padding: '28px 20px 100px', maxWidth: 600, margin: '-12px auto 0', minHeight: 'calc(100vh - 80px)' }}>
                {!prediction ? (
                    <>
                        <SectionLabel>Farm Details</SectionLabel>
                        <div style={{ marginBottom: 18 }}>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-gray)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Select Farm</label>
                            <select value={form.farm_id} onChange={e => set('farm_id', e.target.value)} style={{ width: '100%', padding: '13px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 15, outline: 'none', fontFamily: 'Inter', background: 'white' }}>
                                {farms.length === 0 ? <option value="">No farms yet — add a farm first</option> : farms.map(f => <option key={f.farm_id} value={f.farm_id}>{f.farm_name} — {f.district}</option>)}
                            </select>
                        </div>

                        <SectionLabel>Crop Details</SectionLabel>
                        <div style={{ marginBottom: 18 }}>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-gray)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Yam Variety</label>
                            <select value={form.yam_variety} onChange={e => set('yam_variety', e.target.value)} style={{ width: '100%', padding: '13px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 15, outline: 'none', fontFamily: 'Inter', background: 'white' }}>
                                {VARIETIES.map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </div>
                        <div style={{ marginBottom: 18 }}>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-gray)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Planting Date</label>
                            <input type="date" value={form.planting_date} onChange={e => set('planting_date', e.target.value)} style={{ width: '100%', padding: '13px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 15, outline: 'none', fontFamily: 'Inter', color: 'var(--text)' }} />
                        </div>
                        <div style={{ marginBottom: 18 }}>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-gray)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Number of Mounds</label>
                            <input type="number" value={form.number_of_mounds} onChange={e => set('number_of_mounds', e.target.value)} placeholder="e.g. 50" min="1" style={{ width: '100%', padding: '13px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 15, outline: 'none', fontFamily: 'Inter' }} />
                        </div>

                        <SectionLabel>Soil Type</SectionLabel>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 18 }}>
                            {SOILS.map(s => (
                                <div key={s.val} onClick={() => set('soil_type', s.val)} style={{ padding: '10px 18px', borderRadius: 20, border: '2px solid ' + (form.soil_type === s.val ? 'var(--primary)' : 'var(--border)'), background: form.soil_type === s.val ? '#E8F5E9' : 'white', color: form.soil_type === s.val ? 'var(--primary)' : 'inherit', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
                                    {s.label}
                                </div>
                            ))}
                        </div>

                        <SectionLabel>Additional Notes</SectionLabel>
                        <div style={{ marginBottom: 24 }}>
                            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any additional information..." rows={3} style={{ width: '100%', padding: '13px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 15, outline: 'none', fontFamily: 'Inter', resize: 'vertical' }} />
                        </div>

                        <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '13px 24px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'Poppins', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
                            {loading ? 'Calculating...' : 'Calculate Harvest Date'}
                        </button>
                    </>
                ) : (
                    <div style={{ background: 'linear-gradient(135deg,#1B5E20,#00897B)', borderRadius: 20, padding: '28px 24px', color: 'white', textAlign: 'center', marginTop: 24 }}>
                        <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: 'rgba(255,255,255,0.75)', marginBottom: 8 }}>Predicted Harvest Date</div>
                        <div style={{ fontFamily: 'Poppins', fontSize: 28, fontWeight: 700, marginBottom: 6 }}>{prediction.predicted_harvest_date}</div>
                        <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.85)', marginBottom: 20 }}>
                            {prediction.days_remaining > 0 ? 'In ' + prediction.days_remaining + ' days' : 'Past date — check planting date'}
                        </div>
                        <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
                            {prediction.confidence_percent}% Confidence
                        </div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 20 }}>{prediction.prediction_basis}</div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => navigate('/dashboard')} style={{ flex: 1, padding: 12, borderRadius: 12, fontFamily: 'Poppins', fontWeight: 600, fontSize: 14, cursor: 'pointer', border: 'none', background: 'white', color: '#1B5E20' }}>
                                Save & Go Home

                            </button>
                            <button onClick={() => { setPrediction(null); set('number_of_mounds', ''); set('notes', '') }} style={{ flex: 1, padding: 12, borderRadius: 12, fontFamily: 'Poppins', fontWeight: 600, fontSize: 14, cursor: 'pointer', background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.4)' }}>
                                Add Another
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    )
}
