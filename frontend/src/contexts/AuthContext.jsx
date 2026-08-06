import { createContext, useState } from 'react'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(() => localStorage.getItem('gas-token'))

    const [role, setRole] = useState(() => {
        const savedRole = localStorage.getItem('gas-role_ID')
        return savedRole ? JSON.parse(savedRole) : null
    })

    const [employeeName, setEmployeeName] = useState(() => {
        const savedName = localStorage.getItem('gas-employee_name')
        // เช็คว่ามีค่า และไม่ใช่ string ว่าง หรือคำว่า "null" / "undefined"
        return savedName && savedName !== 'null' && savedName !== 'undefined' ? savedName : null
    })

    const login = (newToken, role_ID, employee_name = null) => {
        // ตรวจสอบค่าที่จะนำไปบันทึก
        const nameToSave = employee_name || ''

        localStorage.setItem('gas-token', newToken)
        localStorage.setItem('gas-role_ID', JSON.stringify(role_ID))
        localStorage.setItem('gas-employee_name', nameToSave)

        setToken(newToken)
        setRole(role_ID)
        setEmployeeName(nameToSave)
    }

    const logout = () => {
        localStorage.removeItem('gas-token')
        localStorage.removeItem('gas-role_ID')
        localStorage.removeItem('gas-employee_name')

        setToken(null)
        setRole(null)
        setEmployeeName(null)
    }

    return (
        <AuthContext.Provider value={{ token, role, employeeName, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}