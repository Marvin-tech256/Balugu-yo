import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CalendarDays } from 'lucide-react'
import Layout from '../components/Layout'
import { useToast } from '../components/Toast'
import api from '../api'

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
