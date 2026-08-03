import React, { useState } from 'react';
import { useSecurity } from '../hook/useSecurity';
import { KeyRound, ShieldCheck, Save, AlertCircle, CheckCircle2, User, Loader2 } from 'lucide-react';

export default function Security() {
  const { 
    employees, 
    employeeLoading, 
    loading, 
    updateEmployeePassword 
  } = useSecurity();

  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!selectedEmpId) {
      setMessage({ type: 'error', text: 'กรุณาเลือกพนักงานที่ต้องการตั้งรหัสผ่าน' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'รหัสผ่านใหม่อย่างน้อยต้องมี 6 ตัวอักษรขึ้นไป' });
      return;
    }

    try {
      await updateEmployeePassword(selectedEmpId, newPassword);
      setMessage({ type: 'success', text: 'ตั้งรหัสผ่านให้พนักงานสำเร็จเรียบร้อยแล้ว' });

      // รีเซ็ตฟอร์ม
      setSelectedEmpId('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' });
    }
  };

  return (
    <div className="max-w-4xl min-h-screen p-6 mx-auto space-y-6 bg-gray-50/30 text-gray-800">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">กำหนดรหัสผ่านพนักงาน</h1>
        <p className="text-sm text-gray-500 mt-0.5">ตั้งค่าหรือรีเซ็ตรหัสผ่านเข้าสู่ระบบสำหรับพนักงานที่ยังไม่มีรหัสผ่าน</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-[#F5F8FB] flex items-center gap-3">
          <div className="p-2.5 bg-white rounded-xl border border-neutral-200 text-slate-800 shadow-xs">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">ตั้งค่ารหัสผ่านเข้าใช้งาน</h2>
            <p className="text-xs text-gray-500">เลือกพนักงานจากระบบและกำหนดรหัสผ่านใหม่</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {message.text && (
            <div className={`p-4 rounded-xl text-sm flex items-center gap-2 border ${
              message.type === 'error' 
                ? 'bg-rose-50 border-rose-100 text-rose-600' 
                : 'bg-emerald-50 border-emerald-100 text-emerald-600'
            }`}>
              {message.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
              <span>{message.text}</span>
            </div>
          )}

          {/* เลือกพนักงาน */}
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">
              เลือกพนักงาน <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
                disabled={employeeLoading}
                className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-800 text-gray-800 cursor-pointer"
              >
                <option value="">-- เลือกพนักงานในระบบ --</option>
                {employees.map((emp) => (
                  <option key={emp.employee_id} value={emp.employee_id}>
                    {emp.name} ({emp.role_name || 'พนักงาน'})
                  </option>
                ))}
              </select>
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
            {employeeLoading && <p className="text-xs text-gray-400 mt-1">กำลังโหลดรายชื่อพนักงาน...</p>}
          </div>

          <hr className="border-gray-100 my-2" />

          {/* รหัสผ่านใหม่ & ยืนยันรหัสผ่านใหม่ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">
                รหัสผ่านใหม่ <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="อย่างน้อย 6 ตัวอักษร"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-slate-800 placeholder-gray-400"
                />
                <ShieldCheck className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">
                ยืนยันรหัสผ่านใหม่ <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-slate-800 placeholder-gray-400"
                />
                <ShieldCheck className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#0B192C] hover:bg-[#1E3E62] text-white text-sm font-medium rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
              {loading ? 'กำลังบันทึก...' : 'บันทึกรหัสผ่านใหม่'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}