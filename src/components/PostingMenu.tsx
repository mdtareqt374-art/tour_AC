import React, { useState, useId } from 'react';
import {
  Calendar,
  Send,
  Check,
  Plus,
  Users,
  MapPin,
  TrendingUp,
  Receipt,
  HeartHandshake,
  Hammer,
  Image as ImageIcon,
  DollarSign,
  Trash2,
  Phone,
  User,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Layers,
  FileText,
  Smartphone,
  Download
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import {
  Trip,
  Expense,
  Income,
  Language,
  PostingMenuTab,
  CommitteeMember,
  DevelopmentProject,
  PhotoRecord,
  ExpenseCategory,
  IncomeSource,
  PaymentMethod
} from '../types';
import { PAYMENT_METHODS } from '../constants/categories';

interface PostingMenuProps {
  trip: Trip;
  expenses: Expense[];
  incomes: Income[];
  members: CommitteeMember[];
  projects: DevelopmentProject[];
  photos: PhotoRecord[];
  activeMenuTab: PostingMenuTab;
  onSelectMenuTab: (tab: PostingMenuTab) => void;
  onAddExpense: (expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onAddIncome: (incomeData: Omit<Income, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDeleteExpense: (id: string) => void;
  onDeleteIncome: (id: string) => void;
  onAddMember: (member: Omit<CommitteeMember, 'id' | 'createdAt'>) => void;
  onDeleteMember: (id: string) => void;
  onAddProject: (project: Omit<DevelopmentProject, 'id' | 'createdAt'>) => void;
  onDeleteProject: (id: string) => void;
  onAddPhoto: (photo: Omit<PhotoRecord, 'id' | 'createdAt'>) => void;
  onDeletePhoto: (id: string) => void;
  onOpenReportModal: () => void;
  language: Language;
}

export const PostingMenu: React.FC<PostingMenuProps> = ({
  trip,
  expenses,
  incomes,
  members,
  projects,
  photos,
  activeMenuTab,
  onSelectMenuTab,
  onAddExpense,
  onAddIncome,
  onDeleteExpense,
  onDeleteIncome,
  onAddMember,
  onDeleteMember,
  onAddProject,
  onDeleteProject,
  onAddPhoto,
  onDeletePhoto,
  language
}) => {
  const isBn = language === 'bn';
  const isInst = trip.type === 'institution' || trip.type === 'business';

  // --- Posting Form State ---
  const todayStr = new Date().toISOString().split('T')[0];
  const [postingDate, setPostingDate] = useState<string>(todayStr);
  const [postingMode, setPostingMode] = useState<'income' | 'expense'>('income');
  const [amount, setAmount] = useState<string>('');
  const [payerOrVendor, setPayerOrVendor] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>('other');
  const [incomeSource, setIncomeSource] = useState<IncomeSource>('contribution');
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // --- Member Modal State ---
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [memberRole, setMemberRole] = useState(isInst ? 'সদস্য / স্টাফ' : 'ভ্রমণসঙ্গী');
  const [memberPhone, setMemberPhone] = useState('');
  const [memberContrib, setMemberContrib] = useState('');

  // --- Project Modal State ---
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectCost, setProjectCost] = useState('');
  const [projectStatus, setProjectStatus] = useState<'planning' | 'ongoing' | 'completed'>('ongoing');
  const [projectLead, setProjectLead] = useState('');

  // --- Photo Modal State ---
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  // Format date helper: YYYY-MM-DD -> DD/MM/YYYY
  const formatDisplayDate = (dStr: string) => {
    if (!dStr) return '';
    const parts = dStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dStr;
  };

  // Handle Posting Submission
  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || isNaN(numAmount) || numAmount <= 0) {
      setErrorMsg(isBn ? 'অনুগ্রহ করে সঠিক টাকার পরিমাণ লিখুন।' : 'Please enter a valid amount.');
      return;
    }

    const finalTitle = description.trim() || (postingMode === 'income' 
      ? (isInst ? (isBn ? 'আয়' : 'Income') : (isBn ? 'আয়' : 'Income'))
      : (isInst ? (isBn ? 'ব্যয়' : 'Expense') : (isBn ? 'ব্যয়' : 'Expense'))
    );

    if (postingMode === 'income') {
      onAddIncome({
        tripId: trip.id,
        title: finalTitle,
        amount: numAmount,
        source: incomeSource,
        date: postingDate || todayStr,
        paymentMethod: paymentMethod,
        contributor: payerOrVendor.trim() || undefined,
        notes: description.trim() || undefined
      });
      setShowNotification(
        isBn 
          ? `✓ ৳${numAmount.toLocaleString()} টাকার আয় সফলভাবে পোস্টিং হয়েছে!` 
          : `✓ Successfully posted income of ${trip.currency}${numAmount.toLocaleString()}!`
      );
    } else {
      onAddExpense({
        tripId: trip.id,
        description: finalTitle,
        amount: numAmount,
        category: expenseCategory,
        date: postingDate || todayStr,
        paymentMethod: paymentMethod,
        paidBy: payerOrVendor.trim() || undefined,
        notes: description.trim() || undefined
      });
      setShowNotification(
        isBn 
          ? `✓ ৳${numAmount.toLocaleString()} টাকার খরচ সফলভাবে পোস্টিং হয়েছে!` 
          : `✓ Successfully posted expense of ${trip.currency}${numAmount.toLocaleString()}!`
      );
    }

    // Reset fields
    setAmount('');
    setPayerOrVendor('');
    setDescription('');
    setErrorMsg(null);

    // Auto dismiss notification
    setTimeout(() => {
      setShowNotification(null);
    }, 4000);
  };

  // Handle Member Add
  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim()) return;
    onAddMember({
      tripId: trip.id,
      name: memberName.trim(),
      role: memberRole.trim() || (isInst ? 'সদস্য' : 'ভ্রমণসঙ্গী'),
      phone: memberPhone.trim() || undefined,
      contributedAmount: parseFloat(memberContrib) || 0,
      notes: ''
    });
    setMemberName('');
    setMemberPhone('');
    setMemberContrib('');
    setIsMemberModalOpen(false);
  };

  // Handle Project Add
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim()) return;
    onAddProject({
      tripId: trip.id,
      title: projectTitle.trim(),
      cost: parseFloat(projectCost) || 0,
      status: projectStatus,
      startDate: todayStr,
      contractorOrLead: projectLead.trim() || undefined,
      notes: ''
    });
    setProjectTitle('');
    setProjectCost('');
    setProjectLead('');
    setIsProjectModalOpen(false);
  };

  // Handle Photo Add
  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoTitle.trim()) return;
    onAddPhoto({
      tripId: trip.id,
      title: photoTitle.trim(),
      imageUrl: photoUrl.trim() || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      date: todayStr,
      category: 'voucher'
    });
    setPhotoTitle('');
    setPhotoUrl('');
    setIsPhotoModalOpen(false);
  };

  // Filter items for active trip
  const tripIncomes = incomes.filter((i) => i.tripId === trip.id);
  const tripExpenses = expenses.filter((e) => e.tripId === trip.id);
  const tripMembers = members.filter((m) => m.tripId === trip.id || m.tripId === 'all');
  const tripProjects = projects.filter((p) => p.tripId === trip.id || p.tripId === 'all');
  const tripPhotos = photos.filter((p) => p.tripId === trip.id || p.tripId === 'all');

  // Filter donations (incomes with source 'donation' or 'sponsor' or 'contribution')
  const tripDonations = tripIncomes.filter(
    (i) => i.source === 'donation' || i.source === 'sponsor' || i.source === 'contribution'
  );
  const totalDonations = tripDonations.reduce((acc, curr) => acc + curr.amount, 0);

  // Combined recent postings (last 6 items)
  const recentPostings = [
    ...tripIncomes.map((i) => ({ ...i, itemType: 'income' as const })),
    ...tripExpenses.map((e) => ({ ...e, itemType: 'expense' as const }))
  ].sort((a, b) => b.createdAt - a.createdAt).slice(0, 6);

  // Navigation Items matching the user's provided picture:
  // [কমিটি] [ম্যাপ] [আয়] [ব্যয়] [পোস্টিং] [অনুদান] [উন্নয়ন] [ফটো]
  const menuTabs: { id: PostingMenuTab; labelBn: string; labelEn: string; icon: any }[] = [
    { id: 'committee', labelBn: 'কমিটি', labelEn: 'Committee', icon: Users },
    { id: 'map', labelBn: 'ম্যাপ', labelEn: 'Map', icon: MapPin },
    { id: 'income', labelBn: 'আয়', labelEn: 'Income', icon: TrendingUp },
    { id: 'expense', labelBn: 'ব্যয়', labelEn: 'Expense', icon: Receipt },
    { id: 'posting', labelBn: 'পোস্টিং', labelEn: 'Posting', icon: Send },
    { id: 'donation', labelBn: 'অনুদান', labelEn: 'Donations', icon: HeartHandshake },
    { id: 'development', labelBn: 'উন্নয়ন', labelEn: 'Development', icon: Hammer },
    { id: 'photos', labelBn: 'ফটো', labelEn: 'Photos', icon: ImageIcon }
  ];

  const datePickerId = useId();

  return (
    <div className="space-y-4">
      {/* ========================================================
          1. TOP PILL NAVIGATION BAR (EXACTLY AS IN USER'S PICTURE)
          [কমিটি] [ম্যাপ] [আয়] [ব্যয়] [পোস্টিং] [অনুদান] [উন্নয়ন] [ফটো]
         ======================================================== */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 sm:p-2.5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
          {menuTabs.map((item) => {
            const isActive = activeMenuTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectMenuTab(item.id)}
                className={`flex-1 min-w-[72px] sm:min-w-[86px] py-2 px-2.5 sm:px-3.5 rounded-xl font-bold text-xs sm:text-sm text-center transition-all ${
                  isActive
                    ? 'bg-emerald-800 dark:bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-600/30'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>{isBn ? item.labelBn : item.labelEn}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          2. POSTING VIEW (EXACTLY MATCHING USER'S SCREENSHOT)
         ======================================================== */}
      {activeMenuTab === 'posting' && (
        <div className="space-y-4 animate-fade-in">
          {/* Notification Toast */}
          {showNotification && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-sm font-semibold flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>{showNotification}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowNotification(null)}
                className="text-emerald-600 hover:text-emerald-800 text-xs font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* Date Selector Card: [Icon] পোস্টিং তারিখ: [23/09/2026 ∨] */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <span className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">
                {isBn ? 'পোস্টিং তারিখ:' : 'Posting Date:'}
              </span>
            </div>

            <div className="relative inline-flex items-center">
              <label htmlFor={datePickerId} className="sr-only">
                {isBn ? 'পোস্টিং তারিখ নির্বাচন' : 'Select Posting Date'}
              </label>
              <input
                id={datePickerId}
                type="date"
                value={postingDate}
                onChange={(e) => setPostingDate(e.target.value)}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
              />
              <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs sm:text-sm font-bold shadow-2xs hover:bg-slate-100 transition-colors pointer-events-none">
                <span>{formatDisplayDate(postingDate)}</span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </div>
            </div>
          </div>

          {/* Main Posting Table / Form Card */}
          <form
            onSubmit={handlePostSubmit}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs"
          >
            {/* Header Row: Blue "বিবরণ" on left + Prominent Split [আয় (৫০%)] and [ব্যয় (৫০%)] buttons on right */}
            <div className="flex flex-col sm:flex-row border-b border-slate-200 dark:border-slate-800">
              <div className="sm:w-1/4 bg-blue-600 text-white font-bold px-4 sm:px-6 py-3.5 flex items-center justify-center sm:justify-start text-sm sm:text-base tracking-wide border-b sm:border-b-0 sm:border-r border-blue-700/50">
                <span>{isBn ? 'বিবরণ' : 'Details'}</span>
              </div>

              {/* Two equal halves (50% / 50%) large toggle options */}
              <div className="flex-1 p-2 sm:p-2.5 bg-slate-100/80 dark:bg-slate-850/80 grid grid-cols-2 gap-2 sm:gap-3">
                {/* [আয়] Option - Large Half */}
                <button
                  type="button"
                  onClick={() => setPostingMode('income')}
                  className={`w-full py-3 sm:py-3.5 px-3 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    postingMode === 'income'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md ring-2 ring-emerald-500/50 scale-[1.01]'
                      : 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                    postingMode === 'income' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950'
                  }`}>
                    {postingMode === 'income' ? <Check className="w-3.5 h-3.5" /> : '+'}
                  </span>
                  <span className="tracking-wide">{isBn ? 'আয় (Income)' : 'Income'}</span>
                </button>

                {/* [ব্যয়] Option - Large Half */}
                <button
                  type="button"
                  onClick={() => setPostingMode('expense')}
                  className={`w-full py-3 sm:py-3.5 px-3 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    postingMode === 'expense'
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md ring-2 ring-rose-500/50 scale-[1.01]'
                      : 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                    postingMode === 'expense' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-600 dark:bg-rose-950'
                  }`}>
                    {postingMode === 'expense' ? <Check className="w-3.5 h-3.5" /> : '−'}
                  </span>
                  <span className="tracking-wide">{isBn ? 'ব্যয় (Expense)' : 'Expense'}</span>
                </button>
              </div>
            </div>

            {/* Row 1: টাকার পরিমাণ */}
            <div className="flex border-b border-slate-200 dark:border-slate-800">
              <div className="w-1/3 sm:w-1/4 bg-slate-50/60 dark:bg-slate-850/60 px-4 sm:px-6 py-4 font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm border-r border-slate-200 dark:border-slate-800 flex items-center">
                <span>{isBn ? 'টাকার পরিমাণ' : 'Amount'}</span>
              </div>
              <div className="flex-1 px-4 sm:px-6 py-2.5 flex items-center">
                <span className="text-slate-400 dark:text-slate-500 font-bold text-base mr-2">
                  ৳
                </span>
                <input
                  type="number"
                  step="any"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder={isBn ? 'টাকার পরিমাণ লিখুন' : 'Enter amount'}
                  className="w-full bg-transparent text-slate-900 dark:text-slate-100 text-sm sm:text-base font-semibold placeholder:text-slate-400 placeholder:font-normal focus:outline-hidden py-1.5"
                  required
                />
              </div>
            </div>

            {/* Row 2: চাঁদা দাতার নাম (আয় হলে) অথবা পরিশোধকারী/ভেন্ডর (ব্যয় হলে) */}
            <div className="flex border-b border-slate-200 dark:border-slate-800">
              <div className="w-1/3 sm:w-1/4 bg-slate-50/60 dark:bg-slate-850/60 px-4 sm:px-6 py-4 font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm border-r border-slate-200 dark:border-slate-800 flex items-center">
                <span>
                  {postingMode === 'income'
                    ? (isBn ? 'চাঁদা দাতার নাম' : 'Donor / Payer Name')
                    : (isBn ? 'পরিশোধকারী / ভেন্ডর' : 'Paid By / Vendor')}
                </span>
              </div>
              <div className="flex-1 px-4 sm:px-6 py-2.5 flex items-center">
                <input
                  type="text"
                  value={payerOrVendor}
                  onChange={(e) => setPayerOrVendor(e.target.value)}
                  placeholder={
                    postingMode === 'income'
                      ? (isBn ? 'চাঁদা দাতার নাম লিখুন (ঐচ্ছিক)' : 'Enter donor/payer name (optional)')
                      : (isBn ? 'পরিশোধকারী বা ভেন্ডরের নাম (ঐচ্ছিক)' : 'Enter paid by / vendor name (optional)')
                  }
                  className="w-full bg-transparent text-slate-900 dark:text-slate-100 text-sm sm:text-base placeholder:text-slate-400 focus:outline-hidden py-1.5"
                />
              </div>
            </div>

            {/* Row 3: বিবরণ */}
            <div className="flex border-b border-slate-200 dark:border-slate-800">
              <div className="w-1/3 sm:w-1/4 bg-slate-50/60 dark:bg-slate-850/60 px-4 sm:px-6 py-4 font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm border-r border-slate-200 dark:border-slate-800 flex items-center">
                <span>{isBn ? 'বিবরণ' : 'Description'}</span>
              </div>
              <div className="flex-1 px-4 sm:px-6 py-2.5 flex items-center">
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={
                    postingMode === 'income'
                      ? (isBn ? 'আয়ের কারণ বা বিবরণ (যেমন: সদস্য চাঁদা, অনুদান, বিক্রয়...)' : 'Income details or reason...')
                      : (isBn ? 'ব্যয়ের কারণ বা বিবরণ (যেমন: বেতন, অফিস ভাড়া, নাস্তা, পরিবহন...)' : 'Expense details or reason...')
                  }
                  className="w-full bg-transparent text-slate-900 dark:text-slate-100 text-sm sm:text-base placeholder:text-slate-400 focus:outline-hidden py-1.5"
                />
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="px-5 py-2 text-xs font-semibold text-rose-600 bg-rose-50 border-t border-rose-100">
                {errorMsg}
              </div>
            )}
          </form>

          {/* Action Button on Bottom Right: [ ✈ পোস্টিং ] */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            {/* Mobile App Install Prompt Badge */}
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs text-teal-800 dark:text-teal-200">
              <img
                src="/app-icon.jpg"
                alt="App Icon"
                className="w-7 h-7 rounded-lg object-cover shadow-2xs"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="font-semibold">
                {isBn ? 'মোবাইলে সহজে ব্যবহার করতে ইনস্টল করুন:' : 'Install for best mobile experience:'}
              </span>
              <PWAInstallButton language={language} variant="compact" />
            </div>

            <button
              type="button"
              onClick={handlePostSubmit}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-base font-bold shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4 -rotate-12" />
              <span>{isBn ? 'পোস্টিং' : 'Post Entry'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          3. COMMITTEE VIEW (কমিটি / স্টাফ ও সদস্য)
         ======================================================== */}
      {activeMenuTab === 'committee' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-2xs">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-600" />
                <span>
                  {isInst ? (isBn ? 'কমিটি, পরিচালনা পর্ষদ ও স্টাফ' : 'Committee & Staff') : (isBn ? 'ভ্রমণসঙ্গী ও সমন্বয় কমিটি' : 'Tour Companions & Committee')}
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                {isBn ? 'মোট সদস্য:' : 'Total Members:'} {tripMembers.length} {isBn ? 'জন' : 'people'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsMemberModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{isBn ? '+ সদস্য যোগ' : '+ Add Member'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {tripMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs relative group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-sm">
                      {member.name.slice(0, 1)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {member.name}
                      </h4>
                      <span className="inline-block text-2xs px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 font-semibold mt-0.5">
                        {member.role}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteMember(member.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title={isBn ? 'মুছুন' : 'Delete'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  {member.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                  {member.contributedAmount ? (
                    <div className="flex items-center justify-between font-semibold text-emerald-700 dark:text-emerald-400">
                      <span>{isBn ? 'জমা / চাঁদা:' : 'Contribution:'}</span>
                      <span>৳{member.contributedAmount.toLocaleString()}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          {/* Add Member Modal */}
          {isMemberModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 w-full max-w-md shadow-xl">
                <h3 className="font-bold text-base mb-3">
                  {isBn ? 'নতুন সদস্য যুক্ত করুন' : 'Add New Member'}
                </h3>
                <form onSubmit={handleSaveMember} className="space-y-3 text-xs sm:text-sm">
                  <div>
                    <label className="block font-semibold mb-1">{isBn ? 'নাম:' : 'Name:'}</label>
                    <input
                      type="text"
                      value={memberName}
                      onChange={(e) => setMemberName(e.target.value)}
                      placeholder={isBn ? 'সদস্যের নাম লিখুন' : 'Member name'}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">{isBn ? 'পদবি / দায়িত্ব:' : 'Role / Title:'}</label>
                    <input
                      type="text"
                      value={memberRole}
                      onChange={(e) => setMemberRole(e.target.value)}
                      placeholder={isBn ? 'যেমন: সভাপতি, সাধারণ সম্পাদক, স্টাফ, সদস্য' : 'e.g. President, Secretary, Member'}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">{isBn ? 'মোবাইল নম্বর:' : 'Phone:'}</label>
                    <input
                      type="text"
                      value={memberPhone}
                      onChange={(e) => setMemberPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">{isBn ? 'জমা / চাঁদা পরিমাণ (ঐচ্ছিক):' : 'Contribution amount:'}</label>
                    <input
                      type="number"
                      value={memberContrib}
                      onChange={(e) => setMemberContrib(e.target.value)}
                      placeholder="৳ 0"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsMemberModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                    >
                      {isBn ? 'বাতিল' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold"
                    >
                      {isBn ? 'সংরক্ষণ করুন' : 'Save Member'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          4. MAP VIEW (ম্যাপ ও লোকেশন)
         ======================================================== */}
      {activeMenuTab === 'map' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-2xl shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-rose-600" />
                  <span>
                    {isInst ? (isBn ? 'প্রতিষ্ঠানের অবস্থান ও ঠিকানা' : 'Institution Location') : (isBn ? 'ভ্রমণের গন্তব্য ও রুট ম্যাপ' : 'Trip Destination Map')}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {trip.destination || (isBn ? 'বাংলাদেশ' : 'Bangladesh')}
                </p>
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  trip.destination || 'Bangladesh'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <span>{isBn ? 'গুগল ম্যাপে দেখুন' : 'Open in Google Maps'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Embedded Interactive Map */}
            <div className="w-full h-80 sm:h-96 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100">
              <iframe
                title="Location Map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  trip.destination || 'Dhaka, Bangladesh'
                )}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          5. DONATION VIEW (অনুদান ও স্পনসর ফান্ড)
         ======================================================== */}
      {activeMenuTab === 'donation' && (
        <div className="space-y-4 animate-fade-in">
          {/* Donation Summary Card */}
          <div className="bg-emerald-500/10 border border-emerald-200 dark:border-emerald-800/80 p-4 sm:p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide">
                {isBn ? 'মোট সংগৃহীত অনুদান ও সহায়তা ফান্ড' : 'Total Donations & Sponsorship'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-emerald-800 dark:text-emerald-200 mt-1">
                ৳{totalDonations.toLocaleString()}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {tripDonations.length} {isBn ? 'জন দাতা / কন্ট্রিবিউটর' : 'contributors'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setPostingMode('income');
                setIncomeSource('donation');
                onSelectMenuTab('posting');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{isBn ? '+ নতুন অনুদান পোস্টিং' : '+ Post Donation'}</span>
            </button>
          </div>

          {/* Donation List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-3">
              {isBn ? 'অনুদান দাতাদের তালিকা' : 'Donors & Contributors List'}
            </h4>
            {tripDonations.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                {isBn ? 'এখনও কোনো অনুদান জমা হয়নি। পোস্টিং মেনু থেকে অনুদান যুক্ত করুন।' : 'No donations recorded yet.'}
              </p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {tripDonations.map((d) => (
                  <div key={d.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {d.contributor || d.title}
                      </div>
                      <div className="text-slate-500 text-2xs mt-0.5">
                        {formatDisplayDate(d.date)} • {d.title} • {d.paymentMethod}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-600 text-sm">
                        ৳{d.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          6. DEVELOPMENT VIEW (উন্নয়ন ও প্রজেক্ট ফান্ড)
         ======================================================== */}
      {activeMenuTab === 'development' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-2xs">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                <Hammer className="w-5 h-5 text-indigo-600" />
                <span>{isBn ? 'উন্নয়ন কাজ, সংস্কার ও প্রজেক্ট খতিয়ান' : 'Development & Projects Log'}</span>
              </h3>
              <p className="text-xs text-slate-500">
                {isBn ? 'মোট প্রকল্প:' : 'Total Projects:'} {tripProjects.length}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsProjectModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{isBn ? '+ প্রজেক্ট যোগ' : '+ Add Project'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {tripProjects.map((p) => (
              <div
                key={p.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-wrap items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                      {p.title}
                    </h4>
                    <span
                      className={`text-2xs font-bold px-2 py-0.5 rounded-full ${
                        p.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : p.status === 'ongoing'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {p.status === 'completed'
                        ? (isBn ? 'সম্পন্ন' : 'Completed')
                        : p.status === 'ongoing'
                        ? (isBn ? 'চলমান' : 'Ongoing')
                        : (isBn ? 'পরিকল্পনা' : 'Planned')}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {p.contractorOrLead && `${isBn ? 'দায়িত্বে:' : 'Lead:'} ${p.contractorOrLead} • `}
                    {p.startDate && `${isBn ? 'শুরু:' : 'Started:'} ${formatDisplayDate(p.startDate)}`}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">{isBn ? 'বাজেট/ব্যয়:' : 'Cost:'}</span>
                    <span className="font-bold text-base text-slate-900 dark:text-slate-100">
                      ৳{p.cost.toLocaleString()}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteProject(p.id)}
                    className="text-slate-400 hover:text-rose-600 p-1.5"
                    title={isBn ? 'মুছুন' : 'Delete'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Project Modal */}
          {isProjectModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 w-full max-w-md shadow-xl">
                <h3 className="font-bold text-base mb-3">
                  {isBn ? 'নতুন উন্নয়ন প্রকল্প যুক্ত করুন' : 'Add Development Project'}
                </h3>
                <form onSubmit={handleSaveProject} className="space-y-3 text-xs sm:text-sm">
                  <div>
                    <label className="block font-semibold mb-1">{isBn ? 'প্রকল্পের নাম:' : 'Title:'}</label>
                    <input
                      type="text"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      placeholder={isBn ? 'যেমন: নতুন সাইনবোর্ড, ডেকোরেশন, সংস্কার' : 'Project title'}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">{isBn ? 'আনুমানিক ব্যয়:' : 'Cost:'}</label>
                    <input
                      type="number"
                      value={projectCost}
                      onChange={(e) => setProjectCost(e.target.value)}
                      placeholder="৳ 0"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">{isBn ? 'বর্তমান অবস্থা:' : 'Status:'}</label>
                    <select
                      value={projectStatus}
                      onChange={(e) => setProjectStatus(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                    >
                      <option value="planning">{isBn ? 'পরিকল্পনাধীন' : 'Planning'}</option>
                      <option value="ongoing">{isBn ? 'চলমান' : 'Ongoing'}</option>
                      <option value="completed">{isBn ? 'সম্পন্ন' : 'Completed'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">{isBn ? 'দায়িত্বপ্রাপ্ত ব্যক্তি/ভেন্ডর:' : 'Lead / Vendor:'}</label>
                    <input
                      type="text"
                      value={projectLead}
                      onChange={(e) => setProjectLead(e.target.value)}
                      placeholder={isBn ? 'ভেন্ডর বা দায়িত্বপ্রাপ্ত ব্যক্তি' : 'Lead person'}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsProjectModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                    >
                      {isBn ? 'বাতিল' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                    >
                      {isBn ? 'সংরক্ষণ' : 'Save'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          7. PHOTOS VIEW (ভাউচার ও ফটো গ্যালারি)
         ======================================================== */}
      {activeMenuTab === 'photos' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-2xs">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-purple-600" />
                <span>{isBn ? 'ভাউচার, রসিদ ও ফটো গ্যালারি' : 'Photos & Receipts Gallery'}</span>
              </h3>
              <p className="text-xs text-slate-500">
                {isBn ? 'সংরক্ষিত ছবি:' : 'Saved photos:'} {tripPhotos.length}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsPhotoModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{isBn ? '+ ফটো যোগ' : '+ Add Photo'}</span>
            </button>
          </div>

          {tripPhotos.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">
                {isBn ? 'কোনো ভাউচার বা ছবি যুক্ত করা হয়নি।' : 'No photos or receipts attached yet.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {tripPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs group relative"
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-36 object-cover"
                  />
                  <div className="p-2.5">
                    <h5 className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate">
                      {photo.title}
                    </h5>
                    <span className="text-2xs text-slate-400 block mt-0.5">
                      {formatDisplayDate(photo.date)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeletePhoto(photo.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/60 text-white hover:bg-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    title={isBn ? 'মুছুন' : 'Delete'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Photo Modal */}
          {isPhotoModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 w-full max-w-md shadow-xl">
                <h3 className="font-bold text-base mb-3">
                  {isBn ? 'ফটো বা ভাউচার রসিদ যুক্ত করুন' : 'Attach Photo or Receipt'}
                </h3>
                <form onSubmit={handleSavePhoto} className="space-y-3 text-xs sm:text-sm">
                  <div>
                    <label className="block font-semibold mb-1">{isBn ? 'শিরোনাম / বিবরণ:' : 'Title:'}</label>
                    <input
                      type="text"
                      value={photoTitle}
                      onChange={(e) => setPhotoTitle(e.target.value)}
                      placeholder={isBn ? 'যেমন: হোটেল ক্যাশ মেমো, গাড়ি ভাড়া ভাউচার' : 'Title'}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">{isBn ? 'ছবির লিংক (URL):' : 'Image URL:'}</label>
                    <input
                      type="url"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                    <p className="text-2xs text-slate-400 mt-1">
                      {isBn ? 'ফাঁকা রাখলে স্বয়ংক্রিয় ডিফল্ট ভাউচার ছবি নেওয়া হবে।' : 'Leave blank for default voucher image.'}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsPhotoModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                    >
                      {isBn ? 'বাতিল' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
                    >
                      {isBn ? 'যুক্ত করুন' : 'Add'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
