import { createContext, useContext, useState, useEffect } from 'react'
import { login as apiLogin, register as apiRegister, getMe } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      getMe()
        .then(({ data }) => setUser(data))
        .catch(() => {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
        })
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const { data } = await apiLogin(email, password)
    localStorage.setItem('access_token', data.access)
    localStorage.setItem('refresh_token', data.refresh)
    const me = await getMe()
    setUser(me.data)
    return me.data
  }

  const register = async (formData) => {
    // Returns {detail: "..."} — no tokens yet, user must verify email first
    const { data } = await apiRegister(formData)
    return data
  }

  const loginWithTokens = (access, refresh, userData) => {
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, register, loginWithTokens, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
