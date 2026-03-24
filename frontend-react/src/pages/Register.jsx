import React, { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Sprout } from 'lucide-react'
import { useToast } from '../components/Toast'
import api from '../api'

const DISTRICTS = ['Buikwe', 'Bukunja', 'Mukono', 'Kampala', 'Jinja', 'Mbale', 'Masaka', 'Mbarara', 'Other']

export default function Register() {
    const [step, setStep] = useState(1)
    const [form, setForm] = useState({ full_name: '', phone: '', role: 'farmer', district: '', location: '' })
    const [pin, setPin] = useState(['', '', '', ''])
    const [confirmPin, setConfirmPin] = useState(['', '', '', ''])
    const [loading, setLoading] = useState(false)
    const pinRefs = [useRef(), useRef(), useRef(), useRef()]
    const cPinRefs = [useRef(), useRef(), useRef(), useRef()]
    const showToast = useToast()
    const navigate = useNavigate()

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

    const handlePinChange = (arr, setArr, refs, i, val) => {
        const next = [...arr]; next[i] = val; setArr(next)
        if (val && i < 3) refs[i + 1].current?.focus()
    }
    const handlePinKey = (arr, refs, i, e) => {
        if (e.key === 'Backspace' && !arr[i] && i > 0) refs[i - 1].current?.focus()
    }

    const goStep2 = () => {
        if (!form.full_name.trim()) { showToast('Enter your full name', 'error'); return }
        if (!form.phone || form.phone.length < 9) { showToast('Enter a valid phone number', 'error'); return }
        setStep(2)
    }
    const goStep3 = () => {
        if (!form.district) { showToast('Select your district', 'error'); return }
        setStep(3)
    }

    const handleRegister = async () => {
        const p = pin.join(''), cp = confirmPin.join('')
        if (p.length < 4) { showToast('Enter a 4-digit PIN', 'error'); return }
        if (p !== cp) { showToast('PINs do not match', 'error'); return }
        setLoading(true)
        try {
            const data = await api.post('/auth/register', {
                full_name: form.full_name, phone: '+256' + form.phone,
                pin: p, role: form.role, district: form.district,
            })
            if (data.success) {
                showToast('Account created! Please login')
                setTimeout(() => navigate('/login'), 1200)
            } else {
                showToast(data.message || 'Registration failed', 'error')
            }
        } catch (err) {
            showToast(err?.message || 'Connection error', 'error')
        }
        setLoading(false)
    }

    const StepDot = ({ n }) => (
        <div style={{
            width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 13, fontWeight: 700, fontFamily: 'Poppins',
            background: n < step ? 'var(--accent)' : n === step ? 'var(--primary)' : 'var(--border)',
            color: n <= step ? 'white' : 'var(--text-gray)',
        }}>{n < step ? '✓' : n}</div>
    )

    const PinRow = ({ arr, setArr, refs }) => (
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 8 }}>
            {arr.map((v, i) => (
                <input key={i} ref={refs[i]} type="password" maxLength={1} value={v}
                    onChange={e => handlePinChange(arr, setArr, refs, i, e.target.value)}
                    onKeyDown={e => handlePinKey(arr, refs, i, e)}
                    style={{ width: 56, height: 56, border: '2px solid var(--border)', borderRadius: 12, textAlign: 'center', fontSize: 24, fontWeight: 700, color: 'var(--primary)', outline: 'none' }} />
            ))}
        </div>
    )

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
            <div style={{ background: 'linear-gradient(160deg, #1B5E20, #2E7D32)', padding: '40px 24px 56px', textAlign: 'center' }}>
                <Sprout size={44} color="white" style={{ marginBottom: 12 }} />
                <h1 style={{ fontFamily: 'Poppins', fontSize: 26, color: 'white', marginBottom: 6 }}>Create Account</h1>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>Join thousands of Ugandan yam farmers</p>
            </div>

            <div style={{ background: 'white', borderRadius: '24px 24px 0 0', marginTop: -24, padding: '32px 24px 100px', maxWidth: 480, margin: '-24px auto 0', minHeight: 'calc(100vh - 160px)' }}>
                {/* Step dots */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 28 }}>
                    <StepDot n={1} />
                    <div style={{ flex: 1, height: 2, background: step > 1 ? 'var(--accent)' : 'var(--border)', maxWidth: 48 }} />
                    <StepDot n={2} />
                    <div style={{ flex: 1, height: 2, background: step > 2 ? 'var(--accent)' : 'var(--border)', maxWidth: 48 }} />
                    <StepDot n={3} />
                </div>

                {step === 1 && (
                    <>
                        <h3 style={{ fontFamily: 'Poppins', fontSize: 18, marginBottom: 4 }}>Personal Information</h3>
                        <p style={{ color: 'var(--text-gray)', fontSize: 13, marginBottom: 24 }}>Tell us about yourself</p>

                        <div style={{ marginBottom: 18 }}>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-gray)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Full Name</label>
                            <input value={form.full_name} onChange={e => set('full_name', e.target.value)} placeholder="e.g. Nakato Sarah"
                                style={{ width: '100%', padding: '13px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 15, outline: 'none', fontFamily: 'Inter' }} />
                        </div>

                        <div style={{ marginBottom: 18 }}>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-gray)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Phone Number</label>
                            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                                <span style={{ background: 'var(--bg)', padding: '13px 12px', fontWeight: 600, borderRight: '1.5px solid var(--border)', fontSize: 14 }}>🇺🇬 +256</span>
                                <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="700 000 000" maxLength={9}
                                    style={{ border: 'none', outline: 'none', padding: '13px 16px', fontSize: 15, flex: 1, fontFamily: 'Inter' }} />
                            </div>
                        </div>

                        <div style={{ marginBottom: 18 }}>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-gray)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>I am a</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                {[{ val: 'farmer', label: 'Farmer', icon: '👨‍🌾' }, { val: 'extension_officer', label: 'Extension Officer', icon: '👷' }].map(r => (
                                    <div key={r.val} onClick={() => set('role', r.val)} style={{
                                        border: `2px solid ${form.role === r.val ? 'var(--primary)' : 'var(--border)'}`,
                                        background: form.role === r.val ? '#E8F5E9' : 'white',
                                        borderRadius: 'var(--radius)', padding: '16px 12px', textAlign: 'center', cursor: 'pointer',
                                    }}>
                                        <div style={{ fontSize: 28, marginBottom: 6 }}>{r.icon}</div>
                                        <div style={{ fontSize: 13, fontWeight: 600 }}>{r.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button onClick={goStep2} style={{ width: '100%', padding: '13px 24px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'Poppins', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
                            Continue →
                        </button>
                        <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text-gray)', fontSize: 14 }}>
                            Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login</Link>
                        </p>
                    </>
                )}

                {step === 2 && (
                    <>
                        <h3 style={{ fontFamily: 'Poppins', fontSize: 18, marginBottom: 4 }}>Your Location</h3>
                        <p style={{ color: 'var(--text-gray)', fontSize: 13, marginBottom: 24 }}>Where is your farm located?</p>

                        <div style={{ marginBottom: 18 }}>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-gray)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>District</label>
                            <select value={form.district} onChange={e => set('district', e.target.value)}
                                style={{ width: '100%', padding: '13px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 15, outline: 'none', fontFamily: 'Inter', background: 'white' }}>
                                <option value="">Select your district</option>
                                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>

                        <div style={{ marginBottom: 18 }}>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-gray)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Village / Area (optional)</label>
                            <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Bukunja Village"
                                style={{ width: '100%', padding: '13px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 15, outline: 'none', fontFamily: 'Inter' }} />
                        </div>

                        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                            <button onClick={() => setStep(1)} style={{ flex: 1, padding: 13, background: 'var(--bg)', color: 'var(--text)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'Poppins', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>← Back</button>
                            <button onClick={goStep3} style={{ flex: 2, padding: 13, background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'Poppins', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Continue →</button>
                        </div>
                    </>
                )}

                {step === 3 && (
                    <>
                        <h3 style={{ fontFamily: 'Poppins', fontSize: 18, marginBottom: 4 }}>Set Your PIN</h3>
                        <p style={{ color: 'var(--text-gray)', fontSize: 13, marginBottom: 24 }}>Choose a 4-digit PIN to secure your account</p>

                        <div style={{ marginBottom: 18 }}>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-gray)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Create PIN</label>
                            <PinRow arr={pin} setArr={setPin} refs={pinRefs} />
                        </div>
                        <div style={{ marginBottom: 18 }}>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-gray)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Confirm PIN</label>
                            <PinRow arr={confirmPin} setArr={setConfirmPin} refs={cPinRefs} />
                        </div>

                        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                            <button onClick={() => setStep(2)} style={{ flex: 1, padding: 13, background: 'var(--bg)', color: 'var(--text)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'Poppins', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>← Back</button>
                            <button onClick={handleRegister} disabled={loading} style={{ flex: 2, padding: 13, background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'Poppins', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
                                {loading ? 'Creating...' : 'Create Account'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
