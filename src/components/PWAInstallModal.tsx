/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Smartphone, Monitor, Apple, CheckCircle2, Download, Share2 } from 'lucide-react';
import { Language } from '../types';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstallNative?: () => void;
  canPromptNative: boolean;
  isIOS: boolean;
  language: Language;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  onInstallNative,
  canPromptNative,
  isIOS,
  language
}) => {
  if (!isOpen) return null;
  const isBn = language === 'bn';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-teal-50/50 dark:bg-teal-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-xs">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {isBn ? 'ব্রাউজার থেকে অ্যাপ ইনস্টল করুন' : 'Install App from Browser'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isBn ? 'মোবাইল বা কম্পিউটারে সরাসরি অ্যাপের মতো ব্যবহার করুন' : 'Run natively on mobile or desktop without an app store'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 text-sm text-slate-700 dark:text-slate-300">
          {/* Quick Direct Install Button if supported */}
          {canPromptNative && onInstallNative && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/40 dark:to-emerald-950/40 border border-teal-200 dark:border-teal-800 text-center space-y-3">
              <p className="font-semibold text-teal-900 dark:text-teal-200">
                {isBn
                  ? 'আপনার ব্রাউজার সরাসরি অটো ইনস্টলেশন সাপোর্ট করে!'
                  : 'Your browser supports one-click native installation!'}
              </p>
              <button
                type="button"
                onClick={() => {
                  onInstallNative();
                  onClose();
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isBn ? 'এখনই সরাসরি ইনস্টল করুন' : 'Install Now Directly'}</span>
              </button>
            </div>
          )}

          {/* Benefits */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              <span>{isBn ? '১০০% অফলাইনে চলবে' : '100% Works Offline'}</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              <span>{isBn ? 'কোনো স্টোর অ্যাকাউন্ট লাগবে না' : 'No App Store needed'}</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              <span>{isBn ? 'কম স্টোরেজ (১ এমবি এরও কম)' : 'Ultra lightweight (< 1MB)'}</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              <span>{isBn ? 'ফুল-স্ক্রিন অ্যাপ ইন্টারফেস' : 'Full-screen app view'}</span>
            </div>
          </div>

          {/* Platform Specific Steps */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
              {isBn ? 'ডিভাইস অনুযায়ী ইনস্টল নির্দেশিকা:' : 'Device Installation Guides:'}
            </h4>

            {/* Android / Chrome */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>{isBn ? 'Android (Chrome / Samsung Internet)' : 'Android (Chrome / Samsung)'}</span>
              </div>
              <ol className="list-decimal list-inside text-xs text-slate-600 dark:text-slate-400 space-y-1 pl-1">
                <li>{isBn ? 'ব্রাউজারের উপরের ডান কোণায় ৩-ডট (⋮) মেনুতে ট্যাপ করুন।' : 'Tap the 3-dots (⋮) menu in Chrome.'}</li>
                <li>{isBn ? 'মেনু থেকে "Install app" অথবা "Add to Home screen" নির্বাচন করুন।' : 'Select "Install app" or "Add to Home screen".'}</li>
                <li>{isBn ? '"Install" বাটনে নিশ্চিত করলেই আপনার হোমস্ক্রিনে অ্যাপ আইকন চলে আসবে।' : 'Confirm by clicking "Install" to add to your phone.'}</li>
              </ol>
            </div>

            {/* iOS Safari */}
            <div className={`p-3.5 rounded-xl border ${isIOS ? 'border-teal-400 bg-teal-50/30 dark:bg-teal-950/20' : 'border-slate-200 dark:border-slate-800 bg-slate-50/60'} space-y-1.5`}>
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                <Apple className="w-4 h-4 text-slate-800 dark:text-slate-200" />
                <span>{isBn ? 'iPhone / iPad (Safari)' : 'iPhone / iPad (Safari)'}</span>
                {isIOS && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-semibold ml-auto">
                    {isBn ? 'আপনার ডিভাইস' : 'Current Device'}
                  </span>
                )}
              </div>
              <ol className="list-decimal list-inside text-xs text-slate-600 dark:text-slate-400 space-y-1 pl-1">
                <li>{isBn ? 'সাফারি ব্রাউজারের নিচে থাকা শেয়ার (Share)' : 'Tap the Share'} <Share2 className="w-3 h-3 inline mx-0.5 text-blue-600" /> {isBn ? 'আইকনে ট্যাপ করুন।' : 'icon in Safari.'}</li>
                <li>{isBn ? 'নিচে স্ক্রল করে "Add to Home Screen" (হোম স্ক্রিনে যোগ করুন) চাপুন।' : 'Scroll down and tap "Add to Home Screen".'}</li>
                <li>{isBn ? 'উপরে ডানদিকের "Add" বাটনে চাপলেই ইনস্টল সম্পন্ন হবে।' : 'Tap "Add" in top-right corner to finish installation.'}</li>
              </ol>
            </div>

            {/* Desktop Chrome / Edge */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                <Monitor className="w-4 h-4 text-indigo-600" />
                <span>{isBn ? 'কম্পিউটার (Chrome, Edge, Brave)' : 'Desktop (Chrome, Edge, Brave)'}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 pl-1">
                {isBn
                  ? 'ব্রাউজারের অ্যাড্রেস বার (URL bar) এর একদম ডানদিকে থাকা ইনস্টল আইকন (⊕) ক্লিক করুন অথবা ৩-ডট মেনু থেকে "Install ভ্রমণ হিসাব" ক্লিক করুন।'
                  : 'Click the install icon (⊕) on the right side of the address bar, or use 3-dot menu > "Install TripEx".'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold transition-colors"
          >
            {isBn ? 'ঠিক আছে' : 'Got it'}
          </button>
        </div>
      </div>
    </div>
  );
};
