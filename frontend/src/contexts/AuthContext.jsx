import { createContext, useState } from 'react'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(() => localStorage.getItem('gas-token'))
    
    const [role, setRole] = useState(() => {

        const savedRole = localStorage.getItem('gas-role_ID')
        return savedRole ? JSON.parse(savedRole) : null
    })

    const login = (newToken, role_ID) => {
        
        localStorage.setItem('gas-token', newToken)
        localStorage.setItem('gas-role_ID', JSON.stringify(role_ID))
        setToken(newToken)
        set(role_ID)
    }

    const logout = () => {

        localStorage.removeItem('gas-token')
        localStorage.removeItem('gas-role_ID')
        setToken(null)
        setRole(null)
    }

    return (
        <AuthContext.Provider value={{ token, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}