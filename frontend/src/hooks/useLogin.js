import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './useAuth'
import axiosInstance from '../api/axiosInstance'

export const useLogin = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    
    const { login } = useAuth() 
    const navigate = useNavigate()

    const handleLogin = async (email, password) => {
        if (!email || !password) {
            setError('กรุณากรอกข้อมูลให้ครบถ้วน')
            return
        }

        try {
            setLoading(true)
            setError(null)

            const response = await axiosInstance.post('/auth/login', { email, password })
            const { token } = response.data;
            const { role_ID} = response.data;

            console.log(role_ID);

            if(role_ID != 1 && role_ID != 2) {
                setError('ไม่มีสิทธิเข้าถึงข้อมูล')
                return;
            } 

            login(token , role_ID)

            navigate('/', { replace: true })
            
        } catch (err) {
            setError(err.response?.data?.message || 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง')
        } finally {
            setLoading(false)
        }
    }

    return { handleLogin, loading, error }
}