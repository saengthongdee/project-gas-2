import React, { useState } from 'react';

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

const formatShortDate = (isoDateStr) => {
  if (!isoDateStr) return '';
  const parts = isoDateStr.split('-');
  if (parts.length < 3) return isoDateStr;
  const [, month, day] = parts;
  const months = ['', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  return `${parseInt(day, 10)} ${months[parseInt(month, 10)]}`;
};

export default function SalesChartSection({
  viewMode,
  setViewMode,
  monthly_revenue_chart,
  weekly_revenue_chart,
  maxMonthlyRev,
  maxWeeklyRev,
  selectedMonth,
  onMonthChange,
  chartSelection,
  setChartSelection
}) {
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-sm font-bold text-slate-900">สถิติและประวัติการขาย</h2>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => { setViewMode('monthly'); setChartSelection({ type: 'month', value: selectedMonth }); }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${viewMode === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
          >
            รายเดือน
          </button>
          <button
            onClick={() => { 
              setViewMode('weekly'); 
              if (weekly_revenue_chart?.length > 0) {
                setChartSelection({ type: 'week', value: weekly_revenue_chart[0]?.week });
              }
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${viewMode === 'weekly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
          >
            รายสัปดาห์
          </button>
        </div>
      </div>

      {/* Monthly Chart */}
      {viewMode === 'monthly' && (
        <div className="h-60 flex items-end justify-between gap-3 pt-10 px-2 border-b border-slate-100 relative">
          {monthly_revenue_chart?.map((item, idx) => {
            const rev = item?.revenue || 0;
            const barHeight = Math.max((rev / maxMonthlyRev) * 80, 6);
            const isHovered = hoveredBarIndex === idx;
            const isSelected = chartSelection.type === 'month' && chartSelection.value === item?.month;

            return (
              <div
                key={item?.month || idx}
                className="flex flex-col items-center h-full justify-end flex-1 group cursor-pointer relative"
                onClick={() => {
                  if (item?.month) {
                    onMonthChange(item.month);
                  }
                }}
                onMouseEnter={() => setHoveredBarIndex(idx)}
                onMouseLeave={() => setHoveredBarIndex(null)}
              >
                {isHovered && (
                  <div className="absolute -top-16 bg-slate-900 text-white text-[11px] px-3 py-2 rounded-xl shadow-xl z-25 whitespace-nowrap pointer-events-none flex flex-col gap-0.5">
                    <span className="text-[10px] text-slate-400">{formatThaiMonth(item?.month)}</span>
                    {/* เปลี่ยนสีตัวหนังสือรายได้ใน Tooltip เป็นสีฟ้า */}
                    <span className="tabular-nums font-bold text-sky-400">รายได้: {formatCurrency(rev)}</span>
                  </div>
                )}
                <div
                  className={`w-full max-w-[32px] rounded-t-lg transition-all duration-300 ${isSelected ? 'ring-2 ring-sky-400 ring-offset-2' : ''}`}
                  /* เปลี่ยนสี Active เป็น #0284C7 (ฟ้าเข้ม) และ Hover เป็น #38BDF8 (ฟ้าอ่อน) */
                  style={{ height: `${barHeight}%`, backgroundColor: isSelected ? '#0284C7' : isHovered ? '#38BDF8' : '#E2E8F0' }}
                />
                {/* เปลี่ยนสีตัวอักษรเมื่อเลือกเป็นโทนฟ้า */}
                <span className={`text-[10px] mt-2 tabular-nums font-medium ${isSelected ? 'text-sky-600 font-bold' : 'text-slate-500'}`}>
                  {formatThaiMonth(item?.month).split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Weekly Chart */}
      {viewMode === 'weekly' && (
        <div className="h-60 flex items-end justify-between gap-3 pt-10 px-2 border-b border-slate-100 relative">
          {weekly_revenue_chart?.map((item, idx) => {
            const rev = item?.revenue || 0;
            const barHeight = Math.max((rev / maxWeeklyRev) * 80, 6);
            const isHovered = hoveredBarIndex === idx;
            const isSelected = chartSelection.type === 'week' && chartSelection.value === item?.week;

            return (
              <div
                key={item?.week || idx}
                className="flex flex-col items-center h-full justify-end flex-1 group cursor-pointer relative"
                onClick={() => item?.week && setChartSelection({ type: 'week', value: item.week })}
                onMouseEnter={() => setHoveredBarIndex(idx)}
                onMouseLeave={() => setHoveredBarIndex(null)}
              >
                {isHovered && (
                  <div className="absolute -top-16 bg-slate-900 text-white text-[11px] px-3 py-2 rounded-xl shadow-xl z-25 whitespace-nowrap pointer-events-none flex flex-col gap-0.5">
                    {/* เปลี่ยนสีสัปดาห์ใน Tooltip เป็นฟ้า */}
                    <span className="text-[10px] text-sky-400 font-bold">{item?.week}</span>
                    <span className="tabular-nums font-bold text-emerald-400">รายได้: {formatCurrency(rev)} (กำไร: {formatCurrency(item?.profit || 0)})</span>
                  </div>
                )}
                <div
                  className={`w-full max-w-[48px] rounded-t-lg transition-all duration-300 ${isSelected ? 'ring-2 ring-sky-400 ring-offset-2' : ''}`}
                  style={{ height: `${barHeight}%`, backgroundColor: isSelected ? '#0284C7' : isHovered ? '#38BDF8' : '#E2E8F0' }}
                />
                <div className="text-center mt-2">
                  <span className={`block text-[11px] font-bold ${isSelected ? 'text-sky-600' : 'text-slate-700'}`}>{item?.week}</span>
                  <span className="block text-[9px] text-slate-400 tabular-nums">{formatShortDate(item?.start_date)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}