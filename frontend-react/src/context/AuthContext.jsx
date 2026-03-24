import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try { return JSON.parse(localStorage.getItem('balugu_user')) } catch { return null }
    })

    const saveAuth = (token, userData) => {
        localStorage.setItem('balugu_token', token)
        localStorage.setItem('balugu_user', JSON.stringify(userData))
        setUser(userData)
    }

    const logout = () => {
        localStorage.removeItem('balugu_token')
        localStorage.removeItem('balugu_user')
        setUser(null)
    }

    const getToken = () => localStorage.getItem('balugu_token')

    return (
        <AuthContext.Provider value={{ user, saveAuth, logout, getToken }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
