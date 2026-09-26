import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PaymentModal } from './PaymentModal';
import { InvoiceReceiptModal } from './InvoiceReceiptModal';
import { SpeedTestModal } from './SpeedTestModal';
import { Invoice, Ticket } from '../types';
import {
  Wifi,
  AlertTriangle,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  Activity,
  PhoneCall,
  Send,
  Zap,
  ShieldCheck,
  LifeBuoy
} from 'lucide-react';

export const CustomerPortal: React.FC = () => {
  const {
    activeCustomer,
    customers,
    setSelectedCustomerId,
    packages,
    invoices,
    tickets,
    confirmPayment,
    createTicket
  } = useApp();

  const [activePaymentInvoice, setActivePaymentInvoice] = useState<Invoice | null>(null);
  const [activeReceiptInvoice, setActiveReceiptInvoice] = useState<Invoice | null>(null);
  const [showSpeedTest, setShowSpeedTest] = useState(false);

  // New ticket state
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState<Ticket['category']>('los_red_light');
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketSentSuccess, setTicketSentSuccess] = useState(false);

  if (!activeCustomer) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Pelanggan Tidak Ditemukan</h2>
        <p className="text-xs text-slate-500 mt-2">Silakan pilih akun pelanggan dari daftar di atas.</p>
      </div>
    );
  }

  const pkg = packages.find(p => p.id === activeCustomer.packageId) || packages[1];
  const customerInvoices = invoices.filter(i => i.customerId === activeCustomer.id);
  const activeInvoice = customerInvoices.find(i => i.monthPeriod.includes('September 2026')) || customerInvoices[0];
  const customerTickets = tickets.filter(t => t.customerId === activeCustomer.id);

  const isIsolated = activeCustomer.status === 'isolated';
  const isPaid = activeInvoice?.status === 'paid';

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketDesc) return;
    createTicket(activeCustomer.id, ticketSubject, ticketCategory, ticketDesc);
    setTicketSubject('');
    setTicketDesc('');
    setTicketSentSuccess(true);
    setTimeout(() => setTicketSentSuccess(false), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Customer Info Strip */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {activeCustomer.customerCode}
                </span>
                <span aria-hidden="true">·</span>
                <span>RT {activeCustomer.rt} / RW {activeCustomer.rw}</span>
                <span aria-hidden="true">·</span>
                <span>{activeCustomer.address}</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                Halo, {activeCustomer.name} 👋
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                Paket Aktif: <strong className="text-slate-800">{pkg.name}</strong> ({pkg.speedMbps} Mbps FTTH)
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowSpeedTest(true)}
                className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Uji Kecepatan Internet</span>
              </button>

              <a
                href="https://wa.me/6281234567890?text=Halo%20Admin%20NetWarga%2C%20saya%20pelanggan%20ingin%20bertanya"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Hubungi Admin WA</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Left Column: Network & Invoices */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Connection Status Card */}
            <div className={`rounded-2xl p-6 border transition-all ${
              isIsolated
                ? 'bg-red-50/70 border-red-200'
                : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    isIsolated
                      ? 'bg-red-600 text-white'
                      : 'bg-emerald-600 text-white shadow-sm'
                  }`}>
                    {isIsolated ? <AlertTriangle className="w-6 h-6" /> : <Wifi className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-900">
                        {isIsolated ? 'Koneksi Terisolir (Tunggakan Tagihan)' : 'Status Jaringan: Online & Normal'}
                      </h2>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      {isIsolated
                        ? 'Akses internet sementara dibatasi router MikroTik. Segera lunasi tagihan agar aktif kembali otomatis.'
                        : `Terhubung langsung ke ${activeCustomer.odpCode} Port #${activeCustomer.portNumber} via Fiber Optik GPON.`}
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right text-xs shrink-0">
                  <span className="text-slate-500 block">IP ONT / Router:</span>
                  <span className="font-mono font-bold text-slate-800">{activeCustomer.ipAddress}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Uptime: 28 hari 14 jam</span>
                </div>
              </div>
            </div>

            {/* Current Active Invoice Card */}
            {activeInvoice && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block">
                      Tagihan Bulan Berjalan
                    </span>
                    <h3 className="text-xl font-bold text-slate-900">
                      {activeInvoice.monthPeriod}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {isPaid ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        LUNAS
                      </span>
                    ) : activeInvoice.status === 'overdue' || activeInvoice.status === 'isolated' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        LEWAT JATUH TEMPO
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                        <Clock className="w-3.5 h-3.5" />
                        MENUNGGU PEMBAYARAN
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-500 block mb-0.5">No. Invoice:</span>
                      <span className="font-mono font-bold text-slate-800">{activeInvoice.invoiceNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-0.5">Jatuh Tempo:</span>
                      <span className="font-semibold text-slate-800">{activeInvoice.dueDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-0.5">Total Tagihan:</span>
                      <span className="text-lg font-black text-emerald-700 tabular-nums">
                        Rp {activeInvoice.totalAmount.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-slate-500">
                      {isPaid ? (
                        <span>Diverifikasi lunas pada {activeInvoice.paymentDate} via {(activeInvoice.paymentMethod || 'QRIS').toUpperCase()}.</span>
                      ) : (
                        <span>Bayar sebelum tanggal jatuh tempo agar tidak terkena isolir otomatis.</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {!isPaid && (
                        <button
                          onClick={() => setActivePaymentInvoice(activeInvoice)}
                          className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Bayar Sekarang (QRIS / Bank)</span>
                        </button>
                      )}

                      <button
                        onClick={() => setActiveReceiptInvoice(activeInvoice)}
                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        <span>{isPaid ? 'Cetak Kuitansi Resmi' : 'Lihat Invoice'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Riwayat Tagihan Bulanan (Billing History) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-base font-bold text-slate-900 mb-4">
                Riwayat Pembayaran &amp; Invoice
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                      <th className="py-2.5">No. Invoice</th>
                      <th className="py-2.5">Periode</th>
                      <th className="py-2.5">Jatuh Tempo</th>
                      <th className="py-2.5">Jumlah</th>
                      <th className="py-2.5">Status</th>
                      <th className="py-2.5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {customerInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/60">
                        <td className="py-3 font-mono font-medium">{inv.invoiceNumber}</td>
                        <td className="py-3 font-semibold text-slate-900">{inv.monthPeriod}</td>
                        <td className="py-3">{inv.dueDate}</td>
                        <td className="py-3 font-mono font-bold tabular-nums">
                          Rp {inv.totalAmount.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3">
                          {inv.status === 'paid' ? (
                            <span className="text-emerald-700 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Lunas
                            </span>
                          ) : inv.status === 'overdue' || inv.status === 'isolated' ? (
                            <span className="text-red-700 font-semibold flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" /> Nunggak
                            </span>
                          ) : (
                            <span className="text-amber-700 font-semibold flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> Belum Bayar
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => setActiveReceiptInvoice(inv)}
                            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                          >
                            Kuitansi
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right Column: Customer Support Tickets & Info */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Layanan Pengaduan Gangguan (Support Ticket) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <LifeBuoy className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">Lapor Kendala / Tiket</h3>
              </div>

              {ticketSentSuccess && (
                <div className="p-3 mb-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Laporan berhasil dikirim ke teknisi RT RW Net!</span>
                </div>
              )}

              <form onSubmit={handleTicketSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kategori Kendala
                  </label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="los_red_light">Lampu Modem LOS Merah (Kabel Putus)</option>
                    <option value="slow_speed">Internet Lemot / Lambat</option>
                    <option value="frequent_disconnect">Sering Putus-Nyambung</option>
                    <option value="billing">Pertanyaan Tagihan / Invoice</option>
                    <option value="relocation">Pindah Titik Pasang Router</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Judul Pengaduan
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Lampu LOS merah sejak pagi"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Detail Masalah
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Jelaskan kondisi router, lampu indikator, dan kendala yang dialami..."
                    value={ticketDesc}
                    onChange={(e) => setTicketDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Laporan ke Teknisi</span>
                </button>
              </form>

              {/* Existing Tickets for this customer */}
              {customerTickets.length > 0 && (
                <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Riwayat Tiket Pengaduan
                  </span>

                  {customerTickets.map((tkt) => (
                    <div key={tkt.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-slate-500 font-bold">{tkt.ticketNumber}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          tkt.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : tkt.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {tkt.status === 'resolved' ? 'SELESAI' : tkt.status === 'in_progress' ? 'DIPROSES TEKNISI' : 'MENUNGGU'}
                        </span>
                      </div>
                      <div className="font-semibold text-slate-800">{tkt.subject}</div>
                      <div className="text-slate-600 text-[11px]">{tkt.description}</div>
                      {tkt.technicianNotes && (
                        <div className="p-2 rounded bg-white border border-slate-200/80 text-[11px] text-emerald-800 mt-1">
                          <strong>Catatan Teknisi:</strong> {tkt.technicianNotes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Contacts Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
                <span className="font-bold text-sm">Posko Teknisi Warga 24 Jam</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Butuh bantuan darurat saat jaringan internet putus atau perbaikan kabel tiang di lingkungan RT?
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800 text-slate-400">
                  <span>Teknisi Utama:</span>
                  <span className="text-white font-medium">Joko Sutrisno (0812-3456-7890)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800 text-slate-400">
                  <span>Bendahara Kas:</span>
                  <span className="text-white font-medium">Ibu Maya (0857-1122-3344)</span>
                </div>
                <div className="flex justify-between py-1 text-slate-400">
                  <span>Pos Ronda OLT:</span>
                  <span className="text-white font-medium">Balai RT 03 RW 07</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Payment Modal */}
      {activePaymentInvoice && (
        <PaymentModal
          invoice={activePaymentInvoice}
          customer={activeCustomer}
          pkg={pkg}
          onClose={() => setActivePaymentInvoice(null)}
          onConfirm={(method, ref) => {
            confirmPayment(activePaymentInvoice.id, method, ref);
            setActivePaymentInvoice(null);
          }}
        />
      )}

      {/* Invoice Receipt Modal */}
      {activeReceiptInvoice && (
        <InvoiceReceiptModal
          invoice={activeReceiptInvoice}
          customer={activeCustomer}
          pkg={pkg}
          onClose={() => setActiveReceiptInvoice(null)}
        />
      )}

      {/* Speed Test Modal */}
      {showSpeedTest && (
        <SpeedTestModal
          pkg={pkg}
          onClose={() => setShowSpeedTest(false)}
        />
      )}
    </div>
  );
};
