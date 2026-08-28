import { io } from "socket.io-client";

// กำหนด URL ของ Backend
const SOCKET_URL = "http://10.161.96.216:5000"; 

export const socket = io(SOCKET_URL, {
    autoConnect: true,
});