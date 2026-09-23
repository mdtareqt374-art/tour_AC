/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';
import { Language } from '../types';

interface AutoInstallBannerProps {
  language: Language;
}

export const AutoInstallBanner: React.FC<AutoInstallBannerProps> = ({ language }) => {
  const { isInstalled, hasNativePrompt, isIOS, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isBn = language === 'bn';

  useEffect(() => {
    const isDismissed = sessionStorage.getItem('tripex_pwa_banner_dismissed') === 'true';
    if (isDismissed) {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('tripex_pwa_banner_dismissed', 'true');
  };

  const handleInstallClick = async () => {
    if (hasNativePrompt) {
      const success = await install();
      if (!success) {
        setIsModalOpen(true);
      }
    } else {
      setIsModalOpen(true);
    }
  };

  // If already installed or dismissed by user, do not render
  if (isInstalled || dismissed) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-3 sm:bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-in slide-in-from-bottom-5 duration-300">
        <div className="bg-slate-900/95 dark:bg-slate-900/95 text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-teal-500/30 backdrop-blur-md flex items-center justify-between gap-3">
          {/* App Icon */}
          <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 shadow-sm shadow-teal-500/30 border border-teal-400/40">
            <img
              src="/app-icon.jpg"
              alt="App Icon"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          {/* Text description */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs sm:text-sm text-white truncate">
                {isBn ? 'অ্যাপটি ফোনে ইনস্টল করুন' : 'Install on Your Device'}
              </span>
              <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {isBn ? 'অফলাইন' : 'Offline'}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-300 line-clamp-1 mt-0.5">
              {isBn
                ? 'ব্রাউজার ছাড়াই দ্রুত হোমস্ক্রিন থেকে ব্যবহার করুন'
                : 'Directly from home screen without app store'}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              id="btn-auto-install-now"
              type="button"
              onClick={handleInstallClick}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isBn ? 'ইনস্টল' : 'Install'}</span>
            </button>

            <button
              id="btn-dismiss-install-banner"
              type="button"
              onClick={handleDismiss}
              className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
              title={isBn ? 'বন্ধ করুন' : 'Dismiss'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <PWAInstallModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onInstallNative={hasNativePrompt ? install : undefined}
        canPromptNative={hasNativePrompt}
        isIOS={isIOS}
        language={language}
      />
    </>
  );
};
