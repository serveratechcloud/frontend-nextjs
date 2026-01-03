"use client"

import { StatsCard } from "./stats-card"
import { 
  Users, 
  UserCheck, 
  DollarSign, 
  CreditCard, 
  FileText, 
  Wifi,
  TrendingUp,
  TrendingDown
} from "lucide-react"
import { DashboardStats } from "@/types"

interface DashboardOverviewProps {
  stats: DashboardStats
}

export function DashboardOverview({ stats }: DashboardOverviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <StatsCard
        title="Total Customers"
        value={stats.totalCustomers.toLocaleString()}
        description="Registered customers"
        icon={Users}
        trend={{
          value: 12,
          isPositive: true
        }}
      />
      
      <StatsCard
        title="Active Customers"
        value={stats.activeCustomers.toLocaleString()}
        description="Currently active"
        icon={UserCheck}
        trend={{
          value: 8,
          isPositive: true
        }}
      />
      
      <StatsCard
        title="Total Revenue"
        value={formatCurrency(stats.totalRevenue)}
        description="All time revenue"
        icon={DollarSign}
        trend={{
          value: 15,
          isPositive: true
        }}
      />
      
      <StatsCard
        title="Monthly Revenue"
        value={formatCurrency(stats.monthlyRevenue)}
        description="This month"
        icon={CreditCard}
        trend={{
          value: 23,
          isPositive: true
        }}
      />
      
      <StatsCard
        title="Unpaid Invoices"
        value={stats.unpaidInvoices.toLocaleString()}
        description="Pending payment"
        icon={FileText}
        trend={{
          value: 5,
          isPositive: false
        }}
      />
      
      <StatsCard
        title="Online Sessions"
        value={stats.onlineSessions.toLocaleString()}
        description="Currently connected"
        icon={Wifi}
        trend={{
          value: 3,
          isPositive: true
        }}
      />
      
      <StatsCard
        title="Total Bandwidth"
        value={formatBytes(stats.bandwidthUsage.total)}
        description="Last 24 hours"
        icon={TrendingUp}
        trend={{
          value: 18,
          isPositive: true
        }}
      />
      
      <StatsCard
        title="Average Bandwidth"
        value={formatBytes(stats.bandwidthUsage.average)}
        description="Per session"
        icon={TrendingDown}
        trend={{
          value: 2,
          isPositive: false
        }}
      />
    </div>
  )
}
