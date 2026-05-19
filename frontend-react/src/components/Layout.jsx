import React, { useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

export default function Layout({ children, notifCount = 0 }) {
    const [collapsed, setCollapsed] = useState(false)
    const sidebarW = collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-w)'

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative' }}>
            {/* Background photo */}
            <div style={{
                position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
                backgroundImage: 'url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=85)',
                backgroundSize: 'cover', backgroundPosition: 'center',
                filter: 'brightness(0.55) saturate(1.2)',
            }} />
            <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'rgba(240,253,244,0.78)' }} />
            {/* Desktop sidebar */}
            <div className="desktop-only" style={{ position: 'relative', zIndex: 10 }}>
                <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
            </div>

            {/* Content area */}
            <div className="desktop-only" style={{ marginLeft: sidebarW, transition: 'margin-left 0.25s cubic-bezier(0.4,0,0.2,1)', position: 'relative', zIndex: 1 }}>
                <Navbar notifCount={notifCount} sidebarW={sidebarW} />
                <main>{children}</main>
            </div>

            {/* Mobile layout */}
            <div className="mobile-only" style={{ position: 'relative', zIndex: 1 }}>
                <Navbar notifCount={notifCount} />
                <main style={{ paddingBottom: 64 }}>{children}</main>
                <BottomNav />
            </div>

            <style>{`
        .desktop-only { display: none; }
        .mobile-only { display: block; }
        @media (min-width: 768px) {
          .desktop-only { display: block; }
          .mobile-only { display: none; }
        }
      `}</style>
        </div>
    )
}
