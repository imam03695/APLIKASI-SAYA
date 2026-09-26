import React from 'react';
import { useApp } from '../context/AppContext';
import { Wifi, UserCheck, ShieldAlert, FileText, BellRing, PhoneCall } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentView, setCurrentView, customers, selectedCustomerId, setSelectedCustomerId, activeCustomer, invoices } = useApp();

  const unpaidCount = invoices.filter(i => i.status === 'unpaid' || i.status === 'overdue' || i.status === 'isolated').length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('landing')}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
                <Wifi className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-slate-900 block leading-tight">
                  NetWarga
                </span>
                <span className="text-[11px] font-medium text-emerald-700 tracking-wide block">
                  RT 01–05 / RW 07
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation views */}
          <nav className="flex items-center p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setCurrentView('landing')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
                currentView === 'landing'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Pendaftaran Baru</span>
            </button>

            <button
              onClick={() => setCurrentView('customer')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
                currentView === 'customer'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Portal Pelanggan</span>
              {activeCustomer && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse hidden sm:inline-block" />
              )}
            </button>

            <button
              onClick={() => setCurrentView('admin')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
                currentView === 'admin'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin & WhatsApp</span>
              {unpaidCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold bg-amber-100 text-amber-800 rounded">
                  {unpaidCount}
                </span>
              )}
            </button>
          </nav>

          {/* Zone 3: Actions & customer switcher */}
          <div className="flex items-center gap-3">
            {currentView === 'customer' ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 hidden md:inline">Akun:</span>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-300 text-slate-800 rounded-md px-2.5 py-1.5 font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none cursor-pointer max-w-[170px] truncate"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.houseNumber})
                    </option>
                  ))}
                </select>
              </div>
            ) : currentView === 'admin' ? (
              <div className="flex items-center gap-2">
                <div className="hidden lg:flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Mikrotik Core Online</span>
                </div>
                <a
                  href="https://wa.me/6281234567890?text=Halo%20Admin%20NetWarga"
                  target="_blank"
                  rel="noreferrer"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-100/70 hover:bg-emerald-100 rounded-md transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call NOC</span>
                </a>
              </div>
            ) : (
              <button
                onClick={() => setCurrentView('landing')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm"
              >
                <span>Cek Coverage RT</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
