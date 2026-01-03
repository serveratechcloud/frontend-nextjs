import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { ApiResponse, PaginatedResponse } from '@/types'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://backend.serveratech.biz.id/api/v1',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const refreshToken = localStorage.getItem('refresh_token')
            if (refreshToken) {
              const response = await this.client.post('/auth/refresh', {
                refresh_token: refreshToken,
              })

              const { access_token } = response.data
              localStorage.setItem('access_token', access_token)

              originalRequest.headers.Authorization = `Bearer ${access_token}`
              return this.client(originalRequest)
            }
          } catch (refreshError) {
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            window.location.href = '/login'
            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(error)
      }
    )
  }

  async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get(url, { params })
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post(url, data)
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put(url, data)
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  async patch<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.patch(url, data)
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete(url)
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  async getPaginated<T>(url: string, params?: any): Promise<PaginatedResponse<T>> {
    try {
      const response = await this.client.get(url, { params })
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      const message = error.response.data?.message || error.response.data?.error || 'Server error occurred'
      return new Error(message)
    } else if (error.request) {
      return new Error('No response from server')
    } else {
      return new Error(error.message || 'Request failed')
    }
  }
}

export const apiClient = new ApiClient()

export const api = {
  auth: {
    login: (credentials: { email: string; password: string }) =>
      apiClient.post('/auth/login', credentials),
    logout: () => apiClient.post('/auth/logout'),
    refresh: (refreshToken: string) =>
      apiClient.post('/auth/refresh', { refresh_token: refreshToken }),
    me: () => apiClient.get('/auth/me'),
  },
  customers: {
    getAll: (params?: any) => apiClient.getPaginated('/customers', params),
    getById: (id: string) => apiClient.get(`/customers/${id}`),
    create: (data: any) => apiClient.post('/customers', data),
    update: (id: string, data: any) => apiClient.put(`/customers/${id}`, data),
    delete: (id: string) => apiClient.delete(`/customers/${id}`),
    getServices: (id: string) => apiClient.get(`/customers/${id}/services`),
  },
  services: {
    getAll: (params?: any) => apiClient.getPaginated('/services', params),
    getById: (id: string) => apiClient.get(`/services/${id}`),
    create: (data: any) => apiClient.post('/services', data),
    update: (id: string, data: any) => apiClient.put(`/services/${id}`, data),
    delete: (id: string) => apiClient.delete(`/services/${id}`),
    suspend: (id: string) => apiClient.post(`/services/${id}/suspend`),
    activate: (id: string) => apiClient.post(`/services/${id}/activate`),
    terminate: (id: string) => apiClient.post(`/services/${id}/terminate`),
    suspendService: (id: number) => apiClient.post(`/services/${id}/suspend`),
    activateService: (id: number) => apiClient.post(`/services/${id}/activate`),
    terminateService: (id: number) => apiClient.post(`/services/${id}/terminate`),
  },
  packages: {
    getAll: (params?: any) => apiClient.getPaginated('/packages', params),
    getById: (id: string) => apiClient.get(`/packages/${id}`),
    create: (data: any) => apiClient.post('/packages', data),
    update: (id: string, data: any) => apiClient.put(`/packages/${id}`, data),
    delete: (id: string) => apiClient.delete(`/packages/${id}`),
  },
  billing: {
    getInvoices: (params?: any) => apiClient.getPaginated('/invoices', params),
    getInvoice: (id: string) => apiClient.get(`/invoices/${id}`),
    createInvoice: (data: any) => apiClient.post('/invoices', data),
    updateInvoice: (id: string, data: any) => apiClient.put(`/invoices/${id}`, data),
    deleteInvoice: (id: string) => apiClient.delete(`/invoices/${id}`),
    markPaid: (id: string, data: any) => apiClient.post(`/invoices/${id}/pay`, data),
    getPayments: (params?: any) => apiClient.getPaginated('/payments', params),
  },
  network: {
    getDevices: () => apiClient.get('/network/devices'),
    createDevice: (data: any) => apiClient.post('/network/devices', data),
    updateDevice: (id: string, data: any) => apiClient.put(`/network/devices/${id}`, data),
    deleteDevice: (id: string) => apiClient.delete(`/network/devices/${id}`),
    getSessions: (params?: any) => apiClient.getPaginated('/network/sessions', params),
    disconnectUser: (username: string) => apiClient.post(`/network/disconnect/${username}`),
  },
  tickets: {
    getAll: (params?: any) => apiClient.getPaginated('/tickets', params),
    getById: (id: string) => apiClient.get(`/tickets/${id}`),
    create: (data: any) => apiClient.post('/tickets', data),
    update: (id: string, data: any) => apiClient.put(`/tickets/${id}`, data),
    delete: (id: string) => apiClient.delete(`/tickets/${id}`),
    addReply: (id: string, data: any) => apiClient.post(`/tickets/${id}/replies`, data),
  },
  dashboard: {
    getStats: () => apiClient.get('/dashboard/stats'),
    getRevenueChart: (period: string) => apiClient.get(`/dashboard/revenue?period=${period}`),
    getUsageChart: (period: string) => apiClient.get(`/dashboard/usage?period=${period}`),
  },
  logs: {
    getActivityLogs: (params?: any) => apiClient.getPaginated('/logs/activity', params),
  },
}
