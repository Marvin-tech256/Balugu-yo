import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Home, Wheat, Sprout, CloudRain, Bell, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from './Toast'

const navStyle = (active) => ({
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
    color: active ? 'var(--primary)' : 'var(--text-gray)',
    fontSize: 11, fontWeight: 500, padding: '4px 10px', borderRadius: 8,
    border: 'none', background: 'none', cursor: 'pointer', textDecoration: 'none'
})

export default function BottomNav({ active }) {
    const { logout } = useAuth()
    const navigate = useNavigate()
    const showToast = useToast()

    const handleLogout = () => {
        logout()
        showToast('Logged out successfully')
        navigate('/login')
    }

    const items = [
        { to: '/dashboard', icon: <Home size={22} />, label: 'Home' },
        { to: '/my-farms', icon: <Wheat size={22} />, label: 'Farms' },
        { to: '/add-planting', icon: <Sprout size={22} />, label: 'Plant' },
        { to: '/weather', icon: <CloudRain size={22} />, label: 'Weather' },
        { to: '/alerts', icon: <Bell size={22} />, label: 'Alerts' },
    ]

    return (
        <nav style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white',
            display: 'flex', justifyContent: 'space-around', padding: '8px 0',
            boxShadow: '0 -2px 12px rgba(0,0,0,0.1)', zIndex: 100
        }}>
            {items.map(item => (
                <NavLink key={item.to} to={item.to} style={({ isActive }) => navStyle(isActive)}>
                    {item.icon}
                    {item.label}
                </NavLink>
            ))}
            <button onClick={handleLogout} style={navStyle(false)}>
                <LogOut size={22} />
                Logout
            </button>
        </nav>
    )
}
