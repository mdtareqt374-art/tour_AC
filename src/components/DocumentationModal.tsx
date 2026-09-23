import React, { useState } from 'react';
import {
  X,
  BookOpen,
  GitBranch,
  Cloud,
  Database,
  WifiOff,
  FileDown,
  Check,
  Copy,
  ExternalLink,
  Layers,
  Smartphone,
  Download
} from 'lucide-react';
import { Language } from '../types';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  const isBn = language === 'bn';
  const [activeDocTab, setActiveDocTab] = useState<'features' | 'pwa' | 'github' | 'vercel' | 'offline' | 'supabase'>('features');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-900/60 dark:text-teal-300 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isBn ? 'অ্যাপ ডকুমেন্টেশন ও ডিপ্লয়মেন্ট নির্দেশিকা' : 'Documentation & Deployment Guide'}
              </h3>
              <p className="text-xs text-slate-500">
                {isBn
                  ? 'গিটহাব পুশ, ভারসেল অটো-ডিপ্লয়, অফলাইন মোড ও ফিচারের বিস্তারিত নির্দেশিকা'
                  : 'Complete instructions for GitHub export, Vercel auto-deployment, and features'}
              </p>
            </div>
          </div>
          <button
            id="btn-close-docs"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs for Docs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto bg-slate-100/50 dark:bg-slate-800/30 p-1.5 gap-1 shrink-0 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveDocTab('features')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              activeDocTab === 'features'
                ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {isBn ? 'ফিচার নির্দেশিকা' : 'Features Overview'}
          </button>

          <button
            type="button"
            onClick={() => setActiveDocTab('pwa')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              activeDocTab === 'pwa'
                ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-teal-600" />
            <span>{isBn ? 'অ্যাপ অটো ইনস্টল (PWA)' : 'Auto Install (PWA)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveDocTab('github')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              activeDocTab === 'github'
                ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>{isBn ? 'গিটহাব পুশ (GitHub)' : 'GitHub Push'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveDocTab('vercel')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              activeDocTab === 'vercel'
                ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>{isBn ? 'ভারসেল অটো ডিপ্লয়' : 'Vercel Auto-Deploy'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveDocTab('offline')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              activeDocTab === 'offline'
                ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <WifiOff className="w-3.5 h-3.5" />
            <span>{isBn ? 'অফলাইন ও লোকাল স্টোরেজ' : 'Offline & Storage'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveDocTab('supabase')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              activeDocTab === 'supabase'
                ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>{isBn ? 'সুপাবেজ সিঙ্কিং' : 'Supabase Sync'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {/* Tab 1: Features */}
          {activeDocTab === 'features' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {isBn ? 'ভ্রমণ হিসাব অ্যাপের প্রধান সুবিধাসমূহ:' : 'Core Features of TripEx:'}
              </h4>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  <strong>{isBn ? 'আলাদা আলাদা ট্যাব:' : 'Multi-Trip Tabs:'}</strong>{' '}
                  {isBn
                    ? 'প্রতিটি ভ্রমণের জন্য ভিন্ন ভিন্ন ট্যাব তৈরি করুন (যেমন: সাজেক, কক্সবাজার, সিলেট)। প্রতিটি ট্যাবে সম্পূর্ণ পৃথক হিসাব ও বাজেট থাকবে।'
                    : 'Create dedicated tabs for each destination with separate ledger, budget, and metrics.'}
                </li>
                <li>
                  <strong>{isBn ? 'খরচের ক্যাটাগরি ও ফিল্টারিং:' : 'Category Breakdown:'}</strong>{' '}
                  {isBn
                    ? 'যাতায়াত, হোটেল, খাবার, টিকিট, শপিং ও অন্যান্য ক্যাটাগরিতে খরচ বিভক্ত করার সুবিধা এবং যেকোনো ক্যাটাগরিতে ক্লিক করে ফিল্টার করার সুযোগ।'
                    : 'Categorize spending by transport, stay, dining, tickets, shopping, and click any category to filter.'}
                </li>
                <li>
                  <strong>{isBn ? 'এডিট, আপডেট ও ডিলিট:' : 'CRUD Operations:'}</strong>{' '}
                  {isBn
                    ? 'প্রতিটি খরচের এন্ট্রি যেকোনো সময় এডিট বা ডিলিট করতে পারবেন।'
                    : 'Easily update amounts, dates, descriptions, or remove incorrect entries.'}
                </li>
                <li>
                  <strong>{isBn ? 'পিডিএফ ও সিএসভি রিপোর্ট:' : 'PDF & CSV Reports:'}</strong>{' '}
                  {isBn
                    ? 'এক ক্লিকে ফুল ট্রিপ স্টেটমেন্ট সরাসরি PDF ফাইলে ডাউনলোড করুন অথবা প্রিন্ট থেকে সেভ করুন।'
                    : 'Instant one-click client-side PDF generation or high-resolution printable report.'}
                </li>
              </ul>
            </div>
          )}

          {/* Tab: PWA / Auto-Install */}
          {activeDocTab === 'pwa' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-teal-600" />
                {isBn ? 'ব্রাউজার থেকে স্বয়ংক্রিয় অ্যাপ ইনস্টল (PWA):' : 'Browser Auto-Install (PWA):'}
              </h4>

              <div className="p-3.5 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/40 dark:to-emerald-950/40 rounded-xl border border-teal-200 dark:border-teal-800 text-teal-950 dark:text-teal-200">
                <p className="font-bold text-sm">
                  {isBn ? 'কীভাবে সরাসরি ব্রাউজার থেকে ইনস্টল হবে?' : 'How does automatic installation work?'}
                </p>
                <p className="text-xs mt-1 leading-relaxed">
                  {isBn
                    ? 'অ্যাপটিতে সম্পূর্ণ প্রগ্রেসিভ ওয়েব অ্যাপ (PWA) কনফিগারেশন, সার্ভিস ওয়ার্কার (Service Worker) এবং ওয়েব অ্যাপ ম্যানিফেস্ট (Manifest) সক্রিয় করা আছে। আপনি যখন ক্রোম, এজ বা সাফারি ব্রাউজার দিয়ে এই অ্যাপে ঢুকবেন, স্ক্রিনের নিচে স্বয়ংক্রিয়ভাবে "অ্যাপটি ফোনে ইনস্টল করুন" ব্যানার চলে আসবে। এছাড়াও উপরের মেনুতে "📲 অ্যাপ ইনস্টল" বাটন রয়েছে।'
                    : 'The app is fully configured as a Progressive Web App (PWA) with Service Worker and Web App Manifest. Modern browsers automatically show the install prompt or you can tap the Install button.'}
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
                  <h5 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                    📱 {isBn ? 'অ্যান্ড্রয়েড ও ক্রোম (Android / Chrome / Samsung Internet):' : 'Android & Chrome:'}
                  </h5>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {isBn
                      ? 'অ্যাপের নিচে আসা ব্যানারে "ইনস্টল" বাটনে ক্লিক করুন অথবা ব্রাউজারের ৩-ডট (⋮) মেনু থেকে "Install app" নির্বাচন করুন। সাথে সাথে আপনার ফোনের অ্যাপ লিস্ট ও হোমস্ক্রিনে চলে আসবে।'
                      : 'Click Install on the floating banner or tap the 3-dot menu > "Install app".'}
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
                  <h5 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                    🍎 {isBn ? 'আইফোন / আইপ্যাড (iPhone / iPad - Safari):' : 'iPhone / iPad (Safari):'}
                  </h5>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {isBn
                      ? 'সাফারি ব্রাউজারের নিচে শেয়ার বাটনে ট্যাপ করে "Add to Home Screen" নির্বাচন করুন। এটি আপনার আইফোনে সরাসরি নেটিভ অ্যাপ হিসেবে ইনস্টল হয়ে যাবে।'
                      : 'Tap Share in Safari, scroll and tap "Add to Home Screen".'}
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
                  <h5 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                    💻 {isBn ? 'কম্পিউটার (Desktop Chrome / Edge / Brave):' : 'Desktop (Chrome / Edge):'}
                  </h5>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {isBn
                      ? 'অ্যাড্রেস বারের ডানপাশে থাকা ইনস্টল (⊕) বাটনে ক্লিক করলেই কম্পিউটার বা ল্যাপটপে আলাদা ডেস্কটপ অ্যাপ হিসেবে ওপেন হবে।'
                      : 'Click the install icon (⊕) on the right side of the address bar.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: GitHub Push */}
          {activeDocTab === 'github' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-teal-600" />
                {isBn ? 'গিটহাবে (GitHub) কোড পুশ করার পদ্ধতি:' : 'How to Push to Dedicated GitHub Repo:'}
              </h4>

              <div className="p-3 bg-teal-50 dark:bg-teal-950/40 rounded-xl border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200">
                <p className="font-bold">
                  {isBn
                    ? 'পদ্ধতি ১: AI Studio সেটিংস থেকে সরাসরি এক্সপোর্ট (সবচেয়ে সহজ)'
                    : 'Method 1: Direct Export via AI Studio Settings (Easiest)'}
                </p>
                <p className="text-xs mt-1">
                  {isBn
                    ? 'AI Studio-এর উপরের ডানপাশের সেটিংস মেনু (Settings / Export) ক্লিক করে সরাসরি "Export to GitHub" নির্বাচন করুন। এটি আপনার গিটহাব অ্যাকাউন্টে একটি সম্পূর্ণ নতুন ডেডিকেটেড রিপোজিটরি স্বয়ংক্রিয়ভাবে তৈরি ও কোড পুশ করে দিবে।'
                    : 'Click the Settings/Export menu at top-right in AI Studio and select "Export to GitHub". It creates a dedicated repository and pushes all code automatically.'}
                </p>
              </div>

              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">
                  {isBn ? 'পদ্ধতি ২: টার্মিনাল বা গিট কমান্ডের মাধ্যমে পুশ:' : 'Method 2: Standard Git CLI Push:'}
                </p>
                <div className="relative bg-slate-950 text-slate-100 p-3 rounded-xl font-mono text-xs overflow-x-auto">
                  <pre>{`git init
git add .
git commit -m "feat: complete travel expense tracker with offline & pdf"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/trip-expense-tracker.git
git push -u origin main`}</pre>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        'git init\ngit add .\ngit commit -m "feat: complete travel expense tracker"\ngit branch -M main\ngit remote add origin https://github.com/YOUR_USERNAME/trip-expense-tracker.git\ngit push -u origin main',
                        'git-cmd'
                      )
                    }
                    className="absolute right-2 top-2 p-1.5 rounded-md bg-slate-800 text-slate-300 hover:text-white"
                  >
                    {copiedCode === 'git-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Vercel Deploy */}
          {activeDocTab === 'vercel' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Cloud className="w-4 h-4 text-teal-600" />
                {isBn ? 'ভারসেল (Vercel) এর মাধ্যমে অটো ডিপ্লয়মেন্ট গাইড:' : 'Vercel Auto-Deployment Setup:'}
              </h4>

              <ol className="space-y-3 list-decimal list-inside">
                <li>
                  <strong>{isBn ? 'ভারসেলে সাইন ইন করুন:' : 'Sign in to Vercel:'}</strong>{' '}
                  <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-teal-600 underline inline-flex items-center gap-0.5">
                    vercel.com <ExternalLink className="w-3 h-3" />
                  </a>{' '}
                  {isBn ? 'এ আপনার গিটহাব অ্যাকাউন্ট দিয়ে লগইন করুন।' : 'with your GitHub account.'}
                </li>
                <li>
                  <strong>{isBn ? 'রিপোজিটরি ইমপোর্ট করুন:' : 'Import Git Repository:'}</strong>{' '}
                  {isBn
                    ? '"Add New Project" ক্লিক করে আপনার `trip-expense-tracker` রিপোজিটরিটি সিলেক্ট করুন।'
                    : 'Click "Add New Project" and select your repository.'}
                </li>
                <li>
                  <strong>{isBn ? 'বিল্ড সেটিংস (স্বয়ংক্রিয়):' : 'Build Configuration (Auto):'}</strong>{' '}
                  {isBn
                    ? 'ভারসেল নিজে থেকেই Vite প্রজেক্ট ডিটেক্ট করবে। Build Command হবে `npm run build` এবং Output Directory হবে `dist`।'
                    : 'Vercel auto-detects Vite. Build command is `npm run build` and output directory is `dist`.'}
                </li>
                <li>
                  <strong>{isBn ? 'ডিপ্লয় ক্লিক করুন:' : 'Click Deploy:'}</strong>{' '}
                  {isBn
                    ? 'ব্যাস! কয়েক সেকেন্ডে অ্যাপটি লাইভ হয়ে যাবে এবং পরবর্তীতে গিটহাবে যেকোনো কোড পুশ করলেই ভারসেল স্বয়ংক্রিয়ভাবে রি-ডিপ্লয় (CI/CD) করবে।'
                    : 'Instant auto-deployment triggered on every git push to the main branch.'}
                </li>
              </ol>
            </div>
          )}

          {/* Tab 4: Offline Storage */}
          {activeDocTab === 'offline' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <WifiOff className="w-4 h-4 text-teal-600" />
                {isBn ? 'অফলাইন ও লোকাল স্টোরেজ প্রযুক্তি:' : 'Offline & LocalStorage Architecture:'}
              </h4>
              <p>
                {isBn
                  ? 'ভ্রমণের সময় প্রত্যন্ত অঞ্চলে যেমন পাহাড়ি এলাকা, নদী বা দ্বীপে সবসময় ইন্টারনেট সংযোগ থাকে না। তাই এই অ্যাপটির মূল আর্কিটেকচার সম্পূর্ণ লোকাল-ফার্স্ট (Local-First Offline) তৈরি করা হয়েছে।'
                  : 'TripEx is built with a Local-First offline architecture to work flawlessly in remote areas without internet.'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <h5 className="font-bold text-teal-700 dark:text-teal-400 mb-1">
                    {isBn ? 'স্বয়ংক্রিয় লোকাল সেভ' : 'Automatic Local Storage'}
                  </h5>
                  <p className="text-xs text-slate-500">
                    {isBn
                      ? 'প্রতিটি খরচ এবং ভ্রমণ সঙ্গে সঙ্গে ব্রাউজারের সুরক্ষিত লোকাল স্টোরেজে সেভ হয়ে থাকে। পেজ রিফ্রেশ বা ব্রাউজার বন্ধ করলেও তথ্য অক্ষুণ্ণ থাকে।'
                      : 'All data is immediately written to persistent local storage and survives restarts.'}
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <h5 className="font-bold text-teal-700 dark:text-teal-400 mb-1">
                    {isBn ? 'JSON ব্যাকআপ ও রিস্টোর' : 'JSON Backup & Restore'}
                  </h5>
                  <p className="text-xs text-slate-500">
                    {isBn
                      ? '"ব্যাকআপ ও সিঙ্ক" বাটন থেকে সম্পূর্ণ ডেটা JSON ফাইল হিসেবে ডাউনলোড করতে পারবেন এবং নতুন ফোনে বা ব্রাউজারে ফিরিয়ে আনতে পারবেন।'
                      : 'Export complete database as JSON and restore on any device seamlessly.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Supabase */}
          {activeDocTab === 'supabase' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-teal-600" />
                {isBn ? 'সুপাবেজ (Supabase) ক্লাউড সিঙ্ক সেটআপ:' : 'Supabase Cloud Sync Setup:'}
              </h4>
              <p>
                {isBn
                  ? 'আপনি যদি একাধিক ডিভাইস বা বন্ধুদের সাথে রিয়েল-টাইমে হিসাব শেয়ার করতে চান, তবে সুপাবেজ ক্লাউড ডেটাবেস যুক্ত করতে পারেন:'
                  : 'To synchronize data across multiple devices or team members in the cloud, Supabase can be connected:'}
              </p>
              <ol className="space-y-2 list-decimal list-inside">
                <li>
                  <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-teal-600 underline inline-flex items-center gap-0.5">
                    supabase.com <ExternalLink className="w-3 h-3" />
                  </a>{' '}
                  {isBn ? 'এ একটি নতুন ফ্রি প্রজেক্ট খুলুন।' : 'Create a free project on Supabase.'}
                </li>
                <li>
                  {isBn
                    ? 'SQL Editor-এ `trips` এবং `expenses` টেবিল তৈরি করুন অথবা ব্যাকআপ ফাইল দিয়ে সিঙ্ক করুন।'
                    : 'Create `trips` and `expenses` tables or use JSON sync.'}
                </li>
                <li>
                  {isBn
                    ? 'অ্যাপের "ব্যাকআপ ও সিঙ্ক" মডালে গিয়ে আপনার Supabase URL ও Anon Key ইনপুট দিয়ে রিয়েলটাইম সিঙ্ক চালু করতে পারেন।'
                    : 'Provide the Supabase URL and Anon Key in the Sync Modal for continuous cloud backup.'}
                </li>
              </ol>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">
            {isBn ? 'সংস্করণ ১.০ • প্রোডাকশন রেডি' : 'Version 1.0 • Production Ready'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors"
          >
            {isBn ? 'ঠিক আছে' : 'Got it'}
          </button>
        </div>
      </div>
    </div>
  );
};
