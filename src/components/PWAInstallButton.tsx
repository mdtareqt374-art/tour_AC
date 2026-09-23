/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Download, Check, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';
import { Language } from '../types';

interface PWAInstallButtonProps {
  language: Language;
  variant?: 'navbar' | 'prominent' | 'compact';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  language,
  variant = 'navbar'
}) => {
  const { isInstalled, hasNativePrompt, isIOS, install } = usePWAInstall();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isBn = language === 'bn';

  // If already running inside installed standalone app, do not show button
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (hasNativePrompt) {
      const installed = await install();
      if (!installed) {
        // If user canceled or failed, give option to view guide
        setIsModalOpen(true);
      }
    } else {
      setIsModalOpen(true);
    }
  };

  if (variant === 'compact') {
    return (
      <>
        <button
          id="btn-pwa-install-compact"
          type="button"
          onClick={handleClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 hover:bg-teal-100 text-xs font-bold transition-all shadow-xs cursor-pointer"
          title={isBn ? 'ব্রাউজার থেকে সরাসরি অ্যাপ ইনস্টল করুন' : 'Install App'}
        >
          <Download className="w-3.5 h-3.5 text-teal-600" />
          <span>{isBn ? 'অ্যাপ ইনস্টল' : 'Install App'}</span>
        </button>

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
  }

  return (
    <>
      <button
        id="btn-pwa-install-navbar"
        type="button"
        onClick={handleClick}
        className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 active:scale-95 text-white text-xs sm:text-xs font-bold shadow-xs shadow-teal-500/20 transition-all cursor-pointer"
        title={isBn ? 'ব্রাউজার থেকে সরাসরি অ্যাপ ইনস্টল করুন' : 'Install App from Browser'}
      >
        <Download className="w-3.5 h-3.5 animate-bounce" />
        <span className="whitespace-nowrap">{isBn ? 'অ্যাপ ইনস্টল' : 'Install App'}</span>
      </button>

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
