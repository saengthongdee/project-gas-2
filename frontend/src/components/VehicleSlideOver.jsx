import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { useVehicleBrands } from "../hooks/useVehicleBrands";

export default function VehicleSlideOver({ isOpen, onClose, onSave, initialData }) {

  const { brands } = useVehicleBrands();

  const [formData, setFormData] = useState({
    license_plate: "",
    brand_id: "",
    capacity_kg: 1000,
    status: "available",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        license_plate: initialData.license_plate || "",
        brand_id: initialData.brand_id || (brands[0]?.brand_id || ""),
        capacity_kg: initialData.capacity_kg || 1000,
        status: initialData.status || "available",
      });
    } else {
      setFormData({
        license_plate: "",
        brand_id: brands[0]?.brand_id || "",
        capacity_kg: 1000,
        status: "available",
      });
    }
    setError(null);
  }, [initialData, isOpen, brands]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "brand_id" || name === "capacity_kg" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-40 h-screen transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h2 className="text-lg font-bold text-[#1A1A1A]">
            {initialData ? "แก้ไขข้อมูลรถ" : "เพิ่มรถใหม่"}
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
                ทะเบียนรถ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="license_plate"
                required
                placeholder="เช่น ผก-1234 กรุงเทพ"
                value={formData.license_plate}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] text-[#1A1A1A]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                ยี่ห้อ / ประเภทรถ <span className="text-red-500">*</span>
              </label>
              <select
                name="brand_id"
                required
                value={formData.brand_id}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] text-[#1A1A1A] bg-white"
              >
                {brands.map((brand) => (
                  <option key={brand.brand_id} value={brand.brand_id}>
                    {brand.brand_type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                รับน้ำหนักสูงสุด (กก.) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="capacity_kg"
                required
                min={0}
                placeholder="เช่น 1500"
                value={formData.capacity_kg}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] text-[#1A1A1A]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                สถานะรถ <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] text-[#1A1A1A] bg-white"
              >
                <option value="available">พร้อมใช้งาน (Available)</option>
                <option value="in_use">กำลังส่งของ (In Use)</option>
                <option value="maintenance">ซ่อมบำรุง (Maintenance)</option>
              </select>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1A1A1A] hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{initialData ? "บันทึกการแก้ไข" : "บันทึกข้อมูล"}</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}