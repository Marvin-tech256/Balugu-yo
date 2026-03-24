import React, { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Leaf } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import api from '../api'

export default function Login() {
    const [phone, setPhone] = useState('')
    const [pin, setPin] = useState(['', '', '', ''])
    const [loading, setLoading] = useState(false)
    const pinRefs = [useRef(), useRef(), useRef(), useRef()]
    const { saveAuth } = useAuth()
    const showToast = useToast()
    const navigate = useNavigate()

    const handlePinChange = (i, val) => {
        const next = [...pin]; next[i] = val; setPin(next)
        if (val && i < 3) pinRefs[i + 1].current?.focus()
    }

    const handlePinKey = (i, e) => {
        if (e.key === 'Backspace' && !pin[i] && i > 0) pinRefs[i - 1].current?.focus()
    }

    const handleLogin = async () => {
        const pinStr = pin.join('')
        if (!phone || pinStr.length < 4) {
            showToast('Enter phone number and 4-digit PIN', 'error'); return
        }
        setLoading(true)
        try {
            const data = await api.post('/auth/login', { phone: '+256' + phone, pin: pinStr })
            if (data.success) {
                saveAuth(data.token, data.user)
                showToast('Welcome back!')
                if (data.user.role === 'admin') navigate('/admin')
                else if (data.user.role === 'extension_officer') navigate('/ext-dashboard')
                else navigate('/dashboard')
            } else {
                showToast(data.message || 'Login failed', 'error')
            }
        } catch (err) {
            showToast(err?.message || 'Connection error', 'error')
        }
        setLoading(false)
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: 'linear-gradient(160deg, #1B5E20, #2E7D32)', padding: '48px 24px 64px', textAlign: 'center' }}>
                <Leaf size={48} color="white" style={{ marginBottom: 12 }} />
                <h1 style={{ fontFamily: 'Poppins', fontSize: 28, color: 'white', marginBottom: 6 }}>Welcome Back</h1>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>Login to your Balugu Yo account</p>
            </div>

            <div style={{
                background: 'white', borderRadius: '24px 24px 0 0', marginTop: -24,
                padding: '32px 24px', flex: 1, maxWidth: 480, width: '100%',
                margin: '-24px auto 0', boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
            }}>
                <h2 style={{ fontFamily: 'Poppins', fontSize: 22, marginBottom: 6 }}>Login</h2>
                <p style={{ color: 'var(--text-gray)', fontSize: 14, marginBottom: 28 }}>Enter your phone number and PIN to continue</p>

                <div style={{ marginBottom: 18 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-gray)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Phone Number</label>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                        <span style={{ background: 'var(--bg)', padding: '13px 12px', fontWeight: 600, borderRight: '1.5px solid var(--border)', fontSize: 14, whiteSpace: 'nowrap' }}>🇺🇬 +256</span>
                        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="700 000 000" maxLength={9}
                            style={{ border: 'none', outline: 'none', padding: '13px 16px', fontSize: 15, flex: 1, fontFamily: 'Inter' }} />
                    </div>
                </div>

                <div style={{ marginBottom: 8 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-gray)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Your PIN</label>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                        {pin.map((v, i) => (
                            <input key={i} ref={pinRefs[i]} type="password" maxLength={1} value={v}
                                onChange={e => handlePinChange(i, e.target.value)}
                                onKeyDown={e => handlePinKey(i, e)}
                                style={{ width: 56, height: 56, border: '2px solid var(--border)', borderRadius: 12, textAlign: 'center', fontSize: 24, fontWeight: 700, color: 'var(--primary)', outline: 'none' }} />
                        ))}
                    </div>
                </div>

                <div style={{ textAlign: 'right', marginBottom: 24 }}>
                    <span style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Forgot PIN?</span>
                </div>

                <button onClick={handleLogin} disabled={loading} style={{
                    width: '100%', padding: '13px 24px', background: 'var(--primary)', color: 'white',
                    border: 'none', borderRadius: 'var(--radius)', fontFamily: 'Poppins',
                    fontWeight: 600, fontSize: 15, cursor: 'pointer',
                }}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text-gray)', fontSize: 14 }}>
                    New farmer? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Create account</Link>
                </p>
            </div>
        </div>
    )
}
