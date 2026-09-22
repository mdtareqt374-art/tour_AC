import React, { useState } from 'react';
import {
  X,
  FileDown,
  Printer,
  FileSpreadsheet,
  CheckCircle,
  Calendar,
  MapPin,
  PieChart,
  Receipt,
  PiggyBank,
  Loader2
} from 'lucide-react';
import { Trip, Expense, Income, Language } from '../types';
import { CATEGORIES, getCategoryMeta, PAYMENT_METHODS, getIncomeSourceMeta } from '../constants/categories';
import { downloadTripPdf } from '../utils/pdfGenerator';
import { exportCSV } from '../utils/storage';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
  expenses: Expense[];
  incomes?: Income[];
  language: Language;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  trip,
  expenses,
  incomes = [],
  language
}) => {
  const isBn = language === 'bn';
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!isOpen) return null;

  const totalSpent = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const totalIncome = incomes.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
  const baseBudget = trip.budget || 0;
  const totalFunds = baseBudget + totalIncome;
  const remainingCash = totalFunds > 0 ? totalFunds - totalSpent : (baseBudget > 0 ? baseBudget - totalSpent : null);
  const isOverBudget = totalFunds > 0 && totalSpent > totalFunds;

  // Category summary calculation
  const categoryStats = CATEGORIES.map((cat) => {
    const catExpenses = expenses.filter((e) => e.category === cat.id);
    const amount = catExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    const count = catExpenses.length;
    const percentage = totalSpent > 0 ? ((amount / totalSpent) * 100).toFixed(1) : '0';
    return {
      ...cat,
      amount,
      count,
      percentage
    };
  }).filter((c) => c.amount > 0);

  const handleDownloadPdf = async () => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    try {
      await downloadTripPdf(trip, expenses, incomes, language);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err) {
      console.error('PDF generation error:', err);
      alert(
        isBn
          ? 'পিডিএফ তৈরিতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
          : 'Failed to generate PDF. Please try again.'
      );
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 gap-3 bg-slate-50 dark:bg-slate-800/60 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                {isBn ? 'ভ্রমণের আয়-ব্যয় পূর্ণাঙ্গ রিপোর্ট' : 'Trip Financial Statement'}
              </span>
              {downloadSuccess && (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle className="w-3 h-3" />
                  {isBn ? 'পিডিএফ ডাউনলোড সম্পন্ন!' : 'Downloaded successfully!'}
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {trip.name}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Direct jsPDF Download */}
            <button
              id="btn-download-pdf"
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-white text-xs sm:text-sm font-bold shadow-xs transition-colors ${
                isGeneratingPdf
                  ? 'bg-teal-700 opacity-80 cursor-wait'
                  : 'bg-teal-600 hover:bg-teal-700 cursor-pointer'
              }`}
              title={isBn ? 'পিডিএফ ফাইল সরাসরি ডাউনলোড করুন' : 'Direct PDF Download'}
            >
              {isGeneratingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileDown className="w-4 h-4" />
              )}
              <span>
                {isGeneratingPdf
                  ? (isBn ? 'পিডিএফ তৈরি হচ্ছে...' : 'Generating PDF...')
                  : (isBn ? 'পিডিএফ ডাউনলোড' : 'Download PDF')}
              </span>
            </button>

            {/* Print / Save via Browser */}
            <button
              id="btn-print-report"
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold transition-colors"
              title={isBn ? 'প্রিন্ট অথবা সেভ অ্যাজ পিডিএফ করুন' : 'Print / Save as PDF'}
            >
              <Printer className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              <span>{isBn ? 'প্রিন্ট' : 'Print'}</span>
            </button>

            {/* CSV Export */}
            <button
              id="btn-export-csv-modal"
              type="button"
              onClick={() => exportCSV(trip, expenses, incomes)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold transition-colors"
              title="CSV Download"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>CSV</span>
            </button>

            <button
              id="btn-close-report-modal"
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div id="printable-report-area" className="p-6 sm:p-8 overflow-y-auto space-y-6 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
          {/* Document Header Banner */}
          <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {trip.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-teal-600" />
                    <strong>{isBn ? 'গন্তব্য:' : 'Destination:'}</strong> {trip.destination || 'N/A'}
                  </span>
                  {trip.startDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-teal-600" />
                      <strong>{isBn ? 'তারিখ:' : 'Dates:'}</strong> {trip.startDate} {trip.endDate ? `– ${trip.endDate}` : ''}
                    </span>
                  )}
                </div>
                {trip.notes && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 italic">
                    {trip.notes}
                  </p>
                )}
              </div>

              <div className="text-right sm:border-l sm:border-slate-200 sm:dark:border-slate-800 sm:pl-6">
                <span className="text-xs text-slate-500 uppercase font-semibold">
                  {isBn ? 'রিপোর্ট তৈরির তারিখ' : 'Report Generated'}
                </span>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {new Date().toLocaleDateString(isBn ? 'bn-BD' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {expenses.length} {isBn ? 'টি খরচ' : 'expenses'} • {incomes.length} {isBn ? 'টি আয়/চাঁদা' : 'incomes'}
                </p>
              </div>
            </div>
          </div>

          {/* Financial Summary Highlight */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                {isBn ? 'মোট ফান্ড ও বাজেট' : 'Total Funds & Budget'}
              </span>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                {trip.currency} {totalFunds.toLocaleString()}
              </p>
              <span className="text-[11px] text-slate-400">
                {isBn ? `মূল: ${baseBudget.toLocaleString()} + চাঁদা: ${totalIncome.toLocaleString()}` : `Base: ${baseBudget} + Income: ${totalIncome}`}
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                {isBn ? 'সর্বমোট খরচ' : 'Total Spent'}
              </span>
              <p className="text-xl font-bold text-rose-600 mt-0.5">
                {trip.currency} {totalSpent.toLocaleString()}
              </p>
              <span className="text-[11px] text-slate-400">
                {expenses.length} {isBn ? 'টি এন্ট্রি' : 'entries'}
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                {isBn ? 'অবশিষ্ট নগদ উদ্বৃত্ত' : 'Remaining Balance'}
              </span>
              <p className={`text-xl font-bold mt-0.5 ${isOverBudget ? 'text-red-600' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {remainingCash !== null ? (
                  isOverBudget
                    ? `-${trip.currency} ${Math.abs(remainingCash).toLocaleString()} (${isBn ? 'ঘাটতি' : 'Deficit'})`
                    : `${trip.currency} ${remainingCash.toLocaleString()} (${isBn ? 'উদ্বৃত্ত' : 'Surplus'})`
                ) : (
                  '—'
                )}
              </p>
              <span className="text-[11px] text-slate-400">
                {isBn ? 'হাতে নগদ ফান্ড' : 'Cash in hand'}
              </span>
            </div>
          </div>

          {/* Income & Funds Ledger if exists */}
          {incomes.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <PiggyBank className="w-4 h-4 text-emerald-600" />
                <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  {isBn ? 'আয় ও ফান্ড সংগ্রহের খতিয়ান' : 'Income & Funds Collected'}
                </h4>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-bold border-b border-emerald-100 dark:border-emerald-900/60">
                    <tr>
                      <th className="py-2.5 px-4">{isBn ? 'তারিখ' : 'Date'}</th>
                      <th className="py-2.5 px-4">{isBn ? 'আয় বা ফান্ডের নাম' : 'Source / Title'}</th>
                      <th className="py-2.5 px-4">{isBn ? 'উৎস' : 'Source'}</th>
                      <th className="py-2.5 px-4">{isBn ? 'মাধ্যম' : 'Method'}</th>
                      <th className="py-2.5 px-4">{isBn ? 'প্রদানকারী' : 'Contributor'}</th>
                      <th className="py-2.5 px-4 text-right">{isBn ? 'টাকা' : 'Amount'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {incomes.map((inc) => {
                      const sMeta = getIncomeSourceMeta(inc.source);
                      const method = PAYMENT_METHODS.find((m) => m.id === inc.paymentMethod);
                      return (
                        <tr key={inc.id} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-4 text-slate-500 whitespace-nowrap">{inc.date}</td>
                          <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-slate-100">
                            {inc.title}
                            {inc.notes && (
                              <span className="block text-[11px] text-slate-400 italic">
                                {inc.notes}
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-4">
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${sMeta.badgeClass}`}>
                              {isBn ? sMeta.nameBn : sMeta.nameEn}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-slate-500 text-xs">
                            {isBn ? method?.nameBn || inc.paymentMethod : method?.nameEn || inc.paymentMethod}
                          </td>
                          <td className="py-2.5 px-4 text-slate-500 text-xs">
                            {inc.contributor || '—'}
                          </td>
                          <td className="py-2.5 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                            +{trip.currency} {inc.amount.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-emerald-50 dark:bg-emerald-950/50 font-bold border-t-2 border-emerald-200 dark:border-emerald-800">
                    <tr>
                      <td colSpan={5} className="py-3 px-4 text-right text-emerald-900 dark:text-emerald-200">
                        {isBn ? 'মোট সংগৃহীত আয় ও চাঁদা:' : 'Total Income Collected:'}
                      </td>
                      <td className="py-3 px-4 text-right text-base text-emerald-600 dark:text-emerald-400">
                        +{trip.currency} {totalIncome.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Category Summary Table */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <PieChart className="w-4 h-4 text-teal-600" />
              <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                {isBn ? 'ক্যাটাগরি অনুযায়ী খরচের সারসংক্ষেপ' : 'Category Summary'}
              </h4>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-2.5 px-4">{isBn ? 'ক্যাটাগরি' : 'Category'}</th>
                    <th className="py-2.5 px-4">{isBn ? 'এন্ট্রি সংখ্যা' : 'Entries'}</th>
                    <th className="py-2.5 px-4 text-right">{isBn ? 'খরচের পরিমাণ' : 'Amount'}</th>
                    <th className="py-2.5 px-4 text-right">{isBn ? 'শতাংশ' : '% Share'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {categoryStats.map((cat) => (
                    <tr key={cat.id} className="hover:bg-slate-50/50">
                      <td className="py-2 px-4 font-semibold text-slate-900 dark:text-slate-100">
                        {isBn ? cat.nameBn : cat.nameEn}
                      </td>
                      <td className="py-2 px-4 text-slate-500">{cat.count}</td>
                      <td className="py-2 px-4 text-right font-bold text-slate-900 dark:text-slate-100">
                        {trip.currency} {cat.amount.toLocaleString()}
                      </td>
                      <td className="py-2 px-4 text-right text-slate-600 dark:text-slate-400">
                        {cat.percentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detailed Expense Ledger */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Receipt className="w-4 h-4 text-teal-600" />
              <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                {isBn ? 'খরচের পূর্ণাঙ্গ খতিয়ান' : 'Itemized Expenses Ledger'}
              </h4>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-2.5 px-4">{isBn ? 'তারিখ' : 'Date'}</th>
                    <th className="py-2.5 px-4">{isBn ? 'বিবরণ' : 'Description'}</th>
                    <th className="py-2.5 px-4">{isBn ? 'ক্যাটাগরি' : 'Category'}</th>
                    <th className="py-2.5 px-4">{isBn ? 'মাধ্যম' : 'Method'}</th>
                    <th className="py-2.5 px-4">{isBn ? 'পরিশোধকারী' : 'Paid By'}</th>
                    <th className="py-2.5 px-4 text-right">{isBn ? 'টাকা' : 'Amount'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {expenses.map((exp) => {
                    const cat = getCategoryMeta(exp.category);
                    const method = PAYMENT_METHODS.find((m) => m.id === exp.paymentMethod);
                    return (
                      <tr key={exp.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-4 text-slate-500 whitespace-nowrap">{exp.date}</td>
                        <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-slate-100">
                          {exp.description}
                          {exp.notes && (
                            <span className="block text-[11px] text-slate-400 italic">
                              {exp.notes}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300">
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${cat.badgeClass}`}>
                            {isBn ? cat.nameBn : cat.nameEn}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-slate-500 text-xs">
                          {isBn ? method?.nameBn || exp.paymentMethod : method?.nameEn || exp.paymentMethod}
                        </td>
                        <td className="py-2.5 px-4 text-slate-500 text-xs">
                          {exp.paidBy || '—'}
                        </td>
                        <td className="py-2.5 px-4 text-right font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                          {trip.currency} {exp.amount.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-50 dark:bg-slate-800 font-bold border-t-2 border-slate-300 dark:border-slate-700">
                  <tr>
                    <td colSpan={5} className="py-3 px-4 text-right text-slate-800 dark:text-slate-200">
                      {isBn ? 'সর্বমোট খরচ (Grand Total):' : 'Grand Total Spent:'}
                    </td>
                    <td className="py-3 px-4 text-right text-base text-rose-600">
                      {trip.currency} {totalSpent.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
            <p>
              {isBn
                ? 'ভ্রমণ হিসাব অ্যাপ দ্বারা প্রস্তুতকৃত • সম্পূর্ণ অফলাইনে সুরক্ষিত ডেটা'
                : 'Generated with TripEx Expense Manager • Stored locally and safely offline'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
