import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Wheat, Sprout, CloudRain, User } from 'lucide-react'

const links = [
    { to: '/dashboard', icon: Home, label: 'Home' },
    { to: '/my-farms', icon: Wheat, label: 'Farms' },
    { to: '/add-planting', icon: Sprout, label: 'Plant' },
    { to: '/weather', icon: CloudRain, label: 'Weather' },
]

export default function BottomNav({ onProfileClick }) {
    return (
        <nav style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            background: 'white', display: 'flex', justifyContent: 'space-around',
            padding: '8px 0', boxShadow: '0 -2px 12px rgba(0,0,0,0.1)', zIndex: 100,
        }}>
            {links.map(({ to, icon: Icon, label }) => (
                <NavLink key={to} to={to} style={({ isActive }) => ({
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: 4, color: isActive ? 'var(--primary)' : 'var(--text-gray)',
                    fontSize: 11, fontWeight: 500, padding: '4px 12px',
                    textDecoration: 'none', transition: 'color 0.2s',
                })}>
                    <Icon size={22} />
                    {label}
                </NavLink>
            ))}
            <button onClick={onProfileClick} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 4, color: 'var(--text-gray)', fontSize: 11, fontWeight: 500,
                padding: '4px 12px', background: 'none', border: 'none', cursor: 'pointer',
            }}>
                <User size={22} />
                Profile
            </button>
        </nav>
    )
}
