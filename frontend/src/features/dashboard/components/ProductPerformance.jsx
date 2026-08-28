import React from 'react';

const formatCurrency = (val, decimals = 0) =>
  '฿' + Number(val || 0).toLocaleString('th-TH', { 
    minimumFractionDigits: decimals, 
    maximumFractionDigits: decimals 
  });

export default function ProductPerformance({ bestSellers = [], worstSellers = [] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      
      {/* Best Sellers */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
          <span>สินค้าขายดี</span>
        </h2>
        
        <div className="space-y-3">
          {bestSellers.map((item, index) => {
            const soldCount = item?.quantity_sold ?? 0;

            return (
              <div 
                key={item?.item_id || index} 
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/60 border border-slate-100"
              >
                <div className="flex items-center gap-3.5">
                  <span className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <div>
                    <span className="text-sm font-semibold text-slate-700 block">
                      {item?.name || 'สินค้า'}
                    </span>
                    <span className="text-[12px] text-slate-500 tabular-nums">
                      ขายแล้ว {soldCount} หน่วย
                    </span>
                  </div>
                </div>

                <span className="text-sm font-semibold text-slate-700 tabular-nums">
                  {formatCurrency(item?.revenue)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Worst Sellers */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
          <span>สินค้าขายไม่ดี</span>
        </h2>

        <div className="space-y-3">
          {worstSellers.map((item, index) => {
            const soldCount = item?.quantity_sold ?? 0;

            return (
              <div 
                key={item?.item_id || index} 
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/60 border border-slate-100"
              >
                <div className="flex items-center gap-3.5">
                  <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <div>
                    <span className="text-sm font-semibold text-slate-700 block">
                      {item?.name || 'สินค้า'}
                    </span>
                    <span className="text-[12px] text-slate-500 tabular-nums">
                      ขายได้ {soldCount} หน่วย
                    </span>
                  </div>
                </div>

                <span className="text-sm font-semibold text-slate-700 tabular-nums">
                  {formatCurrency(item?.revenue)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}