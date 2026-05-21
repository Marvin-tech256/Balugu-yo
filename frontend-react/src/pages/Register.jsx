import React, { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Sprout, CheckCircle, User, MapPin, Lock } from 'lucide-react'
import { useToast } from '../components/Toast'
import api from '../api'

const DISTRICTS = ['Buikwe', 'Bukunja', 'Mukono', 'Kampala', 'Jinja', 'Mbale', 'Masaka', 'Mbarara', 'Other']
const STEPS = [
  { icon: User, label: 'Personal Info' },
  { icon: MapPin, label: 'Location' },
  { icon: Lock, label: 'Set PIN' },
]

export default function Register() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ full_name: '', phone: '', role: 'farmer', district: '', location: '' })
  const [pin, setPin] = useState(['', '', '', ''])
  const [confirmPin, setConfirmPin] = useState(['', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [phoneError, setPhoneError] = useState('')
  const [checkingPhone, setCheckingPhone] = useState(false)
  const [nameError, setNameError] = useState('')
  const pinRefs = [useRef(), useRef(), useRef(), useRef()]
  const cPinRefs = [useRef(), useRef(), useRef(), useRef()]
  const showToast = useToast()
  const navigate = useNavigate()

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handlePhoneChange = async (val) => {
    const cleaned = val.replace(/[^0-9]/g, '').slice(0, 9)
    set('phone', cleaned)
    setPhoneError('')
    if (cleaned.length === 9) {
      setCheckingPhone(true)
      try {
        const data = await api.post('/auth/check-phone', { phone: '+256' + cleaned })
        if (data.exists) setPhoneError('This number is already registered')
      } catch { }
      setCheckingPhone(false)
    }
  }

  const handlePinChange = (arr, setArr, refs, i, val) => {
    const next = [...arr]; next[i] = val; setArr(next)
    if (val && i < 3) refs[i + 1].current?.focus()
  }
  const handlePinKey = (arr, refs, i, e) => {
    if (e.key === 'Backspace' && !arr[i] && i > 0) refs[i - 1].current?.focus()
  }

  const goStep2 = () => {
    if (!form.full_name.trim()) { showToast('Enter your full name', 'error'); return }
    if (nameError) { showToast(nameError, 'error'); return }
    if (!form.phone || form.phone.length < 9) { showToast('Enter a valid phone number', 'error'); return }
    if (phoneError) { showToast(phoneError, 'error'); return }
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
      if (data.success) { showToast('Account created'); setTimeout(() => navigate('/login'), 1200) }
      else showToast(data.message || 'Registration failed', 'error')
    } catch (err) { showToast(err?.message || 'Connection error', 'error') }
    setLoading(false)
  }

  const PinRow = ({ arr, setArr, refs }) => (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
      {arr.map((v, i) => (
        <input key={i} ref={refs[i]} type="password" maxLength={1} value={v}
          onChange={e => handlePinChange(arr, setArr, refs, i, e.target.value)}
          onKeyDown={e => handlePinKey(arr, refs, i, e)}
          style={{ width: 52, height: 52, border: '1.5px solid var(--border)', borderRadius: 10, textAlign: 'center', fontSize: 20, fontWeight: 700, color: 'var(--primary)', outline: 'none', background: 'var(--surface)', transition: 'border-color 0.15s, box-shadow 0.15s' }}
          onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.12)' }}
          onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none' }}
        />
      ))}
    </div>
  )

  return (
    <div className="auth-split">
      {/* Left visual panel */}
      <div className="auth-split-visual" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=900&q=80)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'brightness(0.3) saturate(1.2)',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(5,46,22,0.85) 0%, rgba(6,95,70,0.75) 60%, rgba(15,52,96,0.65) 100%)' }} />
        <div style={{ position: 'absolute', top: '15%', right: '15%', width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(217,119,6,0.12) 0%, transparent 70%)', animation: 'floatSlow 8s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '20%', left: '10%', width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle, rgba(22,163,74,0.15) 0%, transparent 70%)', animation: 'floatSlow 6s ease-in-out infinite reverse', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '48px 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #16a34a, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sprout size={20} color="white" />
            </div>
            <span style={{ fontFamily: 'Poppins', fontSize: 22, fontWeight: 700, color: 'white' }}>
              Balugu <span style={{ color: '#6ee7b7' }}>Yo</span>
            </span>
          </div>
          <h2 style={{ fontFamily: 'Poppins', fontSize: 30, fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: 16 }}>
            Join Uganda's<br />
            <span className="hero-gradient-text">smartest farmers</span>
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, marginBottom: 40, maxWidth: 300 }}>
            Register in 3 simple steps and start predicting your yam harvest dates today.
          </p>
          {STEPS.map(({ icon: Icon, label }, i) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: i + 1 <= step ? 'rgba(22,163,74,0.3)' : 'rgba(255,255,255,0.08)', border: `1px solid ${i + 1 <= step ? 'rgba(22,163,74,0.5)' : 'rgba(255,255,255,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                {i + 1 < step ? <CheckCircle size={14} color="#6ee7b7" /> : <Icon size={14} color={i + 1 === step ? '#6ee7b7' : 'rgba(255,255,255,0.4)'} />}
              </div>
              <span style={{ fontSize: 13, color: i + 1 <= step ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.35)', fontWeight: i + 1 === step ? 600 : 400 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '40px 24px', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 400 }} className="anim-scale-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, #16a34a, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sprout size={16} color="white" />
            </div>
            <span style={{ fontFamily: 'Poppins', fontSize: 17, fontWeight: 700, color: 'var(--text)' }}>
              Balugu <span style={{ color: 'var(--primary)' }}>Yo</span>
            </span>
          </div>

          {/* Step progress dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
            {[1, 2, 3].map(n => (
              <div key={n} style={{ height: 6, borderRadius: 3, background: n <= step ? 'var(--primary)' : 'var(--border)', width: n === step ? 28 : 8, transition: 'all 0.3s ease' }} />
            ))}
            <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 6 }}>Step {step} of 3</span>
          </div>

          <div className="card" style={{ padding: '24px 22px' }}>
            {step === 1 && (
              <>
                <h3 style={{ fontFamily: 'Poppins', fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Personal Info</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>Tell us about yourself</p>
                <div style={{ marginBottom: 14 }}>
                  <label className="form-label">Full Name</label>
                  <input className="form-input" value={form.full_name}
                    onChange={e => {
                      const raw = e.target.value
                      if (/[^a-zA-Z\s'\-]/.test(raw)) {
                        setNameError('Only letters, spaces, hyphens and apostrophes allowed')
                        return
                      }
                      if (/[-']{2,}/.test(raw)) {
                        setNameError('Cannot use consecutive special characters like --')
                        return
                      }
                      if (/^[\s'\-]/.test(raw)) {
                        setNameError('Name must start with a letter')
                        return
                      }
                      set('full_name', raw.slice(0, 100))
                      setNameError(raw.trim().length > 0 && raw.trim().length < 2 ? 'Name must be at least 2 characters' : '')
                    }}
                    placeholder="e.g. Nakato Sarah"
                    style={{ borderColor: nameError ? 'var(--danger)' : undefined }} />
                  {nameError && <div style={{ fontSize: 12, color: 'var(--danger)', marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>⚠ {nameError}</div>}
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label className="form-label">Phone Number</label>
                  <div style={{ display: 'flex', border: `1.5px solid ${phoneError ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                    <span style={{ padding: '10px 12px', color: 'var(--text-muted)', fontSize: 13, borderRight: '1px solid var(--border)', background: 'var(--surface-2)', whiteSpace: 'nowrap' }}>🇺🇬 +256</span>
                    <input type="tel" value={form.phone} onChange={e => handlePhoneChange(e.target.value)} placeholder="700 000 000" maxLength={9}
                      style={{ border: 'none', outline: 'none', padding: '10px 12px', fontSize: 14, flex: 1, background: 'white', color: 'var(--text)' }} />
                    {checkingPhone && <span style={{ padding: '10px 12px', fontSize: 12, color: 'var(--text-muted)' }}>checking...</span>}
                  </div>
                  {phoneError && <div style={{ fontSize: 12, color: 'var(--danger)', marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>⚠ {phoneError}</div>}
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label className="form-label">I am a</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {[
                      { val: 'farmer', label: 'Farmer', sub: 'Grow & harvest yams' },
                      { val: 'extension_officer', label: 'Extension Officer', sub: 'Advise farmers' },
                    ].map(r => (
                      <div key={r.val} onClick={() => set('role', r.val)} style={{ border: `1.5px solid ${form.role === r.val ? 'var(--primary)' : 'var(--border)'}`, background: form.role === r.val ? 'var(--primary-bg)' : 'var(--surface)', borderRadius: 10, padding: '12px 10px', cursor: 'pointer', transition: 'all 0.15s' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: form.role === r.val ? 'var(--primary-mid)' : 'var(--text)', marginBottom: 2 }}>{r.label}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={goStep2} className="btn btn-primary" style={{ width: '100%', padding: '11px' }}>
                  Continue <ArrowRight size={14} />
                </button>
                <p style={{ textAlign: 'center', marginTop: 14, fontSize: 12, color: 'var(--text-muted)' }}>
                  Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
                </p>
              </>
            )}

            {step === 2 && (
              <>
                <h3 style={{ fontFamily: 'Poppins', fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Your Location</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>Where is your farm located?</p>
                <div style={{ marginBottom: 14 }}>
                  <label className="form-label">District</label>
                  <select className="form-input" value={form.district} onChange={e => set('district', e.target.value)}>
                    <option value="">Select district</option>
                    {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label className="form-label">Village / Area (optional)</label>
                  <input className="form-input" value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Bukunja Village" />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setStep(1)} className="btn btn-ghost" style={{ flex: 1 }}><ArrowLeft size={14} /> Back</button>
                  <button onClick={goStep3} className="btn btn-primary" style={{ flex: 2 }}>Continue <ArrowRight size={14} /></button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h3 style={{ fontFamily: 'Poppins', fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Set Your PIN</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>Choose a 4-digit PIN to secure your account</p>
                <div style={{ marginBottom: 18 }}>
                  <label className="form-label" style={{ textAlign: 'center', display: 'block', marginBottom: 10 }}>Create PIN</label>
                  <PinRow arr={pin} setArr={setPin} refs={pinRefs} />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label className="form-label" style={{ textAlign: 'center', display: 'block', marginBottom: 10 }}>Confirm PIN</label>
                  <PinRow arr={confirmPin} setArr={setConfirmPin} refs={cPinRefs} />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setStep(2)} className="btn btn-ghost" style={{ flex: 1 }}><ArrowLeft size={14} /> Back</button>
                  <button onClick={handleRegister} disabled={loading} className="btn btn-primary" style={{ flex: 2 }}>
                    {loading ? <><span className="spinner" /> Creating...</> : 'Create Account'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
