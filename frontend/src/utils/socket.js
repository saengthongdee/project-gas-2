import { io } from "socket.io-client";

// กำหนด URL ของ Backend
const SOCKET_URL = "http://localhost:5000"; 

// สร้าง Instance กลางและสั่งเชื่อมต่อทันที
export const socket = io(SOCKET_URL, {
    autoConnect: true,
});