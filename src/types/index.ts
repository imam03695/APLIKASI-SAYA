export type CustomerStatus = 'active' | 'isolated' | 'pending_survey' | 'scheduled_install' | 'inactive';

export type PaymentStatus = 'paid' | 'unpaid' | 'overdue' | 'isolated';

export type PaymentMethod = 'qris' | 'bca' | 'bri' | 'mandiri' | 'dana' | 'cash';

export interface InternetPackage {
  id: string;
  name: string;
  speedMbps: number;
  uploadMbps: number;
  priceMonthly: number;
  installFee: number;
  description: string;
  isPopular?: boolean;
  features: string[];
}

export interface Customer {
  id: string;
  customerCode: string; // e.g. NW-04-102
  name: string;
  phone: string; // e.g. 081234567890
  email?: string;
  address: string;
  rt: string;
  rw: string;
  houseNumber: string;
  packageId: string;
  status: CustomerStatus;
  installDate: string;
  ipAddress: string;
  pppoeUsername: string;
  odpCode: string; // e.g. ODP-RT04-02
  portNumber: number;
  monthlyDueDate: number; // e.g. 10 or 20
  notes?: string;
  registeredAt: string;
}

export interface ReminderLog {
  id: string;
  invoiceId: string;
  customerId: string;
  customerName: string;
  phone: string;
  type: 'h-3' | 'due_date' | 'overdue' | 'isolated' | 'payment_success' | 'custom';
  message: string;
  sentAt: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. INV-202609-001
  customerId: string;
  monthPeriod: string; // e.g. "September 2026"
  periodYear: number;
  periodMonth: number; // 1-12
  amount: number;
  discount?: number;
  totalAmount: number;
  dueDate: string; // YYYY-MM-DD
  status: PaymentStatus;
  paymentDate?: string;
  paymentMethod?: PaymentMethod;
  paymentProofUrl?: string;
  referenceNumber?: string;
  adminNotes?: string;
  reminderLogs?: ReminderLog[];
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  subject: string;
  category: 'slow_speed' | 'los_red_light' | 'frequent_disconnect' | 'billing' | 'relocation' | 'other';
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  updatedAt: string;
  technicianNotes?: string;
}

export interface WhatsAppTemplate {
  id: string;
  triggerType: 'h-3' | 'due_date' | 'overdue' | 'isolated' | 'payment_success';
  title: string;
  daysOffset: number; // -3, 0, 2, etc.
  isEnabled: boolean;
  content: string;
}

export interface FinanceSummary {
  totalExpectedRevenue: number;
  totalCollectedRevenue: number;
  totalOverdueAmount: number;
  paidCount: number;
  unpaidCount: number;
  overdueCount: number;
  isolatedCount: number;
  collectionRate: number; // percentage
}
