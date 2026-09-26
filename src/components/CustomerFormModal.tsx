import React, { useState } from 'react';
import { Customer, InternetPackage } from '../types';
import { X, Check } from 'lucide-react';

interface CustomerFormModalProps {
  customer?: Customer;
  packages: InternetPackage[];
  onClose: () => void;
  onSave: (customerData: any) => void;
}

export const CustomerFormModal: React.FC<CustomerFormModalProps> = ({
  customer,
  packages,
  onClose,
  onSave
}) => {
  const isEditing = !!customer;

  const [formData, setFormData] = useState({
    name: customer?.name || '',
    phone: customer?.phone || '',
    email: customer?.email || '',
    address: customer?.address || '',
    rt: customer?.rt || '02',
    rw: customer?.rw || '07',
    houseNumber: customer?.houseNumber || '',
    packageId: customer?.packageId || packages[1]?.id || 'pkg-30',
    status: customer?.status || 'active',
    monthlyDueDate: customer?.monthlyDueDate || 10,
    ipAddress: customer?.ipAddress || '192.168.10.88',
    pppoeUsername: customer?.pppoeUsername || '',
    odpCode: customer?.odpCode || 'ODP-RT02-01',
    portNumber: customer?.portNumber || 1,
    notes: customer?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Nama dan Nomor WhatsApp wajib diisi');
      return;
    }

    if (isEditing && customer) {
      onSave({
        ...customer,
        ...formData
      });
    } else {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-slate-900 mb-1">
          {isEditing ? 'Ubah Data Pelanggan' : 'Tambah Pelanggan Baru (Manual)'}
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Kelola informasi identitas, paket internet, dan parameter teknis router.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">No. WhatsApp *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Paket Berlangganan</label>
              <select
                value={formData.packageId}
                onChange={(e) => setFormData({ ...formData, packageId: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              >
                {packages.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.speedMbps} Mbps)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">RT</label>
              <select
                value={formData.rt}
                onChange={(e) => setFormData({ ...formData, rt: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="01">RT 01</option>
                <option value="02">RT 02</option>
                <option value="03">RT 03</option>
                <option value="04">RT 04</option>
                <option value="05">RT 05</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">RW</label>
              <input
                type="text"
                disabled
                value="RW 07"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-100 text-slate-600"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">No. Rumah / Blok</label>
              <input
                type="text"
                required
                value={formData.houseNumber}
                onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Alamat Jalan</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Contoh: Jl. Flamboyan Blok B2 No. 10"
              className="w-full px-3 py-2 rounded-lg border border-slate-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tgl Jatuh Tempo</label>
              <select
                value={formData.monthlyDueDate}
                onChange={(e) => setFormData({ ...formData, monthlyDueDate: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value={5}>Tanggal 05 Tiap Bulan</option>
                <option value={10}>Tanggal 10 Tiap Bulan</option>
                <option value={15}>Tanggal 15 Tiap Bulan</option>
                <option value={20}>Tanggal 20 Tiap Bulan</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status Akun</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="active">Aktif (Normal)</option>
                <option value="isolated">Terisolir (Tunggakan)</option>
                <option value="pending_survey">Jadwal Pasang</option>
                <option value="inactive">Non-Aktif</option>
              </select>
            </div>
          </div>

          {/* Technical Section */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
              Konfigurasi Teknis Jaringan (NOC)
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1">ODP Box</label>
                <input
                  type="text"
                  value={formData.odpCode}
                  onChange={(e) => setFormData({ ...formData, odpCode: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Port ODP # (1-8)</label>
                <input
                  type="number"
                  min={1}
                  max={16}
                  value={formData.portNumber}
                  onChange={(e) => setFormData({ ...formData, portNumber: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-600 mb-1">IP Address ONT</label>
              <input
                type="text"
                value={formData.ipAddress}
                onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded border border-slate-300 font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Data</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
