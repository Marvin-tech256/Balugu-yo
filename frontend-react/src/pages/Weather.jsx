import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Droplets, CloudRain, Thermometer, Lightbulb } from 'lucide-react'
import Layout from '../components/Layout'
import api from '../api'

const DISTRICTS = ['Buikwe', 'Mukono', 'Kampala', 'Jinja', 'Mbale', 'Masaka']
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function weatherIcon(condition) {
    const map = { Clear: '☀️', Clouds: '⛅', Rain: '🌧️', Drizzle: '🌦️', Thunderstorm: '⛈️', Mist: '🌫️', Haze: '🌫️' }
    return map[condition] || '🌤️'
}

export default function Weather() {
    const navigate = useNavigate()
    const [district, setDistrict] = useState('Buikwe')
    const [weather, setWeather] = useState(null)
    const [forecast, setForecast] = useState([])
    const [impact, setImpact] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => { loadWeather() }, [district])

    async function loadWeather() {
        setLoading(true)
        try {
            const [wData, iData] = await Promise.all([
                api.get('/weather/current/' + district),
                api.get('/weather/impact/' + district),
            ])
            if (wData.success) setWeather(wData.weather)
            if (iData.success) setImpact(iData.impact)
            const fData = await api.get('/weather/forecast/' + district)
            if (fData.success) setForecast(fData.forecast)
        } catch (err) {
            console.error(err)
        }
        setLoading(false)
    }

    const impactClass = (val) => {
        if (['Good', 'Optimal', 'Low'].includes(val)) return { background: '#E8F5E9', color: '#2E7D32' }
        if (['Moderate', 'Normal'].includes(val)) return { background: '#FFF8E1', color: '#F57F17' }
        return { background: '#FFEBEE', color: '#C62828' }
    }

    return (
        <Layout>
            <div style={{ background: 'linear-gradient(135deg,#1B5E20,#00897B)', padding: '20px 24px 48px', color: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ArrowLeft size={18} />
                    </button>
                    <h1 style={{ fontFamily: 'Poppins', fontSize: 20, color: 'white' }}>Weather Overview</h1>
                </div>
                <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4 }}>
                    {DISTRICTS.map(d => (
                        <button key={d} onClick={() => setDistrict(d)} style={{ padding: '8px 16px', borderRadius: 20, border: '1.5px solid ' + (d === district ? 'white' : 'rgba(255,255,255,0.4)'), color: d === district ? '#1B5E20' : 'rgba(255,255,255,0.85)', background: d === district ? 'white' : 'transparent', fontSize: 13, fontWeight: d === district ? 700 : 500, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'Inter' }}>
                            {d}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ background: 'var(--bg)', borderRadius: '20px 20px 0 0', marginTop: -24, padding: '24px 20px 100px', maxWidth: 600, margin: '-24px auto 0', minHeight: 'calc(100vh - 140px)' }}>
                {loading ? (
                    <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: 40, textAlign: 'center', color: 'var(--text-gray)', boxShadow: 'var(--shadow)' }}>
                        <div style={{ fontSize: 36, marginBottom: 12 }}>🌤️</div>
                        <p>Loading weather data...</p>
                    </div>
                ) : (
                    <>
                        {weather && (
                            <>
                                <div style={{ background: 'linear-gradient(135deg,#1B5E20,#2E7D32)', borderRadius: 20, padding: 24, color: 'white', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>{district}, Uganda</div>
                                        <div style={{ fontFamily: 'Poppins', fontSize: 56, fontWeight: 700, lineHeight: 1 }}>
                                            {weather.temperature.current}<span style={{ fontSize: 24, fontWeight: 400 }}>°C</span>
                                        </div>
                                        <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', marginTop: 4, textTransform: 'capitalize' }}>{weather.description}</div>
                                    </div>
                                    <div style={{ fontSize: 64 }}>{weatherIcon(weather.condition)}</div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
                                    {[{ icon: Droplets, value: weather.humidity + '%', label: 'Humidity' }, { icon: CloudRain, value: weather.rainfall_mm + 'mm', label: 'Rainfall' }, { icon: Thermometer, value: weather.temperature.min + '–' + weather.temperature.max + '°', label: 'Min–Max' }].map(({ icon: Icon, value, label }) => (
                                        <div key={label} style={{ background: 'white', borderRadius: 'var(--radius)', padding: '14px 10px', textAlign: 'center', boxShadow: 'var(--shadow)' }}>
                                            <Icon size={20} color="var(--primary)" style={{ marginBottom: 4 }} />
                                            <div style={{ fontFamily: 'Poppins', fontSize: 16, fontWeight: 700, color: 'var(--primary)' }}>{value}</div>
                                            <div style={{ fontSize: 11, color: 'var(--text-gray)', marginTop: 2 }}>{label}</div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {impact && (
                            <div style={{ background: '#FFF8E1', border: '1px solid #F57F17', borderRadius: 'var(--radius)', padding: 16, marginBottom: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                <Lightbulb size={24} color="#F57F17" style={{ flexShrink: 0 }} />
                                <div>
                                    <div style={{ fontWeight: 600, color: '#F57F17', marginBottom: 4 }}>Harvest Recommendation</div>
                                    <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>{impact.harvest_recommendation}</div>
                                </div>
                            </div>
                        )}

                        {forecast.length > 0 && (
                            <>
                                <h3 style={{ fontSize: 16, marginBottom: 12 }}>7-Day Forecast</h3>
                                <div style={{ display: 'flex', gap: 10, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 8, marginBottom: 16 }}>
                                    {forecast.map((day, i) => {
                                        const d = new Date(day.date)
                                        const dayName = i === 0 ? 'Today' : DAYS[d.getDay()]
                                        return (
                                            <div key={i} style={{ minWidth: 80, background: i === 0 ? 'var(--primary)' : 'white', borderRadius: 'var(--radius)', padding: '14px 10px', textAlign: 'center', boxShadow: 'var(--shadow)', flexShrink: 0, color: i === 0 ? 'white' : 'inherit' }}>
                                                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase' }}>{dayName}</div>
                                                <div style={{ fontSize: 24, marginBottom: 8 }}>{weatherIcon(day.condition)}</div>
                                                <div style={{ fontFamily: 'Poppins', fontSize: 15, fontWeight: 700 }}>{day.temp_max}°</div>
                                                <div style={{ fontSize: 11, marginTop: 4, color: i === 0 ? '#A5D6A7' : 'var(--accent)' }}>{day.rainfall_mm}mm</div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </>
                        )}

                        {impact && (
                            <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: 20, boxShadow: 'var(--shadow)' }}>
                                <div style={{ fontFamily: 'Poppins', fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Impact on Your Yams</div>
                                {[{ label: 'Soil Moisture', value: impact.soil_moisture }, { label: 'Growth Rate', value: impact.growth_rate }, { label: 'Pest Risk', value: impact.pest_risk }].map(({ label, value }) => (
                                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                                        <div style={{ fontSize: 13, color: 'var(--text-gray)' }}>{label}</div>
                                        <span style={{ fontSize: 13, fontWeight: 600, padding: '4px 12px', borderRadius: 20, ...impactClass(value) }}>{value}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </Layout>
    )
}
