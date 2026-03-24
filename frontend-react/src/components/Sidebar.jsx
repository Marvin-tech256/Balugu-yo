import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Home, Wheat, Sprout, CloudRain, Bell, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from './Toast'

const links = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/my-farms', icon: Wheat, label: 'My Farms' },
    { to: '/add-planting', icon: Sprout, label: 'Add Planting' },
    { to: '/weather', icon: CloudRain, label: 'Weather' },
    { to: '/alerts', icon: Bell, label: 'Alerts' },
]

export default function Sidebar() {
    const { logout } = useAuth()
    const navigate = useNavigate()
    const showToast = useToast()

    const handleLogout = () => {
        logout()
        showToast('Logged out successfully')
        navigate('/login')
    }

    return (
        <aside style={{
            width: 240, background: 'var(--primary-dark)', color: 'white',
            display: 'flex', flexDirection: 'column', position: 'fixed',
            height: '100vh', top: 0, left: 0, zIndex: 99,
        }}>
            <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontFamily: 'Poppins', fontSize: 20, fontWeight: 700 }}>
                Balugu <span style={{ color: '#A5D6A7' }}>Yo</span>
            </div>
            <nav style={{ flex: 1, padding: '16px 0' }}>
                {links.map(({ to, icon: Icon, label }) => (
                    <NavLink key={to} to={to} style={({ isActive }) => ({
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 20px', color: isActive ? 'white' : 'rgba(255,255,255,0.75)',
                        fontSize: 14, fontWeight: 500, textDecoration: 'none',
                        background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                        borderLeft: isActive ? '3px solid #A5D6A7' : '3px solid transparent',
                        transition: 'all 0.2s',
                    })}>
                        <Icon size={18} />
                        {label}
                    </NavLink>
                ))}
            </nav>
            <div style={{ padding: 20, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <button onClick={handleLogout} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)',
                    fontSize: 13, cursor: 'pointer', fontFamily: 'Inter',
                }}>
                    <LogOut size={16} /> Logout
                </button>
            </div>
        </aside>
    )
}
