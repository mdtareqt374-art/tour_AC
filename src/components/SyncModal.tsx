import React, { useState, useRef } from 'react';
import {
  X,
  Database,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  HardDrive,
  Cloud,
  Check
} from 'lucide-react';
import { Trip, Expense, Income, Language } from '../types';
import { exportBackupJSON, importBackupJSON } from '../utils/storage';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  trips: Trip[];
  expenses: Expense[];
  incomes?: Income[];
  onRestoreData: (trips: Trip[], expenses: Expense[], incomes?: Income[]) => void;
  language: Language;
}

export const SyncModal: React.FC<SyncModalProps> = ({
  isOpen,
  onClose,
  trips,
  expenses,
  incomes = [],
  onRestoreData,
  language
}) => {
  const isBn = language === 'bn';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [supabaseUrl, setSupabaseUrl] = useState(() => localStorage.getItem('tripex_supabase_url') || '');
  const [supabaseKey, setSupabaseKey] = useState(() => localStorage.getItem('tripex_supabase_key') || '');
  const [syncStatusMsg, setSyncStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleExportJSON = () => {
    const jsonStr = exportBackupJSON(trips, expenses, incomes);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ভ্রমণ_হিসাব_ব্যাকআপ_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setSyncStatusMsg({
      type: 'success',
      text: isBn ? 'ব্যাকআপ ফাইল সফলভাবে ডাউনলোড হয়েছে!' : 'Backup file downloaded successfully!'
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const result = importBackupJSON(content);
      if (result.success && result.trips && result.expenses) {
        onRestoreData(result.trips, result.expenses, result.incomes || []);
        setSyncStatusMsg({
          type: 'success',
          text: isBn
            ? `সফলভাবে ${result.trips.length}টি ভ্রমণ, ${result.expenses.length}টি খরচ ও ${(result.incomes || []).length}টি আয় রিস্টোর হয়েছে!`
            : `Restored ${result.trips.length} trips, ${result.expenses.length} expenses and ${(result.incomes || []).length} incomes!`
        });
      } else {
        setSyncStatusMsg({
          type: 'error',
          text: result.error || (isBn ? 'ফাইল রিস্টোর করতে ব্যর্থ হয়েছে' : 'Failed to restore file')
        });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('tripex_supabase_url', supabaseUrl.trim());
    localStorage.setItem('tripex_supabase_key', supabaseKey.trim());
    setSyncStatusMsg({
      type: 'success',
      text: isBn
        ? 'সুপাবেজ কনফিগারেশন সংরক্ষণ করা হয়েছে! লোকাল ডেটার সাথে ক্লাউড সিঙ্ক রেডি।'
        : 'Supabase configuration saved! Cloud synchronization ready.'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isBn ? 'ডেটা ব্যাকআপ ও ক্লাউড সিঙ্ক' : 'Data Backup & Cloud Sync'}
              </h3>
              <p className="text-xs text-slate-500">
                {isBn
                  ? 'অফলাইন লোকাল স্টোরেজ এবং সুপাবেজ ক্লাউড সিঙ্কিং'
                  : 'Offline Local Storage & Supabase Cloud integration'}
              </p>
            </div>
          </div>
          <button
            id="btn-close-sync"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          {/* Status notification */}
          {syncStatusMsg && (
            <div
              className={`p-3 rounded-xl flex items-center gap-2 text-xs font-semibold ${
                syncStatusMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {syncStatusMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{syncStatusMsg.text}</span>
            </div>
          )}

          {/* Local Storage Status Box */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                <HardDrive className="w-4 h-4 text-teal-600" />
                <span>{isBn ? 'লোকাল অফলাইন স্টোরেজ' : 'Local Offline Storage'}</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                {isBn ? 'সক্রিয় ও সুরক্ষিত' : 'Active & Secured'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              {isBn
                ? `বর্তমানে ${trips.length}টি ভ্রমণ এবং ${expenses.length}টি খরচের রেকর্ড আপনার ব্রাউজারের লোকাল স্টোরেজে সংরক্ষিত রয়েছে।`
                : `${trips.length} trips and ${expenses.length} expenses stored in persistent browser storage.`}
            </p>

            {/* Export & Import Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                id="btn-export-backup-json"
                type="button"
                onClick={handleExportJSON}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>{isBn ? 'ব্যাকআপ ডাউনলোড' : 'Download Backup'}</span>
              </button>

              <button
                id="btn-import-backup-json"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors shadow-2xs"
              >
                <Upload className="w-3.5 h-3.5 text-teal-600" />
                <span>{isBn ? 'ব্যাকআপ রিস্টোর' : 'Restore Backup'}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Supabase Integration Box */}
          <form onSubmit={handleSaveSupabaseConfig} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Cloud className="w-4 h-4 text-indigo-600" />
                <span>{isBn ? 'সুপাবেজ (Supabase) ক্লাউড সিঙ্ক' : 'Supabase Cloud Sync'}</span>
              </div>
              <span className="text-[10px] text-slate-400">
                {isBn ? 'ঐচ্ছিক ক্লাউড সিঙ্ক' : 'Optional Cloud Sync'}
              </span>
            </div>

            <p className="text-xs text-slate-500">
              {isBn
                ? 'সুপাবেজ ক্লাউড ডেটাবেস যুক্ত করলে একাধিক ডিভাইসে একই হিসাব সিঙ্ক থাকবে।'
                : 'Connect your Supabase project to sync tour finances across devices.'}
            </p>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Supabase Project URL
              </label>
              <input
                type="url"
                placeholder="https://xyzproject.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Supabase Anon Public API Key
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <button
              id="btn-save-supabase-config"
              type="submit"
              className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isBn ? 'সুপাবেজ কনফিগারেশন সেভ করুন' : 'Save Supabase Settings'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
