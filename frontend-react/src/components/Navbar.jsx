import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, LogOut, Key } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from './Toast'
import api from '../api'

export default function Navbar({ notifCount = 0 }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const showToast = useToast()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [pinOpen, setPinOpen] = useState(false)
  const [oldPin, setOldPin] = useState(['', '', '', ''])
  const [newPin, setNewPin] = useState(['', '', '', ''])

  const handleLogout = () => {
    logout()
    showToast('Logged out successfully')
    navigate('/login')
  }

  const handleChangePin = async () => {
    const op = oldPin.join(''), np = newPin.join('')
    if (op.length < 4 || np.length < 4) { showToast('Enter both PINs', 'error'); return }
    try {
      const data = await api.post('/auth/change-pin', { old_pin: op, new_pin: np })
      if (data.success) {
        showToast('PIN updated')
        setPinOpen(false); setOldPin(['', '', '', '']); setNewPin(['', '', '', ''])
      } else showToast(data.message || 'Failed', 'error')
    } catch { showToast('Failed to update PIN', 'error') }
  }

  const PinInput = ({ value, onChange, idPrefix }) => (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 12 }}>
      {value.map((v, i) => (
        <input key={i} id={`${idPrefix}-${i}`} type="password" maxLength={1} value={v}
          style={{
            width: 44, height: 44, border: '2px solid var(--border)', borderRadius: 10,
            textAlign: 'center', fontSize: 20, fontWeight: 700, color: 'var(--primary)', outline: 'none'
          }}
          onChange={e => {
            const next = [...value]; next[i] = e.target.value; onChange(next)
            if (e.target.value && i < 3) document.getElementById(`${idPrefix}-${i + 1}`)?.focus()
          }}
          onKeyDown={e => {
            if (e.key === 'Backspace' && !v && i > 0) document.getElementById(`${idPrefix}-${i - 1}`)?.focus()
          }}
        />
      ))}
    </div>
  )

  const roleLabel = user?.role === 'admin' ? 'Admin'
    : user?.role === 'extension_officer' ? 'Extension Officer' : 'Farmer'

  return (
    <>
      <nav style={{
        background: 'var(--primary-dark)', color: 'white', padding: '0 20px',
        height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
      }}>
        <div style={{ fontFamily: 'Poppins', fontSize: 20, fontWeight: 700 }}>
          Balugu <span style={{ color: '#A5D6A7' }}>Yo</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => navigate('/alerts')}
            style={{ background: 'none', border: 'none', color: 'white', position: 'relative', padding: 4, cursor: 'pointer' }}>
            <Bell size={22} />
            {notifCount > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4, background: 'var(--amber)',
                color: 'white', borderRadius: '50%', width: 16, height: 16,
                fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>{notifCount}</span>
            )}
          </button>
          <button onClick={() => setSheetOpen(true)} style={{
            width: 36, height: 36, borderRadius: '50%', background: 'var(--accent)',
            color: 'white', border: 'none', fontWeight: 700, fontSize: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
          }}>
            {user?.full_name?.charAt(0).toUpperCase()}
          </button>
        </div>
      </nav>

      {sheetOpen && (
        <div onClick={e => e.target === e.currentTarget && setSheetOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
            zIndex: 300, display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
          }}>
          <div style={{
            background: 'white', borderRadius: '24px 24px 0 0',
            padding: '28px 24px 40px', width: '100%', maxWidth: 480, animation: 'slideUp 0.25s ease'
          }}>
            <div style={{ width: 40, height: 4, background: 'var(--border)', borderRadius: 2, margin: '0 auto 20px' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%', background: 'var(--accent)',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, fontWeight: 700
              }}>
                {user?.full_name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontFamily: 'Poppins', fontSize: 17, fontWeight: 600 }}>{user?.full_name}</div>
                <div style={{ fontSize: 13, color: 'var(--text-gray)', marginTop: 2 }}>{user?.phone}</div>
                <span style={{
                  display: 'inline-block', marginTop: 4, padding: '2px 10px',
                  borderRadius: 20, fontSize: 11, fontWeight: 600, background: '#E8F5E9', color: 'var(--primary)'
                }}>{roleLabel}</span>
              </div>
            </div>

            <div onClick={() => setPinOpen(p => !p)} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '14px 4px',
              borderBottom: '1px solid var(--border)', cursor: 'pointer'
            }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Key size={18} color="var(--primary)" />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>Change PIN</div>
                <div style={{ fontSize: 12, color: 'var(--text-gray)' }}>Update your 4-digit PIN</div>
              </div>
            </div>

            {pinOpen && (
              <div style={{ padding: '16px 0' }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-gray)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 8 }}>Current PIN</label>
                <PinInput value={oldPin} onChange={setOldPin} idPrefix="op" />
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-gray)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 8 }}>New PIN</label>
                <PinInput value={newPin} onChange={setNewPin} idPrefix="np" />
                <button onClick={handleChangePin} style={{
                  width: '100%', padding: 12, background: 'var(--primary)', color: 'white',
                  border: 'none', borderRadius: 'var(--radius)', fontFamily: 'Poppins', fontWeight: 600, fontSize: 14, cursor: 'pointer'
                }}>Update PIN</button>
              </div>
            )}

            <div onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 4px', cursor: 'pointer' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: '#FFEBEE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LogOut size={18} color="#C62828" />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#C62828' }}>Logout</div>
                <div style={{ fontSize: 12, color: 'var(--text-gray)' }}>Sign out of your account</div>
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
    </>
  )
}
