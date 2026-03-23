import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

export default function Layout({ children, notifCount = 0 }) {
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
        }
      `}</style>
        </div>
    )
}
