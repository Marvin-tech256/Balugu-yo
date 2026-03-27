<<<<<<< HEAD
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Leaf } from 'lucide-react'
=======
import React, { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowRight, Phone, Sprout, CheckCircle } from 'lucide-react'
>>>>>>> main
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import api from '../api'

export default function Login() {
    const [phone, setPhone] = useState('')
    const [pin, setPin] = useState(['', '', '', ''])
    const [loading, setLoading] = useState(false)
<<<<<<< HEAD
    const { saveAuth } = useAuth()
    const navigate = useNavigate()
    const showToast = useToast()

    const handlePin = (val, i) => {
        const next = [...pin]; next[i] = val; setPin(next)
        if (val && i < 3) document.getElementById(`lp-${i + 1}`)?.focus()
    }

    const handleSubmit = async () => {
        if (!phone || pin.join('').length < 4) { showToast('Enter phone and PIN', 'error'); return }
        setLoading(true)
        try {
            const data = await api.post('/auth/login', { phone: '+256' + phone, pin: pin.join('') })
=======
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
>>>>>>> main
            if (data.success) {
                saveAuth(data.token, data.user)
                showToast('Welcome back!')
                if (data.user.role === 'admin') navigate('/admin')
                else if (data.user.role === 'extension_officer') navigate('/ext-dashboard')
                else navigate('/dashboard')
            } else showToast(data.message || 'Login failed', 'error')
<<<<<<< HEAD
        } catch (e) { showToast(e?.message || 'Connection error', 'error') }
=======
        } catch (err) { showToast(err?.message || 'Connection error', 'error') }
>>>>>>> main
        setLoading(false)
    }

    return (
<<<<<<< HEAD
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
            <div style={{ background: 'linear-gradient(160deg,#1B5E20,#2E7D32)', padding: '48px 24px 64px', textAlign: 'center' }}>
                <Leaf size={48} color="white" style={{ marginBottom: 12 }} />
                <h1 style={{ fontSize: 28, color: 'white', marginBottom: 6 }}>Welcome Back</h1>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>Login to your Balugu Yo account</p>
            </div>

            <div style={{ background: 'white', borderRadius: '24px 24px 0 0', marginTop: -24, padding: '32px 24px', flex: 1, maxWidth: 480, width: '100%', margin: '-24px auto 0', boxShadow: '0 -4px 20px rgba(0,0,0,0.08)' }}>
                <h2 style={{ fontSize: 22, marginBottom: 6 }}>Login</h2>
                <p style={{ color: 'var(--text-gray)', fontSize: 14, marginBottom: 28 }}>Enter your phone number and PIN</p>

                <div style={{ marginBottom: 18 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-gray)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Phone Number</label>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                        <span style={{ background: 'var(--bg)', padding: '13px 12px', fontWeight: 600, fontSize: 14, borderRight: '1.5px solid var(--border)' }}>+256</span>
                        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="700 000 000" maxLength={9}
                            style={{ border: 'none', outline: 'none', padding: '13px 16px', fontSize: 15, flex: 1 }} />
                    </div>
                </div>

                <div style={{ marginBottom: 8 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-gray)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Your PIN</label>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                        {pin.map((v, i) => (
                            <input key={i} id={`lp-${i}`} type="password" maxLength={1} value={v}
                                onChange={e => handlePin(e.target.value, i)}
                                onKeyDown={e => { if (e.key === 'Backspace' && !v && i > 0) document.getElementById(`lp-${i - 1}`)?.focus() }}
                                style={{ width: 56, height: 56, border: '2px solid var(--border)', borderRadius: 12, textAlign: 'center', fontSize: 24, fontWeight: 700, color: 'var(--primary)', outline: 'none' }} />
                        ))}
                    </div>
                </div>

                <div style={{ textAlign: 'right', marginBottom: 24 }}>
                    <a href="#" style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 500 }}>Forgot PIN?</a>
                </div>

                <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '13px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'Poppins', fontWeight: 600, fontSize: 15, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text-gray)', fontSize: 14 }}>
                    New farmer? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Create account</Link>
                </p>
=======
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

                {/* Floating orbs */}
                <div style={{ position: 'absolute', top: '20%', left: '10%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(22,163,74,0.15) 0%, transparent 70%)', animation: 'floatSlow 7s ease-in-out infinite', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,148,136,0.12) 0%, transparent 70%)', animation: 'floatSlow 9s ease-in-out infinite reverse', pointerEvents: 'none' }} />

                <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '48px 40px' }}>
                    {/* Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #16a34a, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Sprout size={20} color="white" />
                        </div>
                        <span style={{ fontFamily: 'Poppins', fontSize: 22, fontWeight: 700, color: 'white' }}>
                            Balugu <span style={{ color: '#6ee7b7' }}>Yo</span>
                        </span>
                    </div>

                    <h2 style={{ fontFamily: 'Poppins', fontSize: 32, fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: 16 }}>
                        Predict your<br />
                        <span className="hero-gradient-text">harvest date</span><br />
                        with confidence
                    </h2>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, marginBottom: 40, maxWidth: 320 }}>
                        Join thousands of Ugandan yam farmers using data-driven predictions to plan better harvests.
                    </p>

                    {/* Feature bullets */}
                    {[
                        'Harvest date predictions with 98% accuracy',
                        'Real-time weather data for your district',
                        'SMS alerts 2 weeks before harvest',
                    ].map(text => (
                        <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                            <CheckCircle size={15} color="#6ee7b7" style={{ flexShrink: 0 }} />
                            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>{text}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right form panel */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '40px 24px' }}>
                <div style={{ width: '100%', maxWidth: 380 }} className="anim-scale-in">

                    {/* Mobile logo (hidden on desktop via auth-split-visual display:none) */}
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
                            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="700 000 000" maxLength={9}
                                onKeyDown={e => e.key === 'Enter' && pinRefs[0].current?.focus()}
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
>>>>>>> main
            </div>
        </div>
    )
}
