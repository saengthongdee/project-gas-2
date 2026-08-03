import React, { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'

export default function CustomerSlideOver({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    address: '',
    delivery_note: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (initialData) {
      setFormData({
        customer_name: initialData.customer_name || '',
        phone: initialData.phone || '',
        address: initialData.address || '',
        delivery_note: initialData.delivery_note || '',
      })
    } else {
      setFormData({
        customer_name: '',
        phone: '',
        address: '',
        delivery_note: '',
      })
    }
    setError(null)
  }, [initialData, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {

    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await onSave(formData)
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-40 h-screen transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h2 className="text-lg font-bold text-[#1A1A1A]">
            {initialData ? 'แก้ไขข้อมูลลูกค้า' : 'เพิ่มลูกค้าใหม่'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between min-h-0">
          <div className="p-6 space-y-4 overflow-y-auto">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                ชื่อลูกค้า / ร้านค้า <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="customer_name"
                required
                placeholder="เช่น เจ๊เพ็ญ ก๋วยเตี๋ยวเรือ"
                value={formData.customer_name}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] text-[#1A1A1A]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                เบอร์โทรศัพท์ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="phone"
                required
                placeholder="เช่น 089-111-2222"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] text-[#1A1A1A]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                ที่อยู่จัดส่ง
              </label>
              <textarea
                name="address"
                rows={3}
                placeholder="ระบุบ้านเลขที่ ถนน ซอย หรือจุดสังเกต"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] text-[#1A1A1A] resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                หมายเหตุการจัดส่ง
              </label>
              <textarea
                name="delivery_note"
                rows={2}
                placeholder="เช่น ร้านอยู่ล็อกกลาง ติดร้านน้ำแข็ง"
                value={formData.delivery_note}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] text-[#1A1A1A] resize-none"
              />
            </div>
          </div>
          
          <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-1/2 px-4 py-2 justify-center text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 flex justify-center items-center  gap-2 px-4 py-2 text-sm font-medium text-white bg-[#009966] hover:bg-[#006600] rounded-lg transition-colors disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{initialData ? 'บันทึกการแก้ไข' : 'บันทึกข้อมูล'}</span>
            </button>
          </div>
        </form>
      </div>
    </>
  )
}