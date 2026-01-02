
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AssetsPage from './pages/AssetsPage';
import CryptoPage from './pages/CryptoPage';
import P2PLendingPage from './pages/P2PLendingPage';
import RealEstatePage from './pages/RealEstatePage';
import DebtPage from './pages/DebtPage';
import GoalsPage from './pages/GoalsPage';
import AIAdvisor from './pages/AIAdvisor';
import ProfilePage from './pages/ProfilePage';
import BudgetPlanner from './pages/BudgetPlanner';
import { Asset, FinancialGoal, BudgetEntry, AssetType } from './types';
import { INITIAL_ASSETS, INITIAL_GOALS } from './constants';
import { LanguageProvider, useLanguage, Language, Currency } from './context/LanguageContext';
import { syncPrices } from './services/financeService';

const SetupModal: React.FC = () => {
  const { 
    language, setLanguage, 
    currency, setCurrency, 
    email, setEmail,
    age, setAge,
    displayName, setDisplayName,
    isSetupComplete, completeSetup, t 
  } = useLanguage();

  const [step, setStep] = useState(1);

  if (isSetupComplete) return null;

  const nextStep = () => {
    if (step === 1) {
      setStep(2);
    }
  };

  const handleComplete = () => {
    completeSetup();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand-dark/95 backdrop-blur-xl transition-opacity duration-700"></div>
      
      <div className="relative w-full max-w-2xl bg-brand-soft dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 fade-in duration-700">
        <header className="brand-gradient p-10 text-white text-center relative overflow-hidden">
          <div className="z-10 relative">
            <div className="w-24 h-24 mx-auto mb-6 logo-gradient rounded-[2rem] p-4 shadow-2xl border border-white/10 flex items-center justify-center relative group overflow-hidden">
              <img src="logo.png" alt="Asserra" className="w-full h-full object-contain relative z-10 drop-shadow-2xl" />
            </div>
            <h2 className="text-3xl font-black tracking-tighter mb-2">{t('setup_title')}</h2>
            <div className="flex justify-center gap-2 mb-2">
              {[1, 2].map(s => (
                <div key={s} className={`h-1.5 w-12 rounded-full transition-all ${step >= s ? 'bg-brand-primary' : 'bg-white/20'}`}></div>
              ))}
            </div>
            <p className="text-white/80 font-bold uppercase tracking-widest text-[10px]">{t('setup_subtitle')}</p>
          </div>
        </header>

        <div className="p-10 space-y-6 bg-slate-50/50 dark:bg-slate-950/20">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">
                  {t('setup_display_name')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={t('name_placeholder')}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-brand-primary/5 transition shadow-inner"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">
                    {t('setup_email')} <span className="opacity-50 text-[8px]">({t('optional_label')})</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('email_placeholder')}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-brand-primary/5 transition shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">
                    {t('setup_age')} <span className="opacity-50 text-[8px]">({t('optional_label')})</span>
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="25"
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-brand-primary/5 transition shadow-inner"
                  />
                </div>
              </div>
              <button
                onClick={nextStep}
                disabled={!displayName}
                className="w-full bg-brand-primary text-brand-secondary py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {t('next')}
              </button>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">
                    {t('setup_language')} <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    {(['de', 'en'] as Language[]).map(lang => (
                      <button
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] border transition-all ${
                          language === lang 
                          ? 'bg-brand-primary text-brand-secondary border-brand-primary shadow-lg shadow-brand-primary/10' 
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-brand-primary/50'
                        }`}
                      >
                        {lang === 'de' ? 'Deutsch' : 'English'}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">
                    {t('setup_currency')} <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as Currency)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-brand-primary/5 transition shadow-inner appearance-none cursor-pointer"
                  >
                    <option value="EUR">Euro (€)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="GBP">British Pound (£)</option>
                    <option value="CHF">Swiss Franc (Fr)</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleComplete}
                className="w-full bg-brand-primary text-brand-secondary py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {t('setup_complete')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SidebarLink = ({ to, icon, labelKey, onClick, collapsed }: { to: string, icon: string, labelKey: string, onClick?: () => void, collapsed: boolean }) => {
  const location = useLocation();
  const { t } = useLanguage();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
        isActive 
          ? 'bg-brand-soft text-brand-primary shadow-lg shadow-brand-primary/10 font-bold' 
          : 'text-slate-400 hover:bg-white/5 hover:text-white'
      } ${collapsed ? 'justify-center space-x-0' : ''}`}
      title={collapsed ? t(labelKey) : undefined}
    >
      <i className={`fas ${icon} w-5 flex-shrink-0 text-center`}></i>
      {!collapsed && <span className="tracking-tight truncate">{t(labelKey)}</span>}
    </Link>
  );
};

const AppContent: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [goals, setGoals] = useState<FinancialGoal[]>(INITIAL_GOALS);
  const [budget, setBudget] = useState<BudgetEntry[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('asserra-theme');
    return saved === 'dark';
  });

  const { t, isSetupComplete, displayName } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('asserra-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const syncDebtForRealEstate = (realEstate: Asset, currentAssets: Asset[]): Asset[] => {
    const debtIndex = currentAssets.findIndex(a => a.linkedAssetId === realEstate.id && a.type === AssetType.DEBT);
    let updatedAssets = [...currentAssets];

    if (realEstate.remainingDebt && realEstate.remainingDebt > 0) {
      const debtAsset: Asset = {
        id: debtIndex >= 0 ? updatedAssets[debtIndex].id : `debt-${realEstate.id}`,
        name: `${t('debt_nav')}: ${realEstate.name}`,
        type: AssetType.DEBT,
        quantity: 1,
        purchasePrice: realEstate.totalLoan || realEstate.remainingDebt,
        currentPrice: realEstate.remainingDebt,
        currency: realEstate.currency,
        lastUpdated: new Date().toISOString(),
        linkedAssetId: realEstate.id,
        interestRate: realEstate.interestRate,
        repaymentRate: realEstate.repaymentRate,
        monthlyPayment: realEstate.monthlyPayment,
        fixedInterestPeriod: realEstate.fixedInterestPeriod,
        termStart: realEstate.termStart,
        duration: realEstate.duration,
        institution: t('bank')
      };

      if (debtIndex >= 0) {
        updatedAssets[debtIndex] = debtAsset;
      } else {
        updatedAssets.push(debtAsset);
      }
    } else if (debtIndex >= 0) {
      updatedAssets.splice(debtIndex, 1);
    }
    
    return updatedAssets;
  };

  const updateAsset = (updatedAsset: Asset) => {
    setAssets(prev => {
      let nextAssets = prev.map(a => a.id === updatedAsset.id ? updatedAsset : a);
      if (updatedAsset.type === AssetType.REAL_ESTATE) {
        nextAssets = syncDebtForRealEstate(updatedAsset, nextAssets);
      }
      return nextAssets;
    });
  };

  const addAsset = (newAsset: Asset) => {
    const id = Date.now().toString();
    const assetWithId = { ...newAsset, id };
    setAssets(prev => {
      let nextAssets = [...prev, assetWithId];
      if (assetWithId.type === AssetType.REAL_ESTATE) {
        nextAssets = syncDebtForRealEstate(assetWithId, nextAssets);
      }
      return nextAssets;
    });
  };

  const deleteAsset = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id && a.linkedAssetId !== id));
  };

  const updateGoal = (updatedGoal: FinancialGoal) => {
    setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
  };

  const addGoal = (newGoal: FinancialGoal) => {
    setGoals(prev => [...prev, { ...newGoal, id: Date.now().toString() }]);
  };

  const handleSyncAll = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      const updated = await syncPrices(assets);
      setAssets(updated);
    } catch (err) {
      console.error("Global Sync Failed:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogoClick = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const hasAssetType = (type: AssetType) => assets.some(a => a.type === type);

  return (
    <div className={`flex min-h-screen brand-gradient ${isDarkMode ? 'dark' : ''}`}>
      <SetupModal />
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <aside className={`fixed inset-y-0 left-0 z-[90] bg-brand-dark/95 lg:bg-transparent lg:static lg:flex flex-col h-screen overflow-hidden transition-all duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} ${isSidebarCollapsed ? 'w-24' : 'w-72'} ${!isSetupComplete ? 'blur-xl opacity-30 pointer-events-none' : ''}`}>
        <div className={`p-8 pb-2 transition-all duration-300 ${isSidebarCollapsed ? 'px-4 flex justify-center' : 'p-8'}`}>
          <button 
            onClick={handleLogoClick}
            className={`flex items-center gap-3 group transition-all duration-300 ${isSidebarCollapsed ? 'flex-col justify-center' : 'flex-row'}`}
          >
            <div className={`logo-gradient rounded-[1rem] p-2 shadow-2xl border border-white/10 flex items-center justify-center transition-all duration-300 ${isSidebarCollapsed ? 'w-14 h-14' : 'w-14 h-14'}`}>
              <img src="logo.png" alt="Asserra Logo" className={`relative z-10 drop-shadow-2xl transition-all duration-300 w-full h-full object-contain`} />
            </div>
            {!isSidebarCollapsed && (
              <div className="text-left">
                <h1 className="text-2xl font-black text-white tracking-tighter text-glow">Asserra</h1>
                <p className="text-[10px] text-brand-primary font-black uppercase tracking-[0.2em] opacity-80">Smart Wealth</p>
              </div>
            )}
          </button>
        </div>

        {!isSidebarCollapsed && (
          <>
            <div className="px-6 py-4">
              <div className="bg-white/5 border border-white/10 rounded-[2rem] p-4 flex flex-col gap-4 overflow-hidden relative group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-brand-soft flex items-center justify-center text-brand-primary shadow-lg flex-shrink-0">
                    <i className="fas fa-crown"></i>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{displayName || 'Investor'}</p>
                    <p className="text-[9px] text-brand-primary font-black uppercase tracking-widest">{t('premium')}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 justify-between">
                  <Link 
                    to="/profile" 
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-brand-primary/20 hover:text-white transition-all rounded-xl text-slate-400"
                    title={t('account')}
                  >
                    <i className="fas fa-user-gear text-sm"></i>
                    <span className="text-[10px] font-black uppercase tracking-widest">{t('settings_title')}</span>
                  </Link>
                  
                  <button 
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="flex-shrink-0 w-12 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 text-slate-400 transition-all rounded-xl border border-white/5"
                    title={isDarkMode ? t('theme_light') : t('theme_dark')}
                  >
                    <i className={`fas ${isDarkMode ? 'fa-sun text-amber-400' : 'fa-moon text-brand-primary'}`}></i>
                  </button>
                </div>
              </div>
            </div>
            
            <nav className="flex-1 px-6 mt-2 space-y-2 overflow-y-auto custom-scrollbar">
              <SidebarLink to="/" icon="fa-th-large" labelKey="dashboard" onClick={() => setIsSidebarOpen(false)} collapsed={false} />
              <SidebarLink to="/assets" icon="fa-briefcase" labelKey="portfolio" onClick={() => setIsSidebarOpen(false)} collapsed={false} />
              <SidebarLink to="/budget" icon="fa-wallet" labelKey="budget_nav" onClick={() => setIsSidebarOpen(false)} collapsed={false} />
              
              {hasAssetType(AssetType.CRYPTO) && <SidebarLink to="/crypto" icon="fa-bitcoin-sign" labelKey="crypto" onClick={() => setIsSidebarOpen(false)} collapsed={false} />}
              {hasAssetType(AssetType.P2P) && <SidebarLink to="/p2p" icon="fa-handshake" labelKey="p2p" onClick={() => setIsSidebarOpen(false)} collapsed={false} />}
              {hasAssetType(AssetType.REAL_ESTATE) && <SidebarLink to="/real-estate" icon="fa-house-chimney" labelKey="real_estate_nav" onClick={() => setIsSidebarOpen(false)} collapsed={false} />}
              {hasAssetType(AssetType.DEBT) && <SidebarLink to="/debt" icon="fa-file-invoice-dollar" labelKey="debt_nav" onClick={() => setIsSidebarOpen(false)} collapsed={false} />}
              
              <SidebarLink to="/goals" icon="fa-bullseye" labelKey="goals" onClick={() => setIsSidebarOpen(false)} collapsed={false} />
              <SidebarLink to="/advisor" icon="fa-robot" labelKey="advisor" onClick={() => setIsSidebarOpen(false)} collapsed={false} />
            </nav>
          </>
        )}
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 p-4 z-[70] flex items-center justify-between bg-brand-dark/90 backdrop-blur-md border-b border-white/5">
        <button onClick={handleLogoClick} className="flex items-center gap-3">
           <div className="w-8 h-8 logo-gradient rounded-lg p-1 shadow-lg">
             <img src="logo.png" alt="Logo" className="w-full h-full object-contain" />
           </div>
           <span className="font-black text-white tracking-tighter">Asserra</span>
        </button>
      </div>

      <main className={`flex-1 overflow-y-auto lg:rounded-l-[2.5rem] shadow-2xl mt-16 lg:mt-0 transition-all duration-700 ${!isSetupComplete ? 'blur-xl opacity-30 pointer-events-none scale-95' : ''} ${
        isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-brand-light text-slate-900'
      }`}>
        <div className="p-4 md:p-10 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard assets={assets} budget={budget} goals={goals} onSync={handleSyncAll} isSyncing={isSyncing} onAddAsset={addAsset} onUpdateAsset={updateAsset} onDeleteAsset={deleteAsset} />} />
            <Route path="/assets" element={<AssetsPage assets={assets} onUpdateAsset={updateAsset} onAddAsset={addAsset} onDeleteAsset={deleteAsset} onSync={handleSyncAll} isSyncing={isSyncing} />} />
            <Route path="/budget" element={<BudgetPlanner budget={budget} setBudget={setBudget} />} />
            <Route path="/crypto" element={<CryptoPage assets={assets} onSync={handleSyncAll} isSyncing={isSyncing} onAddAsset={addAsset} />} />
            <Route path="/p2p" element={<P2PLendingPage assets={assets} onAddAsset={addAsset} onUpdateAsset={updateAsset} onDeleteAsset={deleteAsset} />} />
            <Route path="/real-estate" element={<RealEstatePage assets={assets} onAddAsset={addAsset} onUpdateAsset={updateAsset} onDeleteAsset={deleteAsset} />} />
            <Route path="/debt" element={<DebtPage assets={assets} onAddAsset={addAsset} onUpdateAsset={updateAsset} onDeleteAsset={deleteAsset} />} />
            <Route path="/goals" element={<GoalsPage goals={goals} onUpdateGoal={updateGoal} onAddGoal={addGoal} />} />
            <Route path="/advisor" element={<AIAdvisor assets={assets} />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

const WrappedApp = () => (
  <Router>
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  </Router>
);

export default WrappedApp;
