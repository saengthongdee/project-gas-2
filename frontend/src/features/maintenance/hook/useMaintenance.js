import { useState, useCallback, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance';

export const useMaintenance = () => {
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. ดึงข้อมูล (GET)
  const fetchingData = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      const response = await axiosInstance.get('/maintenence');

      if (response.status === 200) {
        const result = response.data.data || response.data;
        setData(Array.isArray(result) ? result : []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setData([]); 
    } finally {
      setLoading(false);
    }
  }, []); 

  // 2. เพิ่มข้อมูลใหม่ (POST) - แยกรับพารามิเตอร์
  const createMaintenance = async (received_date, imageBase64) => {
    try {
      setError(null);
      setLoading(true);

      const response = await axiosInstance.post('/maintenence', {
        received_date,
        imageBase64
      });

      if (response.status === 200 || response.status === 201) {
        await fetchingData(); 
        return { success: true, data: response.data };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw new Error(errorMessage); 
    } finally {
      setLoading(false);
    }
  };

  // 3. ลบข้อมูล (DELETE)
  const deleteMaintenance = async (id) => {
    try {
      setError(null);
      setLoading(true);

      const response = await axiosInstance.delete(`/maintenence/${id}`);

      if (response.status === 200) {
        setData((prevData) => 
          Array.isArray(prevData) 
            ? prevData.filter((item) => item.maintenance_id !== id) 
            : []
        );
        return { success: true };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw new Error(errorMessage); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchingData();
  }, [fetchingData]);

  return { 
    data, 
    error, 
    loading, 
    refetch: fetchingData,
    createMaintenance,
    deleteMaintenance 
  };
};