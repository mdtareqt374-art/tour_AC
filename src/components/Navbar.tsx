import React from 'react';
import {
  Compass,
  Plus,
  FileText,
  Database,
  Globe,
  HelpCircle,
  HardDriveDownload
} from 'lucide-react';
import { Language } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenNewTripModal: () => void;
  onOpenDocModal: () => void;
  onOpenSyncModal: () => void;
  tripCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  onOpenNewTripModal,
  onOpenDocModal,
  onOpenSyncModal,
  tripCount
}) => {
  const isBn = language === 'bn';

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-sm shadow-teal-200">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {isBn ? 'ভ্রমণ হিসাব' : 'TripEx'}
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
                  {isBn ? 'অফলাইন রেডি' : 'Offline Ready'}
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">
                {isBn ? 'ভ্রমণ ও প্রতিষ্ঠানের আয়-ব্যয় ও ক্যাশ ট্র্যাকার' : 'Trip & Institution Ledger Manager'}
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* PWA Install Button */}
            <PWAInstallButton language={language} variant="navbar" />

            {/* Language Toggle */}
            <button
              id="btn-language-toggle"
              type="button"
              onClick={() => onLanguageChange(isBn ? 'en' : 'bn')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
              title={isBn ? 'Switch to English' : 'বাংলায় দেখুন'}
            >
              <Globe className="w-3.5 h-3.5 text-teal-600" />
              <span>{isBn ? 'EN' : 'বাং'}</span>
            </button>

            {/* Sync & Backup */}
            <button
              id="btn-open-sync"
              type="button"
              onClick={onOpenSyncModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
              title={isBn ? 'ব্যাকআপ ও সিঙ্ক' : 'Backup & Sync'}
            >
              <Database className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">{isBn ? 'ব্যাকআপ ও সিঙ্ক' : 'Sync / Backup'}</span>
            </button>

            {/* Documentation & GitHub/Vercel Guide */}
            <button
              id="btn-open-docs"
              type="button"
              onClick={onOpenDocModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
              title={isBn ? 'ডকুমেন্টেশন ও ডিপ্লয় গাইড' : 'Docs & Deployment'}
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">{isBn ? 'গাইড ও ডিপ্লয়' : 'Deploy & Guide'}</span>
            </button>

            {/* New Tab Button */}
            <button
              id="btn-new-trip-navbar"
              type="button"
              onClick={onOpenNewTripModal}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{isBn ? '+ নতুন ট্যাব' : '+ New Tab'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
