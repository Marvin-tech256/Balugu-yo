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
    (res) => res.data,
    (err) => Promise.reject(err.response?.data || err)
)

export default api
