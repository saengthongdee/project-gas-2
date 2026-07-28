import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";

export const useVehicleBrands = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [brands, setBrands] = useState([]);

  const fetchBrands = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.get("/vehiclebrand");
      if (res.status === 200) {
        setBrands(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addBrand = async (formData) => {
    const res = await axiosInstance.post("/vehiclebrand", formData);
    await fetchBrands();
    return res.data;
  };

  const updateBrand = async (id, formData) => {
    const res = await axiosInstance.put(`/vehiclebrand/${id}`, formData);
    await fetchBrands();
    return res.data;
  };

  const deleteBrand = async (id) => {
    const res = await axiosInstance.delete(`/vehiclebrand/${id}`);
    await fetchBrands();
    return res.data;
  };

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  return {
    brands,
    loading,
    error,
    refetch: fetchBrands,
    addBrand,
    updateBrand,
    deleteBrand,
  };
};