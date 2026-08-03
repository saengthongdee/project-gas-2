import React from "react";

export default function OrderStatusBadge({ status }) {
  const statusConfig = {
    
    pending: { label: "รอดำเนินการ", bg: "bg-yellow-100", text: "text-yellow-800" },
    delivering: { label: "กำลังจัดส่ง", bg: "bg-blue-100", text: "text-blue-800" },
    delivered: { label: "จัดส่งสำเร็จ", bg: "bg-green-100", text: "text-green-800" },
    cancelled: { label: "ยกเลิกแล้ว", bg: "bg-red-100", text: "text-red-800" },
  };

  const current = statusConfig[status] || {
    label: status || "ไม่ระบุ",
    bg: "bg-gray-100",
    text: "text-gray-800",
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${current.bg} ${current.text}`}>
      {current.label}
    </span>
  );
}