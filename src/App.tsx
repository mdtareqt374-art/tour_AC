/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Trip,
  Expense,
  Income,
  Language,
  AccountType,
  PostingMenuTab,
  CommitteeMember,
  DevelopmentProject,
  PhotoRecord
} from './types';
import {
  loadTrips,
  saveTrips,
  loadExpenses,
  saveExpenses,
  loadIncomes,
  saveIncomes,
  loadActiveTripId,
  saveActiveTripId,
  loadMembers,
  saveMembers,
  loadProjects,
  saveProjects,
  loadPhotos,
  savePhotos,
  resetToBlankState,
  restoreDemoData,
  syncStorageWithIndexedDB,
  exportCSV
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { TripTabs } from './components/TripTabs';
import { TripSummaryCards } from './components/TripSummaryCards';
import { PostingMenu } from './components/PostingMenu';
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
import { AutoInstallBanner } from './components/AutoInstallBanner';
import { OfflineIndicator } from './components/OfflineIndicator';
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
  const [defaultTabTypeForModal, setDefaultTabTypeForModal] = useState<AccountType>('institution');

  const handleOpenNewTripModal = (tabType: AccountType = 'institution') => {
    setEditingTrip(null);
    setDefaultTabTypeForModal(tabType);
    setIsTripModalOpen(true);
  };

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);

  const [isQuickBudgetModalOpen, setIsQuickBudgetModalOpen] = useState(false);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  // Posting Menu Tab & Additional Data state (Committee, Projects, Photos)
  const [postingMenuTab, setPostingMenuTab] = useState<PostingMenuTab>('posting');
  const [members, setMembers] = useState<CommitteeMember[]>(() => loadMembers());
  const [projects, setProjects] = useState<DevelopmentProject[]>(() => loadProjects());
  const [photos, setPhotos] = useState<PhotoRecord[]>(() => loadPhotos());

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
    saveMembers(members);
  }, [members]);

  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  useEffect(() => {
    savePhotos(photos);
  }, [photos]);

  useEffect(() => {
    if (activeTripId) {
      saveActiveTripId(activeTripId);
    }
  }, [activeTripId]);

  // IndexedDB background hydration: guarantees persistence even across private tabs / partition clearing
  useEffect(() => {
    syncStorageWithIndexedDB((hydratedTrips, hydratedExpenses, hydratedIncomes) => {
      if (hydratedTrips && hydratedTrips.length > 0) {
        setTrips(hydratedTrips);
        setExpenses(hydratedExpenses);
        setIncomes(hydratedIncomes);
        const targetTripId = loadActiveTripId(hydratedTrips);
        setActiveTripId(targetTripId);
      }
    });
  }, []);

  // Current active trip
  const activeTrip = trips.find((t) => t.id === activeTripId) || trips[0];
  const activeTripExpenses = expenses.filter((e) => e.tripId === activeTrip?.id);
  const activeTripIncomes = incomes.filter((i) => i.tripId === activeTrip?.id);

  // If active trip was deleted or empty, set to first available trip
  useEffect(() => {
    if ((!activeTrip || !trips.some((t) => t.id === activeTripId)) && trips.length > 0) {
      const fallbackId = trips[0].id;
      setActiveTripId(fallbackId);
      saveActiveTripId(fallbackId);
    }
  }, [trips, activeTripId, activeTrip]);

  // Handle Trip Add / Update with immediate synchronous save
  const handleSaveTrip = (
    tripData: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>,
    editId?: string
  ) => {
    if (editId) {
      // Update
      const updated = trips.map((t) =>
        t.id === editId
          ? { ...t, ...tripData, updatedAt: Date.now() }
          : t
      );
      setTrips(updated);
      saveTrips(updated);
    } else {
      // Create new trip tab
      const newTripId = 'trip-' + Date.now();
      const newTrip: Trip = {
        id: newTripId,
        ...tripData,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      const updated = [...trips, newTrip];
      setTrips(updated);
      saveTrips(updated);
      setActiveTripId(newTripId);
      saveActiveTripId(newTripId);
      setSelectedCategory('all');
    }
  };

  // Handle Quick Budget Update (Direct budget update or increment) with immediate synchronous save
  const handleUpdateBudget = (newBudget: number) => {
    if (!activeTrip) return;
    const updated = trips.map((t) =>
      t.id === activeTrip.id
        ? { ...t, budget: newBudget, updatedAt: Date.now() }
        : t
    );
    setTrips(updated);
    saveTrips(updated);
  };

  // Handle Trip Delete with immediate synchronous save
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
      const remainingExpenses = expenses.filter((e) => e.tripId !== tripId);
      const remainingIncomes = incomes.filter((i) => i.tripId !== tripId);

      setTrips(remainingTrips);
      setExpenses(remainingExpenses);
      setIncomes(remainingIncomes);

      saveTrips(remainingTrips);
      saveExpenses(remainingExpenses);
      saveIncomes(remainingIncomes);

      if (activeTripId === tripId) {
        const nextActiveId = remainingTrips[0]?.id || '';
        setActiveTripId(nextActiveId);
        saveActiveTripId(nextActiveId);
      }
    }
  };

  // Handle Expense Add / Update with immediate synchronous save
  const handleSaveExpense = (
    expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>,
    editId?: string
  ) => {
    if (editId) {
      // Update
      const updated = expenses.map((e) =>
        e.id === editId
          ? { ...e, ...expenseData, updatedAt: Date.now() }
          : e
      );
      setExpenses(updated);
      saveExpenses(updated);
    } else {
      // Add new
      const newExp: Expense = {
        id: 'exp-' + Date.now(),
        ...expenseData,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      const updated = [newExp, ...expenses];
      setExpenses(updated);
      saveExpenses(updated);
    }
  };

  // Handle Expense Delete with immediate synchronous save
  const handleDeleteExpense = (expenseId: string) => {
    const updated = expenses.filter((e) => e.id !== expenseId);
    setExpenses(updated);
    saveExpenses(updated);
  };

  // Handle Income Add / Update with immediate synchronous save
  const handleSaveIncome = (
    incomeData: Omit<Income, 'id' | 'createdAt' | 'updatedAt'>,
    editId?: string
  ) => {
    if (editId) {
      // Update
      const updated = incomes.map((i) =>
        i.id === editId
          ? { ...i, ...incomeData, updatedAt: Date.now() }
          : i
      );
      setIncomes(updated);
      saveIncomes(updated);
    } else {
      // Add new
      const newInc: Income = {
        id: 'inc-' + Date.now(),
        ...incomeData,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      const updated = [newInc, ...incomes];
      setIncomes(updated);
      saveIncomes(updated);
    }
  };

  // Handle Income Delete with immediate synchronous save
  const handleDeleteIncome = (incomeId: string) => {
    const updated = incomes.filter((i) => i.id !== incomeId);
    setIncomes(updated);
    saveIncomes(updated);
  };

  // Committee Member Handlers
  const handleAddMember = (memberData: Omit<CommitteeMember, 'id' | 'createdAt'>) => {
    const newMember: CommitteeMember = {
      ...memberData,
      id: 'mem-' + Date.now(),
      createdAt: Date.now()
    };
    const updated = [newMember, ...members];
    setMembers(updated);
    saveMembers(updated);
  };

  const handleDeleteMember = (memberId: string) => {
    const updated = members.filter((m) => m.id !== memberId);
    setMembers(updated);
    saveMembers(updated);
  };

  // Development Project Handlers
  const handleAddProject = (projectData: Omit<DevelopmentProject, 'id' | 'createdAt'>) => {
    const newProject: DevelopmentProject = {
      ...projectData,
      id: 'proj-' + Date.now(),
      createdAt: Date.now()
    };
    const updated = [newProject, ...projects];
    setProjects(updated);
    saveProjects(updated);
  };

  const handleDeleteProject = (projectId: string) => {
    const updated = projects.filter((p) => p.id !== projectId);
    setProjects(updated);
    saveProjects(updated);
  };

  // Photo / Receipt Handlers
  const handleAddPhoto = (photoData: Omit<PhotoRecord, 'id' | 'createdAt'>) => {
    const newPhoto: PhotoRecord = {
      ...photoData,
      id: 'photo-' + Date.now(),
      createdAt: Date.now()
    };
    const updated = [newPhoto, ...photos];
    setPhotos(updated);
    savePhotos(updated);
  };

  const handleDeletePhoto = (photoId: string) => {
    const updated = photos.filter((p) => p.id !== photoId);
    setPhotos(updated);
    savePhotos(updated);
  };

  // Handle Start Fresh / Reset to Blank
  const handleResetToBlank = () => {
    const blank = resetToBlankState();
    setTrips(blank.trips);
    setExpenses(blank.expenses);
    setIncomes(blank.incomes);
    setActiveTripId(blank.trips[0].id);
    setSelectedCategory('all');
  };

  // Handle Restore Demo Data
  const handleRestoreDemo = () => {
    const demo = restoreDemoData();
    setTrips(demo.trips);
    setExpenses(demo.expenses);
    setIncomes(demo.incomes);
    setActiveTripId(demo.trips[0].id);
    setSelectedCategory('all');
  };

  // Handle Restore Backup
  const handleRestoreData = (newTrips: Trip[], newExpenses: Expense[], newIncomes?: Income[]) => {
    setTrips(newTrips);
    setExpenses(newExpenses);
    const incs = newIncomes || [];
    setIncomes(incs);

    saveTrips(newTrips);
    saveExpenses(newExpenses);
    saveIncomes(incs);

    if (newTrips.length > 0) {
      setActiveTripId(newTrips[0].id);
      saveActiveTripId(newTrips[0].id);
    }
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
        onOpenNewTripModal={() => handleOpenNewTripModal('institution')}
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
          onOpenNewTripModal={handleOpenNewTripModal}
          onEditTrip={(trip) => {
            setEditingTrip(trip);
            setIsTripModalOpen(true);
          }}
          onDeleteTrip={handleDeleteTrip}
          expenses={expenses}
          incomes={incomes}
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

            {/* 2. Top Posting & Navigation Menu (Exact layout from user's picture) */}
            {/* [কমিটি] [ম্যাপ] [আয়] [ব্যয়] [পোস্টিং] [অনুদান] [উন্নয়ন] [ফটো] */}
            <PostingMenu
              trip={activeTrip}
              expenses={expenses}
              incomes={incomes}
              members={members}
              projects={projects}
              photos={photos}
              activeMenuTab={postingMenuTab}
              onSelectMenuTab={(tab) => {
                setPostingMenuTab(tab);
                if (tab === 'expense') setActiveViewTab('expenses');
                else if (tab === 'income') setActiveViewTab('incomes');
              }}
              onAddExpense={(data) => handleSaveExpense(data)}
              onAddIncome={(data) => handleSaveIncome(data)}
              onDeleteExpense={handleDeleteExpense}
              onDeleteIncome={handleDeleteIncome}
              onAddMember={handleAddMember}
              onDeleteMember={handleDeleteMember}
              onAddProject={handleAddProject}
              onDeleteProject={handleDeleteProject}
              onAddPhoto={handleAddPhoto}
              onDeletePhoto={handleDeletePhoto}
              onOpenReportModal={() => setIsReportModalOpen(true)}
              language={language}
            />

            {/* Income Section (When in 'income' tab) */}
            {postingMenuTab === 'income' && (
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

            {/* Expense Section (When in 'expense' tab) */}
            {postingMenuTab === 'expense' && (
              <>
                <CategoryBreakdown
                  trip={activeTrip}
                  expenses={activeTripExpenses}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  language={language}
                />

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
        defaultTabType={defaultTabTypeForModal}
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
        onResetToBlank={handleResetToBlank}
        onRestoreDemo={handleRestoreDemo}
        language={language}
      />

      {/* PWA Auto-Install Banner & Offline Connectivity Indicator */}
      <AutoInstallBanner language={language} />
      <OfflineIndicator language={language} />
    </div>
  );
}
