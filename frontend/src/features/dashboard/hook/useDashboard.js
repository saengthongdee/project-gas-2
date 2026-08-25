import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../../api/axiosInstance";

export const useDashboard = () => {
    const [dashboard1, setDashboard1] = useState(null);
    const [dashboard2, setDashboard2] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 1. ดึงข้อมูล Dashboard แรก (GET /api/dashboard หรือตาม endpoint ของคุณ)
    const fetchDashboard1 = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get("/dashboard");
            setDashboard1(response.data.data);
            return response.data.data;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // 2. ดึงข้อมูล Dashboard 2 ตามปีและเดือน (POST /api/dashboard/month)
    const fetchDashboard2 = useCallback(async (year, month) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.post("/dashboard/month", { year, month });
            setDashboard2(response.data.data);
            return response.data.data;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        dashboard1,
        dashboard2,
        loading,
        error,
        fetchDashboard1,
        fetchDashboard2
    };
};