import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wheat, Sprout, Bell, Plus, CloudRain } from 'lucide-react'
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
        api.get('/farms/my'),
        api.get('/predictions/my-predictions'),
        api.get('/alerts/unread'),
      ])
      if (farmsData.success) {
        setStats(s => ({ ...s, farms: farmsData.count }))
        setFarms(farmsData.farms || [])
      }
      if (predData.success) {
        setStats(s => ({ ...s, plantings: predData.count }))
        const preds = predData.predictions || []
        const upcoming = preds.filter(p => p.days_remaining > 0).sort((a, b) => a.days_remaining - b.days_remaining)[0] || preds[0]
        setPrediction(upcoming || null)
      }
      if (alertData.success) {
        setStats(s => ({ ...s, alerts: alertData.count }))
        setNotifCount(alertData.count)
        setRecentAlerts((alertData.notifications || []).slice(0, 3))
      }
    } catch (err) {
      console.error('Dashboard load error:', err)
    }
  }

  const dotColor = { harvest: 'var(--primary)', weather: 'var(--accent)', warning: 'var(--amber)', system: 'var(--text-gray)' }

  return (
    <Layout notifCount={notifCount}>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '20px 16px 80px' }}>
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'Poppins', fontSize: 20 }}>{greet}!</h2>
          <p style={{ fontSize: 13, color: 'var(--text-gray)', marginTop: 2 }}>Welcome back, {firstName}</p>
        </div>

        {prediction ? (
          <div style={{ background: 'linear-gradient(135deg,#1B5E20,#2E7D32,#00897B)', borderRadius: 20, padding: 24, color: 'white', marginBottom: 20 }}>
            <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: 'rgba(255,255,255,0.75)', marginBottom: 6 }}>Your Next Harvest</div>
            <div style={{ fontFamily: 'Poppins', fontSize: 52, fontWeight: 700, lineHeight: 1, marginBottom: 4 }}>
              {prediction.days_remaining > 0 ? prediction.days_remaining + ' Days' : 'Ready!'}
            </div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', marginBottom: 16 }}>
              {prediction.farm_name} — {prediction.yam_variety}
            </div>
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 20, height: 8, marginBottom: 6 }}>
              <div style={{ background: '#A5D6A7', borderRadius: 20, height: 8, width: Math.min(Math.round(((270 - prediction.days_remaining) / 270) * 100), 100) + '%' }} />
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Planted</span><span>{prediction.confidence_percent}% confidence</span><span>Harvest</span>
            </div>
          </div>
        ) : (
          <div style={{ background: 'linear-gradient(135deg,#E8F5E9,#E0F2F1)', borderRadius: 20, padding: '32px 24px', textAlign: 'center', marginBottom: 20, border: '2px dashed var(--primary)' }}>
            <Sprout size={48} color="var(--primary)" style={{ marginBottom: 12 }} />
            <h3 style={{ color: 'var(--primary)', marginBottom: 8 }}>No Active Planting</h3>
            <p style={{ color: 'var(--text-gray)', fontSize: 13, marginBottom: 16 }}>Add your first yam planting to get your harvest prediction!</p>
            <button onClick={() => navigate('/add-planting')} style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius)', padding: '12px 24px', fontFamily: 'Poppins', fontWeight: 600, cursor: 'pointer' }}>
              Add Planting
            </button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
          {[{ icon: Wheat, value: stats.farms, label: 'My Farms' }, { icon: Sprout, value: stats.plantings, label: 'Plantings' }, { icon: Bell, value: stats.alerts, label: 'Alerts' }].map(({ icon: Icon, value, label }) => (
            <div key={label} style={{ background: 'white', borderRadius: 'var(--radius)', padding: '14px 10px', textAlign: 'center', boxShadow: 'var(--shadow)' }}>
              <Icon size={22} color="var(--primary)" style={{ marginBottom: 4 }} />
              <div style={{ fontFamily: 'Poppins', fontSize: 18, fontWeight: 700, color: 'var(--primary)' }}>{value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-gray)', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontSize: 16 }}>My Farms</h3>
          <span onClick={() => navigate('/my-farms')} style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500, cursor: 'pointer' }}>View all</span>
        </div>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8, marginBottom: 20, scrollbarWidth: 'none' }}>
          {farms.map(f => (
            <div key={f.farm_id} style={{ minWidth: 180, background: 'white', borderRadius: 'var(--radius)', padding: 16, boxShadow: 'var(--shadow)', flexShrink: 0 }}>
              <Wheat size={28} color="var(--primary)" style={{ marginBottom: 8 }} />
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{f.farm_name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-gray)', marginBottom: 10 }}>{f.district}</div>
              {f.days_remaining ? <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>{f.days_remaining} days to harvest</div> : <span style={{ fontSize: 12, background: '#E8F5E9', color: 'var(--primary)', padding: '2px 10px', borderRadius: 20 }}>Growing</span>}
            </div>
          ))}
          <div onClick={() => navigate('/add-planting')} style={{ minWidth: 140, background: '#E8F5E9', border: '2px dashed var(--primary)', borderRadius: 'var(--radius)', padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, gap: 8, color: 'var(--primary)', fontWeight: 600, fontSize: 13 }}>
            <Plus size={28} />Add New Farm
          </div>
        </div>

        <h3 style={{ fontSize: 16, marginBottom: 12 }}>Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12, marginBottom: 20 }}>
          {[{ icon: Sprout, title: 'Add Planting', sub: 'Record new yam planting', to: '/add-planting' }, { icon: CloudRain, title: 'Weather', sub: 'Check conditions', to: '/weather' }, { icon: Wheat, title: 'My Farms', sub: 'View all farms', to: '/my-farms' }, { icon: Bell, title: 'Alerts', sub: 'View notifications', to: '/alerts' }].map(({ icon: Icon, title, sub, to }) => (
            <button key={to} onClick={() => navigate(to)} style={{ background: 'white', borderRadius: 'var(--radius)', padding: '18px 14px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: 'var(--shadow)', cursor: 'pointer', border: 'none', textAlign: 'left' }}>
              <Icon size={28} color="var(--primary)" />
              <div>
                <div style={{ fontFamily: 'Poppins', fontSize: 13, fontWeight: 600 }}>{title}</div>
                <div style={{ fontSize: 11, color: 'var(--text-gray)', marginTop: 2 }}>{sub}</div>
              </div>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontSize: 16 }}>Recent Alerts</h3>
          <span onClick={() => navigate('/alerts')} style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500, cursor: 'pointer' }}>View all</span>
        </div>
        {recentAlerts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 20px', color: 'var(--text-gray)' }}>
            <Bell size={40} color="var(--border)" style={{ marginBottom: 12 }} />
            <p>No alerts yet</p>
          </div>
        ) : recentAlerts.map(a => (
          <div key={a.notif_id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 14, background: 'white', borderRadius: 'var(--radius)', marginBottom: 10, boxShadow: 'var(--shadow)' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: dotColor[a.type] || 'var(--text-gray)', marginTop: 4, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{a.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-gray)', lineHeight: 1.5 }}>{a.message}</div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}
