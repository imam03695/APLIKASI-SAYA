import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Customer, Invoice } from '../types';
import { WhatsAppAutomation } from './WhatsAppAutomation';
import { CustomerFormModal } from './CustomerFormModal';
import { InvoiceReceiptModal } from './InvoiceReceiptModal';
import {
  CreditCard,
  Users,
  MessageSquare,
  BarChart3,
  Search,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  Phone,
  PowerOff,
  Check,
  Download,
  Filter,
  ArrowUpRight,
  Shield,
  Layers,
  FileSpreadsheet
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    customers,
    packages,
    invoices,
    financeSummary,
    confirmPayment,
    toggleCustomerIsolation,
    sendWhatsAppReminder,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    createMonthlyInvoices
  } = useApp();

  const [activeTab, setActiveTab] = useState<'monitoring' | 'customers' | 'whatsapp' | 'finance'>('monitoring');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'unpaid' | 'overdue' | 'isolated'>('all');
  const [rtFilter, setRtFilter] = useState<string>('all');
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewingReceiptInvoice, setViewingReceiptInvoice] = useState<Invoice | null>(null);
  const [confirmInvoiceAction, setConfirmInvoiceAction] = useState<{ id: string; name: string } | null>(null);

  // Month period invoices (default current: September 2026)
  const currentMonthInvoices = invoices.filter(i => i.monthPeriod.includes('September 2026'));

  // Filtering invoices for real-time monitoring
  const filteredInvoices = currentMonthInvoices.filter(inv => {
    const cust = customers.find(c => c.id === inv.customerId);
    if (!cust) return false;

    // Search query match
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      cust.name.toLowerCase().includes(q) ||
      cust.customerCode.toLowerCase().includes(q) ||
      cust.phone.includes(q) ||
      inv.invoiceNumber.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    // Status filter
    if (statusFilter !== 'all' && inv.status !== statusFilter) return false;

    // RT filter
    if (rtFilter !== 'all' && cust.rt !== rtFilter) return false;

    return true;
  });

  // Filtering customers list
  const filteredCustomers = customers.filter(c => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(q) ||
      c.customerCode.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.address.toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (rtFilter !== 'all' && c.rt !== rtFilter) return false;
    return true;
  });

  const handleSendWA = (invoiceId: string, type: 'due_date' | 'overdue' | 'h-3') => {
    const result = sendWhatsAppReminder(invoiceId, type);
    window.open(result.waLink, '_blank');
  };

  const handleExportCSV = () => {
    const headers = ['No Invoice', 'Kode Pelanggan', 'Nama Warga', 'No HP/WA', 'RT', 'RW', 'Paket', 'Nominal', 'Jatuh Tempo', 'Status', 'Tgl Bayar', 'Metode'];
    const rows = currentMonthInvoices.map(inv => {
      const cust = customers.find(c => c.id === inv.customerId);
      const pkg = packages.find(p => p.id === cust?.packageId);
      return [
        inv.invoiceNumber,
        cust?.customerCode || '',
        `"${cust?.name || ''}"`,
        cust?.phone || '',
        cust?.rt || '',
        cust?.rw || '',
        pkg?.name || '',
        inv.totalAmount,
        inv.dueDate,
        inv.status,
        inv.paymentDate || '',
        inv.paymentMethod || ''
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Iuran_NetWarga_September_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Admin Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>PANEL PENGELOLA RT RW NET</span>
                <span aria-hidden="true">·</span>
                <span>PERIODE SEPTEMBER 2026</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                Dashboard Manajemen &amp; Monitoring Pembayaran
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => createMonthlyInvoices('Oktober 2026', 2026, 10)}
                className="px-3.5 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Generate tagihan bulan depan untuk semua pelanggan aktif"
              >
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                <span>Terbitkan Tagihan Baru</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Ekspor Rekap Kas (CSV)</span>
              </button>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-2 mt-6 border-b border-slate-200 -mb-5 pb-px overflow-x-auto">
            <button
              onClick={() => setActiveTab('monitoring')}
              className={`pb-3.5 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'monitoring'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Monitoring Pembayaran Real-Time</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700">
                {currentMonthInvoices.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`pb-3.5 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'customers'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Data Pelanggan &amp; ONT</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700">
                {customers.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`pb-3.5 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'whatsapp'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Auto-Reminder WhatsApp</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                Otomatis
              </span>
            </button>

            <button
              onClick={() => setActiveTab('finance')}
              className={`pb-3.5 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'finance'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Pembukuan &amp; Kas Warga</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Real-time KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="text-slate-500 text-xs font-semibold mb-1">Target Tagihan Bulan Ini</div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              Rp {financeSummary.totalExpectedRevenue.toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
              <span>Total {currentMonthInvoices.length} unit rumah tercover</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="text-slate-500 text-xs font-semibold mb-1">Iuran Berhasil Terkumpul</div>
            <div className="text-2xl font-extrabold text-emerald-600 font-mono tabular-nums">
              Rp {financeSummary.totalCollectedRevenue.toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-emerald-700 mt-2 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{financeSummary.collectionRate}% kolektibilitas ({financeSummary.paidCount} warga lunas)</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="text-slate-500 text-xs font-semibold mb-1">Tunggakan / Belum Bayar</div>
            <div className="text-2xl font-extrabold text-amber-600 font-mono tabular-nums">
              Rp {financeSummary.totalOverdueAmount.toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-amber-700 mt-2 flex items-center gap-1 font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{financeSummary.overdueCount} warga lewat jatuh tempo</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="text-slate-500 text-xs font-semibold mb-1">Status Koneksi MikroTik</div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              {customers.filter(c => c.status === 'active').length} <span className="text-sm font-normal text-slate-500">Aktif</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
              <span className="text-red-600 font-semibold">{financeSummary.isolatedCount} Akun Terisolir</span>
              <span className="text-slate-400">Core Uptime 99.8%</span>
            </div>
          </div>
        </div>

        {/* TAB 1: REAL-TIME MONITORING */}
        {activeTab === 'monitoring' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Tabel Monitoring Status Pembayaran Warga
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update real-time status pembayaran, tindakan konfirmasi 1-klik, dan pengingat WhatsApp.
                </p>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Cari nama / kode / WA..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 w-44 sm:w-56 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="all">Semua Status</option>
                  <option value="paid">Lunas</option>
                  <option value="unpaid">Belum Bayar</option>
                  <option value="overdue">Lewat Jatuh Tempo</option>
                  <option value="isolated">Terisolir</option>
                </select>

                <select
                  value={rtFilter}
                  onChange={(e) => setRtFilter(e.target.value)}
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="all">Semua RT</option>
                  <option value="01">RT 01</option>
                  <option value="02">RT 02</option>
                  <option value="03">RT 03</option>
                  <option value="04">RT 04</option>
                  <option value="05">RT 05</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/60">
                    <th className="py-3 px-3">Kode &amp; Warga</th>
                    <th className="py-3 px-3">Alamat / RT</th>
                    <th className="py-3 px-3">Paket Bandwidth</th>
                    <th className="py-3 px-3">Nominal</th>
                    <th className="py-3 px-3">Jatuh Tempo</th>
                    <th className="py-3 px-3">Status Bayar</th>
                    <th className="py-3 px-3 text-right">Tindakan Cepat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        Tidak ada data tagihan yang sesuai dengan filter pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map((inv) => {
                      const cust = customers.find(c => c.id === inv.customerId);
                      if (!cust) return null;
                      const pkg = packages.find(p => p.id === cust.packageId);

                      const isPaid = inv.status === 'paid';
                      const isOverdue = inv.status === 'overdue';
                      const isIsolated = inv.status === 'isolated';

                      return (
                        <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900">{cust.name}</div>
                            <div className="flex items-center gap-1 font-mono text-[11px] text-slate-500">
                              <span>{cust.customerCode}</span>
                              <span aria-hidden="true">·</span>
                              <span>{cust.phone}</span>
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <div className="text-slate-800">{cust.houseNumber}</div>
                            <div className="text-[11px] text-slate-500">RT {cust.rt} / RW {cust.rw}</div>
                          </td>

                          <td className="py-3 px-3">
                            <span className="font-semibold text-slate-900 block">{pkg?.name}</span>
                            <span className="text-[11px] text-slate-500 font-mono">{pkg?.speedMbps} Mbps FTTH</span>
                          </td>

                          <td className="py-3 px-3 font-mono font-bold text-slate-900 tabular-nums">
                            Rp {inv.totalAmount.toLocaleString('id-ID')}
                          </td>

                          <td className="py-3 px-3">
                            <span className="font-medium">{inv.dueDate}</span>
                            {inv.paymentDate && (
                              <span className="block text-[10px] text-emerald-600 font-medium">
                                Lunas: {inv.paymentDate.split(' ')[0]}
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-3">
                            {isPaid ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                                <CheckCircle2 className="w-3 h-3" /> LUNAS
                              </span>
                            ) : isIsolated ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800">
                                <PowerOff className="w-3 h-3" /> TERISOLIR
                              </span>
                            ) : isOverdue ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800">
                                <AlertTriangle className="w-3 h-3" /> NUNGGAK
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                                <Clock className="w-3 h-3" /> BELUM BAYAR
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* WhatsApp Reminder Button */}
                              {!isPaid ? (
                                <button
                                  type="button"
                                  onClick={() => handleSendWA(inv.id, isOverdue ? 'overdue' : 'due_date')}
                                  title="Kirim pengingat WhatsApp langsung ke nomor warga"
                                  className="px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-[11px] flex items-center gap-1 border border-emerald-200 transition-colors"
                                >
                                  <Send className="w-3 h-3" />
                                  <span>WA Reminder</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSendWA(inv.id, 'payment_success' as any)}
                                  title="Kirim kuitansi lunas via WhatsApp"
                                  className="px-2 py-1 rounded-md text-slate-500 hover:text-emerald-700 text-[11px] flex items-center gap-1 transition-colors"
                                >
                                  <Send className="w-3 h-3" />
                                  <span>Kuitansi WA</span>
                                </button>
                              )}

                              {/* Action: Mark as Paid */}
                              {!isPaid ? (
                                <button
                                  type="button"
                                  onClick={() => confirmPayment(inv.id, 'cash')}
                                  className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[11px] flex items-center gap-1 transition-colors"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>Tandai Lunas</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setViewingReceiptInvoice(inv)}
                                  className="px-2.5 py-1 rounded-md border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-[11px] transition-colors"
                                >
                                  Kuitansi
                                </button>
                              )}

                              {/* Toggle Isolate Router */}
                              <button
                                type="button"
                                onClick={() => toggleCustomerIsolation(cust.id)}
                                title={cust.status === 'isolated' ? 'Aktifkan kembali internet di MikroTik' : 'Isolir koneksi internet di MikroTik'}
                                className={`p-1 rounded-md transition-colors ${
                                  cust.status === 'isolated'
                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                    : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                                }`}
                              >
                                <PowerOff className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: DATA PELANGGAN & ONT */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Daftar Pelanggan Terdaftar &amp; Port ODP
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Kelola data pelanggan, informasi IP ONT, akun PPPoE, dan titik distribusi kabel fiber optik.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Pelanggan</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/60">
                    <th className="py-3 px-3">Kode Pelanggan</th>
                    <th className="py-3 px-3">Nama Warga</th>
                    <th className="py-3 px-3">WhatsApp</th>
                    <th className="py-3 px-3">Alamat</th>
                    <th className="py-3 px-3">Paket</th>
                    <th className="py-3 px-3">ODP Box / Port</th>
                    <th className="py-3 px-3">IP Address</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Kelola</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredCustomers.map((cust) => {
                    const pkg = packages.find(p => p.id === cust.packageId);
                    return (
                      <tr key={cust.id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-3 font-mono font-bold text-emerald-800">{cust.customerCode}</td>
                        <td className="py-3 px-3 font-semibold text-slate-900">{cust.name}</td>
                        <td className="py-3 px-3 font-mono">{cust.phone}</td>
                        <td className="py-3 px-3">{cust.houseNumber}, RT {cust.rt}/RW {cust.rw}</td>
                        <td className="py-3 px-3 font-medium text-slate-800">{pkg?.name} ({pkg?.speedMbps} Mbps)</td>
                        <td className="py-3 px-3 font-mono text-[11px]">{cust.odpCode} #{cust.portNumber}</td>
                        <td className="py-3 px-3 font-mono text-[11px]">{cust.ipAddress}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            cust.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : cust.status === 'isolated'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {cust.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingCustomer(cust)}
                              className="px-2 py-1 rounded text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => toggleCustomerIsolation(cust.id)}
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                cust.status === 'isolated'
                                  ? 'bg-red-600 text-white'
                                  : 'text-red-600 hover:bg-red-50'
                              }`}
                            >
                              {cust.status === 'isolated' ? 'Buka Isolir' : 'Isolir'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: WHATSAPP AUTOMATION */}
        {activeTab === 'whatsapp' && (
          <WhatsAppAutomation />
        )}

        {/* TAB 4: PEMBUKUAN & LAPORAN KAS */}
        {activeTab === 'finance' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Laporan Arus Kas RT RW Net (Bulan September 2026)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Transparansi keuangan swadaya warga untuk biaya uplink bandwidth grosir, listrik posko, dan kas perbaikan kabel.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-semibold block mb-1">Total Pemasukan Iuran:</span>
                <span className="text-xl font-bold font-mono text-emerald-700 tabular-nums">
                  Rp {financeSummary.totalCollectedRevenue.toLocaleString('id-ID')}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">Dari {financeSummary.paidCount} pembayaran terkonfirmasi</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-semibold block mb-1">Estimasi Biaya Uplink ISP Grosir:</span>
                <span className="text-xl font-bold font-mono text-slate-800 tabular-nums">
                  Rp 650.000
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">Dedicated bandwidth 500 Mbps ke router core</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-semibold block mb-1">Saldo Kas Kas Lingkungan:</span>
                <span className="text-xl font-bold font-mono text-blue-700 tabular-nums">
                  Rp {Math.max(0, financeSummary.totalCollectedRevenue - 650000).toLocaleString('id-ID')}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">Untuk cadangan perbaikan kabel dropcore & ODP</span>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={handleExportCSV}
                className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-2 transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Laporan Lengkap (.CSV)</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <CustomerFormModal
          packages={packages}
          onClose={() => setShowAddModal(false)}
          onSave={(custData) => {
            addCustomer(custData);
            setShowAddModal(false);
          }}
        />
      )}

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <CustomerFormModal
          customer={editingCustomer}
          packages={packages}
          onClose={() => setEditingCustomer(null)}
          onSave={(updated) => {
            updateCustomer(updated);
            setEditingCustomer(null);
          }}
        />
      )}

      {/* Receipt Modal */}
      {viewingReceiptInvoice && (
        <InvoiceReceiptModal
          invoice={viewingReceiptInvoice}
          customer={customers.find(c => c.id === viewingReceiptInvoice.customerId)!}
          pkg={packages.find(p => p.id === customers.find(c => c.id === viewingReceiptInvoice.customerId)?.packageId)!}
          onClose={() => setViewingReceiptInvoice(null)}
        />
      )}
    </div>
  );
};
