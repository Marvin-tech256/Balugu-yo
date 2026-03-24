import React, { useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

export default function Layout({ children, notifCount = 0 }) {
    const [sheetOpen, setSheetOpen] = useState(false)

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
            {/* Desktop sidebar */}
            <div style={{ display: 'none' }} className="sidebar-wrapper">
                <Sidebar />
            </div>

            {/* Top navbar (passes sheet open handler) */}
            <Navbar notifCount={notifCount} sheetOpen={sheetOpen} setSheetOpen={setSheetOpen} />

            {/* Main content — offset for desktop sidebar */}
            <main style={{ paddingBottom: 80 }}>
                {children}
            </main>

            {/* Mobile bottom nav */}
            <div className="mobile-only">
                <BottomNav onProfileClick={() => setSheetOpen(true)} />
            </div>

            <style>{`
        @media (min-width: 768px) {
          .sidebar-wrapper { display: block !important; }
          .mobile-only { display: none !important; }
          main { margin-left: 240px; padding-bottom: 40px; }
        }
      `}</style>
        </div>
    )
}
