import React from 'react';

export default function LowStockPanel({ sortedStockItems = [] }) {
  return (
    <div className="bg-white h-[22rem] custom-scrollbar rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-slate-900">สต็อกใกล้หมด</h2>
      </div>

      <div className="space-y-2.5 overflow-y-auto max-h-[220px] pr-1 flex-1">
        {/* เช็กว่าถ้าไม่มีข้อมูล ให้แสดงข้อความ */}
        {sortedStockItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-xs font-medium">ไม่มีสินค้าใกล้หมดสต็อก</p>
          </div>
        ) : (
          sortedStockItems.map((item, i) => {
            const q = item?.quantity ?? 0;
            const urgent = q <= 3;

            return (
              <div 
                key={item?.item_id || i} 
                className="flex items-center justify-between p-3 border-b border-gray-300 transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${urgent ? 'bg-rose-500' : 'bg-amber-500'}`} />
                  <span className="text-[13px] font-semibold text-slate-800 truncate">
                    {item?.name || 'สินค้า'}
                  </span>
                </div>

                <div className="text-right shrink-0 text-red-700">
                  <span className="tabular-nums text-sm font-bold">{q}</span>
                  <span className="text-[11px] ml-1">{item?.unit || 'ถัง'}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}