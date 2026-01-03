"use client"

import { useEffect, useState } from "react"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { UsageChart } from "@/components/dashboard/usage-chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardStats, ChartData } from "@/types"
import { api } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [revenueData, setRevenueData] = useState<ChartData | null>(null)
  const [usageData, setUsageData] = useState<ChartData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        
        // Fetch all dashboard data in parallel
        const [statsResponse, revenueResponse, usageResponse] = await Promise.all([
          api.dashboard.getStats(),
          api.dashboard.getRevenueChart("monthly"),
          api.dashboard.getUsageChart("daily")
        ])

        setStats(statsResponse.data as DashboardStats)
        setRevenueData(revenueResponse.data as ChartData)
        setUsageData(usageResponse.data as ChartData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm text-muted-foreground">Loading dashboard...</div>
      </div>
    )
  }

  if (!stats || !revenueData || !usageData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm text-muted-foreground">No data available</div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      
      <DashboardOverview stats={stats} />
      
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="usage">Bandwidth Usage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <RevenueChart data={revenueData} title="Monthly Revenue" />
          </div>
        </TabsContent>
        
        <TabsContent value="usage" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <UsageChart data={usageData} title="Daily Bandwidth Usage" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
