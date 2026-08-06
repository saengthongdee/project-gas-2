import React, { useState, useEffect } from "react";
import { X, Loader2, Truck } from "lucide-react";
import { useVehicles } from "../vehicle/hook/useVehicle";
import { useVehicleBrands } from "../vehiclebrand/hook/useVehicleBrand";

const ROLE_MAP = {
  "ผู้จัดการร้าน": "1",
  "ผู้จัดการ": "1",
  "แอดมินรับโทรศัพท์": "2",
  "แอดมิน": "2",
  "คนขับรถส่งแก๊ส": "3",
};

export default function EmployeeSlideOver({ isOpen, onClose, onSave, initialData }) {
  // 💡 ดึงทั้ง vehicles (รถทั้งหมด) และ vehicleIsNull (รถที่ว่าง) ออกมา
  const { vehicles = [], vehicleIsNull = [], refetch } = useVehicles() || {};
  const { brands = [] } = useVehicleBrands() || {};

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    role_id: "1",
    vehicle_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isDriver = String(formData.role_id) === "3";

  const getBrandName = (brandId) => {
    if (!Array.isArray(brands)) return "";
    const brand = brands.find((b) => b.brand_id === brandId);
    return brand ? brand.brand_type : "";
  };

  const getRoleId = (data) => {
    if (!data) return "1";

    const rawVal = typeof data === "object" ? (data.role_id || data.id || data.name) : data;
    const strVal = String(rawVal).trim();

    if (["1", "2", "3"].includes(strVal)) {
      return strVal;
    }

    if (ROLE_MAP[strVal]) {
      return ROLE_MAP[strVal];
    }

    return "1";
  };

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      let matchedVehicleId = initialData.vehicle_id ? String(initialData.vehicle_id) : "";

      if (!matchedVehicleId && initialData.license_plate && Array.isArray(vehicles)) {
        const matchedVehicle = vehicles.find(
          (v) => v.license_plate === initialData.license_plate
        );
        if (matchedVehicle) matchedVehicleId = String(matchedVehicle.vehicle_id);
      }

      const rawRole = initialData.role_id ?? initialData.role ?? initialData.role_name;

      setFormData({
        name: initialData.name || "",
        phone: initialData.phone || "",
        email: initialData.email || "",
        role_id: getRoleId(rawRole),
        vehicle_id: matchedVehicleId,
      });
    } else {
      setFormData({
        name: "",
        phone: "",
        email: "",
        role_id: "1",
        vehicle_id: "",
      });
    }
    setError(null);
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "role_id" && value !== "3") {
        updated.vehicle_id = "";
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      role_id: Number(formData.role_id),
      vehicle_id: isDriver && formData.vehicle_id ? Number(formData.vehicle_id) : null,
    };

    try {
      await onSave(payload);
      onClose();
      if (refetch) refetch();
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
            {initialData ? "แก้ไขข้อมูลพนักงาน" : "เพิ่มพนักงานใหม่"}
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
                ชื่อ-นามสกุล <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="เช่น นายสมชาย สายซิ่ง"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] text-[#1A1A1A]"
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
                placeholder="เช่น 086-222-3333"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] text-[#1A1A1A]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                อีเมล <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="เช่น somchai@gas.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] text-[#1A1A1A]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                ตำแหน่ง / บทบาท <span className="text-red-500">*</span>
              </label>
              <select
                name="role_id"
                value={formData.role_id}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] text-[#1A1A1A] bg-white"
              >
                <option value="1">ผู้จัดการร้าน</option>
                <option value="2">แอดมินรับโทรศัพท์</option>
                <option value="3">คนขับรถส่งแก๊ส</option>
              </select>
            </div>

            {isDriver && (
              <div className="pt-3 border-t border-neutral-200">
                <div className="flex items-center gap-1.5 mb-2">
                  <Truck className="w-4 h-4 text-neutral-600" />
                  <label className="block text-sm font-medium text-[#1A1A1A]">
                    เลือกยานพาหนะประจำตัว
                  </label>
                </div>

                <select
                  name="vehicle_id"
                  value={formData.vehicle_id}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] text-[#1A1A1A] bg-white"
                >
                  <option value="">-- ไม่ระบุ / เลือกยานพาหนะ --</option>

                  {/* วนลูปแสดงรถทุกคัน */}
                  {Array.isArray(vehicles) &&
                    vehicles.map((v) => {
                      const brandName = getBrandName(v.brand_id);
                      
                      // เช็กว่าเป็นรถของคนนี้หรือไม่
                      const isCurrentVehicle = String(v.vehicle_id) === String(formData.vehicle_id);
                      
                      // เช็กว่าอยู่ในรายการรถที่ว่างหรือไม่
                      const isAvailable = Array.isArray(vehicleIsNull) && vehicleIsNull.some(
                        (nullVehicle) => String(nullVehicle.vehicle_id) === String(v.vehicle_id)
                      );

                      // ถ้ารู้สึกว่าไม่อยู่ใน vehicleIsNull และไม่ใช่รถคันปัจจุบัน = รถไม่ว่าง
                      const isBusy = !isAvailable && !isCurrentVehicle;

                      return (
                        <option
                          key={v.vehicle_id}
                          value={v.vehicle_id}
                          disabled={isBusy} // ห้ามเลือกถ้าไม่ว่าง
                          className={isBusy ? "text-neutral-400 bg-neutral-100" : ""}
                        >
                          {v.license_plate} {brandName ? `(${brandName})` : ""}{" "}
                          {isBusy ? "(รถไม่ว่าง)" : isCurrentVehicle ? "(รถปัจจุบัน)" : ""}
                        </option>
                      );
                    })}
                </select>
                <p className="text-xs text-neutral-400 mt-1.5">
                  * รายการที่แสดง (รถไม่ว่าง) คือรถที่มีพนักงานคนอื่นประจำการอยู่แล้ว
                </p>
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-1/2 px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 flex justify-center items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-black hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-50"
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