import React, { useState, useMemo } from "react";
import { useVehicles } from "../hook/useVehicle";
import { useVehicleBrands } from "../../vehiclebrand/hook/useVehicleBrand";
import VehicleSlideOver from "../VehicleSlideOver";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Loader2, 
  AlertCircle, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Wrench 
} from "lucide-react";

export default function Vehicles() {
  const { vehicles, loading, error, addVehicle, updateVehicle, deleteVehicle } = useVehicles();
  const { brands } = useVehicleBrands();

  const [actionLoading, setActionLoading] = useState(null);
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // คำนวณจำนวนสถิติรถแยกตามสถานะ
  const stats = useMemo(() => {
    const total = vehicles.length;
    const available = vehicles.filter((v) => v.status === "available").length;
    const inUse = vehicles.filter((v) => v.status === "in_use").length;
    const maintenance = vehicles.filter((v) => v.status === "maintenance").length;

    return { total, available, inUse, maintenance };
  }, [vehicles]);

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-[#1A1A1A]">ข้อมูลยานพาหนะ</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600 border border-neutral-200/60">
              {stats.total} คัน
            </span>
          </div>
          <p className="text-sm text-neutral-500 mt-1">
            จัดการข้อมูลรายการรถ น้ำหนักบรรทุกสูงสุด และติดตามสถานะการทำงาน
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-neutral-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มรถใหม่</span>
        </button>
      </div>

      {/* Stat Cards (กล่องสรุปสถิติ) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* จำนวนรถทั้งหมด */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700 shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-500">จำนวนรถทั้งหมด</p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-bold text-[#1A1A1A]">{stats.total}</span>
              <span className="text-xs text-neutral-500">คัน</span>
            </div>
          </div>
        </div>

        {/* พร้อมใช้งาน */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-500">พร้อมใช้งาน</p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-bold text-[#1A1A1A]">{stats.available}</span>
              <span className="text-xs text-neutral-500">คัน</span>
            </div>
          </div>
        </div>

        {/* กำลังส่งของ */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-500">กำลังส่งของ</p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-bold text-[#1A1A1A]">{stats.inUse}</span>
              <span className="text-xs text-neutral-500">คัน</span>
            </div>
          </div>
        </div>

        {/* ซ่อมบำรุง */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-500">ซ่อมบำรุง</p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-bold text-[#1A1A1A]">{stats.maintenance}</span>
              <span className="text-xs text-neutral-500">คัน</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Error */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>เกิดข้อผิดพลาดในการโหลดข้อมูล: {error}</span>
        </div>
      )}

      {/* Table Section */}
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
                          className="p-1.5 text-neutral-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                          title="แก้ไข"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(v.vehicle_id, v.license_plate)}
                          disabled={actionLoading === v.vehicle_id}
                          className="p-1.5 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
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

      {/* SlideOver Drawer */}
      <VehicleSlideOver
        isOpen={isSlideOverOpen}
        onClose={() => setIsSlideOverOpen(false)}
        onSave={handleSave}
        initialData={selectedVehicle}
      />
    </div>
  );
}