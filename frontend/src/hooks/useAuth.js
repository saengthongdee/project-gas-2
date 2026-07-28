import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

export const useAuth = () => {

    const context = useContext(AuthContext)
    
    if (!context) {
        throw new Error('useAuth ต้องใช้งานภายใต้ AuthProvider เท่านั้น')
    }
    return context
}