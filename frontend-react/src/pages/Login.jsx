import React, { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowRight, Phone } from 'lucide-react'
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
        if (!phone || pinStr.length < 4) { showToast('Enter phone and 4-digit PIN', 'error'); return }
        setLoading(true)
        try {
            const data = await api.post('/auth/login', { phone: '+256' + phone, pin: pinStr })
            if (data.success) {
                saveAuth(data.token, data.user)
                showToast('Welcome back!')
                if (data.user.role === 'admin') navigate('/admin')
                else if (data.user.role === 'extension_officer') navigate('/ext-dashboard')
                else navigate('/dashboard')
            } else showToast(data.message || 'Login failed', 'error')
        } catch (err) { showToast(err?.message || 'Connection error', 'error') }
        setLoading(false)
    }

    return (
        <div style={{
            minHeight: '100vh', display: 'flex',
            background: 'linear-gradient(135deg, #052e16 0%, #14532d 40%, #065f46 70%, #0f3460 100%)',
            position: 'relative', overflow: 'hidden',
        }}>
            {/* Background blobs */}
            <div style={{ position: 'absolute', top: -100, right: -100, width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(22,163,74,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -60, left: -60, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,148,136,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '24px 16px' }}>
                <div style={{ width: '100%', maxWidth: 400 }}>

                    {/* Brand */}
                    <div style={{ textAlign: 'center', marginBottom: 28 }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #16a34a, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: 18 }}>🌿</span>
                            </div>
                            <span style={{ fontFamily: 'Poppins', fontSize: 22, fontWeight: 700, color: 'white' }}>Balugu Yo</span>
                        </div>
                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Yam harvest prediction platform</p>
                    </div>

                    {/* Glass card */}
                    <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20, padding: '28px 24px' }}>
                        <h2 style={{ fontFamily: 'Poppins', fontSize: 20, fontWeight: 600, color: 'white', marginBottom: 4 }}>Welcome back</h2>
                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>Sign in to your account</p>

                        {/* Phone */}
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 }}>Phone Number</label>
                            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, overflow: 'hidden', transition: 'border-color 0.15s' }}
                                onFocusCapture={e => e.currentTarget.style.borderColor = 'rgba(22,163,74,0.6)'}
                                onBlurCapture={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 12px', borderRight: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap' }}>
                                    <Phone size={13} /> +256
                                </div>
                                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="700 000 000" maxLength={9}
                                    onKeyDown={e => e.key === 'Enter' && pinRefs[0].current?.focus()}
                                    style={{ border: 'none', outline: 'none', padding: '10px 12px', fontSize: 14, flex: 1, background: 'transparent', color: 'white' }} />
                            </div>
                        </div>

                        {/* PIN */}
                        <div style={{ marginBottom: 24 }}>
                            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10 }}>4-Digit PIN</label>
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                                {pin.map((v, i) => (
                                    <input key={i} ref={pinRefs[i]} type="password" maxLength={1} value={v}
                                        onChange={e => handlePinChange(i, e.target.value)}
                                        onKeyDown={e => handlePinKey(i, e)}
                                        style={{ width: 52, height: 52, background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: 10, textAlign: 'center', fontSize: 22, fontWeight: 700, color: 'white', outline: 'none', transition: 'border-color 0.15s, background 0.15s' }}
                                        onFocus={e => { e.target.style.borderColor = '#16a34a'; e.target.style.background = 'rgba(22,163,74,0.15)' }}
                                        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.background = 'rgba(255,255,255,0.08)' }}
                                    />
                                ))}
                            </div>
                        </div>

                        <button onClick={handleLogin} disabled={loading} style={{
                            width: '100%', padding: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            background: loading ? 'rgba(22,163,74,0.5)' : 'linear-gradient(135deg, #16a34a, #0d9488)',
                            color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                            boxShadow: '0 4px 16px rgba(22,163,74,0.3)', transition: 'opacity 0.15s',
                        }}>
                            {loading ? <><span className="spinner" /> Signing in...</> : <>Sign In <ArrowRight size={15} /></>}
                        </button>

                        <p style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                            New farmer?{' '}
                            <Link to="/register" style={{ color: '#6ee7b7', fontWeight: 600 }}>Create account</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
