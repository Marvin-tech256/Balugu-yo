import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Sprout, User, Tractor } from 'lucide-react'
import { useToast } from '../components/Toast'
import api from '../api'

const districts = ['Buikwe', 'Bukunja', 'Mukono', 'Kampala', 'Jinja', 'Mbale', 'Masaka', 'Mbarara', 'Other']

export default function Register() {
    const [step, setStep] = useState(1)
    const [fullName, setFullName] = useState('')
    const [phone, setPhone] = useState('')
    const [role, setRole] = useState('farmer')
    const [district, setDistrict] = useState('')
    const [location, setLocation] = useState('')
    const [pin, setPin] = useState(['', '', '', ''])
    const [confirmPin, setConfirmPin] = useState(['', '', '', ''])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const showToast = useToast()

    const handlePin = (val, i, arr, setArr, prefix) => {
        const next = [...arr]; next[i] = val; setArr(next)
        if (val && i < 3) document.getElementById(`${prefix}-${i + 1}`)?.focus()
    }

    const goStep2 = () => {
        if (!fullName.trim()) { showToast('Enter your full name', 'error'); return }
        if (!phone || phone.length < 9) { showToast('Enter a valid phone number', 'error'); return }
        setStep(2)
    }

    const goStep3 = () => {
        if (!district) { showToast('Select your district', 'error'); return }
        setStep(3)
    }

    const handleRegister = async () => {
        const p = pin.join(''), cp = confirmPin.join('')
        if (p.length < 4) { showToast('Enter a 4-digit PIN', 'error'); return }
        if (p !== cp) { showToast('PINs do not match', 'error'); return }
        setLoading(true)
        try {
            const data = await api.post('/auth/register', { full_name: fullName, phone: '+256' + phone, pin: p, role, district })
            if (data.success) { showToast('Account created! Please login'); navigate('/login') }
            else showToast(data.message || 'Registration failed', 'error')
        } catch (e) { showToast(e?.message || 'Connection error', 'error') }
        setLoading(false)
    }

    const StepDot = ({ n }) => (
        <div style={{
            width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, fontFamily: 'Poppins',
            background: n < step ? 'var(--accent)' : n === step ? 'var(--primary)' : 'var(--border)',
            color: n <= step ? 'white' : 'var(--text-gray)'
        }}>
            {n < step ? '✓' : n}
        </div>
    )

    const PinRow = ({ arr, setArr, prefix }) => (
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 8 }}>
            {arr.map((v, i) => (
                <input key={i} id={`${prefix}-${i}`} type="password" maxLength={1} value={v}
                    onChange={e => handlePin(e.target.value, i, arr, setArr, prefix)}
                    onKeyDown={e => { if (e.key === 'Backspace' && !v && i > 0) document.getElementById(`${prefix}-${i - 1}`)?.focus() }}
                    style={{ width: 56, height: 56, border: '2px solid var(--border)', borderRadius: 12, textAlign: 'center', fontSize: 24, fontWeight: 700, color: 'var(--primary)', outline: 'none' }} />
            ))}
        </div>
    )

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
            <div style={{ background: 'linear-gradient(160deg,#1B5E20,#2E7D32)', padding: '40px 24px 56px', textAlign: 'center' }}>
                <Sprout size={44} color="white" style={{ marginBottom: 12 }} />
                <h1 style={{ fontSize: 26, color: 'white', marginBottom: 6 }}>Create Account</h1>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>Join thousands of Ugandan yam farmers</p>
            </div>

            <div style={{ background: 'white', borderRadius: '24px 24px 0 0', marginTop: -24, padding: '32px 24px 60px', maxWidth: 480, margin: '-24px auto 0', minHeight: 'calc(100vh - 160px)' }}>
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
                        <h3 style={{ fontSize: 18, marginBottom: 4 }}>Personal Information</h3>
                        <p style={{ color: 'var(--text-gray)', fontSize: 13, marginBottom: 24 }}>Tell us about yourself</p>
                        <div style={{ marginBottom: 18 }}>
                            <label style={labelStyle}>Full Name</label>
                            <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="e.g. Nakato Sarah" style={inputStyle} />
                        </div>
                        <div style={{ marginBottom: 18 }}>
                            <label style={labelStyle}>Phone Number</label>
                            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                                <span style={{ background: 'var(--bg)', padding: '13px 12px', fontWeight: 600, fontSize: 14, borderRight: '1.5px solid var(--border)' }}>+256</span>
                                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="700 000 000" maxLength={9} style={{ border: 'none', outline: 'none', padding: '13px 16px', fontSize: 15, flex: 1 }} />
                            </div>
                        </div>
                        <div style={{ marginBottom: 18 }}>
                            <label style={labelStyle}>I am a</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                {[{ val: 'farmer', icon: <Tractor size={28} />, label: 'Farmer' },
                                { val: 'extension_officer', icon: <User size={28} />, label: 'Extension Officer' }].map(r => (
                                    <div key={r.val} onClick={() => setRole(r.val)} style={{ border: `2px solid ${role === r.val ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 'var(--radius)', padding: '16px 12px', textAlign: 'center', cursor: 'pointer', background: role === r.val ? '#E8F5E9' : 'white' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6, color: role === r.val ? 'var(--primary)' : 'var(--text-gray)' }}>{r.icon}</div>
                                        <div style={{ fontSize: 13, fontWeight: 600 }}>{r.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button onClick={goStep2} style={btnStyle}>Continue</button>
                        <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text-gray)', fontSize: 14 }}>
                            Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login</Link>
                        </p>
                    </>
                )}

                {step === 2 && (
                    <>
                        <h3 style={{ fontSize: 18, marginBottom: 4 }}>Your Location</h3>
                        <p style={{ color: 'var(--text-gray)', fontSize: 13, marginBottom: 24 }}>Where is your farm located?</p>
                        <div style={{ marginBottom: 18 }}>
                            <label style={labelStyle}>District</label>
                            <select value={district} onChange={e => setDistrict(e.target.value)} style={inputStyle}>
                                <option value="">Select your district</option>
                                {districts.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div style={{ marginBottom: 18 }}>
                            <label style={labelStyle}>Village / Area (optional)</label>
                            <input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Bukunja Village" style={inputStyle} />
                        </div>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button onClick={() => setStep(1)} style={{ ...btnStyle, background: 'var(--bg)', color: 'var(--text)', flex: 1 }}>Back</button>
                            <button onClick={goStep3} style={{ ...btnStyle, flex: 2 }}>Continue</button>
                        </div>
                    </>
                )}

                {step === 3 && (
                    <>
                        <h3 style={{ fontSize: 18, marginBottom: 4 }}>Set Your PIN</h3>
                        <p style={{ color: 'var(--text-gray)', fontSize: 13, marginBottom: 24 }}>Choose a 4-digit PIN to secure your account</p>
                        <div style={{ marginBottom: 18 }}>
                            <label style={labelStyle}>Create PIN</label>
                            <PinRow arr={pin} setArr={setPin} prefix="rp" />
                        </div>
                        <div style={{ marginBottom: 24 }}>
                            <label style={labelStyle}>Confirm PIN</label>
                            <PinRow arr={confirmPin} setArr={setConfirmPin} prefix="cp" />
                        </div>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button onClick={() => setStep(2)} style={{ ...btnStyle, background: 'var(--bg)', color: 'var(--text)', flex: 1 }}>Back</button>
                            <button onClick={handleRegister} disabled={loading} style={{ ...btnStyle, flex: 2, opacity: loading ? 0.7 : 1 }}>
                                {loading ? 'Creating...' : 'Create Account'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

const labelStyle = { display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-gray)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }
const inputStyle = { width: '100%', padding: '13px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 15, outline: 'none', background: 'white' }
const btnStyle = { width: '100%', padding: 13, background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'Poppins', fontWeight: 600, fontSize: 15, cursor: 'pointer' }
