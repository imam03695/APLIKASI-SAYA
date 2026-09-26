import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { RegistrationView } from './components/RegistrationView';
import { CustomerPortal } from './components/CustomerPortal';
import { AdminDashboard } from './components/AdminDashboard';

const MainContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <main className="min-h-[calc(100vh-64px)]">
      {currentView === 'landing' && <RegistrationView />}
      {currentView === 'customer' && <CustomerPortal />}
      {currentView === 'admin' && <AdminDashboard />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-emerald-500/20 selection:text-emerald-900">
        <Header />
        <MainContent />
        <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 print:hidden">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <strong className="text-slate-700">NetWarga</strong> · Sistem Informasi RT RW Net Swadaya RT 01–05 RW 07
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-400">
              <span>FTTH GPON Network</span>
              <span>·</span>
              <span>WhatsApp Bot Scheduler</span>
              <span>·</span>
              <span>Layanan 24/7</span>
            </div>
          </div>
        </footer>
      </div>
    </AppProvider>
  );
}
