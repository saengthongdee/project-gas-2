import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../../api/axiosInstance";

export const useOrder = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  // 1. ดึงข้อมูลออเดอร์
  const fetchingData = useCallback(async () => {

    try {

      setLoading(true);
      setError(null);

      const response = await axiosInstance.get("/order");

      if (response.status === 200) {
        setData(response.data.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);


  // 2. สร้างออเดอร์ใหม่ (Create)
  const createOrder = async (orderData) => {
    try {

      setLoading(true);
      setError(null);

      const response = await axiosInstance.post("/order", orderData);

      if (response.ok) {
        setData((prev) => [
          response.data.order || response.data || orderData,
          ...prev,
        ]);
      }
      return response.data;

    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderItems = async (orderId, itemsArray) => {
    try {

      setError(null);

      const response = await axiosInstance.put(`/order_item/${orderId}`, {
        items: itemsArray,
      });

      setData((prevData) =>
        prevData.map((order) => {
            
          if (Number(order.order_id || order.id) === Number(orderId)) {
            return {
              ...order,
              items: itemsArray,
              ...(response.data || {}),
            };
          }
          return order;
        }),
      );

      return response.data;
    } catch (err) {
        setError(err.response?.data?.message || err.message);
        throw err;
    }
  };

  const deleteOrder = async (orderId) => {

    try{

        if(!orderId) {return}

        setError(null)

        const response = await axiosInstance.delete(`/order/${orderId}`)

        if(response.ok) { return response.data}

    }catch(err) {
        setError(err.response?.data?.message || err.message);
        throw err;
    }
  }

   useEffect(() => {
    fetchingData();
  }, [fetchingData]);

  return {
    data,
    loading,
    error,
    refetch: fetchingData,
    createOrder,
    updateOrderItems,
    deleteOrder
  };
};
