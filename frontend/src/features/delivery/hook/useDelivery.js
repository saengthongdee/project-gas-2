import { useState, useEffect } from "react";
import axiosInstance from "../../../api/axiosInstance";

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

        try{

            setLoading(true);
            setError(null);

            const response = await axiosInstance.put("/order/delivery", payload);

            if(response.status === 200) {

                fetchingData();
                return response.data;
            }

        }catch(err) {
            setError(err.response?.data?.message || err.message);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchingData();
    }, []);

    return { loading, error, data, fetchingData, assignVehicle };
}