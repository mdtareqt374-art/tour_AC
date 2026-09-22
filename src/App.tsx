/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Trip, Expense, Income, Language } from './types';
import {
  loadTrips,
  saveTrips,
  loadExpenses,
  saveExpenses,
  loadIncomes,
  saveIncomes,
  loadActiveTripId,
  saveActiveTripId,
  exportCSV
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { TripTabs } from './components/TripTabs';
import { TripSummaryCards } from './components/TripSummaryCards';
import { CategoryBreakdown } from './components/CategoryBreakdown';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseModal } from './components/ExpenseModal';
import { IncomeList } from './components/IncomeList';
import { IncomeModal } from './components/IncomeModal';
import { QuickBudgetModal } from './components/QuickBudgetModal';
import { TripModal } from './components/TripModal';
import { ReportModal } from './components/ReportModal';
import { DocumentationModal } from './components/DocumentationModal';
import { SyncModal } from './components/SyncModal';
import { Receipt, PiggyBank, Layers, Plus } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>('bn');
  const [trips, setTrips] = useState<Trip[]>(() => loadTrips());
  const [expenses, setExpenses] = useState<Expense[]>(() => loadExpenses());
  const [incomes, setIncomes] = useState<Income[]>(() => loadIncomes());
  const [activeTripId, setActiveTripId] = useState<string>(() => loadActiveTripId(trips));
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeViewTab, setActiveViewTab] = useState<'expenses' | 'incomes' | 'all'>('all');

  // Modal states
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);

  const [isQuickBudgetModalOpen, setIsQuickBudgetModalOpen] = useState(false);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  // Synchronize state changes to localStorage
  useEffect(() => {
    saveTrips(trips);
  }, [trips]);

  useEffect(() => {
    saveExpenses(expenses);
  }, [expenses]);

  useEffect(() => {
    saveIncomes(incomes);
  }, [incomes]);

  useEffect(() => {
    if (activeTripId) {
      saveActiveTripId(activeTripId);
    }
  }, [activeTripId]);

  // Current active trip
  const activeTrip = trips.find((t) => t.id === activeTripId) || trips[0];
  const activeTripExpenses = expenses.filter((e) => e.tripId === activeTrip?.id);
  const activeTripIncomes = incomes.filter((i) => i.tripId === activeTrip?.id);

  // If active trip was deleted or empty, set to first available trip
  useEffect(() => {
    if ((!activeTrip || !trips.some((t) => t.id === activeTripId)) && trips.length > 0) {
      setActiveTripId(trips[0].id);
    }
  }, [trips, activeTripId, activeTrip]);

  // Handle Trip Add / Update
  const handleSaveTrip = (
    tripData: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>,
    editId?: string
  ) => {
    if (editId) {
      // Update
      setTrips((prev) =>
        prev.map((t) =>
          t.id === editId
            ? { ...t, ...tripData, updatedAt: Date.now() }
            : t
        )
      );
    } else {
      // Create new trip tab
      const newTripId = 'trip-' + Date.now();
      const newTrip: Trip = {
        id: newTripId,
        ...tripData,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      setTrips((prev) => [...prev, newTrip]);
      setActiveTripId(newTripId);
      setSelectedCategory('all');
    }
  };

  // Handle Quick Budget Update (Direct budget update or increment)
  const handleUpdateBudget = (newBudget: number) => {
    if (!activeTrip) return;
    setTrips((prev) =>
      prev.map((t) =>
        t.id === activeTrip.id
          ? { ...t, budget: newBudget, updatedAt: Date.now() }
          : t
      )
    );
  };

  // Handle Trip Delete
  const handleDeleteTrip = (tripId: string) => {
    if (trips.length <= 1) {
      alert(
        language === 'bn'
          ? 'অন্তত একটি ভ্রমণের ট্যাব থাকা আবশ্যক।'
          : 'You must have at least one trip tab.'
      );
      return;
    }

    const confirmMsg =
      language === 'bn'
        ? 'আপনি কি নিশ্চিত এই ভ্রমণের ট্যাব এবং এর সমস্ত খরচের হিসাব মুছে ফেলতে চান?'
        : 'Are you sure you want to delete this trip and all its records?';

    if (window.confirm(confirmMsg)) {
      const remainingTrips = trips.filter((t) => t.id !== tripId);
      setTrips(remainingTrips);
      setExpenses((prev) => prev.filter((e) => e.tripId !== tripId));
      setIncomes((prev) => prev.filter((i) => i.tripId !== tripId));

      if (activeTripId === tripId) {
        setActiveTripId(remainingTrips[0]?.id || '');
      }
    }
  };

  // Handle Expense Add / Update
  const handleSaveExpense = (
    expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>,
    editId?: string
  ) => {
    if (editId) {
      // Update
      setExpenses((prev) =>
        prev.map((e) =>
          e.id === editId
            ? { ...e, ...expenseData, updatedAt: Date.now() }
            : e
        )
      );
    } else {
      // Add new
      const newExp: Expense = {
        id: 'exp-' + Date.now(),
        ...expenseData,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      setExpenses((prev) => [newExp, ...prev]);
    }
  };

  // Handle Expense Delete
  const handleDeleteExpense = (expenseId: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
  };

  // Handle Income Add / Update
  const handleSaveIncome = (
    incomeData: Omit<Income, 'id' | 'createdAt' | 'updatedAt'>,
    editId?: string
  ) => {
    if (editId) {
      // Update
      setIncomes((prev) =>
        prev.map((i) =>
          i.id === editId
            ? { ...i, ...incomeData, updatedAt: Date.now() }
            : i
        )
      );
    } else {
      // Add new
      const newInc: Income = {
        id: 'inc-' + Date.now(),
        ...incomeData,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      setIncomes((prev) => [newInc, ...prev]);
    }
  };

  // Handle Income Delete
  const handleDeleteIncome = (incomeId: string) => {
    setIncomes((prev) => prev.filter((i) => i.id !== incomeId));
  };

  // Handle Restore
  const handleRestoreData = (newTrips: Trip[], newExpenses: Expense[], newIncomes?: Income[]) => {
    setTrips(newTrips);
    setExpenses(newExpenses);
    if (newIncomes) {
      setIncomes(newIncomes);
      saveIncomes(newIncomes);
    }
    if (newTrips.length > 0) {
      setActiveTripId(newTrips[0].id);
    }
    saveTrips(newTrips);
    saveExpenses(newExpenses);
  };

  // Handle Export CSV
  const handleExportCurrentCSV = () => {
    if (activeTrip) {
      exportCSV(activeTrip, activeTripExpenses, activeTripIncomes);
    }
  };

  const isBn = language === 'bn';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-['Hind_Siliguri',sans-serif]">
      {/* Top Navbar */}
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        onOpenNewTripModal={() => {
          setEditingTrip(null);
          setIsTripModalOpen(true);
        }}
        onOpenDocModal={() => setIsDocModalOpen(true)}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        tripCount={trips.length}
      />

      {/* Tabs Header */}
      {trips.length > 0 && (
        <TripTabs
          trips={trips}
          activeTripId={activeTrip?.id || ''}
          onSelectTrip={(id) => {
            setActiveTripId(id);
            setSelectedCategory('all');
          }}
          onOpenNewTripModal={() => {
            setEditingTrip(null);
            setIsTripModalOpen(true);
          }}
          onEditTrip={(trip) => {
            setEditingTrip(trip);
            setIsTripModalOpen(true);
          }}
          onDeleteTrip={handleDeleteTrip}
          expenses={expenses}
          language={language}
        />
      )}

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {activeTrip ? (
          <>
            {/* 1. Trip Summary & Stat Cards (with Income, Budget, Quick Add) */}
            <TripSummaryCards
              trip={activeTrip}
              expenses={activeTripExpenses}
              incomes={activeTripIncomes}
              onOpenAddExpense={() => {
                setEditingExpense(null);
                setIsExpenseModalOpen(true);
              }}
              onOpenAddIncome={() => {
                setEditingIncome(null);
                setIsIncomeModalOpen(true);
              }}
              onOpenQuickBudget={() => setIsQuickBudgetModalOpen(true)}
              onOpenReportModal={() => setIsReportModalOpen(true)}
              onExportCSV={handleExportCurrentCSV}
              language={language}
            />

            {/* View Sub-navigation Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3 pt-2">
              <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 dark:bg-slate-800/80 rounded-xl text-xs sm:text-sm font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveViewTab('all')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    activeViewTab === 'all'
                      ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{isBn ? 'সম্পূর্ণ বিবরণ (All)' : 'Overview'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveViewTab('expenses')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    activeViewTab === 'expenses'
                      ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>
                    {isBn ? 'খরচের তালিকা' : 'Expenses'} ({activeTripExpenses.length})
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveViewTab('incomes')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    activeViewTab === 'incomes'
                      ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <PiggyBank className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    {isBn ? 'আয় ও ফান্ড বৃদ্ধি' : 'Income & Funds'} ({activeTripIncomes.length})
                  </span>
                </button>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingIncome(null);
                    setIsIncomeModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isBn ? '+ আয় যোগ' : '+ Income'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditingExpense(null);
                    setIsExpenseModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-teal-200 dark:border-teal-800/80 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 hover:bg-teal-100 text-xs font-bold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isBn ? '+ খরচ যোগ' : '+ Expense'}</span>
                </button>
              </div>
            </div>

            {/* Income Section (When 'all' or 'incomes') */}
            {(activeViewTab === 'all' || activeViewTab === 'incomes') && (
              <IncomeList
                trip={activeTrip}
                incomes={activeTripIncomes}
                onOpenAddIncome={() => {
                  setEditingIncome(null);
                  setIsIncomeModalOpen(true);
                }}
                onEditIncome={(inc) => {
                  setEditingIncome(inc);
                  setIsIncomeModalOpen(true);
                }}
                onDeleteIncome={handleDeleteIncome}
                language={language}
              />
            )}

            {/* Expense Section (When 'all' or 'expenses') */}
            {(activeViewTab === 'all' || activeViewTab === 'expenses') && (
              <>
                {/* 2. Category Breakdown Chart & Progress */}
                <CategoryBreakdown
                  trip={activeTrip}
                  expenses={activeTripExpenses}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  language={language}
                />

                {/* 3. Detailed Expense Ledger with Search, Filter, Edit, Delete */}
                <ExpenseList
                  trip={activeTrip}
                  expenses={activeTripExpenses}
                  onOpenAddExpense={() => {
                    setEditingExpense(null);
                    setIsExpenseModalOpen(true);
                  }}
                  onEditExpense={(expense) => {
                    setEditingExpense(expense);
                    setIsExpenseModalOpen(true);
                  }}
                  onDeleteExpense={handleDeleteExpense}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  language={language}
                />
              </>
            )}
          </>
        ) : (
          <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            <h3 className="text-xl font-bold mb-2">
              {language === 'bn' ? 'কোনো ভ্রমণের তথ্য পাওয়া যায়নি' : 'No trips found'}
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              {language === 'bn'
                ? 'একটি নতুন ভ্রমণের ট্যাব খুলে হিসাব রাখা শুরু করুন।'
                : 'Create a new trip tab to start tracking expenses.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setEditingTrip(null);
                setIsTripModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-xs"
            >
              {language === 'bn' ? '+ নতুন ভ্রমণ ট্যাব তৈরি করুন' : '+ Create New Trip Tab'}
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            {language === 'bn'
              ? 'ভ্রমণ হিসাব — আপনার নির্ভরযোগ্য ভ্রমণ খরচ, আয় ও বাজেট ট্র্যাকার'
              : 'TripEx — Your reliable offline travel expense, income and budget tracker'}
          </span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsDocModalOpen(true)}
              className="text-teal-600 hover:underline font-medium"
            >
              {language === 'bn' ? 'গিটহাব ও ডিপ্লয় গাইড' : 'GitHub & Deploy Guide'}
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setIsSyncModalOpen(true)}
              className="text-teal-600 hover:underline font-medium"
            >
              {language === 'bn' ? 'ব্যাকআপ ও সিঙ্ক' : 'Backup & Sync'}
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {/* 1. Add / Edit Expense Modal */}
      {activeTrip && (
        <ExpenseModal
          isOpen={isExpenseModalOpen}
          onClose={() => {
            setIsExpenseModalOpen(false);
            setEditingExpense(null);
          }}
          onSave={handleSaveExpense}
          initialExpense={editingExpense}
          trip={activeTrip}
          language={language}
        />
      )}

      {/* 2. Add / Edit Income Modal */}
      {activeTrip && (
        <IncomeModal
          isOpen={isIncomeModalOpen}
          onClose={() => {
            setIsIncomeModalOpen(false);
            setEditingIncome(null);
          }}
          onSave={handleSaveIncome}
          initialIncome={editingIncome}
          trip={activeTrip}
          language={language}
        />
      )}

      {/* 3. Quick Budget Modal */}
      {activeTrip && (
        <QuickBudgetModal
          isOpen={isQuickBudgetModalOpen}
          onClose={() => setIsQuickBudgetModalOpen(false)}
          trip={activeTrip}
          onUpdateBudget={handleUpdateBudget}
          language={language}
        />
      )}

      {/* 4. Add / Edit Trip Modal */}
      <TripModal
        isOpen={isTripModalOpen}
        onClose={() => {
          setIsTripModalOpen(false);
          setEditingTrip(null);
        }}
        onSave={handleSaveTrip}
        initialTrip={editingTrip}
        language={language}
      />

      {/* 5. Report & PDF Download Modal */}
      {activeTrip && (
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          trip={activeTrip}
          expenses={activeTripExpenses}
          incomes={activeTripIncomes}
          language={language}
        />
      )}

      {/* 6. Complete Documentation Modal */}
      <DocumentationModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        language={language}
      />

      {/* 7. Backup & Cloud Sync Modal */}
      <SyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        trips={trips}
        expenses={expenses}
        incomes={incomes}
        onRestoreData={handleRestoreData}
        language={language}
      />
    </div>
  );
}
