import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../../api/axiosInstance";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

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

        if (response.data.success) {
            setData((prev) => [
                response.data.order || response.data.data || orderData,
                ...prev,
            ]);
        } else {
            setError(response.data.message || "Failed to create order");
        }

        return response.data;

    } catch (err) {
        const message = err.response?.data?.message || err.message;
        setError(message);
        throw err;
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
  
  const deleteOrderItem = async (itemId) => {

    try{

      setError(null)

      const response = await axiosInstance.delete(`/order_item/${itemId}`)

      return response.data;

    }catch(err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  }

   useEffect(() => {
    fetchingData();
  }, [fetchingData]);

  useEffect(() => {

    fetchingData();

        socket.on("order_status_update", (updatedOrder) => {
            setData((prevData) =>
                prevData.map((order) =>
                    order.order_id === updatedOrder.order_id
                        ? { ...order, delivery_status: updatedOrder.status }
                        : order
                )
            );
        });
        return () => {
            socket.off("order_status_update");
        };

  },[])

  return {
    data,
    loading,
    error,
    refetch: fetchingData,
    createOrder,
    updateOrderItems,
    deleteOrder,
    deleteOrderItem
  };
};
