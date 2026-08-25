import React from "react";
import { Truck } from "lucide-react";

export default function DriverVehicleSelect({
  formData,
  handleChange,
  vehicles = [],
  vehicleIsNull = [],
  brands = [],
}) {
  const getBrandName = (brandId) => {
    if (!Array.isArray(brands)) return "";
    const brand = brands.find((b) => b.brand_id === brandId);
    return brand ? brand.brand_type : "";
  };

  return (
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
        {Array.isArray(vehicles) &&
          vehicles.map((v) => {
            const brandName = getBrandName(v.brand_id);
            const isCurrentVehicle = String(v.vehicle_id) === String(formData.vehicle_id);
            const isAvailable =
              Array.isArray(vehicleIsNull) &&
              vehicleIsNull.some(
                (nullVehicle) => String(nullVehicle.vehicle_id) === String(v.vehicle_id)
              );
            const isBusy = !isAvailable && !isCurrentVehicle;

            return (
              <option
                key={v.vehicle_id}
                value={v.vehicle_id}
                disabled={isBusy}
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
  );
}