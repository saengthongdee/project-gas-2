import React, { useState, useMemo } from 'react'
import { useCustomer } from '../hooks/useCustomer'
import CustomerSlideOver from '../CustomerSlideOver'
import { Plus, Pencil, Trash2, Loader2, AlertCircle, Users, Search, MapPin } from 'lucide-react'

export default function Customer() {
  const {
    data: customers = [],
    loading,
    error,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  } = useCustomer()

  const [actionLoading, setActionLoading] = useState(null)
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // 💡 กรองข้อมูลตามคำค้นหา (ค้นหาจาก ชื่อ, เบอร์โทร, หรือ ที่อยู่)
  const filteredCustomers = useMemo(() => {
    if (!searchTerm.trim()) return customers
    const term = searchTerm.toLowerCase()
    return customers.filter(
      (c) =>
        c.customer_name?.toLowerCase().includes(term) ||
        c.phone?.includes(term) ||
        c.address?.toLowerCase().includes(term)
    )
  }, [customers, searchTerm])

  const handleOpenAdd = () => {
    setSelectedCustomer(null)
    setIsSlideOverOpen(true)
  }

  const handleOpenEdit = (customer) => {
    setSelectedCustomer(customer)
    setIsSlideOverOpen(true)
  }

  const handleSaveCustomer = async (formData) => {
    if (selectedCustomer) {
      await updateCustomer(selectedCustomer.customer_id, formData)
    } else {
      await addCustomer(formData)
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`คุณต้องการลบข้อมูลลูกค้า "${name}" ใช่หรือไม่?`)) return

    try {
      setActionLoading(id)
      await deleteCustomer(id)
    } catch (err) {
      alert('ไม่สามารถลบข้อมูลได้: ' + (err.response?.data?.message || err.message))
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="max-w-7xl p-6 mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-[#1A1A1A]">ข้อมูลลูกค้า</h1>
            {/* 💡 Badge แสดงจำนวนรวมข้างหัวข้อ */}
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-neutral-100 text-neutral-700 border border-neutral-200 rounded-full">
              {customers.length} ราย
            </span>
          </div>
          <p className="text-sm text-neutral-500 mt-1">จัดการข้อมูลรายชื่อลูกค้าและรายละเอียดการจัดส่งสินค้า</p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-neutral-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มลูกค้าใหม่</span>
        </button>
      </div>

      {/* 💡 Pattern: Stat Cards (สรุปจำนวนลูกค้าและสถิติเบื้องต้น) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-neutral-100 rounded-lg text-[#1A1A1A]">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-500">จำนวนลูกค้าทั้งหมด</p>
            <p className="text-2xl font-bold text-[#1A1A1A]">
              {customers.length}{' '}
              <span className="text-xs font-normal text-neutral-500">ราย</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-500">ระบุที่อยู่จัดส่งแล้ว</p>
            <p className="text-2xl font-bold text-[#1A1A1A]">
              {customers.filter((c) => c.address && c.address.trim() !== '').length}{' '}
              <span className="text-xs font-normal text-neutral-500">ราย</span>
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>เกิดข้อผิดพลาดในการโหลดข้อมูล: {error}</span>
        </div>
      )}

      {/* Main Table Container */}
      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
        {/* 💡 Toolbar: ค้นหา และ สรุปจำนวนจากการค้นหา */}
        <div className="p-4 border-b border-neutral-200 bg-neutral-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="ค้นหาชื่อ, เบอร์โทร, ที่อยู่..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#5b5b5b] text-[#1A1A1A]"
            />
          </div>
          <div className="text-xs text-neutral-500">
            แสดงผล <span className="font-semibold text-[#1A1A1A]">{filteredCustomers.length}</span> จากทั้งหมด{' '}
            <span className="font-semibold text-[#1A1A1A]">{customers.length}</span> ราย
          </div>
        </div>

        {loading && customers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-neutral-400 gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-[#1A1A1A]" />
            <p className="text-sm">กำลังโหลดข้อมูลลูกค้า...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-16 text-neutral-400">
            <p className="text-sm">
              {searchTerm ? 'ไม่พบข้อมูลลูกค้าที่ตรงกับการค้นหา' : 'ไม่พบข้อมูลลูกค้าในระบบ'}
            </p>
          </div>
        ) : (
          <div className="max-h-[55vh] overflow-y-scroll custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F5F8FB] border-b border-neutral-200 text-xs font-semibold text-[#545454] uppercase tracking-wider">
                  <th className="py-3.5 px-4">#</th>
                  <th className="py-3.5 px-4">ชื่อลูกค้า / ร้านค้า</th>
                  <th className="py-3.5 px-4">เบอร์โทรศัพท์</th>
                  <th className="py-3.5 px-4">ที่อยู่</th>
                  <th className="py-3.5 px-4">หมายเหตุการจัดส่ง</th>
                  <th className="py-3.5 px-4 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-sm text-[#1A1A1A]">
                {filteredCustomers.map((customer, index) => (
                  <tr key={customer.customer_id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3.5 px-4 text-neutral-500">{index + 1}</td>
                    <td className="py-3.5 px-4 font-medium">{customer.customer_name}</td>
                    <td className="py-3.5 px-4 text-neutral-600">{customer.phone}</td>
                    <td className="py-3.5 px-4 text-neutral-600 max-w-xs truncate" title={customer.address}>
                      {customer.address || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-600 max-w-xs truncate" title={customer.delivery_note}>
                      {customer.delivery_note || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(customer)}
                          className="p-1.5 text-neutral-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="แก้ไขข้อมูล"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(customer.customer_id, customer.customer_name)}
                          disabled={actionLoading === customer.customer_id}
                          className="p-1.5 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                          title="ลบข้อมูล"
                        >
                          {actionLoading === customer.customer_id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CustomerSlideOver
        isOpen={isSlideOverOpen}
        onClose={() => setIsSlideOverOpen(false)}
        onSave={handleSaveCustomer}
        initialData={selectedCustomer}
      />
    </div>
  )
}