import React from 'react'
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
        </nav>
    )
}
