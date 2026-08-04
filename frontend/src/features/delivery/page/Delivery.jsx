import React, { useState, useMemo } from 'react';
import { useDelivery } from '../hook/useDelivery';
import DeliverySlideOver from '../DeliverySlideOver';
import {
  Clock,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Search,
  Loader2,
  AlertCircle,
  Eye,
  RefreshCw,
  Send,
} from "lucide-react";

const STATUS_MAP = {
  pending: { label: 'รอดำเนินการ', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  delivering: { label: 'กำลังจัดส่ง', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
  delivered: { label: 'จัดส่งสำเร็จ', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  cancelled: { label: 'ยกเลิก', bg: 'bg-rose-50 text-rose-700 border-rose-200' },
};

export default function Delivery() {
  const { loading, error, data: orders, fetchingData ,assignVehicle } = useDelivery();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);

  const filteredOrders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return (orders || []).filter((item) => {
      const matchesSearch = !term || item.order_id?.toString().toLowerCase().includes(term);
      const matchesStatus = selectedStatus === 'all' || item.delivery_status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, selectedStatus]);

  const selectableOrdersInFilter = useMemo(() => {
    return filteredOrders.filter((o) => o.delivery_status === 'pending');
  }, [filteredOrders]);

  const stats = useMemo(() => {
    const list = orders || [];
    return {
      totalCount: list.length,
      pendingCount: list.filter((o) => o.delivery_status === 'pending').length,
      deliveringCount: list.filter((o) => o.delivery_status === 'delivering').length,
      deliveredCount: list.filter((o) => o.delivery_status === 'delivered').length,
      cancelledCount: list.filter((o) => o.delivery_status === 'cancelled').length,
    };
  }, [orders]);

  const handleSelectAll = (e) => {
    const selectableIds = selectableOrdersInFilter.map((o) => o.order_id);
    if (e.target.checked) {
      setSelectedOrderIds((prev) => Array.from(new Set([...prev, ...selectableIds])));
    } else {
      setSelectedOrderIds((prev) => prev.filter((id) => !selectableIds.includes(id)));
    }
  };

  const handleSelectRow = (orderId) => {
    setSelectedOrderIds((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const isAllSelected = useMemo(() => {
    if (selectableOrdersInFilter.length === 0) return false;
    return selectableOrdersInFilter.every((o) => selectedOrderIds.includes(o.order_id));
  }, [selectableOrdersInFilter, selectedOrderIds]);

  const handleAssignQueue = async (payload) => {

    try {

      console.log("Delivery.jsx received payload:", payload);

      const result = await assignVehicle(payload);

      if (result?.success) {

        setSelectedOrderIds([]);
        setIsSlideOverOpen(false);

      } else {
        alert(result?.error || "เกิดข้อผิดพลาดในการจัดคิวส่ง");
      }
    } catch (err) {
      console.error("Failed to assign queue in Delivery.jsx:", err);
    }
  };

  return (
    <div className="max-w-7xl min-h-screen p-6 mx-auto space-y-6 bg-gray-50/30 text-gray-800">
      
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">จัดการการจัดส่ง</h1>
          <p className="text-sm text-gray-500 mt-0.5">ระบบติดตามสถานะ และตรวจสอบรายการจัดส่งออเดอร์</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setIsSlideOverOpen(true)}
            disabled={selectedOrderIds.length === 0}
            className={`px-4 py-2.5 font-medium text-sm rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto ${
              selectedOrderIds.length > 0
                ? 'bg-[#0B192C] hover:bg-[#1E3E62] text-white cursor-pointer'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>จัดคิวส่งสินค้า {selectedOrderIds.length > 0 && `(${selectedOrderIds.length})`}</span>
          </button>
        </div>
      </div>

      {/* 2. Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-neutral-100 rounded-lg text-[#1A1A1A]">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-500">ออเดอร์ทั้งหมด</p>
            <p className="text-2xl font-bold text-[#1A1A1A]">{stats.totalCount} <span className="text-xs font-normal text-neutral-500">รายการ</span></p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-500">รอดำเนินการ</p>
            <p className="text-2xl font-bold text-[#1A1A1A]">{stats.pendingCount} <span className="text-xs font-normal text-neutral-500">รายการ</span></p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-500">กำลังจัดส่ง</p>
            <p className="text-2xl font-bold text-[#1A1A1A]">{stats.deliveringCount} <span className="text-xs font-normal text-neutral-500">รายการ</span></p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-500">จัดส่งสำเร็จ</p>
            <p className="text-2xl font-bold text-[#1A1A1A]">{stats.deliveredCount} <span className="text-xs font-normal text-neutral-500">รายการ</span></p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 rounded-lg text-rose-600">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-500">ยกเลิก</p>
            <p className="text-2xl font-bold text-[#1A1A1A]">{stats.cancelledCount} <span className="text-xs font-normal text-neutral-500">รายการ</span></p>
          </div>
        </div>
      </div>

      {/* 3. Table Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="ค้นหารหัสออเดอร์..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#373737] placeholder-gray-400"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'ทั้งหมด' },
                { id: 'pending', label: 'รอดำเนินการ' },
                { id: 'delivering', label: 'กำลังจัดส่ง' },
                { id: 'delivered', label: 'จัดส่งสำเร็จ' },
                { id: 'cancelled', label: 'ยกเลิก' },
              ].map((status) => (
                <button
                  key={status.id}
                  onClick={() => setSelectedStatus(status.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedStatus === status.id
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-gray-500 whitespace-nowrap">
            แสดงผล {filteredOrders.length} จากทั้งหมด {(orders || []).length} รายการ
          </div>
        </div>

        {/* เนื้อหาตาราง */}
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> กำลังโหลดข้อมูลรายการจัดส่ง...
          </div>
        ) : error ? (
          <div className="p-12 text-center text-rose-500 text-sm flex items-center justify-center gap-2">
            <AlertCircle className="w-5 h-5" /> เกิดข้อผิดพลาด: {error}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">ไม่พบรายการจัดส่งที่ค้นหา</div>
        ) : (
          <div className="overflow-x-auto max-h-[52vh] custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F5F8FB] border-b border-neutral-200 text-xs font-semibold text-[#545454] uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-10 text-center">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={isAllSelected}
                      disabled={selectableOrdersInFilter.length === 0}
                      className="w-4 h-4 rounded text-slate-800 focus:ring-slate-700 border-gray-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                    />
                  </th>
                  <th className="py-3.5 px-4">#</th>
                  <th className="py-3.5 px-4">รหัสออเดอร์</th>
                  <th className="py-3.5 px-4">ที่อยู่</th>
                  <th className="py-3.5 px-4 text-right">วันที่สั่งซื้อ</th>
                  <th className="py-3.5 px-4 text-right">ยอดรวม (บาท)</th>
                  <th className="py-3.5 px-4 text-center">สถานะการจัดส่ง</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {filteredOrders.map((order, index) => {
                  const isSelected = selectedOrderIds.includes(order.order_id);
                  const statusInfo = STATUS_MAP[order.delivery_status] || {
                    label: order.delivery_status,
                    bg: 'bg-gray-100 text-gray-600 border-gray-200',
                  };
                  const isDisableSelect = order.delivery_status !== 'pending';

                  return (
                    <tr
                      key={order.order_id}
                      className={`transition-colors ${
                        isSelected ? 'bg-blue-50/40' : 'hover:bg-slate-50/50'
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          disabled={isDisableSelect}
                          checked={isSelected}
                          onChange={() => handleSelectRow(order.order_id)}
                          className={`w-4 h-4 rounded border-gray-300 ${
                            isDisableSelect ? 'cursor-not-allowed opacity-40' : 'cursor-pointer text-slate-800 focus:ring-slate-700'
                          }`}
                        />
                      </td>

                      <td className="py-3.5 px-4 text-gray-600">{index + 1}</td>
                      <td className="py-3.5 px-4 font-semibold text-gray-900">#{order.order_id}</td>
                      <td className="py-3.5 px-4 text-gray-600">{order.address || '-'}</td>
                      <td className="py-3.5 px-4 text-right text-gray-600">
                        {order.order_date ? new Date(order.order_date).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        }) : '-'}
                      </td>
                      <td className="py-3.5 px-4 text-right font-medium text-gray-900">
                        {Number(order.total_amount || 0).toLocaleString('th-TH', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-md border ${statusInfo.bg}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Render Slide-over ไว้นอก/ท้ายสุดเสมอ */}
      <DeliverySlideOver
        isOpen={isSlideOverOpen}
        onClose={() => setIsSlideOverOpen(false)}
        selectedOrderIds={selectedOrderIds}
        setSelectedOrderIds={setSelectedOrderIds}
        onSuccess={handleAssignQueue}
      />

    </div>
  );
}