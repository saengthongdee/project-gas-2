import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";

export const useCustomer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  // 1. GET: ดึงข้อมูลลูกค้า
  const fetchingData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.get("/customer");
      if (res.status === 200) {
        setData(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.log("Error : ", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. POST: เพิ่มลูกค้าใหม่
  const addCustomer = async (formData) => {
    try {
      const res = await axiosInstance.post("/customer", formData);
      await fetchingData(); // อัปเดตข้อมูลตารางใหม่อัตโนมัติ
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  // 3. PUT: แก้ไขข้อมูลลูกค้า
  const updateCustomer = async (id, formData) => {
    try {
      const res = await axiosInstance.put(`/customer/${id}`, formData);
      await fetchingData(); // อัปเดตข้อมูลตารางใหม่อัตโนมัติ
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  // 4. DELETE: ลบข้อมูลลูกค้า
  const deleteCustomer = async (id) => {
    try {
      const res = await axiosInstance.delete(`/customer/${id}`);
      await fetchingData(); // อัปเดตข้อมูลตารางใหม่อัตโนมัติ
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchingData();
  }, [fetchingData]);

  return {
    data,
    loading,
    error,
    refetch: fetchingData,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  };
};