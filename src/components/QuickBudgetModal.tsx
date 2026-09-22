import React, { useState, useEffect } from 'react';
import { X, Check, Wallet, TrendingUp, Plus } from 'lucide-react';
import { Trip, Language } from '../types';

interface QuickBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
  onUpdateBudget: (newBudget: number) => void;
  language: Language;
}

export const QuickBudgetModal: React.FC<QuickBudgetModalProps> = ({
  isOpen,
  onClose,
  trip,
  onUpdateBudget,
  language
}) => {
  const isBn = language === 'bn';

  const [mode, setMode] = useState<'increase' | 'set'>('increase');
  const [addAmount, setAddAmount] = useState('');
  const [exactBudget, setExactBudget] = useState('');
  const [error, setError] = useState('');

  const currentBudget = trip.budget || 0;

  useEffect(() => {
    setAddAmount('');
    setExactBudget(currentBudget.toString());
    setError('');
    setMode('increase');
  }, [isOpen, currentBudget]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let newBudget = currentBudget;

    if (mode === 'increase') {
      const added = parseFloat(addAmount);
      if (isNaN(added) || added <= 0) {
        setError(isBn ? 'অনুগ্রহ করে কত টাকা বৃদ্ধি করতে চান তা লিখুন' : 'Please enter valid amount to increase');
        return;
      }
      newBudget = currentBudget + added;
    } else {
      const exact = parseFloat(exactBudget);
      if (isNaN(exact) || exact < 0) {
        setError(isBn ? 'সঠিক বাজেট লিখুন' : 'Please enter a valid budget');
        return;
      }
      newBudget = exact;
    }

    onUpdateBudget(newBudget);
    onClose();
  };

  const quickIncrement = (val: number) => {
    const curr = parseFloat(addAmount) || 0;
    setAddAmount((curr + val).toString());
    setError('');
  };

  const calculatedNewBudget =
    mode === 'increase'
      ? currentBudget + (parseFloat(addAmount) || 0)
      : parseFloat(exactBudget) || 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-500/10 to-teal-500/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                {isBn ? 'ভ্রমণের বাজেট বৃদ্ধি বা পরিবর্তন' : 'Increase / Update Trip Budget'}
              </h3>
              <p className="text-xs text-slate-500">{trip.name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Current Budget Banner */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
                {isBn ? 'বর্তমান নির্ধারিত বাজেট' : 'Current Target Budget'}
              </span>
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                {trip.currency} {currentBudget.toLocaleString()}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('increase');
                setError('');
              }}
              className={`py-2 rounded-lg transition-all ${
                mode === 'increase'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {isBn ? '+ বাজেট বৃদ্ধি করুন' : '+ Increase Budget'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('set');
                setError('');
              }}
              className={`py-2 rounded-lg transition-all ${
                mode === 'set'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {isBn ? 'সরাসরি নতুন বাজেট লিখুন' : 'Set New Amount'}
            </button>
          </div>

          {mode === 'increase' ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'কত টাকা বাজেট বৃদ্ধি করতে চান? *' : 'How much to add to budget? *'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold">
                  {trip.currency}
                </div>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={addAmount}
                  onChange={(e) => {
                    setAddAmount(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="উদা: 5000"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-base font-bold bg-white dark:bg-slate-950 text-blue-600 dark:text-blue-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              {/* Quick Increase Buttons */}
              <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1">
                {[1000, 2000, 5000, 10000, 20000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => quickIncrement(val)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-medium border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors whitespace-nowrap"
                  >
                    +{val.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'নতুন সর্বমোট বাজেট *' : 'New Total Target Budget *'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold">
                  {trip.currency}
                </div>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={exactBudget}
                  onChange={(e) => {
                    setExactBudget(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-base font-bold bg-white dark:bg-slate-950 text-blue-600 dark:text-blue-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>
          )}

          {error && <p className="text-xs text-red-500">{error}</p>}

          {/* Preview of New Total Budget */}
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              {isBn ? 'আপডেটের পর নতুন মোট বাজেট হবে:' : 'New Total Budget will be:'}
            </span>
            <span className="text-base font-bold text-emerald-700 dark:text-emerald-300">
              {trip.currency} {calculatedNewBudget.toLocaleString()}
            </span>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors"
            >
              {isBn ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>{isBn ? 'বাজেট আপডেট নিশ্চিত করুন' : 'Confirm Budget Update'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
