<<<<<<< HEAD
import React from 'react'
=======
import React, { useState } from 'react'
>>>>>>> main
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

export default function Layout({ children, notifCount = 0 }) {
<<<<<<< HEAD
    return (
        <div>
            <Navbar notifCount={notifCount} />
            <div style={{ display: 'flex' }}>
                <div style={{ display: 'none' }} className="sidebar-wrap">
                    <Sidebar />
                </div>
                <main style={{ flex: 1, minHeight: 'calc(100vh - 60px)', paddingBottom: 80 }}>
                    <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px 16px' }}>
                        {children}
                    </div>
                </main>
            </div>
            <BottomNav />
            <style>{`
        @media (min-width: 768px) {
          .sidebar-wrap { display: block !important; }
          main { margin-left: 240px; padding-bottom: 40px !important; }
          nav[class*="bottom"] { display: none !important; }
=======
    const [collapsed, setCollapsed] = useState(false)
    const sidebarW = collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-w)'

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
            {/* Desktop sidebar */}
            <div className="desktop-only">
                <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
            </div>

            {/* Content area */}
            <div className="desktop-only" style={{ marginLeft: sidebarW, transition: 'margin-left 0.25s cubic-bezier(0.4,0,0.2,1)' }}>
                <Navbar notifCount={notifCount} sidebarW={sidebarW} />
                <main>{children}</main>
            </div>

            {/* Mobile layout */}
            <div className="mobile-only">
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
>>>>>>> main
        }
      `}</style>
        </div>
    )
}
