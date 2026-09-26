import { Customer, InternetPackage, Invoice, Ticket, WhatsAppTemplate } from '../types';

export const INITIAL_PACKAGES: InternetPackage[] = [
  {
    id: 'pkg-15',
    name: 'Paket Hemat Santai',
    speedMbps: 15,
    uploadMbps: 15,
    priceMonthly: 120000,
    installFee: 150000,
    description: 'Cocok untuk kebutuhan harian keluarga kecil, browsing, media sosial, dan video streaming HD.',
    features: [
      'Kecepatan Download up to 15 Mbps',
      'Upload simetris 1:1 (15 Mbps)',
      'Tanpa Batas Kuota (True Unlimited)',
      'Ideal untuk 2 - 4 perangkat terhubung',
      'Dukungan teknisi lokal siap 24/7',
      'Termasuk Router WiFi Dual Band ONT'
    ]
  },
  {
    id: 'pkg-30',
    name: 'Paket Keluarga Ceria',
    speedMbps: 30,
    uploadMbps: 30,
    priceMonthly: 175000,
    installFee: 100000,
    description: 'Pilihan paling populer bagi warga RT. Lancar untuk WFH, Zoom meeting, YouTube 4K, dan Smart TV.',
    isPopular: true,
    features: [
      'Kecepatan Download up to 30 Mbps',
      'Upload simetris 1:1 (30 Mbps)',
      'Tanpa FUP / Kuota Tanpa Batas',
      'Ideal untuk 4 - 8 perangkat',
      'Prioritas pemeliharaan teknisi RT/RW',
      'Router Fiber Optic Gigabit GPON',
      'Bisa request port game prioritas'
    ]
  },
  {
    id: 'pkg-50',
    name: 'Paket Bisnis & Gamer',
    speedMbps: 50,
    uploadMbps: 50,
    priceMonthly: 250000,
    installFee: 0,
    description: 'Didesain untuk usaha rumahan, gamer kompetitif dengan latency rendah, dan streaming tanpa buffer.',
    features: [
      'Kecepatan Download up to 50 Mbps',
      'Upload simetris 1:1 (50 Mbps)',
      'Ping rendah khusus routing game online',
      'Gratis biaya pasang awal kabel fiber',
      'Cocok untuk 8 - 15 perangkat',
      'Monitoring bandwidth otomatis'
    ]
  },
  {
    id: 'pkg-100',
    name: 'Paket Ultra Fiber Super',
    speedMbps: 100,
    uploadMbps: 100,
    priceMonthly: 380000,
    installFee: 0,
    description: 'Koneksi kelas enterprise untuk kantor ruko, desainer konten kreator, dan pemakaian beban tinggi.',
    features: [
      'Kecepatan maksimal 100 Mbps simetris',
      'Static IP address opsional',
      'QoS Prioritas tertinggi di router core',
      'Gratis instalasi & kabel dropcore 150m',
      'SLA jaminan uptime 99.5%'
    ]
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    customerCode: 'NW-RT02-001',
    name: 'Bpk. Hendra Gunawan',
    phone: '6281234567890',
    email: 'hendra.gunawan@gmail.com',
    address: 'Jl. Flamboyan Blok B3 No. 12',
    rt: '02',
    rw: '07',
    houseNumber: 'B3/12',
    packageId: 'pkg-30',
    status: 'active',
    installDate: '2025-03-10',
    ipAddress: '192.168.10.12',
    pppoeUsername: 'hendra_b312@netwarga',
    odpCode: 'ODP-FLAM-01',
    portNumber: 3,
    monthlyDueDate: 10,
    registeredAt: '2025-03-05'
  },
  {
    id: 'cust-2',
    customerCode: 'NW-RT01-002',
    name: 'Ibu Siti Rahmawati',
    phone: '6285712345678',
    email: 'siti.rahma@yahoo.com',
    address: 'Jl. Mawar No. 05',
    rt: '01',
    rw: '07',
    houseNumber: 'A1/05',
    packageId: 'pkg-15',
    status: 'active',
    installDate: '2025-06-15',
    ipAddress: '192.168.10.15',
    pppoeUsername: 'siti_a105@netwarga',
    odpCode: 'ODP-MAWAR-01',
    portNumber: 1,
    monthlyDueDate: 10,
    registeredAt: '2025-06-12'
  },
  {
    id: 'cust-3',
    customerCode: 'NW-RT03-003',
    name: 'Ahmad Fauzi (Dani Komputer)',
    phone: '6281398765432',
    email: 'fauzi.comp@gmail.com',
    address: 'Jl. Melati Ruko No. 2A',
    rt: '03',
    rw: '07',
    houseNumber: 'Ruko 2A',
    packageId: 'pkg-50',
    status: 'active',
    installDate: '2025-01-20',
    ipAddress: '192.168.10.22',
    pppoeUsername: 'fauzi_ruko2a@netwarga',
    odpCode: 'ODP-MELATI-02',
    portNumber: 4,
    monthlyDueDate: 15,
    registeredAt: '2025-01-18'
  },
  {
    id: 'cust-4',
    customerCode: 'NW-RT02-004',
    name: 'Bpk. Bambang Sutrisno',
    phone: '6281987654321',
    email: 'bambang.sutris@gmail.com',
    address: 'Jl. Flamboyan Blok B1 No. 08',
    rt: '02',
    rw: '07',
    houseNumber: 'B1/08',
    packageId: 'pkg-30',
    status: 'active',
    installDate: '2025-08-01',
    ipAddress: '192.168.10.28',
    pppoeUsername: 'bambang_b108@netwarga',
    odpCode: 'ODP-FLAM-01',
    portNumber: 7,
    monthlyDueDate: 10,
    registeredAt: '2025-07-28'
  },
  {
    id: 'cust-5',
    customerCode: 'NW-RT04-005',
    name: 'Ibu Ratna Dewi',
    phone: '6282133445566',
    email: 'ratna.dewi99@gmail.com',
    address: 'Jl. Kenanga Blok D4 No. 19',
    rt: '04',
    rw: '07',
    houseNumber: 'D4/19',
    packageId: 'pkg-15',
    status: 'active',
    installDate: '2025-09-02',
    ipAddress: '192.168.10.35',
    pppoeUsername: 'ratna_d419@netwarga',
    odpCode: 'ODP-KENANGA-01',
    portNumber: 2,
    monthlyDueDate: 10,
    registeredAt: '2025-08-30'
  },
  {
    id: 'cust-6',
    customerCode: 'NW-RT05-006',
    name: 'Bpk. Wahyu Pratama',
    phone: '6287811223344',
    email: 'wahyu.pratama@outlook.com',
    address: 'Jl. Cempaka Indah No. 31',
    rt: '05',
    rw: '07',
    houseNumber: 'E2/31',
    packageId: 'pkg-30',
    status: 'isolated',
    installDate: '2025-04-14',
    ipAddress: '192.168.10.42',
    pppoeUsername: 'wahyu_e231@netwarga',
    odpCode: 'ODP-CEMPAKA-03',
    portNumber: 6,
    monthlyDueDate: 5,
    notes: 'Terisolir otomatis karena nunggak > 10 hari.',
    registeredAt: '2025-04-10'
  },
  {
    id: 'cust-7',
    customerCode: 'NW-RT03-007',
    name: 'Studio Foto Gemilang (Mas Reza)',
    phone: '6285299887766',
    email: 'gemilang.studio@gmail.com',
    address: 'Jl. Melati Blok C2 No. 04',
    rt: '03',
    rw: '07',
    houseNumber: 'C2/04',
    packageId: 'pkg-100',
    status: 'active',
    installDate: '2025-05-18',
    ipAddress: '192.168.10.50',
    pppoeUsername: 'reza_gemilang@netwarga',
    odpCode: 'ODP-MELATI-01',
    portNumber: 5,
    monthlyDueDate: 20,
    registeredAt: '2025-05-15'
  },
  {
    id: 'cust-8',
    customerCode: 'NW-RT01-008',
    name: 'Bpk. Tri Santoso',
    phone: '6289655443322',
    email: 'tri.santoso88@gmail.com',
    address: 'Jl. Mawar No. 17',
    rt: '01',
    rw: '07',
    houseNumber: 'A2/17',
    packageId: 'pkg-15',
    status: 'active',
    installDate: '2025-07-10',
    ipAddress: '192.168.10.56',
    pppoeUsername: 'tri_a217@netwarga',
    odpCode: 'ODP-MAWAR-02',
    portNumber: 8,
    monthlyDueDate: 10,
    registeredAt: '2025-07-05'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  // September 2026 Invoices
  {
    id: 'inv-202609-01',
    invoiceNumber: 'INV-202609-001',
    customerId: 'cust-1',
    monthPeriod: 'September 2026',
    periodYear: 2026,
    periodMonth: 9,
    amount: 175000,
    totalAmount: 175000,
    dueDate: '2026-09-10',
    status: 'paid',
    paymentDate: '2026-09-08 14:22:10',
    paymentMethod: 'qris',
    referenceNumber: 'QRIS-992817263',
    adminNotes: 'Pembayaran instan via QRIS Gopay',
    reminderLogs: [
      {
        id: 'rem-1',
        invoiceId: 'inv-202609-01',
        customerId: 'cust-1',
        customerName: 'Bpk. Hendra Gunawan',
        phone: '6281234567890',
        type: 'h-3',
        message: 'Halo Bpk. Hendra Gunawan, pengingat tagihan RT RW Net periode September 2026 sebesar Rp 175.000.',
        sentAt: '2026-09-07 09:00',
        status: 'read'
      },
      {
        id: 'rem-2',
        invoiceId: 'inv-202609-01',
        customerId: 'cust-1',
        customerName: 'Bpk. Hendra Gunawan',
        phone: '6281234567890',
        type: 'payment_success',
        message: 'Terima kasih Bpk. Hendra Gunawan! Pembayaran tagihan RT RW Net Anda Rp 175.000 telah lunas.',
        sentAt: '2026-09-08 14:23',
        status: 'delivered'
      }
    ]
  },
  {
    id: 'inv-202609-02',
    invoiceNumber: 'INV-202609-002',
    customerId: 'cust-2',
    monthPeriod: 'September 2026',
    periodYear: 2026,
    periodMonth: 9,
    amount: 120000,
    totalAmount: 120000,
    dueDate: '2026-09-10',
    status: 'paid',
    paymentDate: '2026-09-09 10:15:00',
    paymentMethod: 'bca',
    referenceNumber: 'TRF-BCA-887123',
    adminNotes: 'Transfer BCA atas nama Siti Rahmawati'
  },
  {
    id: 'inv-202609-03',
    invoiceNumber: 'INV-202609-003',
    customerId: 'cust-3',
    monthPeriod: 'September 2026',
    periodYear: 2026,
    periodMonth: 9,
    amount: 250000,
    totalAmount: 250000,
    dueDate: '2026-09-15',
    status: 'paid',
    paymentDate: '2026-09-14 16:40:00',
    paymentMethod: 'mandiri',
    referenceNumber: 'TRF-MDR-009912'
  },
  {
    id: 'inv-202609-04',
    invoiceNumber: 'INV-202609-004',
    customerId: 'cust-4',
    monthPeriod: 'September 2026',
    periodYear: 2026,
    periodMonth: 9,
    amount: 175000,
    totalAmount: 175000,
    dueDate: '2026-09-10',
    status: 'overdue',
    adminNotes: 'Sudah lewat 15 hari dari tanggal jatuh tempo 10 September',
    reminderLogs: [
      {
        id: 'rem-3',
        invoiceId: 'inv-202609-04',
        customerId: 'cust-4',
        customerName: 'Bpk. Bambang Sutrisno',
        phone: '6281987654321',
        type: 'h-3',
        message: 'Pengingat tagihan RT RW Net periode September 2026 jatuh tempo 10 September.',
        sentAt: '2026-09-07 09:15',
        status: 'delivered'
      },
      {
        id: 'rem-4',
        invoiceId: 'inv-202609-04',
        customerId: 'cust-4',
        customerName: 'Bpk. Bambang Sutrisno',
        phone: '6281987654321',
        type: 'due_date',
        message: 'Hari ini jatuh tempo pembayaran RT RW Net Anda sebesar Rp 175.000.',
        sentAt: '2026-09-10 09:00',
        status: 'delivered'
      },
      {
        id: 'rem-5',
        invoiceId: 'inv-202609-04',
        customerId: 'cust-4',
        customerName: 'Bpk. Bambang Sutrisno',
        phone: '6281987654321',
        type: 'overdue',
        message: 'Tagihan RT RW Net Anda telah melewati tanggal jatuh tempo.',
        sentAt: '2026-09-15 10:00',
        status: 'sent'
      }
    ]
  },
  {
    id: 'inv-202609-05',
    invoiceNumber: 'INV-202609-005',
    customerId: 'cust-5',
    monthPeriod: 'September 2026',
    periodYear: 2026,
    periodMonth: 9,
    amount: 120000,
    totalAmount: 120000,
    dueDate: '2026-09-10',
    status: 'overdue',
    adminNotes: 'Menunggu konfirmasi dari Ibu Ratna'
  },
  {
    id: 'inv-202609-06',
    invoiceNumber: 'INV-202609-006',
    customerId: 'cust-6',
    monthPeriod: 'September 2026',
    periodYear: 2026,
    periodMonth: 9,
    amount: 175000,
    totalAmount: 175000,
    dueDate: '2026-09-05',
    status: 'isolated',
    adminNotes: 'Akun terisolir di MikroTik karena belum lunas sejak 5 September.'
  },
  {
    id: 'inv-202609-07',
    invoiceNumber: 'INV-202609-007',
    customerId: 'cust-7',
    monthPeriod: 'September 2026',
    periodYear: 2026,
    periodMonth: 9,
    amount: 380000,
    totalAmount: 380000,
    dueDate: '2026-09-20',
    status: 'paid',
    paymentDate: '2026-09-19 11:05:00',
    paymentMethod: 'bca',
    referenceNumber: 'TRF-BCA-991823'
  },
  {
    id: 'inv-202609-08',
    invoiceNumber: 'INV-202609-008',
    customerId: 'cust-8',
    monthPeriod: 'September 2026',
    periodYear: 2026,
    periodMonth: 9,
    amount: 120000,
    totalAmount: 120000,
    dueDate: '2026-09-10',
    status: 'paid',
    paymentDate: '2026-09-10 08:30:00',
    paymentMethod: 'cash',
    referenceNumber: 'CASH-POS-RT01',
    adminNotes: 'Bayar tunai ke pengurus RT 01'
  }
];

export const INITIAL_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: 'tpl-h3',
    triggerType: 'h-3',
    title: 'Pengingat Lembut H-3 Jatuh Tempo',
    daysOffset: -3,
    isEnabled: true,
    content: `Halo {nama} ({id_pelanggan}) 🙏

Kami dari Pengelola *NetWarga (RT RW Net)* ingin menginformasikan tagihan internet bulanan Anda:

📦 *Paket:* {paket}
🗓 *Periode:* {periode}
💰 *Total Tagihan:* {nominal}
⏰ *Jatuh Tempo:* {jatuh_tempo}

Pembayaran dapat melalui:
• QRIS: Buka portal {link_portal}
• Transfer BCA: 8291-0021-9988 (a.n NetWarga Pengurus)
• Transfer BRI: 0192-01-008899-50-1

Mohon abaikan pesan ini jika Bapak/Ibu sudah melakukan pembayaran. Terima kasih atas dukungannya dalam memajukan jaringan warga! ✨`
  },
  {
    id: 'tpl-due',
    triggerType: 'due_date',
    title: 'Pengingat Hari-H Jatuh Tempo',
    daysOffset: 0,
    isEnabled: true,
    content: `Pemberitahuan Tagihan RT RW Net 🌐

Yth. {nama} ({id_pelanggan}),
Hari ini adalah *tanggal jatuh tempo* pembayaran internet RT RW Net Anda:

🗓 *Periode:* {periode}
💵 *Jumlah:* {nominal}
📅 *Batas Pembayaran:* Hari ini ({jatuh_tempo})

Untuk kenyamanan bersama dan menghindari pemutusan koneksi otomatis oleh sistem, silakan melakukan pembayaran hari ini melalui link berikut:
🔗 {link_portal}

Atau konfirmasi bukti bayar ke nomor ini. Terima kasih! 🙏`
  },
  {
    id: 'tpl-overdue',
    triggerType: 'overdue',
    title: 'Peringatan Terlambat Bayar / H+2',
    daysOffset: 2,
    isEnabled: true,
    content: `⚠️ *Peringatan Keterlambatan Tagihan RT RW Net*

Yth. {nama} ({id_pelanggan}),
Koneksi internet Anda di {alamat} tercatat *belum melunasi* tagihan periode {periode} sebesar {nominal}.

Status: *MELEWATI JATUH TEMPO*
Sistem router akan melakukan isolir otomatis jika tagihan belum diselesaikan dalam 1x24 jam.

Segera selesaikan pembayaran melalui portal:
👉 {link_portal}

Atau hubungi pengurus RT RW Net untuk konfirmasi jika ada kendala. Terima kasih.`
  },
  {
    id: 'tpl-isolated',
    triggerType: 'isolated',
    title: 'Pemberitahuan Isolir Akses Internet',
    daysOffset: 5,
    isEnabled: true,
    content: `⛔ *Pemberitahuan Isolir Jaringan Internet NetWarga*

Yth. {nama} ({id_pelanggan}),
Dengan berat hati kami menginformasikan bahwa koneksi internet di kediaman Anda sementara ini telah *DI-ISOLIR* karena tagihan {periode} sebesar {nominal} belum terlunasi.

Koneksi akan otomatis aktif kembali dalam hitungan menit setelah pembayaran diverifikasi:
💳 Bayar instan via QRIS: {link_portal}

Customer Service & Admin: 0812-3456-7890 (Pengurus NetWarga)`
  },
  {
    id: 'tpl-success',
    triggerType: 'payment_success',
    title: 'Bukti Kuitansi & Terima Kasih Pembayaran',
    daysOffset: 0,
    isEnabled: true,
    content: `✅ *PEMBAYARAN DITERIMA - KUITANSI DIGITAL*

Terima kasih {nama}!
Pembayaran tagihan RT RW Net telah berhasil diverifikasi oleh sistem:

🧾 *No. Kuitansi:* {no_kuitansi}
👤 *Pelanggan:* {nama} ({id_pelanggan})
🗓 *Periode:* {periode}
💰 *Nominal:* {nominal}
💳 *Metode:* {metode_bayar}
⏰ *Waktu:* {waktu_bayar}

Koneksi internet Anda dalam status *AKTIF NORMAL* dengan kecepatan {kecepatan}.
Unduh struk resmi: {link_kuitansi}

Selamat menikmati koneksi internet warga yang lancar dan hemat!`
  }
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'tkt-01',
    ticketNumber: 'TCK-202609-01',
    customerId: 'cust-4',
    customerName: 'Bpk. Bambang Sutrisno',
    subject: 'Lampu Router LOS Berkedip Merah',
    category: 'los_red_light',
    description: 'Tadi pagi setelah hujan deras kabel fiber di tiang depan rumah sepertinya tertimpa dahan pohon, lampu LOS di modem merah.',
    status: 'in_progress',
    createdAt: '2026-09-24 07:30',
    updatedAt: '2026-09-24 09:15',
    technicianNotes: 'Teknisi Joko sedang menuju lokasi dengan splicer fiber optic untuk perbaikan redaman.'
  },
  {
    id: 'tkt-02',
    ticketNumber: 'TCK-202609-02',
    customerId: 'cust-2',
    customerName: 'Ibu Siti Rahmawati',
    subject: 'Kecepatan Agak Lambat saat Sore',
    category: 'slow_speed',
    description: 'Anak saya komplain pas sore jam 5 mau belajar online agak buffering.',
    status: 'resolved',
    createdAt: '2026-09-20 18:20',
    updatedAt: '2026-09-21 10:00',
    technicianNotes: 'Sudah dioptimasi kanal WiFi 2.4GHz ke Channel 6 yang lebih sepi interferensi, tes ulang 15.2 Mbps aman.'
  }
];

export const BANK_ACCOUNTS = [
  { bank: 'BCA', number: '829100219988', name: 'PENGURUS NETWARGA' },
  { bank: 'BRI', number: '019201008899501', name: 'KAS RT RW NET MANDIRI' },
  { bank: 'Mandiri', number: '1370018899221', name: 'PENGURUS PAGUYUBAN' },
  { bank: 'DANA / E-Wallet', number: '081234567890', name: 'NETWARGA COMMUNITY' }
];
