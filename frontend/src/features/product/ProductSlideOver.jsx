import React, { useState, useEffect } from 'react';
import { X, Package, Save } from 'lucide-react';

export default function ProductSlideOver({ isOpen, onClose, mode = 'add', initialData = null, onSave }) {
  // State สำหรับเก็บข้อมูลในฟอร์ม
  const [formData, setFormData] = useState({
    product_name: '',
    category: 'gas',
    cost_price: '',
    current_price: '',
    stock_qty: '',
  });

  // อัปเดตข้อมูลในฟอร์มเมื่อเปิดโหมดแก้ไข หรือเปลี่ยนข้อมูลเริ่มต้น
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData({
          product_name: initialData.product_name || '',
          category: initialData.category || 'gas',
          cost_price: initialData.cost_price ?? '',
          current_price: initialData.current_price ?? '',
          stock_qty: initialData.stock_qty ?? '',
        });
      } else {
        // รีเซ็ตฟอร์มเมื่อเป็นโหมดเพิ่มใหม่
        setFormData({
          product_name: '',
          category: 'gas',
          cost_price: '',
          current_price: '',
          stock_qty: '',
        });
      }
    }
  }, [mode, initialData, isOpen]);

  // จัดการการเปลี่ยนแปลงค่าใน input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // กดบันทึก (แปลงค่าตัวเลขให้ถูกต้องก่อนส่งออกไป)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        ...formData,
        cost_price: formData.cost_price === '' ? 0 : Number(formData.cost_price),
        current_price: formData.current_price === '' ? 0 : Number(formData.current_price),
        stock_qty: formData.stock_qty === '' ? 0 : Number(formData.stock_qty),
      });
    }
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* Background Backdrop (Fade In/Out) */}
      <div 
        className={`absolute inset-0 bg-black/40  transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Slide-over Panel (Slide In/Out from Right) */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className={`w-screen max-w-md bg-white shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-[#F5F8FB]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-neutral-200 text-slate-800 shadow-xs">
                <Package className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                {mode === 'add' ? 'เพิ่มสินค้าใหม่' : 'แก้ไขข้อมูลสินค้า'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between overflow-y-auto">
            <div className="p-6 space-y-4">
              
              {/* ชื่อสินค้า */}
              <div>
                <label className="block text-sm font-medium text-neutral-500 mb-1">
                  ชื่อสินค้า <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="product_name"
                  required
                  placeholder="เช่น ถังแก๊สปตท. 15 กก., หัวปรับแรงดัน"
                  value={formData.product_name}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 placeholder-gray-400"
                />
              </div>

              {/* หมวดหมู่ */}
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">
                  หมวดหมู่ <span className="text-rose-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-800 text-gray-800 cursor-pointer"
                >
                  <option value="gas">แก๊ส</option>
                  <option value="spare_part">อะไหล่/อุปกรณ์</option>
                </select>
              </div>

              {/* ราคาต้นทุน & ราคาขายปัจจุบัน */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1">
                    ราคาต้นทุน (บาท)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="cost_price"
                    placeholder="0.00"
                    value={formData.cost_price}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-slate-800 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1">
                    ราคาขาย (บาท) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="current_price"
                    required
                    placeholder="0.00"
                    value={formData.current_price}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-slate-800 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* จำนวนสต็อก */}
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">
                  จำนวนคงเหลือในสต็อก (ชิ้น) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  name="stock_qty"
                  required
                  placeholder="0"
                  value={formData.stock_qty}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-slate-800 placeholder-gray-400"
                />
              </div>

            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-neutral-200 bg-gray-50 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-neutral-200 text-gray-700 bg-white hover:bg-gray-50 text-sm font-medium rounded-xl transition-all cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#0B192C] hover:bg-[#1E3E62] text-white text-sm font-medium rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" /> บันทึกข้อมูล
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}