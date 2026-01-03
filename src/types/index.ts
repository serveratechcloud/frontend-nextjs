export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  kycData: KYCData
  status: CustomerStatus
  createdAt: Date
  updatedAt: Date
}

export interface KYCData {
  idNumber: string
  idType: string
  idExpiry: Date
  birthDate: Date
  gender: 'male' | 'female'
  occupation: string
  companyName?: string
  companyAddress?: string
}

export interface Service {
  id: string
  customerId: string
  packageId: string
  username: string
  password: string
  status: ServiceStatus
  activatedAt?: Date
  suspendedAt?: Date
  terminatedAt?: Date
  ipAddress?: string
  macAddress?: string
  createdAt: Date
  updatedAt: Date
}

export interface Package {
  id: string
  name: string
  description: string
  downloadSpeed: number
  uploadSpeed: number
  quota?: number
  quotaUnit?: 'GB' | 'TB'
  fairUsagePolicy?: number
  price: number
  taxRate: number
  billingCycle: BillingCycle
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Invoice {
  id: string
  customerId: string
  serviceId: string
  invoiceNumber: string
  amount: number
  taxAmount: number
  totalAmount: number
  status: InvoiceStatus
  dueDate: Date
  paidAt?: Date
  billingPeriod: {
    startDate: Date
    endDate: Date
  }
  createdAt: Date
  updatedAt: Date
}

export interface Payment {
  id: string
  invoiceId: string
  amount: number
  method: PaymentMethod
  status: PaymentStatus
  transactionId?: string
  bankName?: string
  accountNumber?: string
  paidAt: Date
  createdAt: Date
  updatedAt: Date
}

export interface MikroTikDevice {
  id: string
  name: string
  ipAddress: string
  port: number
  username: string
  password: string
  isActive: boolean
  lastSyncAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface RadiusUser {
  id: string
  username: string
  password: string
  serviceId: string
  profile: string
  isActive: boolean
  sessionTimeout?: number
  idleTimeout?: number
  createdAt: Date
  updatedAt: Date
}

export interface RadiusSession {
  id: string
  username: string
  nasIpAddress: string
  nasPortId: string
  sessionTime: number
  inputOctets: number
  outputOctets: number
  startTime: Date
  stopTime?: Date
  terminateCause?: string
}

export interface Ticket {
  id: string
  customerId: string
  subject: string
  description: string
  category: TicketCategory
  priority: TicketPriority
  status: TicketStatus
  assignedTo?: string
  slaDeadline?: Date
  createdAt: Date
  updatedAt: Date
}

export interface TicketReply {
  id: string
  ticketId: string
  userId?: string
  customerId?: string
  message: string
  isInternal: boolean
  createdAt: Date
}

export interface ActivityLog {
  id: string
  userId: string
  action: string
  resource: string
  resourceId: string
  details?: Record<string, any>
  ipAddress: string
  userAgent: string
  createdAt: Date
}

export interface DashboardStats {
  totalCustomers: number
  activeCustomers: number
  totalRevenue: number
  monthlyRevenue: number
  unpaidInvoices: number
  onlineSessions: number
  bandwidthUsage: {
    total: number
    average: number
    peak: number
  }
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string
    borderColor?: string
  }[]
}

export type UserRole = 'super_admin' | 'network_admin' | 'finance_admin' | 'customer_support' | 'reseller' | 'customer'

export type CustomerStatus = 'active' | 'suspended' | 'terminated' | 'pending'

export type ServiceStatus = 'active' | 'suspended' | 'terminated' | 'pending'

export type BillingCycle = 'monthly' | 'quarterly' | 'semi_annual' | 'annual'

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'

export type PaymentMethod = 'bank_transfer' | 'virtual_account' | 'ewallet' | 'credit_card' | 'cash'

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

export type TicketCategory = 'technical' | 'billing' | 'general' | 'complaint'

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
