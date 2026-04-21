import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, LogOut, Key, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from './Toast'
import api from '../api'

export default function Navbar({ notifCount = 0, sidebarW = 'var(--sidebar-w)' }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const showToast = useToast()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [pinOpen, setPinOpen] = useState(false)
  const [oldPin, setOldPin] = useState(['', '', '', ''])
  const [newPin, setNewPin] = useState(['', '', '', ''])

  const handleLogout = () => {
    logout(); showToast('Logged out'); navigate('/login')
  }

  const handleChangePin = async () => {
    const op = oldPin.join(''), np = newPin.join('')
    if (op.length < 4 || np.length < 4) { showToast('Enter both PINs', 'error'); return }
    try {
      const data = await api.post('/auth/change-pin', { old_pin: op, new_pin: np })
      if (data.success) {
        showToast('PIN updated'); setPinOpen(false)
        setOldPin(['', '', '', '']); setNewPin(['', '', '', ''])
      } else showToast(data.message || 'Failed', 'error')
    } catch { showToast('Failed to update PIN', 'error') }
  }

  const PinRow = ({ value, onChange, prefix }) => (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 14 }}>
      {value.map((v, i) => (
        <input key={i} id={`${prefix}-${i}`} type="password" maxLength={1} value={v}
          style={{ width: 42, height: 42, border: '1.5px solid var(--border)', borderRadius: 8, textAlign: 'center', fontSize: 18, fontWeight: 700, color: 'var(--primary)', outline: 'none', transition: 'border-color 0.15s' }}
          onFocus={e => e.target.style.borderColor = 'var(--primary)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
          onChange={e => {
            const next = [...value]; next[i] = e.target.value; onChange(next)
            if (e.target.value && i < 3) document.getElementById(`${prefix}-${i + 1}`)?.focus()
          }}
          onKeyDown={e => { if (e.key === 'Backspace' && !v && i > 0) document.getElementById(`${prefix}-${i - 1}`)?.focus() }}
        />
      ))}
    </div>
  )

  const roleLabel = user?.role === 'admin' ? 'Admin' : user?.role === 'extension_officer' ? 'Extension Officer' : 'Farmer'
  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <>
      <nav style={{
        background: 'white', borderBottom: '1px solid var(--border)',
        height: 'var(--navbar-h)', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 20px',
        position: 'sticky', top: 0, zIndex: 98, boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ fontFamily: 'Poppins', fontSize: 15, fontWeight: 600, color: 'var(--text-2)' }}>
          {/* breadcrumb or title can go here */}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Notifications */}
          <button onClick={() => navigate('/alerts')} style={{ position: 'relative', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <Bell size={17} />
            {notifCount > 0 && (
              <span style={{ position: 'absolute', top: -3, right: -3, background: 'var(--gold)', color: 'white', borderRadius: '50%', width: 16, height: 16, fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>
                {notifCount > 9 ? '9+' : notifCount}
              </span>
            )}
          </button>

          {/* Avatar */}
          <button onClick={() => setSheetOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '5px 10px 5px 5px', cursor: 'pointer' }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'linear-gradient(135deg, var(--primary), var(--teal))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
              {initials}
            </div>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-2)', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.full_name?.split(' ')[0]}
            </span>
            <ChevronDown size={13} color="var(--text-muted)" />
          </button>
        </div>
      </nav>

      {/* Profile sheet */}
      {sheetOpen && (
        <div onClick={e => e.target === e.currentTarget && setSheetOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 300, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
          <div style={{ background: 'white', borderRadius: '20px 20px 0 0', padding: '20px 20px 32px', width: '100%', maxWidth: 420, animation: 'slideUp 0.22s ease' }}>
            <div style={{ width: 36, height: 3, background: 'var(--border)', borderRadius: 2, margin: '0 auto 18px' }} />

            {/* User info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, var(--primary), var(--teal))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700 }}>
                {initials}
              </div>
              <div>
                <div style={{ fontFamily: 'Poppins', fontSize: 15, fontWeight: 600 }}>{user?.full_name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{user?.phone}</div>
                <span style={{ display: 'inline-block', marginTop: 4, padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600, background: 'var(--primary-bg)', color: 'var(--primary-mid)' }}>{roleLabel}</span>
              </div>
            </div>

            {/* Change PIN */}
            <div onClick={() => setPinOpen(p => !p)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 8px', borderRadius: 8, cursor: 'pointer', marginBottom: 2, transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Key size={15} color="var(--primary)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>Change PIN</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Update your 4-digit PIN</div>
              </div>
              <ChevronDown size={14} color="var(--text-muted)" style={{ transform: pinOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>

            {pinOpen && (
              <div style={{ background: 'var(--surface-2)', borderRadius: 10, padding: '14px 12px', marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Current PIN</div>
                <PinRow value={oldPin} onChange={setOldPin} prefix="op" />
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>New PIN</div>
                <PinRow value={newPin} onChange={setNewPin} prefix="np" />
                <button onClick={handleChangePin} style={{ width: '100%', padding: '9px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                  Update PIN
                </button>
              </div>
            )}

            {/* Logout */}
            <div onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 8px', borderRadius: 8, cursor: 'pointer', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--danger-bg)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--danger-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LogOut size={15} color="var(--danger)" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--danger)' }}>Logout</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Sign out of your account</div>
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
    </>
  )
}
