import React from 'react';

const formatCurrency = (amount, decimals = 0) =>
  '฿' + Number(amount || 0).toLocaleString('th-TH', { 
    minimumFractionDigits: decimals, 
    maximumFractionDigits: decimals 
  });

const formatThaiMonth = (yearMonthStr) => {
  if (!yearMonthStr) return '';
  const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  const [year, month] = yearMonthStr.split('-');
  const monthIdx = parseInt(month, 10) - 1;
  return `${months[monthIdx] || month} ${parseInt(year, 10) + 543}`;
};

const formatThaiDate = (isoDateStr) => {
  if (!isoDateStr) return '';
  const date = new Date(isoDateStr);
  if (isNaN(date.getTime())) return isoDateStr;
  const days = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
  const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear() + 543}`;
};

export default function TopSummaryCards({
  selectedMonth,
  monthly_revenue_chart = [],
  onMonthChange,
  revenue,
  profit,
  momPercentage,
  pacingProgress,
  today_summary,
  isLoaded
}) {
  const ringRadius = 54;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference - (pacingProgress / 100) * ringCircumference;

  const orderStatus = today_summary?.order_status || { pending: 0, delivering: 0, delivered: 0 };

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-5 ${isLoaded ? 'fade-in' : 'opacity-0'}`}>
      {/* การ์ดยอดขายเดือน */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          
          <div className="relative shrink-0 mx-auto sm:mx-0">
            <svg width="130" height="130" viewBox="0 0 130 130" className="-rotate-90">
              <circle cx="65" cy="65" r={ringRadius} fill="none" stroke="#F1F5F9" strokeWidth="10" />
              <circle
                cx="65" cy="65" r={ringRadius} fill="none" stroke="url(#gasBlueGrad)" strokeWidth="10"
                strokeDasharray={ringCircumference} strokeDashoffset={isLoaded ? ringOffset : ringCircumference}
                strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
              />
              <defs>
                <linearGradient id="gasBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#0284C7" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="tabular-nums text-2xl font-black text-slate-900">{Math.round(pacingProgress)}%</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[12.5px] font-bold uppercase tracking-wider text-sky-600">
                ยอดขายเดือน {formatThaiMonth(selectedMonth)}
              </span>
              <select
                value={selectedMonth}
                onChange={(e) => onMonthChange(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1 font-semibold focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                {monthly_revenue_chart.map((m) => (
                  <option key={m?.month} value={m?.month}>{formatThaiMonth(m?.month)}</option>
                ))}
              </select>
            </div>
            <div className="tabular-nums text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight my-1">
              {formatCurrency(revenue)}
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {momPercentage !== null && (
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg ${momPercentage >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                  {momPercentage >= 0 ? '▲' : '▼'} {Math.abs(momPercentage).toFixed(1)}% จากเดือนก่อน
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-[12.5px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                กำไรสุทธิ: {formatCurrency(profit)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* การ์ดยอดขายวันนี้ พร้อมเพิ่มแสดงกำไรวันนี้ */}
      <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
         <div>
            <div className="flex items-center justify-between mb-1">
               <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">อัปเดตวันนี้</span>
               <span className="text-[11px] font-medium text-slate-500 tabular-nums">{formatThaiDate(today_summary?.date)}</span>
            </div>
            
            {/* แสดงยอดขายและกำไรวันนี้ในบรรทัดเดียวกัน */}
            <div className="flex items-baseline justify-between mt-1">
               <div className="tabular-nums text-2xl sm:text-3xl font-bold text-slate-900">
                  {formatCurrency(today_summary?.total_revenue, 2)}
               </div>
               <span className="text-xs font-bold text-emerald-600  py-1 rounded-lg">
                  กำไร {formatCurrency(today_summary?.total_profit, 2)}
               </span>
            </div>

            <p className="text-xs text-slate-500 mt-0.5">{today_summary?.total_orders || 0} รายการออเดอร์ในวันนี้</p>
         </div>

         {/* แถบสถานะแบบ Clean & Minimal */}
         <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t-2 border-neutral-200">
            <div className="flex flex-col">
               <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span className="text-[11px] font-medium text-slate-500">รอดำเนินการ</span>
               </div>
               <span className="text-base font-bold text-slate-900 tabular-nums mt-1 pl-3">{orderStatus.pending}</span>
            </div>

            <div className="flex flex-col border-x border-slate-100 px-3">
               <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                  <span className="text-[11px] font-medium text-slate-500">กำลังจัดส่ง</span>
               </div>
               <span className="text-base font-bold text-slate-900 tabular-nums mt-1 pl-3">{orderStatus.delivering}</span>
            </div>

            <div className="flex flex-col pl-1">
               <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span className="text-[11px] font-medium text-slate-500">จัดส่งแล้ว</span>
               </div>
               <span className="text-base font-bold text-slate-900 tabular-nums mt-1 pl-3">{orderStatus.delivered}</span>
            </div>
         </div>
      </div>
    </div>
  );
}