import React, { useState } from 'react';
import {
  MapPin,
  Plus,
  Calendar,
  Building2,
  Briefcase,
  Compass,
  Edit2,
  Trash2,
  Wallet
} from 'lucide-react';
import { Trip, Expense, Income, Language, AccountType } from '../types';

interface TripTabsProps {
  trips: Trip[];
  activeTripId: string;
  onSelectTrip: (tripId: string) => void;
  onOpenNewTripModal: (tabType?: AccountType) => void;
  onEditTrip: (trip: Trip) => void;
  onDeleteTrip: (tripId: string) => void;
  expenses: Expense[];
  incomes?: Income[];
  language: Language;
}

export const TripTabs: React.FC<TripTabsProps> = ({
  trips,
  activeTripId,
  onSelectTrip,
  onOpenNewTripModal,
  onEditTrip,
  onDeleteTrip,
  expenses,
  incomes = [],
  language
}) => {
  const isBn = language === 'bn';
  const [filterType, setFilterType] = useState<'all' | 'institution' | 'trip'>('all');

  const institutionCount = trips.filter(
    (t) => t.type === 'institution' || t.type === 'business'
  ).length;
  const travelCount = trips.filter((t) => !t.type || t.type === 'trip').length;

  const filteredTrips = trips.filter((t) => {
    if (filterType === 'institution') return t.type === 'institution' || t.type === 'business';
    if (filterType === 'trip') return !t.type || t.type === 'trip';
    return true;
  });

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header bar with counter and quick-add actions */}
        <div className="flex flex-wrap items-center justify-between pt-3 pb-1 gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {isBn ? 'আপনার হিসাবের ট্যাবসমূহ' : 'Your Account Tabs'}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
                {trips.length}
              </span>
            </div>

            {/* Filter pills if there are multiple types */}
            {institutionCount > 0 && travelCount > 0 && (
              <div className="hidden sm:flex items-center gap-1 ml-3 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                <button
                  type="button"
                  onClick={() => setFilterType('all')}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    filterType === 'all'
                      ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  {isBn ? 'সব' : 'All'} ({trips.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('institution')}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-all ${
                    filterType === 'institution'
                      ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  <Building2 className="w-3 h-3 text-sky-600" />
                  <span>{isBn ? 'প্রতিষ্ঠান' : 'Institutions'}</span> ({institutionCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('trip')}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-all ${
                    filterType === 'trip'
                      ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  <Compass className="w-3 h-3 text-teal-600" />
                  <span>{isBn ? 'ভ্রমণ' : 'Trips'}</span> ({travelCount})
                </button>
              </div>
            )}
          </div>

          {/* Quick Action Add Buttons */}
          <div className="flex items-center gap-2">
            <button
              id="btn-add-institution-tab"
              type="button"
              onClick={() => onOpenNewTripModal('institution')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sky-300 dark:border-sky-800 bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 dark:hover:bg-sky-900/50 text-sky-800 dark:text-sky-300 text-xs font-bold transition-colors shadow-2xs"
              title={isBn ? 'নতুন প্রতিষ্ঠানের আয়-ব্যয়ের হিসাব খাতা খুলুন' : 'Open new Institution tab'}
            >
              <Building2 className="w-3.5 h-3.5 text-sky-600" />
              <span>{isBn ? '+ প্রতিষ্ঠান ট্যাব' : '+ Institution Tab'}</span>
            </button>

            <button
              id="btn-add-trip-tab"
              type="button"
              onClick={() => onOpenNewTripModal('trip')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-teal-300 dark:border-teal-800 bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 dark:hover:bg-teal-900/50 text-teal-800 dark:text-teal-300 text-xs font-bold transition-colors shadow-2xs"
              title={isBn ? 'নতুন ভ্রমণের ট্যাব খুলুন' : 'Open new Trip tab'}
            >
              <Compass className="w-3.5 h-3.5 text-teal-600" />
              <span>{isBn ? '+ ভ্রমণ ট্যাব' : '+ Trip Tab'}</span>
            </button>
          </div>
        </div>

        {/* Scrollable Tabs */}
        <div className="flex items-center gap-2.5 overflow-x-auto py-2.5 no-scrollbar">
          {filteredTrips.map((trip) => {
            const isActive = trip.id === activeTripId;
            const tripExpenses = expenses.filter((e) => e.tripId === trip.id);
            const tripIncomes = incomes.filter((i) => i.tripId === trip.id);
            const totalSpent = tripExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
            const totalIncome = tripIncomes.reduce((sum, i) => sum + Number(i.amount || 0), 0);

            const isInst = trip.type === 'institution' || trip.type === 'business';

            return (
              <div
                key={trip.id}
                id={`tab-trip-${trip.id}`}
                className={`group relative shrink-0 flex items-center gap-2.5 px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? isInst
                      ? 'bg-sky-50/90 border-sky-500 shadow-xs text-sky-950 dark:bg-sky-950/40 dark:border-sky-400 dark:text-sky-100'
                      : 'bg-teal-50/90 border-teal-500 shadow-xs text-teal-950 dark:bg-teal-950/40 dark:border-teal-400 dark:text-teal-100'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-300'
                }`}
                onClick={() => onSelectTrip(trip.id)}
              >
                {/* Type Icon & Color Dot */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: trip.color || (isInst ? '#0284c7' : '#0d9488') }}
                  />
                  {isInst ? (
                    <Building2 className={`w-4 h-4 ${isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-500'}`} />
                  ) : (
                    <Compass className={`w-4 h-4 ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-500'}`} />
                  )}
                </div>

                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm tracking-tight">{trip.name}</span>
                    {isInst && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200">
                        {trip.type === 'business' ? (isBn ? 'ব্যবসা' : 'Business') : (isBn ? 'প্রতিষ্ঠান' : 'Org')}
                      </span>
                    )}
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400 animate-ping" />
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="font-medium">
                      {isInst ? (isBn ? 'ব্যয়: ' : 'Exp: ') : ''}
                      {trip.currency} {totalSpent.toLocaleString()}
                    </span>
                    {totalIncome > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                          {isBn ? 'আয়: ' : 'Inc: '}{trip.currency} {totalIncome.toLocaleString()}
                        </span>
                      </>
                    )}
                    {trip.destination && (
                      <>
                        <span>•</span>
                        <span className="truncate max-w-[120px]" title={trip.destination}>
                          {trip.destination}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Tab Action Quick Buttons */}
                <div
                  className="flex items-center gap-1 pl-1.5 border-l border-slate-200/80 dark:border-slate-700 ml-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    id={`btn-edit-trip-${trip.id}`}
                    type="button"
                    onClick={() => onEditTrip(trip)}
                    className="p-1 rounded text-slate-400 hover:text-teal-600 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                    title={isBn ? 'তথ্য পরিবর্তন করুন' : 'Edit Tab Details'}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {trips.length > 1 && (
                    <button
                      id={`btn-delete-trip-${trip.id}`}
                      type="button"
                      onClick={() => onDeleteTrip(trip.id)}
                      className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                      title={isBn ? 'এই ট্যাবটি ডিলিট করুন' : 'Delete Tab'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Quick Add Inline Button */}
          <button
            id="btn-add-tab-inline"
            type="button"
            onClick={() => onOpenNewTripModal('institution')}
            className="shrink-0 flex items-center gap-1 px-3 py-2 rounded-xl border border-dashed border-sky-300 text-sky-700 hover:bg-sky-50/60 dark:border-sky-700 dark:text-sky-300 dark:hover:bg-sky-950/40 text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isBn ? 'নতুন প্রতিষ্ঠান' : 'Add Institution'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
