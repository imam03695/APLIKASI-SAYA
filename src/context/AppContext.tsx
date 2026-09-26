import React, { createContext, useContext, useEffect, useState } from 'react';
import { Customer, FinanceSummary, InternetPackage, Invoice, ReminderLog, Ticket, WhatsAppTemplate } from '../types';
import { INITIAL_CUSTOMERS, INITIAL_INVOICES, INITIAL_PACKAGES, INITIAL_TEMPLATES, INITIAL_TICKETS } from '../data/initialData';

interface AppContextType {
  // Navigation & session
  currentView: 'landing' | 'customer' | 'admin';
  setCurrentView: (view: 'landing' | 'customer' | 'admin') => void;
  selectedCustomerId: string;
  setSelectedCustomerId: (id: string) => void;
  activeCustomer: Customer | undefined;
  
  // Data
  customers: Customer[];
  packages: InternetPackage[];
  invoices: Invoice[];
  templates: WhatsAppTemplate[];
  tickets: Ticket[];
  reminderLogs: ReminderLog[];
  financeSummary: FinanceSummary;

  // Actions
  addCustomer: (newCustomer: Omit<Customer, 'id' | 'customerCode' | 'registeredAt' | 'installDate' | 'ipAddress' | 'pppoeUsername' | 'odpCode' | 'portNumber'>) => Customer;
  updateCustomer: (customer: Customer) => void;
  toggleCustomerIsolation: (customerId: string) => void;
  deleteCustomer: (customerId: string) => void;

  // Invoices & Payments
  confirmPayment: (invoiceId: string, method: Invoice['paymentMethod'], reference?: string) => void;
  addPaymentProof: (invoiceId: string, proofUrl: string, method: Invoice['paymentMethod']) => void;
  createMonthlyInvoices: (month: string, year: number, monthNum: number) => void;

  // WhatsApp Automation
  updateTemplate: (templateId: string, newContent: string, isEnabled: boolean) => void;
  sendWhatsAppReminder: (invoiceId: string, type: WhatsAppTemplate['triggerType']) => { waLink: string; message: string };
  runBatchReminderAutoCheck: () => { processedCount: number; sentLogs: ReminderLog[] };
  
  // Tickets
  createTicket: (customerId: string, subject: string, category: Ticket['category'], description: string) => void;
  updateTicketStatus: (ticketId: string, status: Ticket['status'], technicianNotes?: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  CUSTOMERS: 'netwarga_customers_v1',
  INVOICES: 'netwarga_invoices_v1',
  TEMPLATES: 'netwarga_templates_v1',
  TICKETS: 'netwarga_tickets_v1',
  LOGS: 'netwarga_logs_v1',
  VIEW: 'netwarga_view_v1',
  ACTIVE_CUST: 'netwarga_active_cust_v1'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from local storage or initial mock data
  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  const [packages] = useState<InternetPackage[]>(INITIAL_PACKAGES);

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INVOICES);
      return saved ? JSON.parse(saved) : INITIAL_INVOICES;
    } catch {
      return INITIAL_INVOICES;
    }
  });

  const [templates, setTemplates] = useState<WhatsAppTemplate[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
      return saved ? JSON.parse(saved) : INITIAL_TEMPLATES;
    } catch {
      return INITIAL_TEMPLATES;
    }
  });

  const [tickets, setTickets] = useState<Ticket[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TICKETS);
      return saved ? JSON.parse(saved) : INITIAL_TICKETS;
    } catch {
      return INITIAL_TICKETS;
    }
  });

  const [reminderLogs, setReminderLogs] = useState<ReminderLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
      if (saved) return JSON.parse(saved);
      // Collect initial logs from invoices
      const initialLogs: ReminderLog[] = [];
      INITIAL_INVOICES.forEach(inv => {
        if (inv.reminderLogs) {
          initialLogs.push(...inv.reminderLogs);
        }
      });
      return initialLogs;
    } catch {
      return [];
    }
  });

  const [currentView, setCurrentView] = useState<'landing' | 'customer' | 'admin'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VIEW) as any;
      return (saved && ['landing', 'customer', 'admin'].includes(saved)) ? saved : 'landing';
    } catch {
      return 'landing';
    }
  });

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_CUST);
      return saved || 'cust-1';
    } catch {
      return 'cust-1';
    }
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
  }, [templates]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(reminderLogs));
  }, [reminderLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VIEW, currentView);
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_CUST, selectedCustomerId);
  }, [selectedCustomerId]);

  const activeCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0];

  // Real-time finance summary calculation for current month (September 2026 default)
  const financeSummary: FinanceSummary = React.useMemo(() => {
    const currentInvoices = invoices.filter(inv => inv.monthPeriod.includes('September 2026'));
    const totalExpectedRevenue = currentInvoices.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const paidInvoices = currentInvoices.filter(inv => inv.status === 'paid');
    const totalCollectedRevenue = paidInvoices.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const overdueInvoices = currentInvoices.filter(inv => inv.status === 'overdue' || inv.status === 'isolated');
    const totalOverdueAmount = overdueInvoices.reduce((acc, curr) => acc + curr.totalAmount, 0);

    const paidCount = paidInvoices.length;
    const unpaidCount = currentInvoices.filter(inv => inv.status === 'unpaid').length;
    const overdueCount = currentInvoices.filter(inv => inv.status === 'overdue').length;
    const isolatedCount = currentInvoices.filter(inv => inv.status === 'isolated').length;
    const collectionRate = totalExpectedRevenue > 0 ? Math.round((totalCollectedRevenue / totalExpectedRevenue) * 100) : 0;

    return {
      totalExpectedRevenue,
      totalCollectedRevenue,
      totalOverdueAmount,
      paidCount,
      unpaidCount,
      overdueCount,
      isolatedCount,
      collectionRate
    };
  }, [invoices]);

  // Actions
  const addCustomer = (newCustData: Omit<Customer, 'id' | 'customerCode' | 'registeredAt' | 'installDate' | 'ipAddress' | 'pppoeUsername' | 'odpCode' | 'portNumber'>) => {
    const id = `cust-${Date.now()}`;
    const cleanRt = newCustData.rt.padStart(2, '0');
    const custNumber = (customers.length + 1).toString().padStart(3, '0');
    const customerCode = `NW-RT${cleanRt}-${custNumber}`;
    const randomOctet = 50 + customers.length;
    const cleanUsername = newCustData.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10);

    const newCustomer: Customer = {
      ...newCustData,
      id,
      customerCode,
      installDate: new Date().toISOString().split('T')[0],
      ipAddress: `192.168.10.${randomOctet}`,
      pppoeUsername: `${cleanUsername}_rt${cleanRt}@netwarga`,
      odpCode: `ODP-RT${cleanRt}-01`,
      portNumber: (customers.length % 8) + 1,
      registeredAt: new Date().toISOString().split('T')[0]
    };

    setCustomers(prev => [newCustomer, ...prev]);

    // Also auto-generate first invoice
    const selectedPkg = packages.find(p => p.id === newCustomer.packageId) || packages[1];
    const initialInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(invoices.length + 1).padStart(3, '0')}`,
      customerId: id,
      monthPeriod: 'September 2026',
      periodYear: 2026,
      periodMonth: 9,
      amount: selectedPkg.priceMonthly,
      totalAmount: selectedPkg.priceMonthly,
      dueDate: `2026-09-${String(newCustomer.monthlyDueDate).padStart(2, '0')}`,
      status: 'unpaid',
      adminNotes: 'Tagihan bulan pertama pemasangan baru'
    };

    setInvoices(prev => [initialInvoice, ...prev]);
    return newCustomer;
  };

  const updateCustomer = (updated: Customer) => {
    setCustomers(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const toggleCustomerIsolation = (customerId: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const nextStatus = c.status === 'isolated' ? 'active' : 'isolated';
        return { ...c, status: nextStatus };
      }
      return c;
    }));

    // If un-isolated or isolated, also update corresponding invoice status if needed
    setInvoices(prev => prev.map(inv => {
      if (inv.customerId === customerId) {
        if (inv.status === 'isolated') {
          return { ...inv, status: 'overdue' };
        } else if (inv.status === 'overdue') {
          return { ...inv, status: 'isolated' };
        }
      }
      return inv;
    }));
  };

  const deleteCustomer = (customerId: string) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
    setInvoices(prev => prev.filter(i => i.customerId !== customerId));
  };

  const confirmPayment = (invoiceId: string, method: Invoice['paymentMethod'] = 'qris', reference?: string) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    let targetInvoice: Invoice | undefined;

    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        targetInvoice = {
          ...inv,
          status: 'paid',
          paymentDate: formattedDate,
          paymentMethod: method,
          referenceNumber: reference || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
          adminNotes: inv.adminNotes ? `${inv.adminNotes} (Dikonfirmasi lunas)` : 'Pembayaran terkonfirmasi lunas.'
        };
        return targetInvoice;
      }
      return inv;
    }));

    // If customer was isolated, restore to active!
    if (targetInvoice) {
      const custId = targetInvoice.customerId;
      setCustomers(prev => prev.map(c => {
        if (c.id === custId && c.status === 'isolated') {
          return { ...c, status: 'active' };
        }
        return c;
      }));

      // Auto trigger payment success WhatsApp log
      const customer = customers.find(c => c.id === custId);
      if (customer) {
        const log: ReminderLog = {
          id: `log-${Date.now()}`,
          invoiceId,
          customerId: custId,
          customerName: customer.name,
          phone: customer.phone,
          type: 'payment_success',
          message: `Kuitansi pembayaran lunas Rp ${targetInvoice.totalAmount.toLocaleString('id-ID')} atas nama ${customer.name}`,
          sentAt: formattedDate,
          status: 'sent'
        };
        setReminderLogs(prev => [log, ...prev]);
      }
    }
  };

  const addPaymentProof = (invoiceId: string, proofUrl: string, method: Invoice['paymentMethod']) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        return {
          ...inv,
          paymentProofUrl: proofUrl,
          paymentMethod: method,
          adminNotes: 'Bukti bayar diunggah oleh pelanggan, menunggu verifikasi admin/otomatis.'
        };
      }
      return inv;
    }));
  };

  const createMonthlyInvoices = (monthPeriod: string, year: number, monthNum: number) => {
    const newInvoices: Invoice[] = [];
    customers.forEach((cust, idx) => {
      // Check if already exists for this period
      const exists = invoices.some(i => i.customerId === cust.id && i.monthPeriod === monthPeriod);
      if (!exists && cust.status !== 'inactive') {
        const pkg = packages.find(p => p.id === cust.packageId) || packages[1];
        newInvoices.push({
          id: `inv-${Date.now()}-${idx}`,
          invoiceNumber: `INV-${year}${String(monthNum).padStart(2, '0')}-${String(invoices.length + newInvoices.length + 1).padStart(3, '0')}`,
          customerId: cust.id,
          monthPeriod,
          periodYear: year,
          periodMonth: monthNum,
          amount: pkg.priceMonthly,
          totalAmount: pkg.priceMonthly,
          dueDate: `${year}-${String(monthNum).padStart(2, '0')}-${String(cust.monthlyDueDate).padStart(2, '0')}`,
          status: 'unpaid'
        });
      }
    });

    if (newInvoices.length > 0) {
      setInvoices(prev => [...newInvoices, ...prev]);
    }
  };

  const updateTemplate = (templateId: string, newContent: string, isEnabled: boolean) => {
    setTemplates(prev => prev.map(t => t.id === templateId ? { ...t, content: newContent, isEnabled } : t));
  };

  const buildWhatsAppMessage = (invoice: Invoice, customer: Customer, templateType: WhatsAppTemplate['triggerType']) => {
    const template = templates.find(t => t.triggerType === templateType) || templates[0];
    const pkg = packages.find(p => p.id === customer.packageId) || packages[0];
    const nominal = `Rp ${invoice.totalAmount.toLocaleString('id-ID')}`;

    let msg = template.content;
    msg = msg.replace(/{nama}/g, customer.name);
    msg = msg.replace(/{id_pelanggan}/g, customer.customerCode);
    msg = msg.replace(/{paket}/g, `${pkg.name} (${pkg.speedMbps} Mbps)`);
    msg = msg.replace(/{periode}/g, invoice.monthPeriod);
    msg = msg.replace(/{nominal}/g, nominal);
    msg = msg.replace(/{jatuh_tempo}/g, invoice.dueDate);
    msg = msg.replace(/{alamat}/g, `${customer.address}, RT ${customer.rt}/RW ${customer.rw}`);
    msg = msg.replace(/{link_portal}/g, window.location.origin || 'https://netwarga.rt07.id');
    msg = msg.replace(/{no_kuitansi}/g, invoice.invoiceNumber);
    msg = msg.replace(/{metode_bayar}/g, (invoice.paymentMethod || 'QRIS / Transfer').toUpperCase());
    msg = msg.replace(/{waktu_bayar}/g, invoice.paymentDate || 'Hari ini');
    msg = msg.replace(/{kecepatan}/g, `${pkg.speedMbps} Mbps`);
    msg = msg.replace(/{link_kuitansi}/g, `${window.location.origin}/invoice/${invoice.invoiceNumber}`);

    return msg;
  };

  const sendWhatsAppReminder = (invoiceId: string, type: WhatsAppTemplate['triggerType']) => {
    const invoice = invoices.find(i => i.id === invoiceId);
    if (!invoice) return { waLink: '#', message: '' };
    const customer = customers.find(c => c.id === invoice.customerId);
    if (!customer) return { waLink: '#', message: '' };

    const message = buildWhatsAppMessage(invoice, customer, type);

    // Format phone number for WhatsApp: Indonesian standard 08... -> 628...
    let cleanPhone = customer.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith('62')) {
      cleanPhone = '62' + cleanPhone;
    }

    const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

    // Create log
    const now = new Date();
    const sentAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newLog: ReminderLog = {
      id: `log-${Date.now()}`,
      invoiceId,
      customerId: customer.id,
      customerName: customer.name,
      phone: customer.phone,
      type,
      message,
      sentAt,
      status: 'sent'
    };

    setReminderLogs(prev => [newLog, ...prev]);

    // Attach to invoice history
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        return {
          ...inv,
          reminderLogs: [newLog, ...(inv.reminderLogs || [])]
        };
      }
      return inv;
    }));

    return { waLink, message };
  };

  const runBatchReminderAutoCheck = () => {
    // Check all unpaid & overdue invoices and trigger appropriate reminders
    const newLogs: ReminderLog[] = [];
    const now = new Date();
    const formattedSentAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    invoices.forEach(inv => {
      if (inv.status === 'unpaid' || inv.status === 'overdue' || inv.status === 'isolated') {
        const cust = customers.find(c => c.id === inv.customerId);
        if (!cust) return;

        let reminderType: WhatsAppTemplate['triggerType'] = 'due_date';
        if (inv.status === 'overdue') reminderType = 'overdue';
        if (inv.status === 'isolated') reminderType = 'isolated';

        const msg = buildWhatsAppMessage(inv, cust, reminderType);
        const logItem: ReminderLog = {
          id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          invoiceId: inv.id,
          customerId: cust.id,
          customerName: cust.name,
          phone: cust.phone,
          type: reminderType,
          message: msg,
          sentAt: formattedSentAt,
          status: 'sent'
        };
        newLogs.push(logItem);
      }
    });

    if (newLogs.length > 0) {
      setReminderLogs(prev => [...newLogs, ...prev]);
    }

    return {
      processedCount: newLogs.length,
      sentLogs: newLogs
    };
  };

  const createTicket = (customerId: string, subject: string, category: Ticket['category'], description: string) => {
    const cust = customers.find(c => c.id === customerId);
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newTicket: Ticket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: `TCK-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${String(tickets.length + 1).padStart(2, '0')}`,
      customerId,
      customerName: cust?.name || 'Pelanggan',
      subject,
      category,
      description,
      status: 'open',
      createdAt: formattedDate,
      updatedAt: formattedDate,
      technicianNotes: 'Laporan baru diterima tim NOC RT RW Net. Segera dijadwalkan pengecekan tiang & ODP.'
    };

    setTickets(prev => [newTicket, ...prev]);
  };

  const updateTicketStatus = (ticketId: string, status: Ticket['status'], technicianNotes?: string) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status,
          updatedAt: formattedDate,
          technicianNotes: technicianNotes !== undefined ? technicianNotes : t.technicianNotes
        };
      }
      return t;
    }));
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedCustomerId,
        setSelectedCustomerId,
        activeCustomer,
        customers,
        packages,
        invoices,
        templates,
        tickets,
        reminderLogs,
        financeSummary,
        addCustomer,
        updateCustomer,
        toggleCustomerIsolation,
        deleteCustomer,
        confirmPayment,
        addPaymentProof,
        createMonthlyInvoices,
        updateTemplate,
        sendWhatsAppReminder,
        runBatchReminderAutoCheck,
        createTicket,
        updateTicketStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
