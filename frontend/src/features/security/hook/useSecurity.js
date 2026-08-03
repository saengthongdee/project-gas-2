import { useState } from "react";
import axiosInstance from "../../../api/axiosInstance";
import { useEmployees } from "../../employee/hook/useEmployee"; // เรียกใช้ Hook เดิมที่คุณมีอยู่แล้ว

export const useSecurity = () => {
  // ดึงข้อมูลพนักงานและสถานะจาก useEmployees มาใช้ใน Hook นี้ได้เลย
  const { 
    data: employees, 
    loading: employeeLoading, 
    error: employeeError, 
    refetch: refetchEmployees 
  } = useEmployees();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ฟังก์ชันสำหรับตั้งค่า / เปลี่ยนรหัสผ่านให้พนักงาน (Admin Action)
  const updateEmployeePassword = async (id, newPassword) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.put(`/employee/${id}/password`, {
        password: newPassword,
      });
      return res.data;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message;
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    employees,          // รายชื่อพนักงานที่ดึงมาจาก useEmployees
    employeeLoading,    // สถานะกำลังโหลดพนักงาน
    employeeError,      // ข้อผิดพลาดในการโหลดพนักงาน
    refetchEmployees,   // ฟังก์ชันรีเฟรชรายชื่อพนักงาน
    loading,            // สถานะกำลังบันทึกรหัสผ่าน
    error,              // ข้อผิดพลาดในการบันทึกรหัสผ่าน
    updateEmployeePassword,
  };
};