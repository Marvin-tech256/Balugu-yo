import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Home, Wheat, Sprout, CloudRain, Bell, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from './Toast'

const linkStyle = (isActive) => ({
    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px',
    color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
    fontSize: 14, fontWeight: 500, transition: 'all 0.2s', textDecoration: 'none',
    background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
    borderLeft: isActive ? '3px solid #A5D6A7' : '3px solid transparent',
})

export default function Sidebar() {
    const { logout } = useAuth()
    const navigate = useNavigate()
    const showToast = useToast()

    const handleLogout = () => {
        logout()
        showToast('Logged out successfully')
        navigate('/login')
    }

    const links = [
        { to: '/dashboard', icon: <Home size={18} />, label: 'Dashboard' },
        { to: '/my-farms', icon: <Wheat size={18} />, label: 'My Farms' },
        { to: '/add-planting', icon: <Sprout size={18} />, label: 'Add Planting' },
        { to: '/weather', icon: <CloudRain size={18} />, label: 'Weather' },
        { to: '/alerts', icon: <Bell size={18} />, label: 'Alerts' },
    ]

    return (
        <div style={{
            width: 240, background: 'var(--primary-dark)', color: 'white',
            display: 'flex', flexDirection: 'column', position: 'fixed',
            height: '100vh', top: 0, left: 0, zIndex: 99
        }}>
            <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontFamily: 'Poppins', fontSize: 20, fontWeight: 700 }}>
                Balugu <span style={{ color: '#A5D6A7' }}>Yo</span>
            </div>
            <nav style={{ flex: 1, paddingTop: 16 }}>
                {links.map(l => (
                    <NavLink key={l.to} to={l.to} style={({ isActive }) => linkStyle(isActive)}>
                        {l.icon} {l.label}
                    </NavLink>
                ))}
            </nav>
            <div style={{ padding: 20, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <button onClick={handleLogout} style={{
                    display: 'flex', alignItems: 'center', gap: 10, background: 'none',
                    border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 13, cursor: 'pointer'
                }}>
                    <LogOut size={16} /> Logout
                </button>
            </div>
        </div>
    )
}
