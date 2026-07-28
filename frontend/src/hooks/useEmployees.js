import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";

export const useEmployees = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  // GET: ดึงข้อมูลพนักงาน
  const fetchingData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.get("/employee");
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

  // POST: เพิ่มพนักงานใหม่
  const addEmployee = async (formData) => {
    try {
      const res = await axiosInstance.post("/employee", formData);
      await fetchingData();
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  // PUT: แก้ไขข้อมูลพนักงาน
  const updateEmployee = async (id, formData) => {
    try {
      const res = await axiosInstance.put(`/employee/${id}`, formData);
      await fetchingData();
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  // DELETE: ลบข้อมูลพนักงาน
  const deleteEmployee = async (id) => {
    try {
      const res = await axiosInstance.delete(`/employee/${id}`);
      await fetchingData();
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
    addEmployee,
    updateEmployee,
    deleteEmployee,
  };
};