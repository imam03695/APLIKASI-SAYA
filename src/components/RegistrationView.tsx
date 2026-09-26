import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InternetPackage } from '../types';
import { Check, ShieldCheck, Wifi, MapPin, Zap, ArrowRight, Phone, Clock, FileCheck } from 'lucide-react';

const ROUTER_IMAGE = '/src/assets/images/rtrw_net_router_1790398250051.jpg';
const TECHNICIAN_IMAGE = '/src/assets/images/technician_fiber_1790398267894.jpg';

export const RegistrationView: React.FC = () => {
  const { packages, addCustomer, setCurrentView, setSelectedCustomerId } = useApp();

  const [selectedPkgId, setSelectedPkgId] = useState<string>('pkg-30');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    rt: '02',
    rw: '07',
    houseNumber: '',
    address: '',
    notes: '',
    monthlyDueDate: 10
  });

  const [registeredResult, setRegisteredResult] = useState<{
    customerCode: string;
    name: string;
    phone: string;
    customerId: string;
    pkgName: string;
  } | null>(null);

  const selectedPkg = packages.find(p => p.id === selectedPkgId) || packages[1];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.houseNumber) {
      alert('Mohon lengkapi Nama, Nomor WhatsApp, dan Nomor Rumah Anda.');
      return;
    }

    const created = addCustomer({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address || `Jl. Mawar Indah No. ${formData.houseNumber}`,
      rt: formData.rt,
      rw: formData.rw,
      houseNumber: formData.houseNumber,
      packageId: selectedPkgId,
      status: 'pending_survey',
      monthlyDueDate: Number(formData.monthlyDueDate) || 10,
      notes: formData.notes
    });

    setRegisteredResult({
      customerCode: created.customerCode,
      name: created.name,
      phone: created.phone,
      customerId: created.id,
      pkgName: selectedPkg.name
    });
  };

  const handleOpenWAAdmin = () => {
    if (!registeredResult) return;
    const msg = `Halo Admin NetWarga (RT RW Net) 👋\n\nSaya telah melakukan pendaftaran online pasang baru:\n• ID Registrasi: *${registeredResult.customerCode}*\n• Nama: *${registeredResult.name}*\n• No WA: ${registeredResult.phone}\n• Paket: ${registeredResult.pkgName}\n\nMohon konfirmasi jadwal survei lokasi dan pemasangan teknisi. Terima kasih!`;
    const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  const handleGoToPortal = () => {
    if (!registeredResult) return;
    setSelectedCustomerId(registeredResult.customerId);
    setCurrentView('customer');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white border-b border-slate-800">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <img
            src={ROUTER_IMAGE}
            alt="Router WiFi RT RW Net"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>FIBER OPTIC TO THE HOME (FTTH)</span>
                <span aria-hidden="true">·</span>
                <span>LINGKUNGAN RT 01 S/D 05 RW 07</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Internet Warga Cepat, Stabil, & Hemat untuk Seluruh Lingkungan
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Jaringan mandiri RT RW Net resmi dengan kabel fiber optik langsung ke rumah Anda.
                Bebas FUP, kuota tanpa batas, pemantauan pembayaran real-time, dan pengingat jatuh tempo otomatis via WhatsApp.
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% Fiber Optic Simetris</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Teknisi Siaga di Wilayah RT</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Iuran Terbuka & Kas Transparan</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href="#form-pendaftaran"
                  className="px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm transition-all shadow-md inline-flex items-center gap-2"
                >
                  <span>Daftar Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setCurrentView('customer')}
                  className="px-5 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-colors border border-slate-700"
                >
                  Sudah Jadi Pelanggan? Masuk Portal
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-slate-700 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span className="font-semibold text-sm text-slate-200">Cek Coverage Area Aktif</span>
                  </div>
                  <span className="text-xs text-emerald-400 font-mono">100% ONLINE</span>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>RT 01 (Jl. Mawar & Sekitarnya)</span>
                    </div>
                    <span className="text-emerald-400 font-semibold">ODP Siap (4 Port)</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>RT 02 (Jl. Flamboyan Blok B)</span>
                    </div>
                    <span className="text-emerald-400 font-semibold">ODP Siap (6 Port)</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>RT 03 (Jl. Melati & Ruko)</span>
                    </div>
                    <span className="text-emerald-400 font-semibold">ODP Siap (8 Port)</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>RT 04 & RT 05 (Kenanga & Cempaka)</span>
                    </div>
                    <span className="text-emerald-400 font-semibold">ODP Siap (5 Port)</span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-950/40 rounded-lg border border-emerald-800/40 text-xs text-emerald-200 flex items-start gap-2">
                  <Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Promo Warga: Gratis instalasi kabel dropcore s/d 150 meter & gratis peminjaman modem router WiFi.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Package Selection Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 block mb-1">
            Pilihan Paket Berlangganan
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Kecepatan Tinggi, Tarif Terjangkau untuk Warga
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Pilih paket bandwidth sesuai kebutuhan anggota keluarga atau usaha Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg: InternetPackage) => {
            const isSelected = selectedPkgId === pkg.id;
            return (
              <div
                key={pkg.id}
                onClick={() => setSelectedPkgId(pkg.id)}
                className={`cursor-pointer rounded-xl p-6 transition-all border flex flex-col justify-between relative bg-white ${
                  isSelected
                    ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-lg'
                    : 'border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[11px] font-bold py-0.5 px-3 rounded-full shadow-sm">
                    Paling Diminati Warga
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {pkg.speedMbps} Mbps Dedicated
                    </span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-1">{pkg.name}</h3>
                  <p className="text-xs text-slate-600 mb-4 line-clamp-2">{pkg.description}</p>

                  <div className="mb-6 pb-4 border-b border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-900 tabular-nums">
                        Rp {pkg.priceMonthly.toLocaleString('id-ID')}
                      </span>
                      <span className="text-xs text-slate-500">/bulan</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Biaya Pasang: {pkg.installFee === 0 ? 'GRATIS' : `Rp ${pkg.installFee.toLocaleString('id-ID')}`}
                    </div>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600 mb-6">
                    {pkg.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  className={`w-full py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${
                    isSelected
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isSelected ? 'Paket Terpilih ✓' : 'Pilih Paket Ini'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Registration Form Section */}
      <section id="form-pendaftaran" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Formulir Pendaftaran Pasang Baru</h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Data Anda langsung terdaftar ke sistem router & jadwal teknisi RT RW Net.
                </p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3.5 py-2 text-xs text-emerald-800 shrink-0">
                <span className="font-semibold">Paket:</span> {selectedPkg.name} (Rp {selectedPkg.priceMonthly.toLocaleString('id-ID')}/bln)
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nama Lengkap (Kepala Keluarga / Pemilik Rumah) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bpk. Kurniawan Santoso"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-sm px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nomor WhatsApp Aktif (Wajib untuk Pengingat Tagihan) *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="081234567890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-sm px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                  <div className="absolute right-3 top-2.5 text-xs text-slate-400">
                    Format WA
                  </div>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Notifikasi tagihan bulanan dan info pemeliharaan jaringan dikirim ke nomor ini.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Wilayah RT *
                </label>
                <select
                  value={formData.rt}
                  onChange={(e) => setFormData({ ...formData, rt: e.target.value })}
                  className="w-full text-sm px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
                >
                  <option value="01">RT 01 (Jl. Mawar)</option>
                  <option value="02">RT 02 (Jl. Flamboyan)</option>
                  <option value="03">RT 03 (Jl. Melati & Ruko)</option>
                  <option value="04">RT 04 (Jl. Kenanga)</option>
                  <option value="05">RT 05 (Jl. Cempaka Indah)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Wilayah RW
                </label>
                <input
                  type="text"
                  disabled
                  value="RW 07"
                  className="w-full text-sm px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-100 text-slate-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nomor Rumah / Blok *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: B2/14 atau No. 28"
                  value={formData.houseNumber}
                  onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })}
                  className="w-full text-sm px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Alamat Lengkap & Patokan Lokasi Rumah
              </label>
              <textarea
                rows={2}
                placeholder="Misal: Jl. Flamboyan Blok B2 No. 14 (Rumah pagar hitam samping pos ronda)"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full text-sm px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Pilihan Tanggal Jatuh Tempo Tiap Bulan
                </label>
                <select
                  value={formData.monthlyDueDate}
                  onChange={(e) => setFormData({ ...formData, monthlyDueDate: Number(e.target.value) })}
                  className="w-full text-sm px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
                >
                  <option value={10}>Tanggal 10 Setiap Bulan (Rekomendasi Warga)</option>
                  <option value={15}>Tanggal 15 Setiap Bulan</option>
                  <option value={20}>Tanggal 20 Setiap Bulan (Pasca Gajian)</option>
                  <option value={5}>Tanggal 05 Setiap Bulan (Awal Bulan)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email (Opsional untuk kirim invoice digital)
                </label>
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full text-sm px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
            </div>

            {/* Total summary */}
            <div className="rounded-xl p-4 bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="font-semibold text-slate-800">Ringkasan Biaya Awal:</div>
                <div className="text-slate-600 mt-0.5">
                  Iuran Bulan Pertama (Rp {selectedPkg.priceMonthly.toLocaleString('id-ID')}) + Biaya Pasang ({selectedPkg.installFee === 0 ? 'Gratis' : `Rp ${selectedPkg.installFee.toLocaleString('id-ID')}`})
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-500 block">Total Estimasi Awal</span>
                <span className="text-base font-bold text-emerald-700 tabular-nums">
                  Rp {(selectedPkg.priceMonthly + selectedPkg.installFee).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Kirim Pendaftaran & Buat Akun Pelanggan</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Registration Success Modal */}
      {registeredResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 mx-auto">
              <Check className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 text-center mb-2">
              Pendaftaran Berhasil Diterima!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 text-center mb-6">
              Data pelanggan Anda telah masuk ke sistem monitoring RT RW Net. ID Pelanggan unik Anda telah dibuat:
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">ID Pelanggan (Customer Code):</span>
                <span className="font-mono font-bold text-emerald-700 text-sm">{registeredResult.customerCode}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Nama Pelanggan:</span>
                <span className="font-semibold text-slate-800">{registeredResult.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Paket Terpilih:</span>
                <span className="font-semibold text-slate-800">{registeredResult.pkgName}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Status Awal:</span>
                <span className="font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Jadwal Survei & Pasang</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleOpenWAAdmin}
                className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Phone className="w-4 h-4" />
                <span>Konfirmasi Jadwal via WhatsApp ke Pengurus</span>
              </button>

              <button
                onClick={handleGoToPortal}
                className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>Masuk ke Dashboard Pelanggan Anda</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
