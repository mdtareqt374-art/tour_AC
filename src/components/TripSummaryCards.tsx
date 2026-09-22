import React from 'react';
import {
  Wallet,
  Receipt,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  FileText,
  FileSpreadsheet,
  Plus,
  Calendar,
  MapPin,
  PiggyBank,
  Edit2
} from 'lucide-react';
import { Trip, Expense, Income, Language } from '../types';

interface TripSummaryCardsProps {
  trip: Trip;
  expenses: Expense[];
  incomes: Income[];
  onOpenAddExpense: () => void;
  onOpenAddIncome: () => void;
  onOpenQuickBudget: () => void;
  onOpenReportModal: () => void;
  onExportCSV: () => void;
  language: Language;
}

export const TripSummaryCards: React.FC<TripSummaryCardsProps> = ({
  trip,
  expenses,
  incomes,
  onOpenAddExpense,
  onOpenAddIncome,
  onOpenQuickBudget,
  onOpenReportModal,
  onExportCSV,
  language
}) => {
  const isBn = language === 'bn';

  const totalSpent = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const totalIncome = incomes.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
  const baseBudget = trip.budget || 0;

  // Effective Total Funds = base budget + collected income/extra funds
  // If base budget is set, total available is baseBudget + totalIncome
  // If user only uses income collections, total available is totalIncome
  const totalFunds = baseBudget + totalIncome;
  
  // Remaining cash in hand: available total funds - total spent
  const remainingCash = totalFunds > 0 ? totalFunds - totalSpent : (baseBudget > 0 ? baseBudget - totalSpent : null);
  const isOverBudget = totalFunds > 0 && totalSpent > totalFunds;
  const overBudgetAmount = isOverBudget ? totalSpent - totalFunds : 0;
  
  const percentageSpent = totalFunds > 0 ? Math.min(Math.round((totalSpent / totalFunds) * 100), 100) : 0;

  // Calculate days count if dates exist
  let daysCount = 1;
  if (trip.startDate && trip.endDate) {
    const start = new Date(trip.startDate).getTime();
    const end = new Date(trip.endDate).getTime();
    if (!isNaN(start) && !isNaN(end) && end >= start) {
      daysCount = Math.max(1, Math.round((end - start) / (1000 * 3600 * 24)) + 1);
    }
  }
  const dailyAverage = Math.round(totalSpent / Math.max(1, daysCount));

  return (
    <div className="space-y-4">
      {/* Trip Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400 mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{trip.destination || (isBn ? 'গন্তব্য নির্ধারিত নয়' : 'Destination not specified')}</span>
              {trip.startDate && (
                <>
                  <span>•</span>
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {trip.startDate} {trip.endDate ? `থেকে ${trip.endDate}` : ''} ({daysCount} {isBn ? 'দিন' : 'days'})
                  </span>
                </>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {trip.name}
            </h2>
            {trip.notes && (
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                {trip.notes}
              </p>
            )}
          </div>

          {/* Action CTAs: Add Income, Add Expense, PDF Report, CSV */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <button
              id="btn-add-income-main"
              type="button"
              onClick={onOpenAddIncome}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
              title={isBn ? 'নতুন আয় বা চাঁদা সংগ্রহ যোগ করুন' : 'Add Income or Contribution'}
            >
              <PiggyBank className="w-4 h-4" />
              <span>{isBn ? '+ আয় / ফান্ড যোগ' : '+ Add Income'}</span>
            </button>

            <button
              id="btn-add-expense-main"
              type="button"
              onClick={onOpenAddExpense}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
              title={isBn ? 'নতুন খরচ যোগ করুন' : 'Add Expense'}
            >
              <Plus className="w-4 h-4" />
              <span>{isBn ? 'খরচ যোগ করুন' : 'Add Expense'}</span>
            </button>

            <button
              id="btn-open-report-summary"
              type="button"
              onClick={onOpenReportModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 transition-colors shadow-xs"
              title={isBn ? 'পিডিএফ রিপোর্ট তৈরি ও ডাউনলোড করুন' : 'View & Download PDF Report'}
            >
              <FileText className="w-4 h-4 text-rose-600" />
              <span className="hidden sm:inline">{isBn ? 'পিডিএফ রিপোর্ট' : 'PDF Report'}</span>
            </button>

            <button
              id="btn-export-csv-summary"
              type="button"
              onClick={onExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors"
              title={isBn ? 'এক্সেল / সিএসভি ফাইল এক্সপোর্ট করুন' : 'Export to CSV'}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span className="hidden md:inline">{isBn ? 'CSV' : 'CSV'}</span>
            </button>
          </div>
        </div>

        {/* Budget & Fund Progress Bar */}
        {totalFunds > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-600 dark:text-slate-400">
                {isBn ? 'ফান্ড/বাজেট ব্যবহার' : 'Fund Usage'}: {percentageSpent}% (
                {trip.currency} {totalSpent.toLocaleString()} / {trip.currency} {totalFunds.toLocaleString()})
              </span>
              {isOverBudget ? (
                <span className="text-red-600 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {isBn ? 'বাজেট ঘাটতি' : 'Deficit'} {trip.currency} {overBudgetAmount.toLocaleString()}
                </span>
              ) : (
                <span className="text-emerald-600 font-bold">
                  {isBn ? 'অবশিষ্ট নগদ ফান্ড' : 'Cash in Hand'}: {trip.currency} {remainingCash?.toLocaleString()}
                </span>
              )}
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isOverBudget
                    ? 'bg-red-500'
                    : percentageSpent > 80
                    ? 'bg-amber-500'
                    : 'bg-teal-500'
                }`}
                style={{ width: `${Math.min(100, (totalSpent / totalFunds) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Funds & Budget Card with Quick Increase */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {isBn ? 'মোট ফান্ড ও বাজেট' : 'Total Funds & Budget'}
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {trip.currency} {totalFunds.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 space-y-0.5">
              <div>
                {isBn ? 'মূল বাজেট:' : 'Base:'} {trip.currency} {baseBudget.toLocaleString()}
              </div>
              {totalIncome > 0 && (
                <div className="text-emerald-600 dark:text-emerald-400 font-medium">
                  {isBn ? '+ সংগৃহীত আয়:' : '+ Income:'} {trip.currency} {totalIncome.toLocaleString()}
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onOpenQuickBudget}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              <Edit2 className="w-3 h-3" />
              <span>{isBn ? 'বাজেট বৃদ্ধি / পরিবর্তন' : 'Increase / Edit'}</span>
            </button>
          </div>
        </div>

        {/* Total Spent */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {isBn ? 'মোট খরচ' : 'Total Spent'}
              </span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {trip.currency} {totalSpent.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {expenses.length} {isBn ? 'টি খরচ এন্ট্রি' : 'expense entries'}
            </p>
          </div>
          <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-400">
              {isBn ? 'যাবতীয় ভ্রমণ ব্যয়' : 'All travel expenses'}
            </span>
          </div>
        </div>

        {/* Remaining Fund / Cash Balance */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {isBn ? 'অবশিষ্ট নগদ তহবিল' : 'Remaining Balance'}
              </span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isOverBudget ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
              }`}>
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <div className={`text-xl sm:text-2xl font-bold tracking-tight ${
              isOverBudget ? 'text-red-600' : 'text-emerald-600 dark:text-emerald-400'
            }`}>
              {remainingCash !== null ? (
                isOverBudget
                  ? `-${trip.currency} ${Math.abs(remainingCash).toLocaleString()}`
                  : `${trip.currency} ${remainingCash.toLocaleString()}`
              ) : (
                '—'
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {isOverBudget
                ? (isBn ? 'ঘাটতি রয়েছে' : 'Budget deficit')
                : (isBn ? 'হাতে নগদ উদ্বৃত্ত' : 'Cash in hand')}
            </p>
          </div>
          <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-400">
              {isBn ? 'মোট ফান্ড - মোট খরচ' : 'Funds minus spent'}
            </span>
          </div>
        </div>

        {/* Total Collected Incomes & Daily Average */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {isBn ? 'সংগৃহীত চাঁদা ও আয়' : 'Collected Income'}
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
                <PiggyBank className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
              +{trip.currency} {totalIncome.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {incomes.length} {isBn ? 'টি আয়/ফান্ড এন্ট্রি' : 'income entries'}
            </p>
          </div>
          <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              {isBn ? 'দৈনিক গড় ব্যয়:' : 'Daily avg:'} {trip.currency} {dailyAverage.toLocaleString()}
            </span>
            <button
              type="button"
              onClick={onOpenAddIncome}
              className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700"
            >
              + {isBn ? 'যোগ করুন' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
