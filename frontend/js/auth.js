// frontend/js/auth.js

const API = 'https://balugu-yo-api.onrender.com/api';

// Detect base path — works both locally and on Vercel
const getBase = () => {
  const path = window.location.pathname;
  if (path.includes('/frontend/')) {
    return '/frontend/';
  }
  return './';
};

// Save token and user to localStorage
const saveAuth = (token, user) => {
  localStorage.setItem('balugu_token', token);
  localStorage.setItem('balugu_user', JSON.stringify(user));
};

// Get token
const getToken = () => localStorage.getItem('balugu_token');

// Get user
const getUser = () => {
  const user = localStorage.getItem('balugu_user');
  return user ? JSON.parse(user) : null;
};

// Logout
const logout = () => {
  localStorage.removeItem('balugu_token');
  localStorage.removeItem('balugu_user');
  window.location.replace(getBase() + 'login.html');
};

// Redirect if not logged in
const requireAuth = () => {
  if (!getToken()) {
    window.location.replace(getBase() + 'login.html');
  }
};

// Redirect if already logged in
const redirectIfLoggedIn = () => {
  if (getToken()) {
    const user = getUser();
    if (user.role === 'admin') {
      window.location.replace(getBase() + 'admin.html');
    } else if (user.role === 'extension_officer') {
      window.location.replace(getBase() + 'extension-dashboard.html');
    } else {
      window.location.replace(getBase() + 'dashboard.html');
    }
  }
};

// Show toast message
const showToast = (message, type = 'success') => {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
};

// API helper with auth header
const apiCall = async (endpoint, method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    }
  };
  if (body) options.body = JSON.stringify(body);
  const response = await fetch(`${API}${endpoint}`, options);
  return response.json();
};