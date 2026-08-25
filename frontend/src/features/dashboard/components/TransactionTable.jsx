import React from 'react';

const formatCurrency = (val) => '฿' + Number(val || 0).toLocaleString('th-TH');

const formatThaiDate = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const days = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
  const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear() + 543}`;
};

export default function TransactionTable({ filteredTransactions = [], chartSelection = {} }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sm font-bold text-slate-900">ประวัติการจัดส่งสินค้า (Delivered History)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            กำลังแสดงผลสำหรับ: <span className="font-bold text-slate-700">{chartSelection.value || 'ทั้งหมด'}</span>
          </p>
        </div>
        <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
          เจอ {filteredTransactions.length} รายการ
        </span>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="py-12 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl">
          <p className="text-xs text-slate-500 font-medium">ไม่พบประวัติการขายในช่วงเวลานี้</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-600 rounded-tl-xl">รหัสออเดอร์</th>
                <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-600">วัน/เวลาจัดส่ง</th>
                <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-600">ชื่อลูกค้า</th>
                <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-600 text-center">จำนวนรายการ</th>
                <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-600 text-right">ยอดรวม</th>
                <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-600 text-center rounded-tr-xl">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((tx, idx) => (
                <tr key={tx?.order_id || idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 text-xs font-bold text-slate-900">{tx?.order_id}</td>
                  <td className="py-3.5 px-4 text-xs text-slate-600 tabular-nums">{formatThaiDate(tx?.delivered_at)}</td>
                  <td className="py-3.5 px-4 text-xs font-medium text-slate-800">{tx?.customer_name}</td>
                  <td className="py-3.5 px-4 text-xs text-slate-700 text-center tabular-nums">{tx?.items_count} รายการ</td>
                  <td className="py-3.5 px-4 text-xs font-bold text-slate-900 tabular-nums text-right">
                    {formatCurrency(tx?.total_amount)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-100 text-emerald-700">
                      จัดส่งสำเร็จ
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}