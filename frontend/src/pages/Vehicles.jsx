import React, { useState } from "react";
import { useVehicles } from "../hooks/useVehicles";
import { useVehicleBrands } from "../hooks/useVehicleBrands";
import VehicleSlideOver from "../components/VehicleSlideOver";
import { Plus, Pencil, Trash2, Loader2, AlertCircle, Truck } from "lucide-react";

export default function Vehicles() {
  const { vehicles, loading, error, addVehicle, updateVehicle, deleteVehicle } = useVehicles();
  const { brands } = useVehicleBrands();

  const [actionLoading, setActionLoading] = useState(null);
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const getBrandName = (brandId) => {
    const brand = brands.find((b) => b.brand_id === brandId);
    return brand ? brand.brand_type : `ยี่ห้อ ID: ${brandId}`;
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case "available":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            พร้อมใช้งาน
          </span>
        );
      case "in_use":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            กำลังส่งของ
          </span>
        );
      case "maintenance":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
            ซ่อมบำรุง
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600">
            {status}
          </span>
        );
    }
  };

  const handleOpenAdd = () => {
    setSelectedVehicle(null);
    setIsSlideOverOpen(true);
  };

  const handleOpenEdit = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsSlideOverOpen(true);
  };

  const handleSave = async (formData) => {
    if (selectedVehicle) {
      await updateVehicle(selectedVehicle.vehicle_id, formData);
    } else {
      await addVehicle(formData);
    }
  };

  const handleDelete = async (id, licensePlate) => {
    if (!window.confirm(`คุณต้องการลบรถทะเบียน "${licensePlate}" ใช่หรือไม่?`)) return;

    try {
      setActionLoading(id);
      await deleteVehicle(id);
    } catch (err) {
      alert("ไม่สามารถลบข้อมูลได้: " + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">ยานพาหนะจัดส่งแก๊ส</h1>
          <p className="text-sm text-neutral-500 mt-1">
            จัดการทะเบียนรถ น้ำหนักบรรทุกสูงสุด และสถานะการทำงาน
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-neutral-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มรถใหม่</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>เกิดข้อผิดพลาดในการโหลดข้อมูล: {error}</span>
        </div>
      )}

      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
        {loading && vehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-neutral-400 gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-[#1A1A1A]" />
            <p className="text-sm">กำลังโหลดข้อมูลรถ...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-16 text-neutral-400">
            <p className="text-sm">ไม่พบข้อมูลยานพาหนะในระบบ</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F5F8FB] border-b border-neutral-200 text-xs font-semibold text-[#545454] uppercase tracking-wider">
                  <th className="py-3.5 px-4">ทะเบียนรถ</th>
                  <th className="py-3.5 px-4">ยี่ห้อ / ประเภทรถ</th>
                  <th className="py-3.5 px-4">ความจุ / น้ำหนักบรรทุกสูงสุด</th>
                  <th className="py-3.5 px-4">สถานะ</th>
                  <th className="py-3.5 px-4 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-sm text-[#1A1A1A]">
                {vehicles.map((v) => (
                  <tr key={v.vehicle_id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold flex items-center gap-2">
                      <Truck className="w-4 h-4 text-neutral-500" />
                      <span>{v.license_plate}</span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-600">
                      {getBrandName(v.brand_id)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-neutral-700">
                      {v.capacity_kg ? `${v.capacity_kg.toLocaleString()} กก.` : "-"}
                    </td>
                    <td className="py-3.5 px-4">{renderStatusBadge(v.status)}</td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(v)}
                          className="p-1.5 text-neutral-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="แก้ไข"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(v.vehicle_id, v.license_plate)}
                          disabled={actionLoading === v.vehicle_id}
                          className="p-1.5 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                          title="ลบ"
                        >
                          {actionLoading === v.vehicle_id ? (
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

      <VehicleSlideOver
        isOpen={isSlideOverOpen}
        onClose={() => setIsSlideOverOpen(false)}
        onSave={handleSave}
        initialData={selectedVehicle}
      />
    </div>
  );
}