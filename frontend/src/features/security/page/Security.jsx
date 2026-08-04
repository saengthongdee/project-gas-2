import React, { useState } from "react";
import { useSecurity } from "../hook/useSecurity";
import {
  KeyRound,
  ShieldCheck,
  Save,
  AlertCircle,
  CheckCircle2,
  User,
  Loader2,
  Eye,
  EyeOff,
  Lock,
  Check,
  X,
  ShieldAlert,
  Info,
  Building2,
} from "lucide-react";

export default function Security() {
  const {
    employees,
    employeeLoading,
    loading,
    updateEmployeePassword,
  } = useSecurity();

  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState({ type: "", text: "" });

  // ค้นหาข้อมูลพนักงานที่ถูกเลือก
  const selectedEmployee = employees.find(
    (emp) => String(emp.employee_id) === String(selectedEmpId)
  );

  // ตัวแปรเช็คสถานะ validation ย่อยสำหรับแสดง UI Indicator
  const isMinLength = newPassword.length >= 6;
  const isMatched = newPassword !== "" && newPassword === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!selectedEmpId) {
      setMessage({
        type: "error",
        text: "กรุณาเลือกพนักงานที่ต้องการตั้งรหัสผ่าน",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({
        type: "error",
        text: "รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน",
      });
      return;
    }

    if (!isMinLength) {
      setMessage({
        type: "error",
        text: "รหัสผ่านใหม่อย่างน้อยต้องมี 6 ตัวอักษรขึ้นไป",
      });
      return;
    }

    try {
      await updateEmployeePassword(selectedEmpId, newPassword);
      setMessage({
        type: "success",
        text: "ตั้งรหัสผ่านให้พนักงานสำเร็จเรียบร้อยแล้ว",
      });

      // รีเซ็ตฟอร์ม
      setSelectedEmpId("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
      });
    }
  };

  return (
    <div className="max-w-6xl  p-6 space-y-6 min-h-screen text-slate-800">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-[#1A1A1A]">
              กำหนดรหัสผ่านพนักงาน
            </h1>
          </div>
          <p className="text-sm text-neutral-500 mt-1.5 pl-0.5">
            ตั้งค่าหรือรีเซ็ตรหัสผ่านสำหรับเข้าใช้งานระบบความปลอดภัยแก่พนักงานในองค์กร
          </p>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Form Card (Left / Main Column - Span 2) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200/80 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-bold text-[#1A1A1A]">
                ฟอร์มตั้งค่ารหัสผ่านใหม่
              </span>
            </div>
            <span className="text-xs text-neutral-400">
              ช่องที่มีเครื่องหมาย <span className="text-rose-500">*</span> จำเป็นต้องกรอก
            </span>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Message Alert */}
            {message.text && (
              <div
                className={`p-4 rounded-xl text-sm flex items-start gap-3 border transition-all ${
                  message.type === "error"
                    ? "bg-rose-50 border-rose-200 text-rose-700"
                    : "bg-emerald-50 border-emerald-200 text-emerald-700"
                }`}
              >
                {message.type === "error" ? (
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-xs">
                    {message.type === "error" ? "พบข้อผิดพลาด" : "ดำเนินการสำเร็จ"}
                  </p>
                  <p className="text-xs mt-0.5 leading-relaxed">{message.text}</p>
                </div>
              </div>
            )}

            {/* เลือกพนักงาน */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700">
                เลือกพนักงาน <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  disabled={employeeLoading}
                  className="w-full pl-10 pr-10 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium text-[#1A1A1A] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#0B192C] transition-all cursor-pointer disabled:opacity-50 appearance-none"
                >
                  <option value="">-- เลือกพนักงานในระบบ --</option>
                  {employees.map((emp) => (
                    <option key={emp.employee_id} value={emp.employee_id}>
                      {emp.name} ({emp.role_name || "พนักงานทั่วไป"})
                    </option>
                  ))}
                </select>
                <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <div className="absolute right-3.5 top-3.5 pointer-events-none text-neutral-400 text-xs">
                  ▼
                </div>
              </div>
              {employeeLoading && (
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-1">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>กำลังโหลดรายชื่อพนักงาน...</span>
                </div>
              )}
            </div>

            <hr className="border-neutral-100" />

            {/* รหัสผ่านใหม่ & ยืนยันรหัสผ่าน */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* New Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-700">
                  รหัสผ่านใหม่ <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    placeholder="อย่างน้อย 6 ตัวอักษร"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-mono text-[#1A1A1A] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#0B192C] placeholder:font-sans placeholder-neutral-400 transition-all"
                  />
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-2.5 p-1 text-neutral-400 hover:text-neutral-600 rounded-lg transition-colors cursor-pointer"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-700">
                  ยืนยันรหัสผ่านใหม่ <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-mono text-[#1A1A1A] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#0B192C] placeholder:font-sans placeholder-neutral-400 transition-all"
                  />
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 p-1 text-neutral-400 hover:text-neutral-600 rounded-lg transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Validation Feedback Indicators */}
            {newPassword.length > 0 && (
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/60 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  {isMinLength ? (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-rose-500 shrink-0" />
                  )}
                  <span
                    className={
                      isMinLength ? "text-emerald-700 font-medium" : "text-neutral-500"
                    }
                  >
                    ความยาวอย่างน้อย 6 ตัวอักษร
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {isMatched ? (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-rose-500 shrink-0" />
                  )}
                  <span
                    className={
                      isMatched ? "text-emerald-700 font-medium" : "text-neutral-500"
                    }
                  >
                    รหัสผ่านทั้งสองช่องตรงกัน
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#0B192C] hover:bg-[#1E3E62] text-white text-xs font-semibold rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span>กำลังบันทึก...</span>
                  </>
                ) : (
                  <>
                    <span>บันทึกรหัสผ่านใหม่</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Info & Selected Employee Card (Right Column - Span 1) */}
        <div className="space-y-5">
          {/* Selected Employee Context Card */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider text-neutral-400">
              พนักงานที่เลือก
            </h3>

            {selectedEmployee ? (
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100 flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0B192C] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {selectedEmployee.name?.charAt(0) || "E"}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-[#1A1A1A] truncate">
                    {selectedEmployee.name}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">
                      {selectedEmployee.role_name || "ไม่มีตำแหน่งระบุ"}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1 font-mono">
                    ID: #{selectedEmployee.employee_id}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-neutral-50 rounded-xl border border-dashed border-neutral-200 text-center text-xs text-neutral-400 py-6">
                ยังไม่ได้เลือกพนักงาน
              </div>
            )}
          </div>

          {/* Security Guidelines Card */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-[#0B192C]">
              <ShieldAlert className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                ข้อแนะนำความปลอดภัย
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs text-neutral-600">
              <li className="flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                <span>รหัสผ่านควรมีความยาวอย่างน้อย 6 ตัวอักษร</span>
              </li>
              <li className="flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                <span>ควรผสมผสานตัวอักษรภาษาอังกฤษ ตัวเลข และสัญลักษณ์</span>
              </li>
              <li className="flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                <span>หลีกเลี่ยงการใช้ข้อมูลส่วนตัว เช่น วันเกิด หรือเบอร์โทรศัพท์</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}