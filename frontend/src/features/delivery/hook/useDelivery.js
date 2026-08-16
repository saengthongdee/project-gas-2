import { useState, useEffect } from "react";
import axiosInstance from "../../../api/axiosInstance";
import { io } from "socket.io-client";

// เชื่อมต่อ Socket ไปยัง Backend (ปรับ URL ตาม Port ของ Server จริง)
const socket = io("http://localhost:5000");

export const useDelivery = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);

    const fetchingData = async () => {
        try {
            setLoading(true);
            setError(null); 

            const response = await axiosInstance.get("/order/status");

            if (response.status === 200) {
                setData(response.data.data || []);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
        finally {
            setLoading(false);
        }
    }

    const assignVehicle = async (payload) => {
        try {
            setLoading(true);
            setError(null);

            const response = await axiosInstance.put("/order/delivery", payload);

            if (response.status === 200) {
                fetchingData();
                return response.data;
            }

        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
        finally {
            setLoading(false);
        }
    }

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
    }, []);

    return { loading, error, data, fetchingData, assignVehicle };
};