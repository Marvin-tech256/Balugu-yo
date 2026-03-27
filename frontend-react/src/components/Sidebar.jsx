import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
<<<<<<< HEAD
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
=======
import { Home, Wheat, Sprout, CloudRain, Bell, LogOut, ChevronLeft, ChevronRight, Leaf } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from './Toast'

const links = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/my-farms', icon: Wheat, label: 'My Farms' },
    { to: '/add-planting', icon: Sprout, label: 'Add Planting' },
    { to: '/weather', icon: CloudRain, label: 'Weather' },
    { to: '/alerts', icon: Bell, label: 'Alerts' },
]

export default function Sidebar({ collapsed, onToggle }) {
    const { logout, user } = useAuth()
>>>>>>> main
    const navigate = useNavigate()
    const showToast = useToast()

    const handleLogout = () => {
        logout()
        showToast('Logged out successfully')
        navigate('/login')
    }

<<<<<<< HEAD
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
=======
    const w = collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-w)'

    return (
        <aside style={{
            width: w, minWidth: w, background: 'linear-gradient(180deg, #0f2d1a 0%, #14532d 50%, #0f3d35 100%)',
            display: 'flex', flexDirection: 'column', position: 'fixed',
            height: '100vh', top: 0, left: 0, zIndex: 99,
            transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
            overflow: 'hidden', boxShadow: '2px 0 12px rgba(0,0,0,0.15)',
        }}>
            {/* Logo */}
            <div style={{ padding: collapsed ? '16px 0' : '16px 14px', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', borderBottom: '1px solid rgba(255,255,255,0.07)', minHeight: 56 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #16a34a, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Leaf size={16} color="white" />
                    </div>
                    {!collapsed && (
                        <span style={{ fontFamily: 'Poppins', fontSize: 16, fontWeight: 700, color: 'white', whiteSpace: 'nowrap' }}>
                            Balugu <span style={{ color: '#6ee7b7' }}>Yo</span>
                        </span>
                    )}
                </div>
                {!collapsed && (
                    <button onClick={onToggle} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: 'rgba(255,255,255,0.6)', width: 24, height: 24, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                        <ChevronLeft size={14} />
                    </button>
                )}
            </div>

            {/* Collapse toggle when collapsed */}
            {collapsed && (
                <button onClick={onToggle} style={{ margin: '8px auto', background: 'rgba(255,255,255,0.08)', border: 'none', color: 'rgba(255,255,255,0.6)', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <ChevronRight size={14} />
                </button>
            )}

            {/* Nav links */}
            <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto', overflowX: 'hidden' }}>
                {links.map(({ to, icon: Icon, label }) => (
                    <NavLink key={to} to={to} title={collapsed ? label : undefined}
                        className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}${collapsed ? ' sidebar-collapsed' : ''}`}>
                        <Icon size={17} className="link-icon" />
                        <span className="link-label">{label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* User + logout */}
            <div style={{ padding: collapsed ? '12px 0' : '12px 8px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                {!collapsed && user && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 6px', marginBottom: 4 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #16a34a, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                            {user.full_name?.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.full_name}</div>
                            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', textTransform: 'capitalize' }}>{user.role?.replace('_', ' ')}</div>
                        </div>
                    </div>
                )}
                <button onClick={handleLogout} title={collapsed ? 'Logout' : undefined} style={{
                    display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start',
                    gap: 8, width: '100%', padding: collapsed ? '8px 0' : '8px 6px',
                    background: 'none', border: 'none', color: 'rgba(255,255,255,0.45)',
                    fontSize: 12, cursor: 'pointer', borderRadius: 6, transition: 'all 0.15s',
                }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fca5a5'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}>
                    <LogOut size={15} />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
>>>>>>> main
    )
}
