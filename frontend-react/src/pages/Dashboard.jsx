import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wheat, Sprout, Bell, Plus, CloudRain, ArrowRight, TrendingUp, MapPin } from 'lucide-react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import api from '../api'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ farms: 0, plantings: 0, alerts: 0 })
  const [farms, setFarms] = useState([])
  const [recentAlerts, setRecentAlerts] = useState([])
  const [prediction, setPrediction] = useState(null)
  const [notifCount, setNotifCount] = useState(0)

  const hour = new Date().getHours()
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = user?.full_name?.split(' ')[0] || 'Farmer'

  useEffect(() => { loadDashboard() }, [])

  async function loadDashboard() {
    try {
      const [farmsData, predData, alertData] = await Promise.all([
        api.get('/farms/my'), api.get('/predictions/my-predictions'), api.get('/alerts/unread'),
      ])
      if (farmsData.success) { setStats(s => ({ ...s, farms: farmsData.count })); setFarms(farmsData.farms || []) }
      if (predData.success) {
        setStats(s => ({ ...s, plantings: predData.count }))
        const preds = predData.predictions || []
        setPrediction(preds.filter(p => p.days_remaining > 0).sort((a, b) => a.days_remaining - b.days_remaining)[0] || preds[0] || null)
      }
      if (alertData.success) {
        setStats(s => ({ ...s, alerts: alertData.count }))
        setNotifCount(alertData.count)
        setRecentAlerts((alertData.notifications || []).slice(0, 3))
      }
    } catch (err) { console.error(err) }
  }

  const alertDot = { harvest: 'var(--primary)', weather: 'var(--teal)', warning: 'var(--gold)', system: 'var(--text-muted)' }

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
          {/* Hero prediction — spans 2 cols on wide */}
          <div style={{ gridColumn: 'span 2' }}>
            {prediction ? (
              <div style={{ background: 'linear-gradient(135deg, #052e16 0%, #14532d 50%, #065f46 100%)', borderRadius: 16, padding: '20px 24px', color: 'white', height: '100%', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', right: -20, top: -20, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
                <div style={{ position: 'absolute', right: 20, bottom: -30, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
                <div style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                    <TrendingUp size={14} color="#6ee7b7" />
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: 0.5 }}>Next Harvest</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontFamily: 'Poppins', fontSize: 42, fontWeight: 700, lineHeight: 1 }}>
                      {prediction.days_remaining > 0 ? prediction.days_remaining : '0'}
                    </span>
                    <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', paddingBottom: 6 }}>days away</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14, fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                    <MapPin size={12} />
                    {prediction.farm_name} · {prediction.yam_variety}
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 20, height: 6, marginBottom: 6 }}>
                    <div style={{ background: 'linear-gradient(90deg, #6ee7b7, #34d399)', borderRadius: 20, height: 6, width: Math.min(Math.round(((270 - prediction.days_remaining) / 270) * 100), 100) + '%', transition: 'width 1s ease' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>
                    <span>Planted</span>
                    <span style={{ color: '#fbbf24', fontWeight: 600 }}>{prediction.confidence_percent}% confidence</span>
                    <span>Harvest</span>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ background: 'var(--surface)', border: '1.5px dashed var(--border)', borderRadius: 16, padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', height: '100%', minHeight: 140 }}>
                <Sprout size={32} color="var(--primary)" style={{ marginBottom: 10, opacity: 0.7 }} />
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-2)', marginBottom: 4 }}>No active planting</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>Add a planting to see your harvest prediction</div>
                <button onClick={() => navigate('/add-planting')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--primary-bg)', color: 'var(--primary-mid)', border: '1px solid var(--primary-light)', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  <Plus size={13} /> Add Planting
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
              ) : farms.slice(0, 3).map(f => (
                <div key={f.farm_id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
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
                <span style={{ fontSize: 12, fontWeight: 600 }}>Add new farm</span>
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
                  { icon: Sprout, label: 'Add Planting', to: '/add-planting', color: 'var(--primary)', bg: 'var(--primary-bg)' },
                  { icon: CloudRain, label: 'Weather', to: '/weather', color: 'var(--teal)', bg: 'var(--teal-light)' },
                  { icon: Wheat, label: 'My Farms', to: '/my-farms', color: 'var(--gold-dark)', bg: 'var(--gold-light)' },
                  { icon: Bell, label: 'Alerts', to: '/alerts', color: '#7c3aed', bg: '#ede9fe' },
                ].map(({ icon: Icon, label, to, color, bg }) => (
                  <button key={to} onClick={() => navigate(to)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '14px 8px', background: 'var(--surface)', border: 'none', cursor: 'pointer', transition: 'background 0.15s' }}
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
      </div>
    </Layout>
  )
}
