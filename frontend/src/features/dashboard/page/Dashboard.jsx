import React, { useEffect, useState, useMemo } from 'react';
import { useDashboard } from '../hook/useDashboard';

// นำเข้า Components ย่อย
import TopSummaryCards from '../components/TopSummaryCards';
import SalesChartSection from '../components/SalesChartSection';
import LowStockPanel from '../components/LowStockPanel';
import ProductPerformance from '../components/ProductPerformance';
import TransactionTable from '../components/TransactionTable';

export default function DashboardPage() {
  const { dashboard1, dashboard2, loading, error, fetchDashboard1, fetchDashboard2 } = useDashboard();
  
  const [selectedMonth, setSelectedMonth] = useState('');
  const [viewMode, setViewMode] = useState('monthly'); // 'monthly' | 'weekly'
  const [chartSelection, setChartSelection] = useState({ type: 'month', value: '' }); 
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetchDashboard1().then((resData) => {
      // ดึง data ชั้นนอกสุดตามโครงสร้าง API ใหม่
      const data = resData?.data || resData;
      if (data) {
        const monthlyArr = data.yearly_revenue_chart || [];
        const defaultMonth = monthlyArr.length > 0 ? monthlyArr[monthlyArr.length - 1].month : '2026-08';
        setSelectedMonth(defaultMonth);
        setChartSelection({ type: 'month', value: defaultMonth });
        
        const [year, month] = defaultMonth.split('-');
        fetchDashboard2(year, month);
      }
    }).catch(err => {
      console.error("Failed to fetch dashboard1:", err);
    });

    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, [fetchDashboard1, fetchDashboard2]);

  const handleMonthChange = (newMonth) => {
    setSelectedMonth(newMonth);
    setChartSelection({ type: 'month', value: newMonth });
    const [year, month] = newMonth.split('-');
    fetchDashboard2(year, month);
  };

  const analytics = useMemo(() => {
    // ดึง data ชั้นนอกสุดตามโครงสร้าง API ใหม่
    const data1 = dashboard1?.data || dashboard1;
    if (!data1) return null;

    const { today_summary = {}, yearly_revenue_chart = [], low_stock_items = {} } = data1;
    const monthlyArr = Array.isArray(yearly_revenue_chart) ? yearly_revenue_chart : [];
    
    // ดึง data ของ dashboard2 (เผื่อโครงสร้างมี .data ห่อหุ้มเช่นกัน)
    const data2 = dashboard2?.data || dashboard2;
    const weeklyArr = data2?.weekly_breakdown || [];

    const isDashboard2Month = data2 && data2.month === selectedMonth;
    const revenue = isDashboard2Month && data2.monthly_summary?.total_revenue 
      ? data2.monthly_summary.total_revenue 
      : (monthlyArr.find(m => m?.month === selectedMonth)?.revenue || 0);

    const profit = isDashboard2Month && data2.monthly_summary?.total_profit 
      ? data2.monthly_summary.total_profit 
      : (monthlyArr.find(m => m?.month === selectedMonth)?.profit || 0);

    const monthIndex = monthlyArr.findIndex((m) => m?.month === selectedMonth);
    const prevMonth = monthIndex > 0 ? monthlyArr[monthIndex - 1] : null;
    const momPercentage = prevMonth && prevMonth.revenue > 0 
      ? ((revenue - prevMonth.revenue) / prevMonth.revenue) * 100 
      : null;

    const maxMonthlyRev = monthlyArr.length > 0 ? Math.max(...monthlyArr.map((m) => m?.revenue || 0)) : 1;
    const maxWeeklyRev = weeklyArr.length > 0 ? Math.max(...weeklyArr.map((w) => w?.revenue || 0)) : 1;

    const stockItemsRaw = low_stock_items?.items || (Array.isArray(low_stock_items) ? low_stock_items : []);
    const sortedStockItems = [...stockItemsRaw].sort((a, b) => (a?.quantity || 0) - (b?.quantity || 0));

    const [yearStr, monthStr] = selectedMonth.split('-');
    const daysInMonth = (yearStr && monthStr) ? new Date(parseInt(yearStr, 10), parseInt(monthStr, 10), 0).getDate() : 30;
    const isCurrentActualMonth = selectedMonth === today_summary?.date?.slice(0, 7);
    const currentDay = isCurrentActualMonth && today_summary?.date ? new Date(today_summary.date + 'T00:00:00').getDate() : daysInMonth;
    const pacingProgress = Math.min((currentDay / daysInMonth) * 100, 100);

    const bestSellers = data2?.product_performance?.best_sellers || [];
    const worstSellers = data2?.product_performance?.worst_sellers || [];
    const deliveredHistory = data2?.delivered_history || [];

    return {
      revenue, profit, momPercentage, maxMonthlyRev, maxWeeklyRev, sortedStockItems,
      daysInMonth, currentDay, pacingProgress, isCurrentActualMonth, 
      weekly_revenue_chart: weeklyArr, monthly_revenue_chart: monthlyArr,
      bestSellers, worstSellers, deliveredHistory, today_summary
    };
  }, [dashboard1, dashboard2, selectedMonth]);

  const filteredTransactions = useMemo(() => {
    if (!analytics || !analytics.deliveredHistory) return [];
    const history = analytics.deliveredHistory;
    if (!chartSelection.value) return history;

    return history.filter(tx => {
      const txDateStr = tx?.delivered_at || '';
      if (!txDateStr) return true;

      if (chartSelection.type === 'month') {
        return txDateStr.startsWith(chartSelection.value);
      } 
      
      if (chartSelection.type === 'week' && analytics?.weekly_revenue_chart) {
        const weekData = analytics.weekly_revenue_chart.find(w => w?.week === chartSelection.value);
        if (weekData && weekData.start_date && weekData.end_date) {
          const txDate = new Date(txDateStr.split('T')[0]).getTime();
          const startDate = new Date(weekData.start_date).getTime();
          const endDate = new Date(weekData.end_date).getTime() + (24 * 60 * 60 * 1000); 
          return txDate >= startDate && txDate <= endDate;
        }
      }
      return true;
    });
  }, [analytics, chartSelection]);

  if (loading && !dashboard1) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-slate-300 border-t-slate-800 animate-spin" />
          <p className="text-xs text-slate-500 font-medium">กำลังโหลดข้อมูลจากเซิร์ฟเวอร์...</p>
        </div>
      </div>
    );
  }

  if (error && !dashboard1) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-200 text-center">
          <p className="text-sm font-bold text-rose-600">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
          <p className="text-xs text-slate-500 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!dashboard1 || !analytics) {
    return null;
  }

  const { today_summary, revenue, profit, momPercentage, maxMonthlyRev, maxWeeklyRev, sortedStockItems, pacingProgress, weekly_revenue_chart, monthly_revenue_chart, bestSellers, worstSellers } = analytics;

  return (
    <div className="min-h-screen custom-scrollbar bg-[#f9f9f9] text-slate-900 pb-12 font-sans">
      {/* Header */}
      <header className="bg-[#f9f9f9] border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[24px] font-bold tracking-tight text-slate-900">Dashboard Manager</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-6 space-y-6">
        
        {/* 1. Top Summary Cards */}
        <TopSummaryCards
          selectedMonth={selectedMonth}
          monthly_revenue_chart={monthly_revenue_chart}
          onMonthChange={handleMonthChange}
          revenue={revenue}
          profit={profit}
          momPercentage={momPercentage}
          pacingProgress={pacingProgress}
          today_summary={today_summary}
          isLoaded={isLoaded}
        />

        {/* 2. Charts & Low Stock Panel */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-5 ${isLoaded ? 'fade-in' : 'opacity-0'}`} style={{ animationDelay: '100ms' }}>
          <div className="lg:col-span-8">
            <SalesChartSection
              viewMode={viewMode}
              setViewMode={setViewMode}
              monthly_revenue_chart={monthly_revenue_chart}
              weekly_revenue_chart={weekly_revenue_chart}
              maxMonthlyRev={maxMonthlyRev}
              maxWeeklyRev={maxWeeklyRev}
              selectedMonth={selectedMonth}
              onMonthChange={handleMonthChange}
              chartSelection={chartSelection}
              setChartSelection={setChartSelection}
            />
          </div>
          <div className="lg:col-span-4 flex flex-col">
            <LowStockPanel sortedStockItems={sortedStockItems} />
          </div>
        </div>

        {/* 3. Product Performance */}
        <div className={`${isLoaded ? 'fade-in' : 'opacity-0'}`} style={{ animationDelay: '150ms' }}>
          <ProductPerformance bestSellers={bestSellers} worstSellers={worstSellers} />
        </div>

        {/* 4. Transaction History Table */}
        <div className={`${isLoaded ? 'fade-in' : 'opacity-0'}`} style={{ animationDelay: '200ms' }}>
          <TransactionTable
            filteredTransactions={filteredTransactions}
            chartSelection={chartSelection}
          />
        </div>

      </main>
    </div>
  );
}