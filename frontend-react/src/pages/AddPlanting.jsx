import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
<<<<<<< HEAD
import { CalendarDays } from 'lucide-react'
=======
import { Sprout, Calendar, Hash, FileText, TrendingUp, CheckCircle, Plus, RotateCcw } from 'lucide-react'
>>>>>>> main
import Layout from '../components/Layout'
import { useToast } from '../components/Toast'
import api from '../api'

<<<<<<< HEAD
const soils = [{ val: 'loam', label: 'Loam' }, { val: 'clay', label: 'Clay' }, { val: 'sandy', label: 'Sandy' }]
const varieties = ['Local Balugu', 'White Balugu', 'Yellow Balugu', 'Giant Balugu', 'Other']

export default function AddPlanting() {
    const [farms, setFarms] = useState([])
    const [farmId, setFarmId] = useState('')
    const [variety, setVariety] = useState('Local Balugu')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [mounds, setMounds] = useState('')
    const [soil, setSoil] = useState('loam')
    const [notes, setNotes] = useState('')
    const [loading, setLoading] = useState(false)
    const [prediction, setPrediction] = useState(null)
    const navigate = useNavigate()
    const showToast = useToast()
    const [params] = useSearchParams()

    useEffect(() => {
        api.get('/farms/my').then(d => {
            if (d.success) {
                const seen = new Set(); const unique = []
                d.farms.forEach(f => { if (!seen.has(f.farm_id)) { seen.add(f.farm_id); unique.push(f) } })
                setFarms(unique)
                const pid = params.get('farm_id')
                if (pid) setFarmId(pid)
                else if (unique.length) setFarmId(String(unique[0].farm_id))
            }
        }).catch(() => { })
    }, [])

    const handleSubmit = async () => {
        if (!farmId) { showToast('Select a farm', 'error'); return }
        if (!date) { showToast('Select planting date', 'error'); return }
        setLoading(true)
        try {
            const d = await api.post('/predictions/plant', { farm_id: parseInt(farmId), yam_variety: variety, planting_date: date, number_of_mounds: parseInt(mounds) || null, notes })
            if (d.success) { showToast('Harvest date predicted!'); setPrediction(d.prediction) }
            else showToast(d.message || 'Failed', 'error')
        } catch (e) { showToast(e?.message || 'Connection error', 'error') }
        setLoading(false)
    }

    return (
        <Layout>
            <h2 style={{ fontSize: 22, marginBottom: 20 }}>Add New Planting</h2>

            <div style={{ marginBottom: 18 }}>
                <label style={lbl}>Select Farm</label>
                <select value={farmId} onChange={e => setFarmId(e.target.value)} style={inp}>
                    {farms.length === 0 ? <option>No farms yet — add a farm first</option> :
                        farms.map(f => <option key={f.farm_id} value={f.farm_id}>{f.farm_name} — {f.district}</option>)}
                </select>
            </div>

            <div style={{ marginBottom: 18 }}>
                <label style={lbl}>Yam Variety</label>
                <select value={variety} onChange={e => setVariety(e.target.value)} style={inp}>
                    {varieties.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
            </div>

            <div style={{ marginBottom: 18 }}>
                <label style={lbl}>Planting Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inp} />
            </div>

            <div style={{ marginBottom: 18 }}>
                <label style={lbl}>Number of Mounds</label>
                <input type="number" value={mounds} onChange={e => setMounds(e.target.value)} placeholder="e.g. 50" min="1" style={inp} />
            </div>

            <div style={{ marginBottom: 18 }}>
                <label style={lbl}>Soil Type</label>
                <div style={{ display: 'flex', gap: 10 }}>
                    {soils.map(s => (
                        <button key={s.val} onClick={() => setSoil(s.val)} style={{ padding: '10px 18px', borderRadius: 20, border: `2px solid ${soil === s.val ? 'var(--primary)' : 'var(--border)'}`, background: soil === s.val ? '#E8F5E9' : 'white', color: soil === s.val ? 'var(--primary)' : 'var(--text)', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>{s.label}</button>
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: 24 }}>
                <label style={lbl}>Notes (optional)</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any additional information..." rows={3} style={{ ...inp, resize: 'vertical' }} />
            </div>

            <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: 13, background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'Poppins', fontWeight: 600, fontSize: 15, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Calculating...' : 'Calculate Harvest Date'}
            </button>

            {prediction && (
                <div style={{ background: 'linear-gradient(135deg,#1B5E20,#00897B)', borderRadius: 20, padding: '28px 24px', color: 'white', textAlign: 'center', marginTop: 24 }}>
                    <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: 'rgba(255,255,255,0.75)', marginBottom: 8 }}>Predicted Harvest Date</div>
                    <div style={{ fontFamily: 'Poppins', fontSize: 28, fontWeight: 700, marginBottom: 6 }}>{prediction.predicted_harvest_date}</div>
                    <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.85)', marginBottom: 20 }}>
                        {prediction.days_remaining > 0 ? `In ${prediction.days_remaining} days` : 'Past date — check planting date'}
                    </div>
                    <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
                        {prediction.confidence_percent}% Confidence
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 20 }}>{prediction.prediction_basis}</div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button onClick={() => navigate('/dashboard')} style={{ flex: 1, padding: 12, background: 'white', color: 'var(--primary-dark)', border: 'none', borderRadius: 12, fontFamily: 'Poppins', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Save & Go Home</button>
                        <button onClick={() => { setPrediction(null); setMounds(''); setNotes('') }} style={{ flex: 1, padding: 12, background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 12, fontFamily: 'Poppins', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Add Another</button>
                    </div>
                </div>
            )}
        </Layout>
    )
}

const lbl = { display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-gray)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }
const inp = { width: '100%', padding: '13px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 15, outline: 'none', background: 'white' }
=======
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
            if (data.success) { showToast('Harvest date predicted'); setPrediction(data.prediction) }
            else showToast(data.message || 'Failed to save planting', 'error')
        } catch (err) { showToast(err?.message || 'Connection error', 'error') }
        setLoading(false)
    }

    const progress = prediction
        ? Math.min(Math.round(((270 - prediction.days_remaining) / 270) * 100), 100)
        : 0

    return (
        <Layout>
            <div style={{ padding: '20px 24px', maxWidth: 680, margin: '0 auto' }}>
                <div style={{ marginBottom: 20 }}>
                    <h1 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)' }}>Add Planting</h1>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Record a new planting and get a harvest prediction</p>
                </div>

                {!prediction ? (
                    <div className="card" style={{ padding: '24px' }}>
                        {/* Farm + Variety row */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                            <div>
                                <label className="form-label">Farm</label>
                                <select className="form-input" value={form.farm_id} onChange={e => set('farm_id', e.target.value)}>
                                    {farms.length === 0
                                        ? <option value="">No farms — add one first</option>
                                        : farms.map(f => <option key={f.farm_id} value={f.farm_id}>{f.farm_name} — {f.district}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="form-label">Yam Variety</label>
                                <select className="form-input" value={form.yam_variety} onChange={e => set('yam_variety', e.target.value)}>
                                    {VARIETIES.map(v => <option key={v} value={v}>{v}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Date + Mounds row */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                            <div>
                                <label className="form-label"><Calendar size={11} style={{ display: 'inline', marginRight: 4 }} />Planting Date</label>
                                <input type="date" className="form-input" value={form.planting_date} onChange={e => set('planting_date', e.target.value)} />
                            </div>
                            <div>
                                <label className="form-label"><Hash size={11} style={{ display: 'inline', marginRight: 4 }} />Number of Mounds</label>
                                <input type="number" className="form-input" value={form.number_of_mounds} onChange={e => set('number_of_mounds', e.target.value)} placeholder="e.g. 50" min="1" />
                            </div>
                        </div>

                        {/* Soil type */}
                        <div style={{ marginBottom: 14 }}>
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

                        {/* Notes */}
                        <div style={{ marginBottom: 20 }}>
                            <label className="form-label"><FileText size={11} style={{ display: 'inline', marginRight: 4 }} />Notes (optional)</label>
                            <textarea className="form-input" value={form.notes} onChange={e => set('notes', e.target.value)}
                                placeholder="Any additional information..." rows={3} style={{ resize: 'vertical' }} />
                        </div>

                        <button onClick={handleSubmit} disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '11px' }}>
                            {loading ? <><span className="spinner" /> Calculating...</> : <><TrendingUp size={15} /> Calculate Harvest Date</>}
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {/* Result hero */}
                        <div style={{ background: 'linear-gradient(135deg, #052e16 0%, #14532d 50%, #065f46 100%)', borderRadius: 16, padding: '24px', color: 'white', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', right: -20, top: -20, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
                            <div style={{ position: 'relative' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                                    <CheckCircle size={14} color="#6ee7b7" />
                                    <span style={{ fontSize: 11, fontWeight: 600, color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: 0.5 }}>Prediction Ready</span>
                                </div>
                                <div style={{ fontFamily: 'Poppins', fontSize: 26, fontWeight: 700, marginBottom: 4 }}>
                                    {new Date(prediction.predicted_harvest_date).toLocaleDateString('en-UG', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', marginBottom: 16 }}>
                                    {prediction.days_remaining > 0 ? `In ${prediction.days_remaining} days` : 'Check planting date'}
                                </div>

                                {/* Progress bar */}
                                <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 20, height: 6, marginBottom: 6 }}>
                                    <div style={{ background: 'linear-gradient(90deg, #6ee7b7, #34d399)', borderRadius: 20, height: 6, width: progress + '%', transition: 'width 1s ease' }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(255,255,255,0.45)', marginBottom: 14 }}>
                                    <span>Planted</span>
                                    <span style={{ color: '#fbbf24', fontWeight: 600 }}>{prediction.confidence_percent}% confidence</span>
                                    <span>Harvest</span>
                                </div>

                                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>{prediction.prediction_basis}</div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                            <button onClick={() => navigate('/dashboard')} className="btn btn-primary" style={{ padding: '11px' }}>
                                <CheckCircle size={15} /> Save & Go Home
                            </button>
                            <button onClick={() => { setPrediction(null); set('number_of_mounds', ''); set('notes', '') }}
                                className="btn btn-ghost" style={{ padding: '11px' }}>
                                <RotateCcw size={15} /> Add Another
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    )
}
>>>>>>> main
