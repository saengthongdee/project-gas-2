import React, { useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import AppRouter from './routes/AppRouter';
import { socket } from './utils/socket';

export default function App() {
  useEffect(() => {

    socket.on("connect", () => {
      console.log("🟢 Global Socket Connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("🔴 Global Socket Connection Error:", err.message);
    });

    // Cleanup เมื่อแอปถูกปิด
    return () => {
      socket.off("connect");
      socket.off("connect_error");
    };
  }, []);

  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}