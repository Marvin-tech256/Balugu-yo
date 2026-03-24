import React, { useEffect, useState } from 'react'
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

export default function Weather() {
    const [district, setDistrict] = useState('Buikwe')
    const [weather, setWeather] = useState(null)
    const [forecast, setForecast] = useState([])
    const [impact, setImpact] = useState(null)
    const [loading, setLoading] = useState(true)

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
        </Layout>
    )
}
