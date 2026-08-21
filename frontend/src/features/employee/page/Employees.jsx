import React, { useState, useMemo } from "react";
import { useEmployees } from "../hook/useEmployee";
import EmployeeSlideOver from "../EmployeeSlideOver";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
  Users,
  Truck,
  Search,
  UserCheck,
} from "lucide-react";

export default function Employees() {
  const {
    data: employees = [],
    loading,
    error,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  } = useEmployees();

  const [actionLoading, setActionLoading] = useState(null);
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 💡 กรองข้อมูลพนักงานจากคำค้นหา (ชื่อ, เบอร์โทร, อีเมล, ตำแหน่ง, ทะเบียนรถ, สถานะ)
  const filteredEmployees = useMemo(() => {
    if (!searchTerm.trim()) return employees;
    const term = searchTerm.toLowerCase();
    return employees.filter(
      (e) =>
        e.name?.toLowerCase().includes(term) ||
        e.phone?.includes(term) ||
        e.email?.toLowerCase().includes(term) ||
        e.role_name?.toLowerCase().includes(term) ||
        e.license_plate?.toLowerCase().includes(term) ||
        e.status?.toLowerCase().includes(term)
    );
  }, [employees, searchTerm]);

  // 💡 คำนวณสถิติสำหรับ Stat Cards
  const driverCount = useMemo(() => {
    return employees.filter(
      (e) =>
        e.role_id === 3 ||
        e.role_name?.includes("คนขับ") ||
        e.role_name?.includes("ส่งแก๊ส")
    ).length;
  }, [employees]);

  const assignedVehicleCount = useMemo(() => {
    return employees.filter((e) => e.license_plate && e.license_plate !== "-").length;
  }, [employees]);

  const handleOpenAdd = () => {
    setSelectedEmployee(null);
    setIsSlideOverOpen(true);
  };

  const handleOpenEdit = (employee) => {
    setSelectedEmployee(employee);
    setIsSlideOverOpen(true);
  };

  const handleSaveEmployee = async (formData) => {
    if (selectedEmployee) {
      await updateEmployee(selectedEmployee.employee_id, formData);
    } else {
      await addEmployee(formData);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`คุณต้องการลบข้อมูลพนักงาน "${name}" ใช่หรือไม่?`)) return;

    try {
      setActionLoading(id);
      await deleteEmployee(id);
    } catch (err) {
      alert("ไม่สามารถลบข้อมูลได้: " + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto  p-6 space-y-6 overflow-hidden max-h-screen ">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-[#1A1A1A]">ข้อมูลพนักงาน</h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-neutral-100 text-neutral-700 border border-neutral-200 rounded-full">
              {employees.length} คน
            </span>
          </div>
          <p className="text-sm text-neutral-500 mt-1">
            จัดการข้อมูลรายชื่อพนักงาน ตำแหน่งงาน และข้อมูลยานพาหนะจัดส่ง
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-neutral-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มพนักงานใหม่</span>
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-neutral-100 rounded-lg text-[#1A1A1A]">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-500">พนักงานทั้งหมด</p>
            <p className="text-2xl font-bold text-[#1A1A1A]">
              {employees.length}{" "}
              <span className="text-xs font-normal text-neutral-500">คน</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-500">คนขับรถส่งแก๊ส</p>
            <p className="text-2xl font-bold text-[#1A1A1A]">
              {driverCount}{" "}
              <span className="text-xs font-normal text-neutral-500">คน</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-500">ผูกยานพาหนะแล้ว</p>
            <p className="text-2xl font-bold text-[#1A1A1A]">
              {assignedVehicleCount}{" "}
              <span className="text-xs font-normal text-neutral-500">คน</span>
            </p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>เกิดข้อผิดพลาดในการโหลดข้อมูล: {error}</span>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-neutral-200 bg-neutral-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="ค้นหาชื่อ, เบอร์, ตำแหน่ง, ทะเบียน, สถานะ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#5b5b5b] text-[#1A1A1A]"
            />
          </div>
          <div className="text-xs text-neutral-500">
            แสดงผล <span className="font-semibold text-[#1A1A1A]">{filteredEmployees.length}</span> จากทั้งหมด{" "}
            <span className="font-semibold text-[#1A1A1A]">{employees.length}</span> คน
          </div>
        </div>

        {loading && employees.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-neutral-400 gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-[#1A1A1A]" />
            <p className="text-sm">กำลังโหลดข้อมูลพนักงาน...</p>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="text-center py-16 text-neutral-400">
            <p className="text-sm">
              {searchTerm ? "ไม่พบข้อมูลพนักงานที่ตรงกับการค้นหา" : "ไม่พบข้อมูลพนักงานในระบบ"}
            </p>
          </div>
        ) : (
          <div className="max-h-[55vh] overflow-y-scroll custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F5F8FB] border-b border-neutral-200 text-xs font-semibold text-[#545454] uppercase tracking-wider">
                  <th className="py-3.5 px-4">#</th>
                  <th className="py-3.5 px-4">ชื่อ-นามสกุล</th>
                  <th className="py-3.5 px-4">ตำแหน่ง</th>
                  <th className="py-3.5 px-4">เบอร์โทรศัพท์</th>
                  <th className="py-3.5 px-4">อีเมล</th>
                  <th className="py-3.5 px-4">ทะเบียน / ยี่ห้อรถ</th>
                  <th className="py-3.5 px-4">สถานะ</th>
                  <th className="py-3.5 px-4 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-sm text-[#1A1A1A]">
                {filteredEmployees.map((employee, index) => (
                  <tr key={employee.employee_id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3.5 px-4 text-neutral-500">{index + 1}</td>
                    <td className="py-3.5 px-4 font-medium">{employee.name}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800 border border-neutral-200">
                        {employee.role_name}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-600">{employee.phone}</td>
                    <td className="py-3.5 px-4 text-neutral-600">{employee.email}</td>
                    <td className="py-3.5 px-4 text-neutral-600">
                      {employee.license_plate ? (
                        <div className="flex flex-col text-xs">
                          <span className="font-semibold text-[#1A1A1A]">{employee.license_plate}</span>
                          <span className="text-neutral-400">{employee.brand_type || "-"}</span>
                        </div>
                      ) : (
                        <span className="text-neutral-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          employee.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                        }`}
                      >
                        {employee.status === "active" ? "Active" : employee.status || "Inactive"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(employee)}
                          className="p-1.5 text-neutral-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="แก้ไขข้อมูล"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(employee.employee_id, employee.name)}
                          disabled={actionLoading === employee.employee_id}
                          className="p-1.5 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                          title="ลบข้อมูล"
                        >
                          {actionLoading === employee.employee_id ? (
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

      {/* Slide-over Component */}
      <EmployeeSlideOver
        isOpen={isSlideOverOpen}
        onClose={() => setIsSlideOverOpen(false)}
        onSave={handleSaveEmployee}
        initialData={selectedEmployee}
      />
    </div>
  );
}