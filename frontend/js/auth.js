// frontend/js/auth.js

const API = 'https://balugu-yo-api.onrender.com/api';

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

// Resolve a page path relative to the current page's directory
const toPage = (page) => {
  const parts = window.location.pathname.split('/');
  parts[parts.length - 1] = page;
  return parts.join('/');
};

// Logout
const logout = () => {
  localStorage.removeItem('balugu_token');
  localStorage.removeItem('balugu_user');
  const toast = document.createElement('div');
  toast.className = 'toast toast-success';
  toast.textContent = 'You have been logged out successfully';
  Object.assign(toast.style, {
    position: 'fixed', bottom: '24px', left: '50%',
    transform: 'translateX(-50%)', background: '#2E7D32',
    color: 'white', padding: '12px 24px', borderRadius: '12px',
    fontFamily: 'Poppins,sans-serif', fontSize: '14px',
    fontWeight: '600', zIndex: '9999', boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
  });
  document.body.appendChild(toast);
  setTimeout(() => window.location.replace(toPage('login.html')), 1500);
};

// Redirect if not logged in
const requireAuth = () => {
  if (!getToken()) {
    window.location.replace(toPage('login.html'));
  }
};

// Redirect if already logged in
const redirectIfLoggedIn = () => {
  if (getToken()) {
    const user = getUser();
    if (user.role === 'admin') {
      window.location.replace(toPage('admin.html'));
    } else if (user.role === 'extension_officer') {
      window.location.replace(toPage('extension-dashboard.html'));
    } else {
      window.location.replace(toPage('dashboard.html'));
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
