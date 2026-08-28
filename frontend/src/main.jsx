import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { socket } from './utils/socket'

socket.on("connect", () => {
  console.log("🟢 Global Socket Connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("🔴 Global Socket Connection Error:", err.message);
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)