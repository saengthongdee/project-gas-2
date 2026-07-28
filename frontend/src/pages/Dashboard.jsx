import { useAuth } from '../hooks/useAuth'

export default function Dashboard() {
    const { user } = useAuth()

    const stats = [
        { title: 'ถังแก๊สทั้งหมด', count: '1,250 ถัง', color: 'bg-blue-500' },
        { title: 'รอดำเนินการคืน', count: '48 รายการ', color: 'bg-amber-500' },
        { title: 'คืนสำเร็จแล้ววันนี้', count: '12 รายการ', color: 'bg-emerald-500' },
    ]


    // const { user } = useAuth()
    // const { stats, loading, error, refetch } = useDashboard()

    // if (loading) {
    //     return <div className="p-4 text-gray-500">กำลังโหลดข้อมูล Dashboard...</div>
    // }

    // if (error) {
    //     return (
    //         <div className="p-4 bg-red-50 text-red-600 rounded-lg">
    //             <p>{error}</p>
    //             <button onClick={refetch} className="mt-2 text-sm underline">ลองใหม่อีกครั้ง</button>
    //         </div>
    //     )
    // }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    ยินดีต้อนรับ, {user?.username || 'ผู้ใช้งาน'} 👋
                </h1>
                <p className="text-sm text-gray-500 mt-1">ภาพรวมระบบจัดการคลังแก๊สประจำวันนี้</p>
            </div>

            {/* การ์ดแสดงสถิติ */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">{stat.count}</p>
                        </div>
                        <div className={`w-3 h-12 rounded-full ${stat.color}`}></div>
                    </div>
                ))}
            </div>
        </div>
    )
}