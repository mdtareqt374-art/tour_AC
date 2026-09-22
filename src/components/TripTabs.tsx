import React from 'react';
import {
  MapPin,
  Plus,
  Calendar,
  MoreVertical,
  Edit2,
  Trash2,
  FileSpreadsheet,
  FileDown
} from 'lucide-react';
import { Trip, Expense, Language } from '../types';

interface TripTabsProps {
  trips: Trip[];
  activeTripId: string;
  onSelectTrip: (tripId: string) => void;
  onOpenNewTripModal: () => void;
  onEditTrip: (trip: Trip) => void;
  onDeleteTrip: (tripId: string) => void;
  expenses: Expense[];
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
  language
}) => {
  const isBn = language === 'bn';

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pt-3 pb-1">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {isBn ? 'আপনার ভ্রমণের ট্যাবসমূহ' : 'Your Trip Tabs'}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
              {trips.length}
            </span>
          </div>

          <button
            id="btn-add-tab-secondary"
            type="button"
            onClick={onOpenNewTripModal}
            className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-800 hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isBn ? '+ নতুন ট্যাব যুক্ত করুন' : '+ Add New Tab'}</span>
          </button>
        </div>

        {/* Scrollable Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto py-2 no-scrollbar">
          {trips.map((trip) => {
            const isActive = trip.id === activeTripId;
            const tripExpenses = expenses.filter(e => e.tripId === trip.id);
            const totalSpent = tripExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

            return (
              <div
                key={trip.id}
                id={`tab-trip-${trip.id}`}
                className={`group relative shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-teal-50/90 border-teal-500 shadow-xs text-teal-950 dark:bg-teal-950/40 dark:border-teal-400 dark:text-teal-100'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-300'
                }`}
                onClick={() => onSelectTrip(trip.id)}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: trip.color || '#0d9488' }}
                />

                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm tracking-tight">{trip.name}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-ping" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <span>
                      {trip.currency} {totalSpent.toLocaleString()}
                    </span>
                    <span>•</span>
                    <span>
                      {tripExpenses.length} {isBn ? 'খরচ' : 'items'}
                    </span>
                  </div>
                </div>

                {/* Tab Action Quick Buttons */}
                <div
                  className="flex items-center gap-1 pl-1 border-l border-slate-200/80 dark:border-slate-700 ml-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    id={`btn-edit-trip-${trip.id}`}
                    type="button"
                    onClick={() => onEditTrip(trip)}
                    className="p-1 rounded text-slate-400 hover:text-teal-600 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                    title={isBn ? 'ভ্রমণ তথ্য এডিট করুন' : 'Edit Trip'}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {trips.length > 1 && (
                    <button
                      id={`btn-delete-trip-${trip.id}`}
                      type="button"
                      onClick={() => onDeleteTrip(trip.id)}
                      className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                      title={isBn ? 'এই ট্যাব ডিলিট করুন' : 'Delete Trip'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* New Tab Quick Button */}
          <button
            id="btn-add-tab-inline"
            type="button"
            onClick={onOpenNewTripModal}
            className="shrink-0 flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-dashed border-teal-300 text-teal-700 hover:bg-teal-50/60 dark:border-teal-700 dark:text-teal-300 dark:hover:bg-teal-950/40 text-xs font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{isBn ? 'নতুন ভ্রমণ যোগ' : 'Add New Trip'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
