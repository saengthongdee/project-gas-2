import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../../api/axiosInstance";

export const useCylinderdeposit = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  const fetchingData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.get("/cylinderdeposit");
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

  const updateDeposit = async (deposit_id, qty_return) => {
    try {
      const res = await axiosInstance.put(`/cylinderdeposit/${deposit_id}`, {
        qty_return,
      });
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
    updateDeposit,
  };
};