import React, { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowRight, ArrowLeft } from 'lucide-react'
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
            const data = await api.post('/auth/register', { full_name: form.full_name, phone: '+256' + form.phone, pin: p, role: form.role, district: form.district })
            if (data.success) { showToast('Account created!'); setTimeout(() => navigate('/login'), 1200) }
            else showToast(data.message || 'Registration failed', 'error')
        } catch (err) { showToast(err?.message || 'Connection error', 'error') }
        setLoading(false)
    }

    const inputStyle = { width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, fontSize: 14, color: 'white', outline: 'none' }
    const labelStyle = { display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 5 }

    const PinRow = ({ arr, setArr, refs }) => (
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            {arr.map((v, i) => (
                <input key={i} ref={refs[i]} type="password" maxLength={1} value={v}
                    onChange={e => handlePinChange(arr, setArr, refs, i, e.target.value)}
                    onKeyDown={e => handlePinKey(arr, refs, i, e)}
                    style={{ width: 50, height: 50, background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: 10, textAlign: 'center', fontSize: 20, fontWeight: 700, color: 'white', outline: 'none' }}
                    onFocus={e => { e.target.style.borderColor = '#16a34a'; e.target.style.background = 'rgba(22,163,74,0.15)' }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.background = 'rgba(255,255,255,0.08)' }}
                />
            ))}
        </div>
    )

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #052e16 0%, #14532d 40%, #065f46 70%, #0f3460 100%)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
            <div style={{ position: 'absolute', top: -100, right: -100, width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(22,163,74,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420 }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <span style={{ fontFamily: 'Poppins', fontSize: 20, fontWeight: 700, color: 'white' }}>Balugu <span style={{ color: '#6ee7b7' }}>Yo</span></span>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Create your account</p>
                </div>

                {/* Step indicator */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 20 }}>
                    {[1, 2, 3].map((n, idx) => (
                        <React.Fragment key={n}>
                            <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, background: n < step ? '#16a34a' : n === step ? 'white' : 'rgba(255,255,255,0.15)', color: n < step ? 'white' : n === step ? '#14532d' : 'rgba(255,255,255,0.4)' }}>
                                {n < step ? '✓' : n}
                            </div>
                            {idx < 2 && <div style={{ width: 32, height: 2, background: n < step ? '#16a34a' : 'rgba(255,255,255,0.15)', borderRadius: 1 }} />}
                        </React.Fragment>
                    ))}
                </div>

                <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20, padding: '24px 20px' }}>

                    {step === 1 && (
                        <>
                            <h3 style={{ fontFamily: 'Poppins', fontSize: 17, fontWeight: 600, color: 'white', marginBottom: 4 }}>Personal Info</h3>
                            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 20 }}>Tell us about yourself</p>

                            <div style={{ marginBottom: 14 }}>
                                <label style={labelStyle}>Full Name</label>
                                <input value={form.full_name} onChange={e => set('full_name', e.target.value)} placeholder="e.g. Nakato Sarah" style={inputStyle}
                                    onFocus={e => e.target.style.borderColor = 'rgba(22,163,74,0.6)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'} />
                            </div>
                            <div style={{ marginBottom: 14 }}>
                                <label style={labelStyle}>Phone Number</label>
                                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, overflow: 'hidden' }}>
                                    <span style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.6)', fontSize: 13, borderRight: '1px solid rgba(255,255,255,0.1)', whiteSpace: 'nowrap' }}>🇺🇬 +256</span>
                                    <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="700 000 000" maxLength={9} style={{ border: 'none', outline: 'none', padding: '10px 12px', fontSize: 14, flex: 1, background: 'transparent', color: 'white' }} />
                                </div>
                            </div>
                            <div style={{ marginBottom: 20 }}>
                                <label style={labelStyle}>I am a</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                    {[{ val: 'farmer', label: 'Farmer', icon: '👨‍🌾' }, { val: 'extension_officer', label: 'Extension Officer', icon: '👷' }].map(r => (
                                        <div key={r.val} onClick={() => set('role', r.val)} style={{ border: '1.5px solid ' + (form.role === r.val ? '#16a34a' : 'rgba(255,255,255,0.15)'), background: form.role === r.val ? 'rgba(22,163,74,0.2)' : 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '12px 8px', textAlign: 'center', cursor: 'pointer' }}>
                                            <div style={{ fontSize: 22, marginBottom: 4 }}>{r.icon}</div>
                                            <div style={{ fontSize: 12, fontWeight: 600, color: 'white' }}>{r.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button onClick={goStep2} style={{ width: '100%', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'linear-gradient(135deg, #16a34a, #0d9488)', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                                Continue <ArrowRight size={14} />
                            </button>
                            <p style={{ textAlign: 'center', marginTop: 14, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                                Already have an account? <Link to="/login" style={{ color: '#6ee7b7', fontWeight: 600 }}>Sign in</Link>
                            </p>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h3 style={{ fontFamily: 'Poppins', fontSize: 17, fontWeight: 600, color: 'white', marginBottom: 4 }}>Your Location</h3>
                            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 20 }}>Where is your farm?</p>
                            <div style={{ marginBottom: 14 }}>
                                <label style={labelStyle}>District</label>
                                <select value={form.district} onChange={e => set('district', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                                    <option value="" style={{ background: '#14532d' }}>Select district</option>
                                    {DISTRICTS.map(d => <option key={d} value={d} style={{ background: '#14532d' }}>{d}</option>)}
                                </select>
                            </div>
                            <div style={{ marginBottom: 20 }}>
                                <label style={labelStyle}>Village / Area (optional)</label>
                                <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Bukunja Village" style={inputStyle} />
                            </div>
                            <div style={{ display: 'flex', gap: 10 }}>
                                <button onClick={() => setStep(1)} style={{ flex: 1, padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                                    <ArrowLeft size={14} /> Back
                                </button>
                                <button onClick={goStep3} style={{ flex: 2, padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'linear-gradient(135deg, #16a34a, #0d9488)', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                                    Continue <ArrowRight size={14} />
                                </button>
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <h3 style={{ fontFamily: 'Poppins', fontSize: 17, fontWeight: 600, color: 'white', marginBottom: 4 }}>Set Your PIN</h3>
                            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 20 }}>Choose a 4-digit PIN</p>
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ ...labelStyle, marginBottom: 10 }}>Create PIN</label>
                                <PinRow arr={pin} setArr={setPin} refs={pinRefs} />
                            </div>
                            <div style={{ marginBottom: 20 }}>
                                <label style={{ ...labelStyle, marginBottom: 10 }}>Confirm PIN</label>
                                <PinRow arr={confirmPin} setArr={setConfirmPin} refs={cPinRefs} />
                            </div>
                            <div style={{ display: 'flex', gap: 10 }}>
                                <button onClick={() => setStep(2)} style={{ flex: 1, padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                                    <ArrowLeft size={14} /> Back
                                </button>
                                <button onClick={handleRegister} disabled={loading} style={{ flex: 2, padding: '10px', background: loading ? 'rgba(22,163,74,0.5)' : 'linear-gradient(135deg, #16a34a, #0d9488)', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
                                    {loading ? 'Creating...' : 'Create Account'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
