import React, { useEffect, useState } from 'react'
import { Wheat, Users, Bell, MapPin, Layers, TrendingUp, FileText, ChevronDown, ChevronUp, Search } from 'lucide-react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import api from '../api'

const fmtDate = d => d ? new Date(d).toLocaleDateString('en-UG', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

export default function ExtDashboard() {
  const { user } = useAuth()
  const showToast = useToast()
  const [farms, setFarms] = useState([])
  const [search, setSearch] = useState('')
  const [expandedFarm, setExpandedFarm] = useState(null)
  const [notes, setNotes] = useState({})
  const [savingNote, setSavingNote] = useState(null)

  useEffect(() => {
    api.get('/farms/all')
      .then(d => { if (d.success) setFarms(d.farms || []) })
      .catch(() => {
        api.get('/farms/my').then(d => { if (d.success) setFarms(d.farms || []) }).catch(() => { })
      })
  }, [])

  const firstName = user?.full_name?.split(' ')[0] || 'Officer'
  const harvestSoon = farms.filter(f => f.days_remaining && f.days_remaining <= 30 && f.days_remaining > 0).length
  const uniqueFarmers = new Set(farms.map(f => f.user_id)).size

  const filtered = farms.filter(f =>
    !search ||
    f.farm_name?.toLowerCase().includes(search.toLowerCase()) ||
    f.district?.toLowerCase().includes(search.toLowerCase()) ||
    f.farmer_name?.toLowerCase().includes(search.toLowerCase())
  )

  async function saveNote(farmId) {
    const note = notes[farmId]
    if (!note?.trim()) return
    setSavingNote(farmId)
    await new Promise(r => setTimeout(r, 400))
    showToast('Advisory note saved')
    setSavingNote(null)
  }

  return (
    <Layout>
      <div style={{ padding: '20px 24px', maxWidth: 960, margin: '0 auto' }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)' }}>Extension Dashboard</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Welcome back, {firstName} — monitoring your region</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { icon: Wheat, label: 'Total Farms', value: farms.length, color: 'var(--primary)', bg: 'var(--primary-bg)' },
            { icon: Users, label: 'Farmers', value: uniqueFarmers, color: 'var(--teal)', bg: 'var(--teal-light)' },
            { icon: TrendingUp, label: 'Harvest Soon', value: harvestSoon, color: 'var(--gold)', bg: 'var(--gold-light)' },
            { icon: Bell, label: 'Urgent Alerts', value: farms.filter(f => f.days_remaining > 0 && f.days_remaining <= 14).length, color: '#7c3aed', bg: '#ede9fe' },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 9, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={17} color={color} />
              </div>
              <div>
                <div style={{ fontFamily: 'Poppins', fontSize: 22, fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search farms, districts, farmers..."
            className="form-input" style={{ paddingLeft: 36 }} />
        </div>

        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>
          Monitored Farms
          <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-muted)', marginLeft: 8 }}>{filtered.length} farms</span>
        </div>

        {filtered.length === 0 ? (
          <div className="card empty-state">
            <Wheat size={32} color="var(--border)" style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>No farms found</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map(f => {
              const soon = f.days_remaining && f.days_remaining <= 30 && f.days_remaining > 0
              const urgent = f.days_remaining && f.days_remaining <= 14 && f.days_remaining > 0
              const isExpanded = expandedFarm === f.farm_id
              return (
                <div key={f.farm_id} className="card" style={{ overflow: 'hidden', borderLeft: `3px solid ${urgent ? 'var(--danger)' : soon ? 'var(--gold)' : 'var(--primary)'}` }}>
                  <div onClick={() => setExpandedFarm(isExpanded ? null : f.farm_id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: soon ? 'var(--gold-light)' : 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Wheat size={16} color={soon ? 'var(--gold-dark)' : 'var(--primary)'} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{f.farm_name}</div>
                      <div style={{ display: 'flex', gap: 10, fontSize: 11, color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><MapPin size={10} /> {f.district}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Layers size={10} /> {f.size_acres} acres</span>
                        {f.farmer_name && <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Users size={10} /> {f.farmer_name}</span>}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      {f.days_remaining > 0 ? (
                        <>
                          <div style={{ fontSize: 13, fontWeight: 700, color: urgent ? 'var(--danger)' : soon ? 'var(--gold-dark)' : 'var(--primary-mid)' }}>{f.days_remaining}d</div>
                          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{fmtDate(f.predicted_harvest_date)}</div>
                        </>
                      ) : <span className="badge badge-green">Growing</span>}
                    </div>
                    {isExpanded ? <ChevronUp size={14} color="var(--text-muted)" /> : <ChevronDown size={14} color="var(--text-muted)" />}
                  </div>

                  {isExpanded && (
                    <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', background: 'var(--surface-2)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                        <FileText size={13} color="var(--teal)" />
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)' }}>Advisory Note</span>
                      </div>
                      <textarea
                        value={notes[f.farm_id] || ''}
                        onChange={e => setNotes(n => ({ ...n, [f.farm_id]: e.target.value }))}
                        placeholder="Add advisory notes for this farm..."
                        rows={2}
                        className="form-input"
                        style={{ resize: 'vertical', fontSize: 12, marginBottom: 8 }}
                      />
                      <button onClick={() => saveNote(f.farm_id)} disabled={savingNote === f.farm_id}
                        className="btn btn-primary" style={{ fontSize: 12, padding: '6px 14px' }}>
                        {savingNote === f.farm_id ? <><span className="spinner" /> Saving...</> : 'Save Note'}
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Layout>
  )
}
