import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CalendarDays, Sprout, Wheat, FileText, CheckCircle, ArrowRight } from 'lucide-react'
import Layout from '../components/Layout'
import { useToast } from '../components/Toast'
import api from '../api'

const SOILS = [{ val: 'loam', label: 'Loam' }, { val: 'clay', label: 'Clay' }, { val: 'sandy', label: 'Sandy' }]
const VARIETIES = ['Local Balugu', 'White Balugu', 'Yellow Balugu', 'Giant Balugu', 'Other']

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
            const d = await api.post('/predictions/plant', {
                farm_id: parseInt(farmId),
                yam_variety: variety,
                planting_date: date,
                number_of_mounds: parseInt(mounds) || null,
                notes
            })
            if (d.success) { showToast('Harvest date predicted!'); setPrediction(d.prediction) }
            else showToast(d.message || 'Failed', 'error')
        } catch (e) { showToast(e?.message || 'Connection error', 'error') }
        setLoading(false)
    }

    const selectedFarm = farms.find(f => String(f.farm_id) === String(farmId))

    return (
        <Layout>
            <div style={{ padding: '24px 32px', maxWidth: 960, margin: '0 auto' }}>

                {/* Header */}
                <div style={{ marginBottom: 28 }}>
                    <h1 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)' }}>Add New Planting</h1>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Record your yam planting and get an AI-powered harvest prediction</p>
                </div>

                {!prediction ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

                        {/* Left column — form */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                            {/* Farm selection */}
                            <div className="card" style={{ padding: '20px 22px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Wheat size={16} color="var(--primary)" />
                                    </div>
                                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Select Farm</span>
                                </div>
                                {farms.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-muted)', fontSize: 13 }}>
                                        No farms yet —{' '}
                                        <span onClick={() => navigate('/my-farms')} style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>add a farm first</span>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {farms.map(f => (
                                            <div key={f.farm_id} onClick={() => setFarmId(String(f.farm_id))} style={{
                                                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                                                borderRadius: 10, border: `1.5px solid ${String(farmId) === String(f.farm_id) ? 'var(--primary)' : 'var(--border)'}`,
                                                background: String(farmId) === String(f.farm_id) ? 'var(--primary-bg)' : 'var(--surface)',
                                                cursor: 'pointer', transition: 'all 0.15s',
                                            }}>
                                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: String(farmId) === String(f.farm_id) ? 'var(--primary)' : 'var(--border)', flexShrink: 0 }} />
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{f.farm_name}</div>
                                                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{f.district} · {f.soil_type} soil</div>
                                                </div>
                                                {String(farmId) === String(f.farm_id) && <CheckCircle size={16} color="var(--primary)" />}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Yam variety */}
                            <div className="card" style={{ padding: '20px 22px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--teal-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Sprout size={16} color="var(--teal)" />
                                    </div>
                                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Yam Variety</span>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {VARIETIES.map(v => (
                                        <button key={v} onClick={() => setVariety(v)} style={{
                                            padding: '8px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s',
                                            border: `1.5px solid ${variety === v ? 'var(--teal)' : 'var(--border)'}`,
                                            background: variety === v ? 'var(--teal-light)' : 'var(--surface)',
                                            color: variety === v ? 'var(--teal)' : 'var(--text-muted)',
                                        }}>{v}</button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right column */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                            {/* Date + mounds */}
                            <div className="card" style={{ padding: '20px 22px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <CalendarDays size={16} color="var(--gold)" />
                                    </div>
                                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Planting Details</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    <div>
                                        <label className="form-label">Planting Date</label>
                                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="form-input" />
                                    </div>
                                    <div>
                                        <label className="form-label">Number of Mounds</label>
                                        <input type="number" value={mounds} onChange={e => setMounds(e.target.value)} placeholder="e.g. 50" min="1" className="form-input" />
                                    </div>
                                </div>
                            </div>

                            {/* Soil type */}
                            <div className="card" style={{ padding: '20px 22px' }}>
                                <label className="form-label" style={{ marginBottom: 12, display: 'block' }}>Soil Type</label>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    {SOILS.map(s => (
                                        <button key={s.val} onClick={() => setSoil(s.val)} style={{
                                            flex: 1, padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                                            border: `1.5px solid ${soil === s.val ? 'var(--primary)' : 'var(--border)'}`,
                                            background: soil === s.val ? 'var(--primary-bg)' : 'var(--surface)',
                                            color: soil === s.val ? 'var(--primary)' : 'var(--text-muted)',
                                        }}>{s.label}</button>
                                    ))}
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="card" style={{ padding: '20px 22px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FileText size={16} color="var(--text-muted)" />
                                    </div>
                                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Notes <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></span>
                                </div>
                                <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any additional information about this planting..." rows={3}
                                    className="form-input" style={{ resize: 'vertical', minHeight: 80 }} />
                            </div>

                            {/* Submit */}
                            <button onClick={handleSubmit} disabled={loading} style={{
                                width: '100%', padding: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                background: loading ? 'var(--border)' : 'linear-gradient(135deg, var(--primary), var(--teal))',
                                color: 'white', border: 'none', borderRadius: 12,
                                fontFamily: 'Poppins', fontWeight: 700, fontSize: 15,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                boxShadow: loading ? 'none' : '0 4px 16px rgba(22,163,74,0.3)',
                                transition: 'all 0.2s',
                            }}>
                                {loading ? <><span className="spinner" /> Calculating...</> : <>Calculate Harvest Date <ArrowRight size={16} /></>}
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Prediction result */
                    <div style={{ maxWidth: 520, margin: '0 auto' }}>
                        <div style={{ background: 'linear-gradient(135deg, #052e16 0%, #14532d 50%, #065f46 100%)', borderRadius: 20, padding: '32px 28px', color: 'white', textAlign: 'center', marginBottom: 16 }}>
                            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                                <Sprout size={30} color="#6ee7b7" />
                            </div>
                            <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.5, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Predicted Harvest Date</div>
                            <div style={{ fontFamily: 'Poppins', fontSize: 32, fontWeight: 800, marginBottom: 6 }}>{prediction.predicted_harvest_date}</div>
                            <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', marginBottom: 20 }}>
                                {prediction.days_remaining > 0 ? `In ${prediction.days_remaining} days` : 'Past date — check planting date'}
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 20, height: 6, marginBottom: 8 }}>
                                <div style={{ background: 'linear-gradient(90deg,#6ee7b7,#34d399)', borderRadius: 20, height: 6, width: Math.min(Math.round(((270 - prediction.days_remaining) / 270) * 100), 100) + '%' }} />
                            </div>
                            <div style={{ display: 'inline-block', background: 'rgba(251,191,36,0.2)', border: '1px solid rgba(251,191,36,0.4)', padding: '5px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, color: '#fbbf24', marginBottom: 16 }}>
                                {prediction.confidence_percent}% Confidence
                            </div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{prediction.prediction_basis}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button onClick={() => navigate('/dashboard')} className="btn btn-primary" style={{ flex: 1, padding: '12px', fontSize: 14 }}>
                                Go to Dashboard
                            </button>
                            <button onClick={() => { setPrediction(null); setMounds(''); setNotes('') }} className="btn btn-ghost" style={{ flex: 1, padding: '12px', fontSize: 14 }}>
                                Add Another
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .add-planting-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </Layout>
    )
}
