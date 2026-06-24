import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wheat, Sprout, Bell, Plus, CloudRain, ArrowRight, MapPin, MessageSquare, X, Lightbulb } from 'lucide-react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import api from '../api'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const showToast = useToast()
  const [stats, setStats] = useState({ farms: 0, plantings: 0, alerts: 0 })
  const [farms, setFarms] = useState([])
  const [recentAlerts, setRecentAlerts] = useState([])
  const [prediction, setPrediction] = useState(null)
  const [notifCount, setNotifCount] = useState(0)
  const [selectedFarmId, setSelectedFarmId] = useState(null)
  const [allPredictions, setAllPredictions] = useState([])
  const [showAdviceModal, setShowAdviceModal] = useState(false)
  const [adviceForm, setAdviceForm] = useState({ farm_id: '', question: '' })
  const [submittingAdvice, setSubmittingAdvice] = useState(false)
  const [myAdvice, setMyAdvice] = useState([])
  const [showAdviceResponses, setShowAdviceResponses] = useState(false)

  const hour = new Date().getHours()
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = user?.full_name?.split(' ')[0] || 'Farmer'

  useEffect(() => { loadDashboard() }, [])

  async function loadDashboard() {
    try {
      const [farmsData, predData, alertData, adviceData] = await Promise.all([
        api.get('/farms/my'), api.get('/predictions/my-predictions'), api.get('/alerts/unread'), api.get('/advice/my'),
      ])
      if (farmsData.success) { setStats(s => ({ ...s, farms: farmsData.count })); setFarms(farmsData.farms || []) }
      if (predData.success) {
        setStats(s => ({ ...s, plantings: predData.count }))
        const preds = predData.predictions || []
        setAllPredictions(preds)
        const first = preds.filter(p => p.days_remaining > 0).sort((a, b) => a.days_remaining - b.days_remaining)[0] || preds[0] || null
        setPrediction(first)
        if (first) setSelectedFarmId(first.farm_name)
      }
      if (alertData.success) {
        setStats(s => ({ ...s, alerts: alertData.count }))
        setNotifCount(alertData.count)
        setRecentAlerts((alertData.notifications || []).slice(0, 3))
      }
      if (adviceData.success) {
        setMyAdvice(adviceData.advice || [])
      }
    } catch (err) { console.error(err) }
  }

  function selectFarm(farm) {
    setSelectedFarmId(farm.farm_name)
    const pred = allPredictions.find(p => p.farm_name === farm.farm_name) || null
    setPrediction(pred)
  }

  async function handleSubmitAdvice() {
    if (!adviceForm.question.trim()) {
      showToast('Please enter your question', 'error')
      return
    }
    setSubmittingAdvice(true)
    try {
      const res = await api.post('/advice/ask', {
        farm_id: adviceForm.farm_id ? parseInt(adviceForm.farm_id) : null,
        question: adviceForm.question.trim(),
      })
      if (res.success) {
        showToast('Your question has been submitted to the extension officer')
        setAdviceForm({ farm_id: '', question: '' })
        setShowAdviceModal(false)
        loadDashboard() // Re-fetch dashboard data
      } else {
        console.error('Advice submission error:', res)
        showToast(res.message || 'Failed to submit question', 'error')
      }
    } catch (e) {
      console.error('Advice submission exception:', e)
      showToast(e?.response?.data?.message || e?.message || 'Error submitting question', 'error')
    }
    setSubmittingAdvice(false)
  }

  async function handleDismissAdvice(advice_id) {
    try {
      const res = await api.delete(`advice/${advice_id}`);
      if (res.success) {
        showToast('Advice dismissed');
        setMyAdvice(currentAdvice => currentAdvice.filter(a => a.advice_id !== advice_id));
      } else {
        showToast(res.message || 'Failed to dismiss', 'error');
      }
    } catch (e) { showToast('Error dismissing advice', 'error'); }
  }
  const alertDot = { harvest: 'var(--primary)', weather: 'var(--teal)', warning: 'var(--gold)', system: 'var(--text-muted)' }
  const fmtDate = d => d ? new Date(d).toLocaleDateString('en-UG', { day: 'numeric', month: 'short', year: 'numeric' }) : null
  const calculateDaysSincePlanted = (plantingDate) => {
    if (!plantingDate) return 0
    const today = new Date()
    const planted = new Date(plantingDate)
    return Math.floor((today - planted) / (1000 * 60 * 60 * 24))
  }

  return (
    <Layout notifCount={notifCount}>
      <div style={{ padding: '20px 24px', maxWidth: 1100, margin: '0 auto' }}>

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)' }}>{greet}, {firstName}</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Here's what's happening on your farms</p>
          </div>
          <button onClick={() => navigate('/add-planting')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={15} /> Add Planting
          </button>
        </div>

        {/* Top row: hero + stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 20 }}>
          {/* Hero prediction — spans 2 cols */}
          <div style={{ gridColumn: 'span 2' }}>
            {prediction ? (
              <div style={{ background: 'linear-gradient(135deg, #052e16 0%, #14532d 50%, #065f46 100%)', borderRadius: 16, padding: '20px 24px', color: 'white', height: '100%', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', right: -20, top: -20, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
                <div style={{ position: 'absolute', right: 20, bottom: -30, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
                <div style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontFamily: 'Poppins', fontSize: 42, fontWeight: 700, lineHeight: 1 }}>
                      {calculateDaysSincePlanted(prediction.planting_date)}
                    </span>
                    <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', paddingBottom: 6 }}>days since planted</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14, fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                    <MapPin size={12} />
                    {prediction.farm_name} · {prediction.yam_variety}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ background: 'var(--surface)', border: '1.5px dashed var(--border)', borderRadius: 16, padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', height: '100%', minHeight: 140 }}>
                <Lightbulb size={28} color="var(--gold)" style={{ marginBottom: 12, opacity: 0.8 }} />
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>Did you know?</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16, maxWidth: '85%', lineHeight: 1.6 }}>The average growth period for climbing yams is 8 to 10 months. Add a planting to get a precise prediction.</div>
                <button onClick={() => navigate('/add-planting')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--primary-bg)', color: 'var(--primary-mid)', border: '1px solid var(--primary-light)', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  <Plus size={13} /> Record Planting
                </button>
              </div>
            )}
          </div>

          {/* Stats column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { icon: Wheat, value: stats.farms, label: 'Farms', color: 'var(--primary)', bg: 'var(--primary-bg)' },
              { icon: Sprout, value: stats.plantings, label: 'Plantings', color: 'var(--teal)', bg: 'var(--teal-light)' },
              { icon: Bell, value: stats.alerts, label: 'Alerts', color: 'var(--gold)', bg: 'var(--gold-light)' },
            ].map(({ icon: Icon, value, label, color, bg }) => (
              <div key={label} style={{ background: 'var(--surface)', borderRadius: 12, padding: '12px 14px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={17} color={color} />
                </div>
                <div>
                  <div style={{ fontFamily: 'Poppins', fontSize: 20, fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>{value}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Climbing yam growth tip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 16px', marginBottom: 20 }}>
          <Lightbulb size={20} color="var(--gold)" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>
            <span style={{ fontWeight: 600 }}>Tip:</span> The average growth period for climbing yams is 8 to 10 months from planting to harvest.
          </div>
        </div>

        {/* Bottom row: farms + quick actions + alerts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

          {/* My Farms */}
          <div style={{ background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>My Farms</span>
              <button onClick={() => navigate('/my-farms')} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: 'var(--primary)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                View all <ArrowRight size={12} />
              </button>
            </div>
            <div style={{ padding: '8px 0' }}>
              {farms.length === 0 ? (
                <div style={{ padding: '20px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No farms yet</div>
              ) : farms.slice(0, 4).map(f => (
                <div key={f.farm_id} onClick={() => selectFarm(f)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px', borderBottom: '1px solid var(--border)', cursor: 'pointer', background: selectedFarmId === f.farm_name ? 'var(--primary-bg)' : 'transparent', borderLeft: selectedFarmId === f.farm_name ? '3px solid var(--primary)' : '3px solid transparent', transition: 'all 0.15s' }}
                  onMouseEnter={e => { if (selectedFarmId !== f.farm_name) e.currentTarget.style.background = 'var(--surface-2)' }}
                  onMouseLeave={e => { if (selectedFarmId !== f.farm_name) e.currentTarget.style.background = 'transparent' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Wheat size={15} color="var(--primary)" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.farm_name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{f.district}</div>
                  </div>
                  {f.days_remaining ? (
                    <span style={{ fontSize: 11, fontWeight: 600, color: f.days_remaining <= 30 ? 'var(--gold-dark)' : 'var(--primary-mid)', background: f.days_remaining <= 30 ? 'var(--gold-light)' : 'var(--primary-bg)', padding: '2px 8px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                      {f.days_remaining}d
                    </span>
                  ) : <span className="badge badge-green">Growing</span>}
                </div>
              ))}
              <div onClick={() => navigate('/add-planting')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px', cursor: 'pointer', color: 'var(--primary)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-bg)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <Plus size={14} />
                <span style={{ fontSize: 12, fontWeight: 600 }}>Add farm</span>
              </div>
            </div>
          </div>

          {/* Right column: quick actions + recent alerts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Quick actions */}
            <div style={{ background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden' }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Quick Actions</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--border)' }}>
                {[
                  { icon: Sprout, label: 'Add Planting', to: '/add-planting', color: 'var(--primary)', bg: 'var(--primary-bg)', action: () => navigate('/add-planting') },
                  { icon: CloudRain, label: 'Weather', to: '/weather', color: 'var(--teal)', bg: 'var(--teal-light)', action: () => navigate('/weather') },
                  { icon: Wheat, label: 'My Farms', to: '/my-farms', color: 'var(--gold-dark)', bg: 'var(--gold-light)', action: () => navigate('/my-farms') },
                  { icon: MessageSquare, label: 'Ask Advice', to: '#', color: '#10b981', bg: '#d1fae5', action: () => setShowAdviceModal(true) },
                ].map(({ icon: Icon, label, to, color, bg, action }) => (
                  <button key={label} onClick={action} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '14px 8px', background: 'var(--surface)', border: 'none', cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}>
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={16} color={color} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-2)' }}>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent alerts */}
            <div style={{ background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Recent Alerts</span>
                <button onClick={() => navigate('/alerts')} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: 'var(--primary)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  View all <ArrowRight size={12} />
                </button>
              </div>
              {recentAlerts.length === 0 ? (
                <div style={{ padding: '20px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No alerts yet</div>
              ) : recentAlerts.map(a => (
                <div key={a.notif_id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: alertDot[a.type] || 'var(--text-muted)', marginTop: 5, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.message}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* My Advice */}
        {myAdvice.length > 0 && (
          <div style={{ background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden', marginTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>My Advice Requests</span>
            </div>
            <div>
              {myAdvice.slice(0, 3).map(a => (
                <div key={a.advice_id} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>Q: {a.question}</div>
                  {a.response ? (
                    <div style={{ background: 'var(--primary-bg)', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>
                      <div style={{ fontWeight: 600, color: 'var(--primary-mid)', marginBottom: 4 }}>
                        A: from {a.officer_name || 'Extension Officer'}
                      </div>
                      {a.response}
                    </div>
                  ) : (
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      Waiting for a response from the extension officer...
                    </div>
                  )}
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      Asked on {fmtDate(a.created_at)}
                      {a.answered_at && ` · Answered on ${fmtDate(a.answered_at)}`}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); handleDismissAdvice(a.advice_id); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 11, cursor: 'pointer', padding: '2px 4px' }}>
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Advice Modal */}
      {showAdviceModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: 'white', borderRadius: 16, maxWidth: 500, width: '90%', padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>Ask Extension Officer</h2>
              <button onClick={() => setShowAdviceModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Farm selection */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>Farm (optional)</label>
                <select value={adviceForm.farm_id} onChange={e => setAdviceForm({ ...adviceForm, farm_id: e.target.value })} style={{
                  width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none',
                  background: 'white', color: 'var(--text)', cursor: 'pointer'
                }}>
                  <option value="">Select a farm</option>
                  {farms.map(f => (
                    <option key={f.farm_id} value={f.farm_id}>{f.farm_name}</option>
                  ))}
                </select>
              </div>

              {/* Question */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>Your Question</label>
                <textarea value={adviceForm.question} onChange={e => setAdviceForm({ ...adviceForm, question: e.target.value })} placeholder="Ask your extension officer for advice about your farm or crops..." rows={4}
                  style={{
                    width: '100%', padding: '12px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none',
                    fontFamily: 'inherit', resize: 'vertical', background: 'white', color: 'var(--text)'
                  }} />
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setShowAdviceModal(false)} style={{
                  flex: 1, padding: '10px', borderRadius: 8, border: '1.5px solid var(--border)', background: 'white',
                  color: 'var(--text)', fontWeight: 600, fontSize: 13, cursor: 'pointer'
                }}>Cancel</button>
                <button onClick={handleSubmitAdvice} disabled={submittingAdvice} style={{
                  flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: submittingAdvice ? 'var(--border)' : 'var(--primary)',
                  color: 'white', fontWeight: 600, fontSize: 13, cursor: submittingAdvice ? 'not-allowed' : 'pointer'
                }}>{submittingAdvice ? 'Submitting...' : 'Submit'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
