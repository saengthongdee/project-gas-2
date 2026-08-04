import React, { useState } from "react";
import { useVehicleBrands } from "../hook/useVehicleBrand";
import VehicleBrandSlideOver from "../VehicleBrandSlideOver";
import { Plus, Pencil, Trash2, Loader2, AlertCircle, Tag } from "lucide-react";

export default function VehicleBrand() {
  const { brands, loading, error, addBrand, updateBrand, deleteBrand } = useVehicleBrands();
  const [actionLoading, setActionLoading] = useState(null);
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const handleOpenAdd = () => {
    setSelectedBrand(null);
    setIsSlideOverOpen(true);
  };

  const handleOpenEdit = (brand) => {
    setSelectedBrand(brand);
    setIsSlideOverOpen(true);
  };

  const handleSave = async (formData) => {
    if (selectedBrand) {
      await updateBrand(selectedBrand.brand_id, formData);
    } else {
      await addBrand(formData);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`คุณต้องการลบยี่ห้อ/ประเภทรถ "${name}" ใช่หรือไม่?`)) return;

    try {
      setActionLoading(id);
      await deleteBrand(id);
    } catch (err) {
      alert("ไม่สามารถลบข้อมูลได้: " + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">ยี่ห้อ / ประเภทรถ</h1>
          <p className="text-sm text-neutral-500 mt-1">
            จัดการหมวดหมู่และประเภทของยานพาหนะส่งแก๊ส
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-neutral-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มประเภทรถ</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>เกิดข้อผิดพลาดในการโหลดข้อมูล: {error}</span>
        </div>
      )}

      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
        {loading && brands.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-neutral-400 gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-[#1A1A1A]" />
            <p className="text-sm">กำลังโหลดข้อมูล...</p>
          </div>
        ) : brands.length === 0 ? (
          <div className="text-center py-16 text-neutral-400">
            <p className="text-sm">ยังไม่มีข้อมูลยี่ห้อ/ประเภทรถ</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F5F8FB] border-b border-neutral-200 text-xs font-semibold text-[#545454] uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-20">ID</th>
                  <th className="py-3.5 px-4">ยี่ห้อ / ประเภทรถ</th>
                  <th className="py-3.5 px-4 text-center w-32">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-sm text-[#1A1A1A]">
                {brands.map((brand) => (
                  <tr key={brand.brand_id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3.5 px-4 text-neutral-500 font-mono">#{brand.brand_id}</td>
                    <td className="py-3.5 px-4 font-medium flex items-center gap-2">
                      <Tag className="w-4 h-4 text-neutral-400" />
                      <span>{brand.brand_type}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(brand)}
                          className="p-1.5 text-neutral-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="แก้ไข"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(brand.brand_id, brand.brand_type)}
                          disabled={actionLoading === brand.brand_id}
                          className="p-1.5 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                          title="ลบ"
                        >
                          {actionLoading === brand.brand_id ? (
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

      <VehicleBrandSlideOver
        isOpen={isSlideOverOpen}
        onClose={() => setIsSlideOverOpen(false)}
        onSave={handleSave}
        initialData={selectedBrand}
      />
    </div>
  );
}