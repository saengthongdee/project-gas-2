import React, { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CylinderdepositSlideOver({ isOpen, onClose, onSave, deposit }) {
  const [qtyReturnInput, setQtyReturnInput] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (deposit) {
      setQtyReturnInput(deposit.qty_return ?? 0)
    } else {
      setQtyReturnInput('')
    }
  }, [deposit, isOpen])

  // รองรับการกดปุ่ม ESC เพื่อปิด
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, loading, onClose])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!deposit) return

    const returnVal = Number(qtyReturnInput)
    const qtyOut = Number(deposit.qty_out || 0)

    if (returnVal > qtyOut) {
      toast.error(`ยอดถังคืน (${returnVal}) ไม่สามารถมากกว่ายอดถังออก (${qtyOut} ถัง) ได้ครับ`)
      return
    }

    if (returnVal < 0) {
      toast.error('ยอดถังคืนต้องไม่น้อยกว่า 0')
      return
    }

    try {
      setLoading(true)
      await onSave(deposit.deposit_id, returnVal)
      toast.success('อัปเดตยอดคืนถังสำเร็จ')
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'เกิดข้อผิดพลาดในการอัปเดต')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 h-screen transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={loading ? undefined : onClose}
      />

      {/* Slide-over Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#1A1A1A]">แก้ไขยอดคืนถัง</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              ลูกค้า: <span className="font-semibold text-neutral-700">{deposit?.customer_name}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between min-h-0">
          <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
              <div className="flex justify-between text-xs text-neutral-600">
                <span>สินค้า:</span>
                <span className="font-medium text-[#1A1A1A]">{deposit?.product_name}</span>
              </div>
              <div className="flex justify-between text-xs text-neutral-600">
                <span>ยอดออกทั้งหมด (Qty Out):</span>
                <span className="font-bold text-orange-600">{deposit?.qty_out} ถัง</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                จำนวนถังคืน (Qty Return)
              </label>
              <input
                type="number"
                min="0"
                max={deposit?.qty_out}
                required
                value={qtyReturnInput}
                onChange={(e) => setQtyReturnInput(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] text-[#1A1A1A]"
              />
              <p className="text-xs text-neutral-400 mt-1">กรอกจำนวนถังที่ลูกค้าส่งคืน (ต้องไม่เกินยอดออก)</p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-neutral-200 bg-neutral-50 flex items-center justify-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-1/2 px-4 py-2 justify-center text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-100 transition-colors disabled:opacity-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 flex justify-center items-center gap-2 px-4 py-2 text-sm font-medium btn-primary hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>บันทึกข้อมูล</span>
            </button>
          </div>
        </form>
      </div>
    </>
  )
}