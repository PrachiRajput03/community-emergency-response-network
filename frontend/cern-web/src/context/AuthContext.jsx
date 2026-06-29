import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'
import * as authService from '../services/authService'
import { TOKEN_KEY, ROLE_KEY, USER_KEY } from '../utils/constants'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [role, setRole] = useState(() => localStorage.getItem(ROLE_KEY))
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY)
    try {
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  const persistSession = useCallback((data, credentials) => {
  const jwt =
    typeof data === 'string'
      ? data
      : data.token || data.accessToken || data.jwt

  let userRole = 'CITIZEN'

  const email = credentials?.email?.toLowerCase() || ''

  if (email.includes('volunteer')) {
    userRole = 'VOLUNTEER'
  }

  if (email.includes('admin')) {
    userRole = 'ADMIN'
  }

  const userInfo = {
  email: credentials?.email,
  role: userRole,
  name: credentials?.email
    ? credentials.email.split('@')[0]
        .replaceAll('.', ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : userRole,
}

  localStorage.setItem(TOKEN_KEY, jwt)
  localStorage.setItem(ROLE_KEY, userRole)
  localStorage.setItem(USER_KEY, JSON.stringify(userInfo))

  setToken(jwt)
  setRole(userRole)
  setUser(userInfo)

  return { token: jwt, role: userRole, user: userInfo }
}, [])

  const login = useCallback(async (credentials) => {
  const data = await authService.login(credentials)
  return persistSession(data, credentials)
}, [persistSession])

  const register = useCallback(async (payload) => {
    const data = await authService.register(payload)
    // Some backends return a token on register; if not, caller should redirect to login.
    if (data?.token || data?.accessToken || data?.jwt) {
      return persistSession(data)
    }
    return data
  }, [persistSession])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(ROLE_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setRole(null)
    setUser(null)
  }, [])

  const value = useMemo(() => ({
    token,
    role,
    user,
    isAuthenticated: !!token,
    login,
    register,
    logout,
  }), [token, role, user, login, register, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
