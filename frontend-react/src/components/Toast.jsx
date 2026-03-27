import React, { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])

    const showToast = useCallback((message, type = 'success') => {
        const id = Date.now()
        setToasts(t => [...t, { id, message, type }])
        setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000)
    }, [])

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {toasts.map(t => (
                    <div key={t.id} style={{
                        padding: '12px 20px', borderRadius: 12, color: 'white', fontWeight: 500,
                        fontSize: 14, boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                        background: t.type === 'error' ? '#C62828' : t.type === 'warning' ? '#F57F17' : '#2E7D32',
                        animation: 'slideIn 0.3s ease',
                    }}>
                        {t.message}
                    </div>
                ))}
            </div>
<<<<<<< HEAD
            <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity:0 } to { transform: translateX(0); opacity:1 } }`}</style>
=======
            <style>{`@keyframes slideIn { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }`}</style>
>>>>>>> main
        </ToastContext.Provider>
    )
}

export const useToast = () => useContext(ToastContext)
