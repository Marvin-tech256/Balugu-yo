import React from 'react'
<<<<<<< HEAD
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
=======
import { NavLink } from 'react-router-dom'
import { Home, Wheat, Sprout, CloudRain, Bell } from 'lucide-react'

const links = [
    { to: '/dashboard', icon: Home, label: 'Home' },
    { to: '/my-farms', icon: Wheat, label: 'Farms' },
    { to: '/add-planting', icon: Sprout, label: 'Plant' },
    { to: '/weather', icon: CloudRain, label: 'Weather' },
    { to: '/alerts', icon: Bell, label: 'Alerts' },
]

export default function BottomNav() {
    return (
        <nav style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            background: 'white', borderTop: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-around',
            padding: '6px 0 8px', zIndex: 100,
            boxShadow: '0 -4px 12px rgba(0,0,0,0.06)',
        }}>
            {links.map(({ to, icon: Icon, label }) => (
                <NavLink key={to} to={to} style={({ isActive }) => ({
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: 3, color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                    fontSize: 10, fontWeight: isActive ? 600 : 500,
                    padding: '4px 10px', textDecoration: 'none', transition: 'color 0.15s',
                    position: 'relative',
                })}>
                    {({ isActive }) => (
                        <>
                            {isActive && <span style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 20, height: 2, background: 'var(--primary)', borderRadius: '0 0 2px 2px' }} />}
                            <Icon size={20} />
                            {label}
                        </>
                    )}
                </NavLink>
            ))}
>>>>>>> main
        </nav>
    )
}
