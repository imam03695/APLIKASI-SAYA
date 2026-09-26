import React, { useState } from 'react';
import { Invoice, Customer, InternetPackage } from '../types';
import { BANK_ACCOUNTS } from '../data/initialData';
import { X, QrCode, Building2, CheckCircle2, Copy, Check, UploadCloud, Smartphone } from 'lucide-react';

interface PaymentModalProps {
  invoice: Invoice;
  customer: Customer;
  pkg: InternetPackage;
  onClose: () => void;
  onConfirm: (method: Invoice['paymentMethod'], refNumber?: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  invoice,
  customer,
  pkg,
  onClose,
  onConfirm
}) => {
  const [tab, setTab] = useState<'qris' | 'bank' | 'confirm'>('qris');
  const [copiedBank, setCopiedBank] = useState<string | null>(null);
  const [refNumber, setRefNumber] = useState(`REF-${Math.floor(100000 + Math.random() * 900000)}`);
  const [selectedBank, setSelectedBank] = useState<'bca' | 'bri' | 'mandiri' | 'dana'>('bca');
  const [isSimulatingUpload, setIsSimulatingUpload] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleCopy = (text: string, bank: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(bank);
    setTimeout(() => setCopiedBank(null), 2000);
  };

  const handleSimulatePayment = (method: Invoice['paymentMethod']) => {
    setIsSimulatingUpload(true);
    setTimeout(() => {
      setIsSimulatingUpload(false);
      setUploadSuccess(true);
      setTimeout(() => {
        onConfirm(method, refNumber);
      }, 800);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block">
            Pembayaran Tagihan RT RW Net
          </span>
          <h3 className="text-xl font-bold text-slate-900">
            {invoice.monthPeriod} — {invoice.invoiceNumber}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Pelanggan: <strong className="text-slate-700">{customer.name}</strong> ({customer.customerCode})
          </p>
        </div>

        {/* Invoice Summary Box */}
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 mb-5 flex items-center justify-between text-xs">
          <div>
            <div className="text-slate-500">Layanan Internet:</div>
            <div className="font-semibold text-slate-800">{pkg.name} ({pkg.speedMbps} Mbps)</div>
          </div>
          <div className="text-right">
            <div className="text-slate-500">Total Pembayaran:</div>
            <div className="text-base font-extrabold text-emerald-700 tabular-nums">
              Rp {invoice.totalAmount.toLocaleString('id-ID')}
            </div>
          </div>
        </div>

        {/* Payment Tabs */}
        <div className="flex border-b border-slate-200 mb-5">
          <button
            onClick={() => setTab('qris')}
            className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              tab === 'qris'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>QRIS Instan</span>
          </button>

          <button
            onClick={() => setTab('bank')}
            className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              tab === 'bank'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Transfer Bank</span>
          </button>

          <button
            onClick={() => setTab('confirm')}
            className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              tab === 'confirm'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Konfirmasi / Bukti</span>
          </button>
        </div>

        {/* Tab 1: QRIS */}
        {tab === 'qris' && (
          <div className="text-center space-y-4">
            <div className="max-w-[240px] mx-auto p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="text-[10px] font-bold text-red-600 mb-1 tracking-wider">QRIS STANDAR NASIONAL</div>
              <div className="text-[11px] font-semibold text-slate-800">NETWARGA RT 07 RW 08</div>
              <div className="text-[9px] text-slate-400 mb-2">NMID: ID1020088991201</div>

              {/* Realistic SVG QR code representation */}
              <div className="bg-slate-900 p-3 rounded-lg mx-auto w-40 h-40 flex flex-col justify-between relative">
                <div className="flex justify-between">
                  <div className="w-8 h-8 bg-white p-1 rounded-sm"><div className="w-full h-full bg-slate-900" /></div>
                  <div className="w-8 h-8 bg-white p-1 rounded-sm"><div className="w-full h-full bg-slate-900" /></div>
                </div>
                {/* Center badge */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-7 h-7 bg-white rounded flex items-center justify-center font-bold text-[9px] text-slate-900 border">
                    NW
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div className="w-8 h-8 bg-white p-1 rounded-sm"><div className="w-full h-full bg-slate-900" /></div>
                  <div className="grid grid-cols-3 gap-0.5 w-7 h-7">
                    <div className="bg-white" /><div className="bg-slate-900" /><div className="bg-white" />
                    <div className="bg-slate-900" /><div className="bg-white" /><div className="bg-white" />
                    <div className="bg-white" /><div className="bg-slate-900" /><div className="bg-slate-900" />
                  </div>
                </div>
              </div>

              <div className="mt-2 text-xs font-bold text-slate-800 tabular-nums">
                Nominal Pas: Rp {invoice.totalAmount.toLocaleString('id-ID')}
              </div>
            </div>

            <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
              Dapat discan dengan BCA Mobile, Livin Mandiri, BRImo, GoPay, DANA, OVO, ShopeePay atau mobile banking apapun.
            </p>

            <button
              onClick={() => handleSimulatePayment('qris')}
              disabled={isSimulatingUpload || uploadSuccess}
              className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {isSimulatingUpload ? (
                <span>Memproses Verifikasi QRIS...</span>
              ) : uploadSuccess ? (
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4" /> Terverifikasi Lunas!</span>
              ) : (
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Saya Sudah Scan &amp; Bayar QRIS</span>
              )}
            </button>
          </div>
        )}

        {/* Tab 2: Transfer Bank */}
        {tab === 'bank' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-600">
              Silakan transfer tepat sebesar <strong className="text-emerald-700">Rp {invoice.totalAmount.toLocaleString('id-ID')}</strong> ke rekening pengurus di bawah ini:
            </p>

            {BANK_ACCOUNTS.map((acc) => (
              <div
                key={acc.bank}
                className="p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{acc.bank}</span>
                    <span className="text-[10px] text-slate-500">a.n {acc.name}</span>
                  </div>
                  <div className="text-sm font-mono font-semibold text-slate-800 tracking-wider mt-0.5">
                    {acc.number}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(acc.number, acc.bank)}
                  className="px-2.5 py-1.5 text-[11px] font-medium rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-1 transition-colors"
                >
                  {copiedBank === acc.bank ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-semibold">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>
            ))}

            <div className="pt-2">
              <button
                onClick={() => setTab('confirm')}
                className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Lanjut Unggah Bukti Transfer</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Konfirmasi / Upload Bukti */}
        {tab === 'confirm' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Metode Pembayaran yang Digunakan
              </label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value as any)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="bca">Transfer Bank BCA</option>
                <option value="bri">Transfer Bank BRI</option>
                <option value="mandiri">Transfer Bank Mandiri</option>
                <option value="dana">DANA / E-Wallet</option>
                <option value="qris">QRIS Standar</option>
                <option value="cash">Tunai ke Pos Ronda RT</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Referensi Transaksi / Nama Pengirim
              </label>
              <input
                type="text"
                value={refNumber}
                onChange={(e) => setRefNumber(e.target.value)}
                placeholder="Contoh: TRF-BCA-98129 atau nama pemilik rekening"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bukti Struk Transfer (Foto / Screenshot)
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <span className="text-xs text-slate-600 font-medium block">
                  Klik untuk pilih screenshot bukti transfer
                </span>
                <span className="text-[10px] text-slate-400">JPG, PNG atau PDF (maks 5MB)</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => handleSimulatePayment(selectedBank)}
                disabled={isSimulatingUpload || uploadSuccess}
                className="flex-1 py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                {isSimulatingUpload ? (
                  <span>Mengirim Bukti...</span>
                ) : uploadSuccess ? (
                  <span className="flex items-center gap-1"><Check className="w-4 h-4" /> Pembayaran Berhasil!</span>
                ) : (
                  <span>Konfirmasi Pembayaran Lunas</span>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-medium"
              >
                Batal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
