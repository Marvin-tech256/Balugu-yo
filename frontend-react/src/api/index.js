import axios from 'axios'

const api = axios.create({
    baseURL: 'https://balugu-yo.onrender.com/api',
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('balugu_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

api.interceptors.response.use(
    (res) => {
        // Detect HTML response (Render cold start / security checkpoint)
        if (typeof res.data === 'string' && res.data.includes('<!DOCTYPE')) {
            return Promise.reject({ message: 'Server is waking up, please try again in a moment.' })
        }
        return res.data
    },
    (err) => {
        const status = err.response?.status
        const message = err.response?.data?.message || ''
        if (status === 401 && (message.includes('expired') || message.includes('invalid'))) {
            localStorage.removeItem('balugu_token')
            localStorage.removeItem('balugu_user')
            window.location.href = '/login'
        }
        return Promise.reject(err.response?.data || err)
    }
)

export default api
