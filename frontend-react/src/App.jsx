import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './components/Toast'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import MyFarms from './pages/MyFarms'
import AddPlanting from './pages/AddPlanting'
import Weather from './pages/Weather'
import Alerts from './pages/Alerts'
import Admin from './pages/Admin'
import ExtDashboard from './pages/ExtDashboard'

function PrivateRoute({ children, roles }) {
    const { user } = useAuth()
    if (!user) return <Navigate to="/login" replace />
    if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />
    return children
}

function PublicRoute({ children }) {
    const { user } = useAuth()
    if (!user) return children
    if (user.role === 'admin') return <Navigate to="/admin" replace />
    if (user.role === 'extension_officer') return <Navigate to="/ext-dashboard" replace />
    return <Navigate to="/dashboard" replace />
}

export default function App() {
    return (
        <AuthProvider>
            <ToastProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
                        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                        <Route path="/dashboard" element={<PrivateRoute roles={['farmer']}><Dashboard /></PrivateRoute>} />
                        <Route path="/my-farms" element={<PrivateRoute roles={['farmer']}><MyFarms /></PrivateRoute>} />
                        <Route path="/add-planting" element={<PrivateRoute roles={['farmer']}><AddPlanting /></PrivateRoute>} />
                        <Route path="/weather" element={<PrivateRoute><Weather /></PrivateRoute>} />
                        <Route path="/alerts" element={<PrivateRoute><Alerts /></PrivateRoute>} />
                        <Route path="/admin" element={<PrivateRoute roles={['admin']}><Admin /></PrivateRoute>} />
                        <Route path="/ext-dashboard" element={<PrivateRoute roles={['extension_officer']}><ExtDashboard /></PrivateRoute>} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </BrowserRouter>
            </ToastProvider>
        </AuthProvider>
    )
}
