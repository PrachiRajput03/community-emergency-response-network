import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

const savedTheme = localStorage.getItem('cern_theme') || 'system'

const prefersDark = window.matchMedia(
  '(prefers-color-scheme: dark)'
).matches

const shouldUseDark =
  savedTheme === 'dark' ||
  (savedTheme === 'system' && prefersDark)

document.documentElement.classList.toggle('dark', shouldUseDark)
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

if ('Notification' in window) {
  Notification.requestPermission()
}