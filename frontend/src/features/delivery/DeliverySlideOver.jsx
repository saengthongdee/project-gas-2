import React, { useState } from 'react';
import { useVehicles } from "../vehicle/hook/useVehicle";
import { Truck, Loader2, X, Check } from "lucide-react";

export default function DeliverySlideOver({
  isOpen,
  onClose,
  selectedOrderIds,
  setSelectedOrderIds,
  onSuccess,
}) {

  const { loading: vehiclesLoading, data: vehicleResponse, vehicles: vehicleList ,  refetch } = useVehicles() || {};
  
  const vehicles = Array.isArray(vehicleResponse) 
    ? vehicleResponse 
    : vehicleResponse?.data || vehicleList || [];

  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmQueue = async () => {
    if (!selectedVehicleId) return;

    try {
      setIsSubmitting(true);

      const payload = {
        vehicle_id: selectedVehicleId,
        order_ids: selectedOrderIds,
      };

      if (typeof onSuccess === 'function') {
        await onSuccess(payload);
      }

      refetch();

      setSelectedOrderIds([]);
      setSelectedVehicleId('');
      onClose();
      
    } catch (err) {
      console.error("Failed to assign queue:", err);
      // 💡 ดึงข้อความแจ้งเตือนจาก Backend มาแสดงให้ผู้ใช้รู้
      const errorMessage = err.response?.data?.message || "เกิดข้อผิดพลาดในการจัดคิว";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 h-screen transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center  justify-between px-6 py-4 border-b border-neutral-200">
          <div>
            <h2 className="text-lg font-bold text-[#1A1A1A]">เลือกรถสำหรับจัดส่งสินค้า</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              รายการออเดอร์ที่เลือกไว้: <span className="font-semibold text-blue-600">{selectedOrderIds.length} รายการ</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-6 space-y-3 overflow-y-auto min-h-0">
          <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-2">
            พาหนะที่พร้อมใช้งาน ({vehicles.filter(v => v.status === 'available' && v.employee_id !== null).length})
          </label>

          {vehiclesLoading ? (
            <div className="p-12 text-center text-neutral-400 text-sm flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" /> กำลังโหลดข้อมูลรถจัดส่ง...
            </div>
          ) : vehicles.length === 0 ? (
            <div className="p-12 text-center text-neutral-400 text-sm">
              ไม่พบข้อมูลรถจัดส่งในระบบ
            </div>
          ) : (
            vehicles.map((vehicle) => {

              const vehicleId = vehicle.vehicle_id;
              const brandType = vehicle.brand_type;
              const licensePlate = vehicle.license_plate;
              const capacityKg = vehicle.capacity_kg;
              
              // 💡 เช็คทั้งสถานะรถและตรวจสอบว่ามีพนักงานผูกอยู่หรือไม่ (employee_id ไม่เป็น null)
              const hasEmployee = vehicle.employee_id !== null && vehicle.employee_id !== undefined;
              const isAvailable = vehicle.status === 'available' && hasEmployee;
              const isSelected = selectedVehicleId === vehicleId;

              return (
                <div
                  key={vehicleId}
                  onClick={() => isAvailable && setSelectedVehicleId(vehicleId)}
                  className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 cursor-pointer ${
                    !isAvailable
                      ? 'bg-neutral-50 border-neutral-200 opacity-60 cursor-not-allowed'
                      : isSelected
                      ? 'bg-blue-50/60 border-blue-100 shadow-xs ring-1 ring-blue-500'
                      : 'bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/80'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`p-3 rounded-lg ${isSelected ? 'bg-blue-500 text-white' : 'bg-neutral-100 text-neutral-600'}`}>
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-neutral-900 text-sm">{brandType}</p>
                        <span className="text-[10px] px-2 py-0.5 bg-neutral-100 text-neutral-600 font-medium rounded-md">
                          {capacityKg} กก.
                        </span>
                      </div>
                      <p className="text-xs font-mono text-neutral-500 mt-1">
                        ทะเบียน: {licensePlate}
                      </p>
                    </div>
                  </div>

                  <div>
                    {!isAvailable ? (
                      <span className="text-xs font-medium text-rose-500 px-2.5">
                        {!hasEmployee ? (
                          <span className="text-[11px] bg-rose-50 text-rose-600 px-2 py-1 rounded-md border border-rose-200 whitespace-nowrap">
                            ยังไม่ระบุพนักงาน
                          </span>
                        ) : (
                          <div className='w-4 h-4 border rounded-full bg-red-500'></div>
                        )}
                      </span>
                    ) : (
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                        isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-neutral-300 bg-white'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-1/2 px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            disabled={!selectedVehicleId || isSubmitting}
            onClick={handleConfirmQueue}
            className={`w-1/2  flex justify-center items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors shadow-sm ${
              selectedVehicleId && !isSubmitting
                ? 'btn-primary'
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>ยืนยันจัดคิวส่ง</span>
          </button>
        </div>

      </div>
    </>
  );
}