import React from 'react';
import { Invoice, Customer, InternetPackage } from '../types';
import { X, Printer, CheckCircle2, AlertCircle, Wifi, Shield } from 'lucide-react';

interface InvoiceReceiptModalProps {
  invoice: Invoice;
  customer: Customer;
  pkg: InternetPackage;
  onClose: () => void;
}

export const InvoiceReceiptModal: React.FC<InvoiceReceiptModalProps> = ({
  invoice,
  customer,
  pkg,
  onClose
}) => {
  const isPaid = invoice.status === 'paid';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-6 print:shadow-none print:border-none print:m-0">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Invoice Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <Wifi className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">NetWarga Community ISP</h2>
              <p className="text-xs text-slate-500">Jaringan Swadaya Mandiri RT 01-05 RW 07</p>
              <p className="text-[11px] text-slate-400">Sekretariat Posko RT RW Net, Balai Warga</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono font-bold text-slate-800 block">
              {invoice.invoiceNumber}
            </span>
            <span className="text-[11px] text-slate-500 block">
              Tgl Terbit: {invoice.dueDate.slice(0, 7)}-01
            </span>
            <span className="text-[11px] text-slate-500 block">
              Jatuh Tempo: {invoice.dueDate}
            </span>
          </div>
        </div>

        {/* Status Stamp */}
        <div className="flex items-center justify-between mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <span className="text-[11px] text-slate-500 block">Status Pembayaran:</span>
            <div className="flex items-center gap-2 mt-0.5">
              {isPaid ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-base font-bold text-emerald-700 uppercase tracking-wide">
                    LUNAS TERVERIFIKASI
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <span className="text-base font-bold text-amber-700 uppercase tracking-wide">
                    MENUNGGU PEMBAYARAN
                  </span>
                </>
              )}
            </div>
          </div>

          {isPaid && (
            <div className="text-right text-xs">
              <span className="text-slate-500 block">Waktu Bayar:</span>
              <span className="font-mono text-slate-700 font-medium">{invoice.paymentDate}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Metode: {(invoice.paymentMethod || 'QRIS').toUpperCase()} ({invoice.referenceNumber || 'TRF-OK'})
              </span>
            </div>
          )}
        </div>

        {/* Customer Information */}
        <div className="grid grid-cols-2 gap-4 text-xs mb-6 pb-6 border-b border-slate-200">
          <div>
            <span className="text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
              Data Pelanggan
            </span>
            <div className="font-bold text-slate-900 text-sm">{customer.name}</div>
            <div className="text-slate-600">{customer.address}</div>
            <div className="text-slate-600">RT {customer.rt} / RW {customer.rw} (No. {customer.houseNumber})</div>
            <div className="text-slate-600 mt-1">WA: {customer.phone}</div>
          </div>

          <div>
            <span className="text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
              Data Teknis Jaringan
            </span>
            <div className="text-slate-700"><strong className="text-slate-900">ID:</strong> {customer.customerCode}</div>
            <div className="text-slate-700"><strong className="text-slate-900">PPPoE:</strong> {customer.pppoeUsername}</div>
            <div className="text-slate-700"><strong className="text-slate-900">Distribusi:</strong> {customer.odpCode} (Port #{customer.portNumber})</div>
            <div className="text-slate-700"><strong className="text-slate-900">IP:</strong> {customer.ipAddress}</div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="mb-6">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold text-left">
                <th className="py-2">Deskripsi Layanan</th>
                <th className="py-2 text-center">Periode</th>
                <th className="py-2 text-center">Kecepatan</th>
                <th className="py-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3">
                  <div className="font-semibold text-slate-900">{pkg.name}</div>
                  <div className="text-[11px] text-slate-500">Iuran akses internet RT RW Net bulanan</div>
                </td>
                <td className="py-3 text-center">{invoice.monthPeriod}</td>
                <td className="py-3 text-center font-mono font-medium">{pkg.speedMbps} Mbps</td>
                <td className="py-3 text-right font-mono font-bold tabular-nums">
                  Rp {invoice.amount.toLocaleString('id-ID')}
                </td>
              </tr>
              {invoice.discount ? (
                <tr>
                  <td colSpan={3} className="py-2 text-slate-500 text-right">Potongan Warga:</td>
                  <td className="py-2 text-right font-mono text-emerald-600 tabular-nums">
                    -Rp {invoice.discount.toLocaleString('id-ID')}
                  </td>
                </tr>
              ) : null}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-300 font-bold text-slate-900">
                <td colSpan={3} className="py-3 text-right text-xs">Total Pembayaran:</td>
                <td className="py-3 text-right font-mono text-base text-emerald-700 tabular-nums">
                  Rp {invoice.totalAmount.toLocaleString('id-ID')}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer Note */}
        <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 mb-6 flex items-start gap-2 border border-slate-100">
          <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            Kuitansi ini adalah bukti sah pembayaran iuran swadaya internet RT RW Net.
            Dana dikelola secara transparan untuk sewa uplink bandwidth grosir dan pemeliharaan kabel fiber warga.
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Kuitansi Resmi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
