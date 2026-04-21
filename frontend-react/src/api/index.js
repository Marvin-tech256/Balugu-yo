import axios from 'axios'

const api = axios.create({
    baseURL: 'https://balugu-yo-api.onrender.com/api',
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
    (err) => Promise.reject(err.response?.data || err)
)

export default api
