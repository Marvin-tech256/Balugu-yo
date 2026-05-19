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
            {/* Background */}
            <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80)',
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    filter: 'brightness(0.18) saturate(1.3)',
                }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(2,13,7,0.7) 0%, rgba(5,46,22,0.6) 50%, rgba(6,95,70,0.5) 100%)' }} />
                <div style={{ position: 'absolute', top: '10%', left: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(22,163,74,0.08) 0%, transparent 70%)', animation: 'floatSlow 9s ease-in-out infinite', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '15%', right: '5%', width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,148,136,0.07) 0%, transparent 70%)', animation: 'floatSlow 7s ease-in-out infinite reverse', pointerEvents: 'none' }} />
            </div>
            <div style={{ padding: '24px 32px', maxWidth: 960, margin: '0 auto', position: 'relative', zIndex: 1 }}>

                {/* Header */}
                <div style={{ marginBottom: 28 }}>
                    <h1 style={{ fontSize: 20, fontWeight: 600, color: 'white' }}>Add New Planting</h1>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>Record your yam planting and get an AI-powered harvest prediction</p>
                </div>

                {!prediction ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

                        {/* Left column — form */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                            {/* Farm selection */}
                            <div style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: '20px 22px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(22,163,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Wheat size={16} color="#6ee7b7" />
                                    </div>
                                    <span style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>Select Farm</span>
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
                                                borderRadius: 10, border: `1.5px solid ${String(farmId) === String(f.farm_id) ? '#6ee7b7' : 'rgba(255,255,255,0.12)'}`,
                                                background: String(farmId) === String(f.farm_id) ? 'rgba(22,163,74,0.15)' : 'rgba(255,255,255,0.04)',
                                                cursor: 'pointer', transition: 'all 0.15s',
                                            }}>
                                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: String(farmId) === String(f.farm_id) ? '#6ee7b7' : 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>{f.farm_name}</div>
                                                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{f.district} · {f.soil_type} soil</div>
                                                </div>
                                                {String(farmId) === String(f.farm_id) && <CheckCircle size={16} color="#6ee7b7" />}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Yam variety */}
                            <div style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: '20px 22px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(13,148,136,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Sprout size={16} color="#5eead4" />
                                    </div>
                                    <span style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>Yam Variety</span>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {VARIETIES.map(v => (
                                        <button key={v} onClick={() => setVariety(v)} style={{
                                            padding: '8px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s',
                                            border: `1.5px solid ${variety === v ? '#5eead4' : 'rgba(255,255,255,0.15)'}`,
                                            background: variety === v ? 'rgba(13,148,136,0.2)' : 'rgba(255,255,255,0.05)',
                                            color: variety === v ? '#5eead4' : 'rgba(255,255,255,0.6)',
                                        }}>{v}</button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right column */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                            {/* Date + mounds */}
                            <div style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: '20px 22px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(217,119,6,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <CalendarDays size={16} color="#fbbf24" />
                                    </div>
                                    <span style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>Planting Details</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 5 }}>Planting Date</label>
                                        <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: 8, fontSize: 14, outline: 'none', background: 'rgba(255,255,255,0.08)', color: 'white', colorScheme: 'dark' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 5 }}>Number of Mounds</label>
                                        <input type="number" value={mounds} onChange={e => setMounds(e.target.value)} placeholder="e.g. 50" min="1" style={{ width: '100%', padding: '10px 14px', border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: 8, fontSize: 14, outline: 'none', background: 'rgba(255,255,255,0.08)', color: 'white' }} />
                                    </div>
                                </div>
                            </div>

                            {/* Soil type */}
                            <div style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: '20px 22px' }}>
                                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12 }}>Soil Type</label>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    {SOILS.map(s => (
                                        <button key={s.val} onClick={() => setSoil(s.val)} style={{
                                            flex: 1, padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                                            border: `1.5px solid ${soil === s.val ? '#6ee7b7' : 'rgba(255,255,255,0.15)'}`,
                                            background: soil === s.val ? 'rgba(22,163,74,0.2)' : 'rgba(255,255,255,0.05)',
                                            color: soil === s.val ? '#6ee7b7' : 'rgba(255,255,255,0.6)',
                                        }}>{s.label}</button>
                                    ))}
                                </div>
                            </div>

                            {/* Notes */}
                            <div style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: '20px 22px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FileText size={16} color="rgba(255,255,255,0.5)" />
                                    </div>
                                    <span style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>Notes <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>(optional)</span></span>
                                </div>
                                <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any additional information about this planting..." rows={3}
                                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: 8, fontSize: 14, outline: 'none', background: 'rgba(255,255,255,0.08)', color: 'white', resize: 'vertical', minHeight: 80 }} />
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
