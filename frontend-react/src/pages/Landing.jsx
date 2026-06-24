import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, CloudRain, Bell, Sprout, ArrowRight, CheckCircle, Star, TrendingUp, Shield, Zap, ChevronDown } from 'lucide-react'

const STATS = [
    { value: '2,400+', label: 'Active Farmers' },
    { value: '98%', label: 'Prediction Accuracy' },
    { value: '12K+', label: 'Harvests Tracked' },
    { value: '6', label: 'Districts Covered' },
]

const FEATURES = [
    {
        icon: CalendarDays,
        color: '#6ee7b7',
        bg: 'rgba(110,231,183,0.12)',
        title: 'Harvest Date Prediction',
        desc: 'AI-powered predictions help you make informed decisions about your yams — down to the day.',
    },
    {
        icon: CloudRain,
        color: '#60a5fa',
        bg: 'rgba(96,165,250,0.12)',
        title: 'Real-Time Weather',
        desc: 'Live weather data for your district helps you plan planting and harvesting around conditions.',
    },
    {
        icon: Bell,
        color: '#fbbf24',
        bg: 'rgba(251,191,36,0.12)',
        title: 'Smart Alerts',
        desc: 'Get notified 2 weeks before harvest so you can prepare transport, storage, and buyers.',
    },
    {
        icon: TrendingUp,
        color: '#a78bfa',
        bg: 'rgba(167,139,250,0.12)',
        title: 'Farm Analytics',
        desc: 'Track yield trends, soil performance, and planting history across all your farms.',
    },
    {
        icon: Shield,
        color: '#34d399',
        bg: 'rgba(52,211,153,0.12)',
        title: 'Secure & Private',
        desc: 'Your farm data is encrypted and only accessible to you. No data sharing without consent.',
    },
    {
        icon: Zap,
        color: '#fb923c',
        bg: 'rgba(251,146,60,0.12)',
        title: 'Works Offline',
        desc: 'Core features work even with poor connectivity — built for rural Uganda.',
    },
]

const TESTIMONIALS = [
    {
        name: 'Nakato Sarah',
        role: 'Yam Farmer, Buikwe',
        text: 'Before Balugu Yo I always guessed harvest time. Now I know exactly when to call the truck. I saved 3 bags last season.',
        rating: 5,
        avatar: 'N',
        color: '#16a34a',
    },
    {
        name: 'Ssemakula John',
        role: 'Farmer, Mukono',
        text: 'The weather alerts helped me avoid harvesting during heavy rains. My yams stayed fresh longer.',
        rating: 5,
        avatar: 'S',
        color: '#0d9488',
    },
    {
        name: 'Apio Grace',
        role: 'Extension Officer, Jinja',
        text: 'I use the extension dashboard to monitor 40+ farmers at once. It saves me days of field visits every month.',
        rating: 5,
        avatar: 'A',
        color: '#7c3aed',
    },
]

function useInView(threshold = 0.15) {
    const ref = useRef(null)
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold })
        if (ref.current) obs.observe(ref.current)
        return () => obs.disconnect()
    }, [])
    return [ref, visible]
}

export default function Landing() {
    const navigate = useNavigate()
    const [scrolled, setScrolled] = useState(false)
    const [statsRef, statsVisible] = useInView()
    const [featRef, featVisible] = useInView()
    const [testRef, testVisible] = useInView()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <div style={{ background: '#020d07', minHeight: '100vh', overflowX: 'hidden' }}>

            {/* ── Navbar ── */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                padding: '0 32px', height: 64,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: scrolled ? 'rgba(2,13,7,0.92)' : 'transparent',
                backdropFilter: scrolled ? 'blur(16px)' : 'none',
                borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
                transition: 'all 0.3s ease',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#16a34a,#0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Sprout size={18} color="white" />
                    </div>
                    <span style={{ fontFamily: 'Poppins', fontSize: 18, fontWeight: 700, color: 'white' }}>
                        Balugu <span style={{ color: '#6ee7b7' }}>Yo</span>
                    </span>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => navigate('/login')} style={{ padding: '8px 18px', borderRadius: 8, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
                        Sign In
                    </button>
                    <button onClick={() => navigate('/register')} style={{ padding: '8px 18px', borderRadius: 8, background: 'linear-gradient(135deg,#16a34a,#0d9488)', border: 'none', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 14px rgba(22,163,74,0.35)', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(22,163,74,0.5)' }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(22,163,74,0.35)' }}>
                        Get Started
                    </button>
                </div>
            </nav>

            {/* ── Hero ── */}
            <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {/* Background image */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80)',
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    filter: 'brightness(0.22) saturate(1.4)',
                }} />
                {/* Gradient overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(2,13,7,0.6) 0%, rgba(5,46,22,0.5) 40%, rgba(6,95,70,0.4) 100%)' }} />

                {/* Animated orbs */}
                <div style={{ position: 'absolute', top: '15%', left: '8%', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(22,163,74,0.12) 0%, transparent 70%)', animation: 'floatSlow 9s ease-in-out infinite', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '20%', right: '6%', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,148,136,0.1) 0%, transparent 70%)', animation: 'floatSlow 7s ease-in-out infinite reverse', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(22,163,74,0.05) 0%, transparent 65%)', pointerEvents: 'none' }} />

                {/* Hero content */}
                <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '100px 24px 60px', maxWidth: 780, margin: '0 auto' }}>
                    {/* Badge */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(110,231,183,0.25)', borderRadius: 40, padding: '6px 16px', marginBottom: 28, animation: 'fadeIn 0.6s ease forwards' }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#6ee7b7', boxShadow: '0 0 8px #6ee7b7', animation: 'pulse-glow 2s ease-in-out infinite' }} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#6ee7b7', letterSpacing: 0.5 }}>Now serving 6 districts in Uganda</span>
                    </div>

                    <h1 style={{ fontFamily: 'Poppins', fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: 800, color: 'white', lineHeight: 1.1, marginBottom: 24, animation: 'slideUp 0.7s ease 0.1s both' }}>
                        Make informed decisions<br />
                        about your <span className="hero-gradient-text">yams</span>
                    </h1>

                    <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, marginBottom: 40, maxWidth: 520, margin: '0 auto 40px', animation: 'slideUp 0.7s ease 0.2s both' }}>
                        Balugu Yo uses weather data and AI to predict your climbing yam harvest date with 98% accuracy. Built for Ugandan farmers.
                    </p>

                    <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 56, animation: 'slideUp 0.7s ease 0.3s both' }}>
                        <button onClick={() => navigate('/register')} style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '14px 28px', borderRadius: 12,
                            background: 'linear-gradient(135deg,#16a34a,#0d9488)',
                            color: 'white', border: 'none', fontSize: 15, fontWeight: 700,
                            cursor: 'pointer', boxShadow: '0 8px 24px rgba(22,163,74,0.4)',
                            transition: 'all 0.25s',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(22,163,74,0.55)' }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(22,163,74,0.4)' }}>
                            Start for Free <ArrowRight size={17} />
                        </button>
                        <button onClick={() => navigate('/login')} style={{
                            padding: '14px 28px', borderRadius: 12,
                            background: 'rgba(255,255,255,0.07)',
                            border: '1.5px solid rgba(255,255,255,0.18)',
                            color: 'white', fontSize: 15, fontWeight: 600,
                            cursor: 'pointer', backdropFilter: 'blur(8px)',
                            transition: 'all 0.25s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.13)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}>
                            I have an account
                        </button>
                    </div>

                    {/* Trust row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, flexWrap: 'wrap', animation: 'fadeIn 0.8s ease 0.5s both', opacity: 0 }}>
                        {['No credit card required', 'Free for farmers', 'Works on any phone'].map(t => (
                            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
                                <CheckCircle size={13} color="#6ee7b7" /> {t}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll indicator */}
                <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.3)', fontSize: 11, animation: 'float 2.5s ease-in-out infinite' }}>
                    <span>Scroll</span>
                    <ChevronDown size={16} />
                </div>
            </section>

            {/* ── Stats ── */}
            <section ref={statsRef} style={{ padding: '80px 24px', background: 'linear-gradient(180deg, #020d07 0%, #041a0e 100%)' }}>
                <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2 }}>
                    {STATS.map((s, i) => (
                        <div key={s.label} style={{
                            textAlign: 'center', padding: '32px 20px',
                            borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                            opacity: statsVisible ? 1 : 0,
                            transform: statsVisible ? 'translateY(0)' : 'translateY(20px)',
                            transition: `all 0.6s ease ${i * 0.1}s`,
                        }}>
                            <div style={{ fontFamily: 'Poppins', fontSize: 42, fontWeight: 800, background: 'linear-gradient(135deg,#6ee7b7,#34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, marginBottom: 8 }}>{s.value}</div>
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Features ── */}
            <section ref={featRef} style={{ padding: '100px 24px', background: '#041a0e' }}>
                <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 64 }}>
                        <div style={{ display: 'inline-block', fontSize: 12, fontWeight: 700, color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 14, opacity: featVisible ? 1 : 0, transition: 'opacity 0.6s ease' }}>
                            Everything you need
                        </div>
                        <h2 style={{ fontFamily: 'Poppins', fontSize: 'clamp(28px,4vw,42px)', fontWeight: 800, color: 'white', lineHeight: 1.2, opacity: featVisible ? 1 : 0, transform: featVisible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease 0.1s' }}>
                            Built for the real<br />Ugandan farmer
                        </h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
                        {FEATURES.map((f, i) => (
                            <div key={f.title} className="feature-card" style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.07)',
                                borderRadius: 16, padding: '28px 24px',
                                opacity: featVisible ? 1 : 0,
                                transform: featVisible ? 'translateY(0)' : 'translateY(30px)',
                                transition: `all 0.6s ease ${0.1 + i * 0.08}s`,
                                cursor: 'default',
                            }}>
                                <div style={{ width: 48, height: 48, borderRadius: 12, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                                    <f.icon size={22} color={f.color} />
                                </div>
                                <div style={{ fontFamily: 'Poppins', fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 10 }}>{f.title}</div>
                                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>{f.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How it works ── */}
            <section style={{ padding: '100px 24px', background: 'linear-gradient(180deg,#041a0e 0%,#020d07 100%)' }}>
                <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 14 }}>Simple process</div>
                    <h2 style={{ fontFamily: 'Poppins', fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, color: 'white', marginBottom: 64 }}>
                        From planting to harvest<br />in 3 steps
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32, position: 'relative' }}>
                        {/* connector line */}
                        <div style={{ position: 'absolute', top: 28, left: '20%', right: '20%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(110,231,183,0.3), transparent)' }} />
                        {[
                            { step: '01', title: 'Register your farm', desc: 'Add your farm location, soil type, and yam variety in under 2 minutes.' },
                            { step: '02', title: 'Record your planting', desc: 'Log your planting date and number of mounds. That\'s all we need.' },
                            { step: '03', title: 'Get your prediction', desc: 'We calculate your harvest date using weather data and crop science.' },
                        ].map((s, i) => (
                            <div key={s.step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(22,163,74,0.2),rgba(13,148,136,0.2))', border: '1px solid rgba(110,231,183,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins', fontSize: 16, fontWeight: 800, color: '#6ee7b7', position: 'relative', zIndex: 1 }}>
                                    {s.step}
                                </div>
                                <div style={{ fontFamily: 'Poppins', fontSize: 15, fontWeight: 700, color: 'white' }}>{s.title}</div>
                                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>{s.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Testimonials ── */}
            <section ref={testRef} style={{ padding: '100px 24px', background: '#020d07' }}>
                <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 56 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 14 }}>Testimonials</div>
                        <h2 style={{ fontFamily: 'Poppins', fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, color: 'white' }}>
                            Farmers love Balugu Yo
                        </h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
                        {TESTIMONIALS.map((t, i) => (
                            <div key={t.name} style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.07)',
                                borderRadius: 16, padding: '28px 24px',
                                opacity: testVisible ? 1 : 0,
                                transform: testVisible ? 'translateY(0)' : 'translateY(30px)',
                                transition: `all 0.6s ease ${i * 0.12}s`,
                            }}>
                                <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                                    {Array(t.rating).fill(0).map((_, j) => <Star key={j} size={14} fill="#fbbf24" color="#fbbf24" />)}
                                </div>
                                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, marginBottom: 24, fontStyle: 'italic' }}>"{t.text}"</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg,${t.color},#0d9488)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins', fontSize: 16, fontWeight: 700, color: 'white', flexShrink: 0 }}>{t.avatar}</div>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{t.name}</div>
                                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section style={{ padding: '100px 24px', background: '#041a0e', textAlign: 'center' }}>
                <div style={{ maxWidth: 600, margin: '0 auto' }}>
                    <div style={{ width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(135deg,#16a34a,#0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', boxShadow: '0 0 40px rgba(22,163,74,0.3)' }}>
                        <Sprout size={34} color="white" />
                    </div>
                    <h2 style={{ fontFamily: 'Poppins', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: 18 }}>
                        Ready to predict your<br />
                        <span className="hero-gradient-text">next harvest?</span>
                    </h2>
                    <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, marginBottom: 40 }}>
                        Join over 2,400 Ugandan yam farmers already using Balugu Yo to plan smarter harvests.
                    </p>
                    <button onClick={() => navigate('/register')} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 10,
                        padding: '16px 36px', borderRadius: 14,
                        background: 'linear-gradient(135deg,#16a34a,#0d9488)',
                        color: 'white', border: 'none', fontSize: 16, fontWeight: 700,
                        cursor: 'pointer', boxShadow: '0 8px 32px rgba(22,163,74,0.4)',
                        transition: 'all 0.25s',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(22,163,74,0.55)' }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(22,163,74,0.4)' }}>
                        Create Free Account <ArrowRight size={18} />
                    </button>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer style={{ padding: '32px 24px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg,#16a34a,#0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Sprout size={14} color="white" />
                    </div>
                    <span style={{ fontFamily: 'Poppins', fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>Balugu Yo</span>
                </div>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>© 2025 Balugu Yo — Makerere University. Built for Uganda's yam farmers.</p>
            </footer>

            <style>{`
                @media (max-width: 768px) {
                    .landing-stats { grid-template-columns: repeat(2,1fr) !important; }
                    .landing-features { grid-template-columns: 1fr !important; }
                    .landing-steps { grid-template-columns: 1fr !important; }
                    .landing-testimonials { grid-template-columns: 1fr !important; }
                }
                @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
            `}</style>
        </div>
    )
}
