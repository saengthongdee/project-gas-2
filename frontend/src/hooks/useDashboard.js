import { useState, useEffect } from 'react'
import axiosInstance from '../api/axiosInstance'

export const useDashboard = () => {
    const [stats, setStats] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchStats = async () => {
        try {
            setLoading(true)
            setError(null)
            // const response = await axiosInstance.get('/dashboard/stats')
            
            // const data = response.data
            setStats([
                { title: 'ถังแก๊สทั้งหมด', count: `${data.totalCylinders} ถัง`, color: 'bg-blue-500' },
                { title: 'รอดำเนินการคืน', count: `${data.pendingReturns} รายการ`, color: 'bg-amber-500' },
                { title: 'คืนสำเร็จแล้ววันนี้', count: `${data.completedToday} รายการ`, color: 'bg-emerald-500' },
            ])
        } catch (err) {
            setError(err.response?.data?.message || 'ไม่สามารถดึงข้อมูล Dashboard ได้')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStats()
    }, [])

    return { stats, loading, error, refetch: fetchStats }
}