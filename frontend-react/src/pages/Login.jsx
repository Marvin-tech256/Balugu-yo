import React, { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowRight, Phone, Sprout, CheckCircle } from 'lucide-react'
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
        <div className="auth-split">
            {/* Left visual panel */}
            <div className="auth-split-visual" style={{ position: 'relative', overflow: 'hidden' }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'url(https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=900&q=80)',
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    filter: 'brightness(0.35) saturate(1.3)',
                }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(5,46,22,0.8) 0%, rgba(6,95,70,0.7) 50%, rgba(15,52,96,0.6) 100%)' }} />

                <div style={{ position: 'absolute', top: '20%', left: '10%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(22,163,74,0.15) 0%, transparent 70%)', animation: 'floatSlow 7s ease-in-out infinite', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,148,136,0.12) 0%, transparent 70%)', animation: 'floatSlow 9s ease-in-out infinite reverse', pointerEvents: 'none' }} />

                <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '48px 40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #16a34a, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Sprout size={20} color="white" />
                        </div>
                        <span style={{ fontFamily: 'Poppins', fontSize: 22, fontWeight: 700, color: 'white' }}>
                            Balugu <span style={{ color: '#6ee7b7' }}>Yo</span>
                        </span>
                    </div>

                    <h2 style={{ fontFamily: 'Poppins', fontSize: 32, fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: 16 }}>
                        Make informed decisions<br />
                        about your <span className="hero-gradient-text">yams</span>
                    </h2>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, marginBottom: 40, maxWidth: 320 }}>
                        Balugu Yo provides useful decisions from qualified extension officers in order for farmers to make data driven and informed decisions.
                    </p>
                </div>
            </div>

            {/* Right form panel */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '40px 24px' }}>
                <div style={{ width: '100%', maxWidth: 380 }} className="anim-scale-in">

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #16a34a, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Sprout size={18} color="white" />
                        </div>
                        <span style={{ fontFamily: 'Poppins', fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>
                            Balugu <span style={{ color: 'var(--primary)' }}>Yo</span>
                        </span>
                    </div>

                    <h2 style={{ fontFamily: 'Poppins', fontSize: 24, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>Welcome back</h2>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 28 }}>Sign in to your account</p>

                    {/* Phone */}
                    <div style={{ marginBottom: 20 }}>
                        <label className="form-label">Phone Number</label>
                        <div style={{ display: 'flex', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', transition: 'border-color 0.15s' }}
                            onFocusCapture={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                            onBlurCapture={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 12px', borderRight: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', background: 'var(--surface-2)' }}>
                                <Phone size={13} /> +256
                            </div>
                            <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 9))} placeholder="700 000 000" maxLength={9}
                                onKeyDown={e => e.key === 'Enter' && pinRefs[0].current?.focus()}
                                inputMode="numeric" pattern="[0-9]*" autoComplete="tel"
                                style={{ border: 'none', outline: 'none', padding: '10px 12px', fontSize: 14, flex: 1, background: 'white', color: 'var(--text)' }} />
                        </div>
                    </div>

                    {/* PIN */}
                    <div style={{ marginBottom: 28 }}>
                        <label className="form-label">4-Digit PIN</label>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                            {pin.map((v, i) => (
                                <input key={i} ref={pinRefs[i]} type="password" maxLength={1} value={v}
                                    onChange={e => handlePinChange(i, e.target.value)}
                                    onKeyDown={e => handlePinKey(i, e)}
                                    inputMode="numeric" pattern="[0-9]*"
                                    style={{ width: 56, height: 56, border: '1.5px solid var(--border)', borderRadius: 10, textAlign: 'center', fontSize: 22, fontWeight: 700, color: 'var(--primary)', outline: 'none', background: 'var(--surface)', transition: 'border-color 0.15s, box-shadow 0.15s' }}
                                    onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.12)' }}
                                    onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none' }}
                                />
                            ))}
                        </div>
                    </div>

                    <button onClick={handleLogin} disabled={loading} style={{
                        width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        background: loading ? 'var(--border)' : 'linear-gradient(135deg, #16a34a, #0d9488)',
                        color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        boxShadow: loading ? 'none' : '0 4px 16px rgba(22,163,74,0.3)',
                        transition: 'all 0.15s',
                    }}>
                        {loading ? <><span className="spinner" style={{ borderTopColor: 'var(--text-muted)', borderColor: 'var(--border-2)' }} /> Signing in...</> : <>Sign In <ArrowRight size={15} /></>}
                    </button>

                    <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
                        New farmer?{' '}
                        <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Create account</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
