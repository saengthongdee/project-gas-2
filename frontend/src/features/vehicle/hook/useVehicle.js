import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../../api/axiosInstance";

export const useVehicles = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [vehicles, setVehicles] = useState([]);

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

  const addVehicle = async (formData) => {
    const res = await axiosInstance.post("/vehicle", formData);
    await fetchVehicles();
    return res.data;
  };

  const updateVehicle = async (id, formData) => {
    const res = await axiosInstance.put(`/vehicle/${id}`, formData);
    await fetchVehicles();
    return res.data;
  };

  const deleteVehicle = async (id) => {
    const res = await axiosInstance.delete(`/vehicle/${id}`);
    await fetchVehicles();
    return res.data;
  };

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return {
    vehicles,
    loading,
    error,
    refetch: fetchVehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
  };
};