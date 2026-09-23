/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { Language } from '../types';

interface OfflineIndicatorProps {
  language: Language;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ language }) => {
  const isOnline = useOnlineStatus();
  const isBn = language === 'bn';

  if (isOnline) return null;

  return (
    <div className="fixed bottom-3 left-3 z-50 flex items-center gap-2 rounded-xl bg-amber-500/95 text-white px-3.5 py-2 text-xs font-semibold shadow-lg shadow-amber-500/20 backdrop-blur-xs border border-amber-400/40 animate-in fade-in">
      <span className="flex h-2 w-2 relative">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
      </span>
      <WifiOff className="w-3.5 h-3.5" />
      <span>
        {isBn
          ? 'অফলাইন মোড সক্রিয় — সমস্ত হিসাব নিরাপদে লোকাল মেমরিতে সংরক্ষিত হচ্ছে।'
          : 'Offline Mode Active — All data is safely saved in local memory.'}
      </span>
    </div>
  );
};
