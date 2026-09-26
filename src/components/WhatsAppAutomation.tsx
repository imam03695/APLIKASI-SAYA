import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WhatsAppTemplate, ReminderLog } from '../types';
import {
  MessageSquare,
  Send,
  Zap,
  CheckCircle2,
  Clock,
  Settings,
  Smartphone,
  ExternalLink,
  RotateCcw,
  CheckCheck,
  AlertTriangle
} from 'lucide-react';

export const WhatsAppAutomation: React.FC = () => {
  const {
    templates,
    updateTemplate,
    invoices,
    customers,
    packages,
    reminderLogs,
    runBatchReminderAutoCheck,
    sendWhatsAppReminder
  } = useApp();

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tpl-h3');
  const [editedContent, setEditedContent] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [batchRunning, setBatchRunning] = useState(false);
  const [batchResult, setBatchResult] = useState<{ count: number } | null>(null);
  const [logFilter, setLogFilter] = useState<'all' | 'due_date' | 'overdue' | 'payment_success'>('all');

  const activeTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];

  // Initialize editedContent when activeTemplate changes
  React.useEffect(() => {
    if (activeTemplate) {
      setEditedContent(activeTemplate.content);
    }
  }, [selectedTemplateId]);

  const handleSaveTemplate = () => {
    updateTemplate(activeTemplate.id, editedContent, activeTemplate.isEnabled);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleToggleEnable = () => {
    updateTemplate(activeTemplate.id, editedContent, !activeTemplate.isEnabled);
  };

  const handleRunBatch = () => {
    setBatchRunning(true);
    setBatchResult(null);

    setTimeout(() => {
      const res = runBatchReminderAutoCheck();
      setBatchRunning(false);
      setBatchResult({ count: res.processedCount });
    }, 1200);
  };

  // Preview replacement using sample customer
  const sampleCustomer = customers[0] || {
    name: 'Bpk. Hendra Gunawan',
    customerCode: 'NW-RT02-001',
    address: 'Jl. Flamboyan Blok B3 No. 12',
    rt: '02',
    rw: '07'
  };
  const samplePkg = packages[1] || { name: 'Paket Keluarga Ceria', speedMbps: 30 };

  const renderedPreview = editedContent
    .replace(/{nama}/g, sampleCustomer.name)
    .replace(/{id_pelanggan}/g, sampleCustomer.customerCode)
    .replace(/{paket}/g, `${samplePkg.name} (${samplePkg.speedMbps} Mbps)`)
    .replace(/{periode}/g, 'September 2026')
    .replace(/{nominal}/g, 'Rp 175.000')
    .replace(/{jatuh_tempo}/g, '10 September 2026')
    .replace(/{alamat}/g, `${sampleCustomer.address}, RT ${sampleCustomer.rt}/RW ${sampleCustomer.rw}`)
    .replace(/{link_portal}/g, window.location.origin || 'https://netwarga.rt07.id')
    .replace(/{no_kuitansi}/g, 'INV-202609-001')
    .replace(/{metode_bayar}/g, 'QRIS (GOPAY)')
    .replace(/{waktu_bayar}/g, '08 Sep 2026 14:22')
    .replace(/{kecepatan}/g, `${samplePkg.speedMbps} Mbps`)
    .replace(/{link_kuitansi}/g, `${window.location.origin}/invoice/INV-202609-001`);

  const filteredLogs = reminderLogs.filter(log => {
    if (logFilter === 'all') return true;
    return log.type === logFilter;
  });

  return (
    <div className="space-y-8">
      {/* Top Banner: Auto-reminder status & Instant Trigger */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-emerald-800/40">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Zap className="w-4 h-4" />
              <span>SISTEM NOTIFIKASI OTOMATIS WHATSAPP (BOT REMINDER)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">
              Pengingat Tagihan &amp; Notifikasi Jatuh Tempo Warga
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Sistem secara otomatis menjadwalkan dan mengirimkan pesan WhatsApp ke nomor warga: H-3 sebelum jatuh tempo, hari-H jatuh tempo, dan peringatan keterlambatan.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={handleRunBatch}
              disabled={batchRunning}
              className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              {batchRunning ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Memindai &amp; Mengirim...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Jalankan Auto-Reminder Hari Ini</span>
                </>
              )}
            </button>
          </div>
        </div>

        {batchResult && (
          <div className="mt-4 p-3 bg-emerald-800/40 border border-emerald-600/50 rounded-xl text-xs text-emerald-200 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Berhasil memindai seluruh tagihan! Sebanyak <strong>{batchResult.count} pesan pengingat WhatsApp</strong> telah dikirimkan ke warga yang belum bayar.
            </span>
          </div>
        )}
      </div>

      {/* Grid: Templates Configuration & Live WhatsApp Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Template Selector & Editor */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Settings className="w-4 h-4 text-emerald-600" />
                <span>Pilih &amp; Kustomisasi Pesan WhatsApp</span>
              </h3>
              {saveSuccess && (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Tersimpan!
                </span>
              )}
            </div>

            {/* Template Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedTemplateId(tpl.id)}
                  className={`p-2.5 rounded-xl text-left border text-xs font-semibold transition-all ${
                    selectedTemplateId === tpl.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase text-slate-400">
                      {tpl.triggerType}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${tpl.isEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  </div>
                  <div className="truncate">{tpl.title}</div>
                </button>
              ))}
            </div>

            {/* Active Template Settings */}
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="font-bold text-slate-900">{activeTemplate.title}</div>
                  <div className="text-slate-500 text-[11px]">
                    Jadwal Picu: {activeTemplate.daysOffset === 0 ? 'Hari-H Jatuh Tempo' : activeTemplate.daysOffset < 0 ? `${Math.abs(activeTemplate.daysOffset)} Hari Sebelum Jatuh Tempo` : `${activeTemplate.daysOffset} Hari Pasca Jatuh Tempo`}
                  </div>
                </div>

                <button
                  onClick={handleToggleEnable}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTemplate.isEnabled
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {activeTemplate.isEnabled ? 'Aktif Otomatis' : 'Non-Aktif'}
                </button>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Isi Pesan WhatsApp (Mendukung Format *Tebal*, _Miring_, dan Variabel)
                </label>
                <textarea
                  rows={9}
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full text-xs font-mono p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 leading-relaxed"
                />
              </div>

              {/* Dynamic Variables helper badges */}
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                  Klik Variabel untuk Menyisipkan ke Template:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    '{nama}',
                    '{id_pelanggan}',
                    '{paket}',
                    '{nominal}',
                    '{periode}',
                    '{jatuh_tempo}',
                    '{alamat}',
                    '{link_portal}',
                    '{no_kuitansi}'
                  ].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setEditedContent(prev => prev + ' ' + v)}
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 font-mono text-[10px] border border-slate-200 transition-colors"
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveTemplate}
                  className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan Perubahan Template</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Realistic WhatsApp Mobile Preview */}
        <div className="lg:col-span-5">
          <div className="bg-slate-900 rounded-3xl p-4 shadow-xl border border-slate-800">
            {/* Phone header */}
            <div className="bg-emerald-800 text-white rounded-t-2xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                  NW
                </div>
                <div>
                  <div className="font-semibold text-xs leading-tight">NetWarga Official RT 07</div>
                  <div className="text-[10px] text-emerald-200">Akun Bisnis Terverifikasi</div>
                </div>
              </div>
              <Smartphone className="w-4 h-4 text-emerald-200" />
            </div>

            {/* Chat background */}
            <div className="bg-[#efeae2] p-4 min-h-[380px] max-h-[460px] overflow-y-auto space-y-3">
              <div className="text-center">
                <span className="text-[10px] bg-white/80 px-2 py-0.5 rounded shadow-2xs text-slate-500 font-medium">
                  HARI INI
                </span>
              </div>

              {/* Chat bubble */}
              <div className="max-w-[90%] bg-white rounded-lg rounded-tl-none p-3 shadow-xs text-xs text-slate-800 space-y-1.5 relative border border-black/5">
                <div className="whitespace-pre-wrap leading-relaxed text-[11.5px] font-sans">
                  {renderedPreview}
                </div>
                <div className="flex items-center justify-end gap-1 text-[9px] text-slate-400 mt-1">
                  <span>09:00</span>
                  <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                </div>
              </div>
            </div>

            {/* Simulated send button */}
            <div className="p-3 bg-slate-800 rounded-b-2xl flex items-center justify-between text-xs text-slate-400">
              <span>Preview tampilan di layar HP pelanggan</span>
              <button
                onClick={() => {
                  const url = `https://wa.me/6281234567890?text=${encodeURIComponent(renderedPreview)}`;
                  window.open(url, '_blank');
                }}
                className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
              >
                <span>Tes Buka di WA</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Delivery Activity Logs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Log Notifikasi &amp; Riwayat WhatsApp Terkirim</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Daftar seluruh pesan pengingat tagihan dan kuitansi yang telah dikirimkan ke pelanggan.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
            <button
              onClick={() => setLogFilter('all')}
              className={`px-3 py-1 font-medium rounded-md transition-colors ${
                logFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Semua ({reminderLogs.length})
            </button>
            <button
              onClick={() => setLogFilter('due_date')}
              className={`px-3 py-1 font-medium rounded-md transition-colors ${
                logFilter === 'due_date' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Hari-H
            </button>
            <button
              onClick={() => setLogFilter('overdue')}
              className={`px-3 py-1 font-medium rounded-md transition-colors ${
                logFilter === 'overdue' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Overdue
            </button>
            <button
              onClick={() => setLogFilter('payment_success')}
              className={`px-3 py-1 font-medium rounded-md transition-colors ${
                logFilter === 'payment_success' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Kuitansi
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-2.5">Waktu Kirim</th>
                <th className="py-2.5">Penerima</th>
                <th className="py-2.5">No. WhatsApp</th>
                <th className="py-2.5">Kategori Pesan</th>
                <th className="py-2.5">Ringkasan Isi Pesan</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-400">
                    Belum ada riwayat pengiriman notifikasi WhatsApp.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70">
                    <td className="py-3 font-mono text-slate-500 whitespace-nowrap">{log.sentAt}</td>
                    <td className="py-3 font-semibold text-slate-900">{log.customerName}</td>
                    <td className="py-3 font-mono">{log.phone}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.type === 'payment_success'
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.type === 'overdue' || log.type === 'isolated'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {log.type === 'payment_success'
                          ? 'KUITANSI LUNAS'
                          : log.type === 'overdue'
                          ? 'PERINGATAN NUNGGAK'
                          : log.type === 'isolated'
                          ? 'ISOLIR JARINGAN'
                          : 'PENGINGAT JATUH TEMPO'}
                      </span>
                    </td>
                    <td className="py-3 max-w-xs truncate text-slate-600" title={log.message}>
                      {log.message}
                    </td>
                    <td className="py-3">
                      <span className="flex items-center gap-1 text-emerald-600 font-medium">
                        <CheckCheck className="w-3.5 h-3.5" /> Terkirim
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => {
                          let cleanPhone = log.phone.replace(/[^0-9]/g, '');
                          if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.slice(1);
                          window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(log.message)}`, '_blank');
                        }}
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline inline-flex items-center gap-1"
                      >
                        <span>Kirim Ulang</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
