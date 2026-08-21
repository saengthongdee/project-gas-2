import React, { useState, useMemo } from "react";
import { useHistory } from "../hook/useHistory";
import OrderDetailsSlideOver from "../OrderDetailsSlideOver"; // นำเข้า SlideOver ที่สร้างใหม่
import {
  Search,
  Loader2,
  AlertCircle,
  User,
  Truck,
  Calendar,
  X,
  Package
} from "lucide-react";

export default function History() {
  const { data: orders = [], loading, error } = useHistory();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  
  // State สำหรับจัดการ SlideOver
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);

  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setIsSlideOverOpen(true);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm.trim() ||
        String(o.order_id).toLowerCase().includes(term) ||
        o.customer_name?.toLowerCase().includes(term) ||
        o.name?.toLowerCase().includes(term) ||
        o.payment_method?.toLowerCase().includes(term);

      let matchesDate = true;
      if (selectedDate) {
        const orderDateOnly = o.order_date ? o.order_date.split("T")[0] : "";
        matchesDate = orderDateOnly === selectedDate;
      }

      return matchesSearch && matchesDate;
    });
  }, [orders, searchTerm, selectedDate]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 overflow-hidden max-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-[#1A1A1A]">ประวัติการสั่งซื้อ</h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-neutral-100 text-neutral-700 border border-neutral-200 rounded-full">
              {orders.length} รายการ
            </span>
          </div>
          <p className="text-sm text-neutral-500 mt-1">
            ตรวจสอบประวัติการสั่งซื้อ สถานะการจัดส่ง และรายการสินค้าในแต่ละออเดอร์
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>เกิดข้อผิดพลาดในการโหลดข้อมูล: {error}</span>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
        {/* Toolbar: Search & Date Filter */}
        <div className="p-4 border-b border-neutral-200 bg-neutral-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="ค้นหาเลขออเดอร์, ลูกค้า, คนขับ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-sm bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#5b5b5b] text-[#1A1A1A]"
              />
            </div>

            <div className="relative w-full sm:w-auto flex items-center gap-2">
              <div className="relative w-full sm:w-auto">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full sm:w-auto pl-9 pr-3 py-1.5 text-sm bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#5b5b5b] text-[#1A1A1A]"
                />
              </div>
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate("")}
                  className="p-1.5 text-neutral-500 hover:text-[#1A1A1A] hover:bg-neutral-200/60 rounded-md transition-colors"
                  title="ล้างวันที่"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="text-xs text-neutral-500">
            แสดงผล <span className="font-semibold text-[#1A1A1A]">{filteredOrders.length}</span> จากทั้งหมด{" "}
            <span className="font-semibold text-[#1A1A1A]">{orders.length}</span> รายการ
          </div>
        </div>

        {loading && orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-neutral-400 gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-[#1A1A1A]" />
            <p className="text-sm">กำลังโหลดประวัติการสั่งซื้อ...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 text-neutral-400">
            <p className="text-sm">
              {searchTerm || selectedDate ? "ไม่พบข้อมูลออเดอร์ที่ตรงกับการค้นหาหรือวันที่เลือก" : "ไม่พบประวัติการสั่งซื้อในระบบ"}
            </p>
          </div>
        ) : (
          <div className="max-h-[60vh] overflow-y-scroll custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F5F8FB] border-b border-neutral-200 text-xs font-semibold text-[#545454] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">วันที่สั่งซื้อ</th>
                  <th className="py-3.5 px-4">ลูกค้า (ผู้รับ)</th>
                  <th className="py-3.5 px-4">รายการสินค้า</th>
                  <th className="py-3.5 px-4">ยอดรวม</th>
                  <th className="py-3.5 px-4">พนักงานจัดส่ง</th>
                  <th className="py-3.5 px-4">สถานะการส่ง</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-sm text-[#1A1A1A]">
                {filteredOrders.map((order) => (
                  <tr key={order.order_id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#1A1A1A]">
                      #{order.order_id}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-600">
                    {order.order_date
                        ? new Date(order.order_date).toLocaleDateString("th-TH", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        })
                        : "-"}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-neutral-400" />
                        {order.customer_name}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleOpenDetails(order)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors border border-neutral-200"
                      >
                        <Package className="w-3.5 h-3.5 text-neutral-500" />
                        <span>ดูรายการ ({order.items_snapshot?.length || 0})</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#1A1A1A]">
                      {Number(order.total_amount).toLocaleString("th-TH", { minimumFractionDigits: 2 })} ฿
                    </td>
                    <td className="py-3.5 px-4 text-neutral-600">
                      <div className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-neutral-400" />
                        {order.employee_name || "-"}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          order.delivery_status === "delivered"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {order.delivery_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Render SlideOver */}
      <OrderDetailsSlideOver
        isOpen={isSlideOverOpen}
        onClose={() => setIsSlideOverOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
}