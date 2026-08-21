import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../../api/axiosInstance";
import { socket } from "../../../utils/socket";

export const useVehicles = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [unassignedVehicles, setUnassignedVehicles] = useState([]);

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
  }, []);

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

  // โหลดข้อมูลครั้งแรกเมื่อเปิดใช้งาน Hook
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // 🟢 ฟัง Socket.io แบบ Global สำหรับอัปเดตสถานะรถ
  useEffect(() => {
    socket.on("vehicle_status_update", (updatedVehicle) => {
      setVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) =>
          Number(vehicle.vehicle_id || vehicle.id) === Number(updatedVehicle.vehicle_id)
            ? { ...vehicle, status: updatedVehicle.status }
            : vehicle
        )
      );

      setUnassignedVehicles((prevUnassigned) =>
        prevUnassigned.map((vehicle) =>
          Number(vehicle.vehicle_id || vehicle.id) === Number(updatedVehicle.vehicle_id)
            ? { ...vehicle, status: updatedVehicle.status }
            : vehicle
        )
      );
    });

    return () => {
      socket.off("vehicle_status_update");
    };
  }, []);

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