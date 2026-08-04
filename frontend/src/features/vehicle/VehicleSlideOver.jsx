import React, { useState, useEffect } from "react";
import { Truck, Loader2, Save, X as CloseIcon } from "lucide-react";
import { useVehicleBrands } from "../vehiclebrand/hook/useVehicleBrand";

const INITIAL_FORM = {
  license_plate: "",
  brand_id: "",
  capacity_kg: "",
  status: "available", // Default เป็น available เสมอ
};

export default function VehicleSlideOver({ isOpen, onClose, onSave, initialData }) {
  const { brands, loading: loadingBrands } = useVehicleBrands();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // อัปเดตข้อมูล Form เมื่อเปิด Modal หรือเปลี่ยน initialData
  useEffect(() => {
    if (initialData) {
      setFormData({
        license_plate: initialData.license_plate || "",
        brand_id: initialData.brand_id || "",
        capacity_kg: initialData.capacity_kg || "",
        status: initialData.status || "available",
      });
    } else {
      setFormData(INITIAL_FORM);
    }
    setErrorMessage("");
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.license_plate.trim()) {
      setErrorMessage("กรุณากรอกทะเบียนรถ");
      return;
    }
    if (!formData.brand_id) {
      setErrorMessage("กรุณาเลือกยี่ห้อ/ประเภทรถ");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage("");

      const payload = {
        ...formData,
        brand_id: Number(formData.brand_id),
        capacity_kg: formData.capacity_kg ? Number(formData.capacity_kg) : 0,
      };

      await onSave(payload);
      onClose();
    } catch (err) {
      console.error("Failed to save vehicle:", err);
      setErrorMessage(
        err.response?.data?.message || err.message || "เกิดข้อผิดพลาดในการบันทึก"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ${
        isOpen
          ? "pointer-events-auto visible"
          : "pointer-events-none invisible delay-300"
      }`}
    >
      {/* Backdrop (Fade In / Out) */}
      <div
        className={`fixed inset-0 bg-black/40  transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Slide-over Panel (Slide Right In / Out) */}
      <div
        className={`fixed inset-y-0 right-0 flex max-w-full pl-10 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="w-screen max-w-md bg-white shadow-xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-neutral-100 rounded-lg text-[#1A1A1A]">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1A1A1A]">
                  {initialData ? "แก้ไขข้อมูลรถ" : "เพิ่มรถใหม่"}
                </h2>
                <p className="text-xs text-neutral-500">
                  {initialData
                    ? "อัปเดตรายละเอียดรถ"
                    : "ลงทะเบียนยานพาหนะเข้าสู่ระบบ"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form
            id="vehicle-form"
            onSubmit={handleSubmit}
            className="p-6 space-y-5 overflow-y-auto flex-1"
          >
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-xs font-medium">
                {errorMessage}
              </div>
            )}

            {/* ทะเบียนรถ */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700">
                ทะเบียนรถ <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="license_plate"
                placeholder="เช่น กข-1234 กทม"
                value={formData.license_plate}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm text-[#1A1A1A] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1A1A1A] transition-all"
              />
            </div>

            {/* ยี่ห้อ / ประเภทรถ */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700">
                ยี่ห้อ / ประเภทรถ <span className="text-rose-500">*</span>
              </label>
              <select
                name="brand_id"
                value={formData.brand_id}
                onChange={handleChange}
                required
                disabled={loadingBrands}
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm text-[#1A1A1A] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1A1A1A] transition-all disabled:opacity-50"
              ><option value="">-- เลือกรุ่น/ยี่ห้อรถ --</option>
                {brands.map((b) => (
                  <option key={b.brand_id} value={b.brand_id}>
                    {b.brand_type}
                  </option>
                ))}
              </select>
            </div>

            {/* ความจุ / น้ำหนักบรรทุกสูงสุด (กก.) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700">
                น้ำหนักบรรทุกสูงสุด (กิโลกรัม)
              </label>
              <input
                type="number"
                name="capacity_kg"
                placeholder="เช่น 1500"
                min="0"
                value={formData.capacity_kg}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm text-[#1A1A1A] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1A1A1A] transition-all"
              />
            </div>
          </form>

          {/* Footer Actions */}
          <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 px-4 py-2.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-200/60 rounded-lg transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              form="vehicle-form"
              disabled={submitting}
              className="w-1/2 flex justify-center items-center gap-2 bg-[#0B192C] hover:bg-[#1E3E62] text-white px-5 py-2.5 rounded-lg text-xs font-semibold transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <>
                  <span>กำลังบันทึก...</span>
                </>
              ) : (
                <>
                  <span>บันทึกข้อมูล</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}