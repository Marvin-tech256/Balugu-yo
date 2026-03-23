import React, { useEffect, useState } from 'react'
import { Droplets, Wind, Thermometer, CloudRain } from 'lucide-react'
import Layout from '../components/Layout'
import api from '../api'

const districts = ['Buikwe', 'Mukono', 'Kampala', 'Jinja', 'Mbale', 'Masaka']
const weatherIcons = { Clear: '☀️', Clouds: '⛅', Rain: '🌧️', Drizzle: '🌦️', Thunderstorm: '⛈️', Mist: '🌫️', default: '🌤️' }
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function Weather() {
    const [district, setDistrict] = useState('Buikwe')
    const [weather, setWeather] = useState(null)
    const [forecast, setForecast] = useState([])
    const [impact, setImpact] = useState(null)
    const [loading, setLoading] = useState(true)

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
        </Layout>
    )
}
