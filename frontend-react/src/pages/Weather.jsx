import React, { useEffect, useState } from 'react'
<<<<<<< HEAD
import { Droplets, Wind, Thermometer, CloudRain } from 'lucide-react'
import Layout from '../components/Layout'
import api from '../api'

const districts = ['Buikwe', 'Mukono', 'Kampala', 'Jinja', 'Mbale', 'Masaka']
const weatherIcons = { Clear: '☀️', Clouds: '⛅', Rain: '🌧️', Drizzle: '🌦️', Thunderstorm: '⛈️', Mist: '🌫️', default: '🌤️' }
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
=======
import { Droplets, CloudRain, Thermometer, Lightbulb, Wind, Sun, Cloud, CloudLightning, CloudDrizzle } from 'lucide-react'
import Layout from '../components/Layout'
import api from '../api'

const DISTRICTS = ['Buikwe', 'Mukono', 'Kampala', 'Jinja', 'Mbale', 'Masaka']
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function WeatherIcon({ condition, size = 20 }) {
    const props = { size, strokeWidth: 1.8 }
    const map = {
        Clear: <Sun {...props} color="#f59e0b" />,
        Clouds: <Cloud {...props} color="#94a3b8" />,
        Rain: <CloudRain {...props} color="#3b82f6" />,
        Drizzle: <CloudDrizzle {...props} color="#60a5fa" />,
        Thunderstorm: <CloudLightning {...props} color="#7c3aed" />,
    }
    return map[condition] || <Cloud {...props} color="#94a3b8" />
}

function impactStyle(val) {
    if (['Good', 'Optimal', 'Low'].includes(val)) return { bg: 'var(--primary-bg)', color: 'var(--primary-mid)' }
    if (['Moderate', 'Normal'].includes(val)) return { bg: 'var(--gold-light)', color: 'var(--gold-dark)' }
    return { bg: 'var(--danger-bg)', color: 'var(--danger)' }
}
>>>>>>> main

export default function Weather() {
    const [district, setDistrict] = useState('Buikwe')
    const [weather, setWeather] = useState(null)
    const [forecast, setForecast] = useState([])
    const [impact, setImpact] = useState(null)
    const [loading, setLoading] = useState(true)

<<<<<<< HEAD
    const load = async (d) => {
        setLoading(true)
        try {
            const [w, imp, fc] = await Promise.all([
                api.get(`/weather/current/${d}`),
                api.get(`/weather/impact/${d}`),
                api.get(`/weather/forecast/${d}`)
            ])
            if (w.success) setWeather(w.weather)
            if (imp.success) setImpact(imp)
            if (fc.success) setForecast(fc.forecast)
        } catch { }
        setLoading(false)
    }

    useEffect(() => { load(district) }, [district])

    const impactClass = (val) => ['Good', 'Optimal', 'Low'].includes(val) ? { background: '#E8F5E9', color: '#2E7D32' } : ['Moderate', 'Normal'].includes(val) ? { background: '#FFF8E1', color: '#F57F17' } : { background: '#FFEBEE', color: '#C62828' }

    return (
        <Layout>
            <h2 style={{ fontSize: 22, marginBottom: 16 }}>Weather Overview</h2>

            {/* District selector */}
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 20, paddingBottom: 4, scrollbarWidth: 'none' }}>
                {districts.map(d => (
                    <button key={d} onClick={() => setDistrict(d)} style={{ padding: '8px 16px', borderRadius: 20, border: `1.5px solid ${district === d ? 'var(--primary)' : 'var(--border)'}`, background: district === d ? '#E8F5E9' : 'white', color: district === d ? 'var(--primary)' : 'var(--text-gray)', fontSize: 13, fontWeight: district === d ? 700 : 500, cursor: 'pointer', whiteSpace: 'nowrap' }}>{d}</button>
                ))}
            </div>

            {loading ? (
                <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: 40, textAlign: 'center', color: 'var(--text-gray)', boxShadow: 'var(--shadow)' }}>
                    <CloudRain size={36} style={{ marginBottom: 12, opacity: 0.4 }} /><p>Loading weather data...</p>
                </div>
            ) : weather && (
                <>
                    {/* Current */}
                    <div style={{ background: 'linear-gradient(135deg,#1B5E20,#2E7D32)', borderRadius: 20, padding: 24, color: 'white', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>{district}, Uganda</div>
                            <div style={{ fontFamily: 'Poppins', fontSize: 56, fontWeight: 700, lineHeight: 1 }}>{weather.temperature.current}<span style={{ fontSize: 24, fontWeight: 400 }}>°C</span></div>
                            <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', marginTop: 4, textTransform: 'capitalize' }}>{weather.description}</div>
                        </div>
                        <div style={{ fontSize: 64 }}>{weatherIcons[weather.condition] || weatherIcons.default}</div>
                    </div>

                    {/* Details */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
                        {[{ icon: <Droplets size={20} color="var(--primary)" />, val: `${weather.humidity}%`, label: 'Humidity' },
                        { icon: <CloudRain size={20} color="var(--primary)" />, val: `${weather.rainfall_mm}mm`, label: 'Rainfall' },
                        { icon: <Thermometer size={20} color="var(--primary)" />, val: `${weather.temperature.min}–${weather.temperature.max}°`, label: 'Min–Max' }].map(d => (
                            <div key={d.label} style={{ background: 'white', borderRadius: 'var(--radius)', padding: '14px 10px', textAlign: 'center', boxShadow: 'var(--shadow)' }}>
                                <div style={{ marginBottom: 4 }}>{d.icon}</div>
                                <div style={{ fontFamily: 'Poppins', fontSize: 16, fontWeight: 700, color: 'var(--primary)' }}>{d.val}</div>
                                <div style={{ fontSize: 11, color: 'var(--text-gray)', marginTop: 2 }}>{d.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Forecast */}
                    <h3 style={{ fontSize: 16, marginBottom: 12 }}>7-Day Forecast</h3>
                    <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8, marginBottom: 16, scrollbarWidth: 'none' }}>
                        {forecast.map((day, i) => {
                            const d = new Date(day.date)
                            return (
                                <div key={i} style={{ minWidth: 80, background: i === 0 ? 'var(--primary)' : 'white', borderRadius: 'var(--radius)', padding: '14px 10px', textAlign: 'center', boxShadow: 'var(--shadow)', flexShrink: 0, color: i === 0 ? 'white' : 'var(--text)' }}>
                                    <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase' }}>{i === 0 ? 'Today' : days[d.getDay()]}</div>
                                    <div style={{ fontSize: 24, marginBottom: 8 }}>{weatherIcons[day.condition] || weatherIcons.default}</div>
                                    <div style={{ fontFamily: 'Poppins', fontSize: 15, fontWeight: 700 }}>{day.temp_max}°</div>
                                    <div style={{ fontSize: 11, marginTop: 4, color: i === 0 ? '#A5D6A7' : 'var(--accent)' }}>{day.rainfall_mm}mm</div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Impact */}
                    {impact?.impact && (
                        <>
                            {impact.impact.harvest_recommendation && (
                                <div style={{ background: '#FFF8E1', border: '1px solid var(--amber)', borderRadius: 'var(--radius)', padding: 16, marginBottom: 16, display: 'flex', gap: 12 }}>
                                    <div style={{ fontSize: 24, flexShrink: 0 }}>💡</div>
                                    <div>
                                        <div style={{ fontWeight: 600, color: '#F57F17', marginBottom: 4 }}>Harvest Recommendation</div>
                                        <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>{impact.impact.harvest_recommendation}</div>
                                    </div>
                                </div>
                            )}
                            <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: 20, boxShadow: 'var(--shadow)' }}>
                                <div style={{ fontFamily: 'Poppins', fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Impact on Your Yams</div>
                                {[{ label: 'Soil Moisture', val: impact.impact.soil_moisture },
                                { label: 'Growth Rate', val: impact.impact.growth_rate },
                                { label: 'Pest Risk', val: impact.impact.pest_risk }].map(r => (
                                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                                        <div style={{ fontSize: 13, color: 'var(--text-gray)' }}>{r.label}</div>
                                        <span style={{ fontSize: 13, fontWeight: 600, padding: '4px 12px', borderRadius: 20, ...impactClass(r.val) }}>{r.val}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </>
            )}
=======
    useEffect(() => { loadWeather() }, [district])

    async function loadWeather() {
        setLoading(true)
        try {
            const [wData, iData, fData] = await Promise.all([
                api.get('/weather/current/' + district),
                api.get('/weather/impact/' + district),
                api.get('/weather/forecast/' + district),
            ])
            if (wData.success) setWeather(wData.weather)
            if (iData.success) setImpact(iData.impact)
            if (fData.success) setForecast(fData.forecast)
        } catch (err) { console.error(err) }
        setLoading(false)
    }

    return (
        <Layout>
            <div style={{ padding: '20px 24px', maxWidth: 900, margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: 16 }}>
                    <h1 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)' }}>Weather Overview</h1>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Current conditions and forecast for your district</p>
                </div>

                {/* District chips */}
                <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4, marginBottom: 20 }}>
                    {DISTRICTS.map(d => (
                        <button key={d} onClick={() => setDistrict(d)}
                            className={`chip-option${d === district ? ' active' : ''}`}
                            style={{ flexShrink: 0 }}>
                            {d}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                        <Cloud size={36} color="var(--border)" style={{ marginBottom: 10 }} />
                        <p>Loading weather data...</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                        {/* Left column */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {/* Current weather hero */}
                            {weather && (
                                <div style={{ background: 'linear-gradient(135deg, #052e16 0%, #14532d 50%, #065f46 100%)', borderRadius: 16, padding: '20px 22px', color: 'white', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', right: -10, top: -10, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>{district}, Uganda</div>
                                        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 6 }}>
                                            <div>
                                                <div style={{ fontFamily: 'Poppins', fontSize: 52, fontWeight: 700, lineHeight: 1 }}>
                                                    {weather.temperature.current}<span style={{ fontSize: 22, fontWeight: 400 }}>°C</span>
                                                </div>
                                                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 4, textTransform: 'capitalize' }}>{weather.description}</div>
                                            </div>
                                            <WeatherIcon condition={weather.condition} size={52} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Stat cards */}
                            {weather && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                                    {[
                                        { icon: Droplets, value: weather.humidity + '%', label: 'Humidity', color: 'var(--teal)' },
                                        { icon: CloudRain, value: weather.rainfall_mm + 'mm', label: 'Rainfall', color: '#3b82f6' },
                                        { icon: Thermometer, value: `${weather.temperature.min}–${weather.temperature.max}°`, label: 'Range', color: 'var(--gold)' },
                                    ].map(({ icon: Icon, value, label, color }) => (
                                        <div key={label} className="stat-card" style={{ textAlign: 'center' }}>
                                            <Icon size={16} color={color} style={{ marginBottom: 4 }} />
                                            <div style={{ fontFamily: 'Poppins', fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{value}</div>
                                            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{label}</div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Harvest recommendation */}
                            {impact && (
                                <div className="card" style={{ padding: '14px 16px', borderLeft: '3px solid var(--gold)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                    <Lightbulb size={18} color="var(--gold)" style={{ flexShrink: 0, marginTop: 1 }} />
                                    <div>
                                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gold-dark)', marginBottom: 4 }}>Harvest Recommendation</div>
                                        <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6 }}>{impact.harvest_recommendation}</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right column */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {/* 7-day forecast */}
                            {forecast.length > 0 && (
                                <div className="card" style={{ padding: '14px 16px' }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>7-Day Forecast</div>
                                    <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4 }}>
                                        {forecast.map((day, i) => {
                                            const d = new Date(day.date)
                                            const dayName = i === 0 ? 'Today' : DAYS[d.getDay()]
                                            const isToday = i === 0
                                            return (
                                                <div key={i} style={{
                                                    minWidth: 68, borderRadius: 10, padding: '10px 8px', textAlign: 'center', flexShrink: 0,
                                                    background: isToday ? 'linear-gradient(135deg, var(--primary-dark), var(--teal))' : 'var(--surface-2)',
                                                    color: isToday ? 'white' : 'var(--text)',
                                                }}>
                                                    <div style={{ fontSize: 10, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', color: isToday ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)' }}>{dayName}</div>
                                                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
                                                        <WeatherIcon condition={day.condition} size={18} />
                                                    </div>
                                                    <div style={{ fontFamily: 'Poppins', fontSize: 14, fontWeight: 700 }}>{day.temp_max}°</div>
                                                    <div style={{ fontSize: 10, marginTop: 3, color: isToday ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)' }}>{day.rainfall_mm}mm</div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Impact table */}
                            {impact && (
                                <div className="card" style={{ padding: '14px 16px' }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>Impact on Your Yams</div>
                                    {[
                                        { label: 'Soil Moisture', value: impact.soil_moisture },
                                        { label: 'Growth Rate', value: impact.growth_rate },
                                        { label: 'Pest Risk', value: impact.pest_risk },
                                    ].map(({ label, value }) => {
                                        const s = impactStyle(value)
                                        return (
                                            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--border)' }}>
                                                <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{label}</span>
                                                <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: s.bg, color: s.color }}>{value}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
>>>>>>> main
        </Layout>
    )
}
