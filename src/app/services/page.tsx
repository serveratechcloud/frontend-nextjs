"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from "@/lib/api"
import { Service } from "@/types"
import { toast } from "@/components/ui/use-toast"

const ServiceStatus = {
  ACTIVE: 'active' as const,
  SUSPENDED: 'suspended' as const,
  TERMINATED: 'terminated' as const
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await api.services.getAll({
        search: search || undefined,
        status: statusFilter || undefined,
        skip: (pagination.page - 1) * pagination.limit,
        limit: pagination.limit
      })
      
      setServices(response.data as Service[])
      setPagination(prev => ({
        ...prev,
        ...(response.data as any).pagination
      }))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch services",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [search, statusFilter, pagination.page])

  const getStatusBadge = (status: string) => {
    const variants = {
      [ServiceStatus.ACTIVE]: "bg-green-100 text-green-800",
      [ServiceStatus.SUSPENDED]: "bg-yellow-100 text-yellow-800",
      [ServiceStatus.TERMINATED]: "bg-red-100 text-red-800"
    }
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status}
      </Badge>
    )
  }

  const handleStatusChange = async (serviceId: number, newStatus: string) => {
    try {
      if (newStatus === ServiceStatus.SUSPENDED) {
        await api.services.suspendService(serviceId)
      } else if (newStatus === ServiceStatus.ACTIVE) {
        await api.services.activateService(serviceId)
      } else if (newStatus === ServiceStatus.TERMINATED) {
        await api.services.terminateService(serviceId)
      }
      
      toast({
        title: "Success",
        description: `Service status updated to ${newStatus}`,
      })
      
      fetchServices()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update service status",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Services</h2>
        <Button>Add Service</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value || "")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value={ServiceStatus.ACTIVE}>Active</SelectItem>
                <SelectItem value={ServiceStatus.SUSPENDED}>Suspended</SelectItem>
                <SelectItem value={ServiceStatus.TERMINATED}>Terminated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Service List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-sm text-muted-foreground">Loading...</div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.username}</TableCell>
                      <TableCell>{service.customer?.name}</TableCell>
                      <TableCell>{service.package?.name}</TableCell>
                      <TableCell>{service.ipAddress || "N/A"}</TableCell>
                      <TableCell>{getStatusBadge(service.status)}</TableCell>
                      <TableCell>
                        {new Date(service.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {service.status === ServiceStatus.ACTIVE && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(service.id, ServiceStatus.SUSPENDED)}
                            >
                              Suspend
                            </Button>
                          )}
                          {service.status === ServiceStatus.SUSPENDED && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(service.id, ServiceStatus.ACTIVE)}
                            >
                              Activate
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {services.length > 0 && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="text-sm text-muted-foreground">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                {pagination.total} services
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page <= 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
