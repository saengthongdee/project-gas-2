import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../../api/axiosInstance";

export const useVehicles = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [unassignedVehicles, setUnassignedVehicles] = useState([]); // เปลี่ยนชื่อให้อ่านเข้าใจง่ายขึ้น

  // ดึงข้อมูลรถทั้งหมด
  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.get("/vehicle");
      if (res.status === 200) {
        setVehicles(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ดึงข้อมูลรถที่ยังไม่มีพนักงานผูกไว้ (Null)
  const fetchVehiclesWithNull = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.get("/vehicle/null");
      if (res.status === 200) {
        setUnassignedVehicles(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []); // <--- เพิ่ม [] ตรงนี้ที่ตกไป

  // รวมฟังก์ชันเรียกโหลดข้อมูลทั้งคู่พร้อมกัน
  const fetchAllData = useCallback(async () => {
    await Promise.all([fetchVehicles(), fetchVehiclesWithNull()]);
  }, [fetchVehicles, fetchVehiclesWithNull]);

  // Action เพิ่ม/แก้ไข/ลบ ให้สั่งดึงข้อมูลใหม่ทั้งหมด
  const addVehicle = async (formData) => {
    const res = await axiosInstance.post("/vehicle", formData);
    await fetchAllData();
    return res.data;
  };

  const updateVehicle = async (id, formData) => {
    const res = await axiosInstance.put(`/vehicle/${id}`, formData);
    await fetchAllData();
    return res.data;
  };

  const deleteVehicle = async (id) => {
    const res = await axiosInstance.delete(`/vehicle/${id}`);
    await fetchAllData();
    return res.data;
  };

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return {
    vehicles,
    vehicleIsNull: unassignedVehicles,
    loading,
    error,
    refetch: fetchAllData,
    fetchVehicles,
    fetchVehiclesWithNull,
    addVehicle,
    updateVehicle,
    deleteVehicle,
  };
};