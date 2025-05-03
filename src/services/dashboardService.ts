import { api, handleApiError } from "@/lib/api";
import { jwtDecode } from "jwt-decode";

/**
 * Типы данных для дашборда
 */
export interface DashboardStats {
  clients: {
    total: number;
    newThisMonth: number;
    percentChange: number;
    demographics?: {
      ageGroups: { label: string; value: number }[];
      gender: { label: string; value: number }[];
    };
  };
  appointments: {
    total: number;
    upcoming: number;
    percentChange: number;
    completionRate?: number;
    cancellationRate?: number;
  };
  products: {
    total: number;
    inStock: number;
    percentChange: number;
    lowStock?: number;
    topSelling?: { id: number; name: string; sales: number }[];
  };
  revenue: {
    total: number;
    thisMonth: number;
    percentChange: number;
    byService?: { [key: string]: number };
    byProduct?: { [key: string]: number };
    forecast?: number;
  };
  staffPerformance?: {
    topStaff: { id: number; name: string; appointments: number; revenue: number }[];
    averageRating: number;
  };
}

export interface SalesChartData {
  name: string;
  services: number;
  products: number;
}

export interface ServiceCategoryData {
  name: string;
  value: number;
}

export interface AppointmentsByDayData {
  day: string;
  appointments: number;
}

export interface RecentActivity {
  id: number;
  type: 'appointment' | 'client' | 'order' | 'service' | 'product' | 'staff' | 'review';
  title: string;
  description: string;
  timestamp: string;
  relatedId?: number;
  metadata?: Record<string, any>;
  user?: {
    id: number;
    name: string;
    avatar?: string;
  };
}

export interface UpcomingAppointment {
  id: number;
  clientId: number;
  clientName: string;
  service: string;
  time: string;
  date: string;
  staffName?: string;
  status: string;
}

export interface RecentOrder {
  id: string;
  clientName: string;
  products: string;
  total: number;
  status: 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  timestamp: string;
}

export interface DashboardData {
  stats: DashboardStats;
  salesChart: SalesChartData[];
  serviceCategories: ServiceCategoryData[];
  appointmentsByDay: AppointmentsByDayData[];
  recentActivity: RecentActivity[];
  upcomingAppointments: UpcomingAppointment[];
  recentOrders: RecentOrder[];
}

export interface BusinessHours {
  [day: string]: { open: string; close: string } | null;
}

export interface StaffAvailability {
  staffId: number;
  staffName: string;
  available: boolean;
  availableSlots: number;
  bookedSlots: number;
}

export interface SalesForecast {
  period: string;
  amount: number;
  trend: 'up' | 'down' | 'stable';
  percentChange: number;
}

/**
 * Сервис для получения данных для дашборда
 */
export const dashboardService = {
  /**
   * Получение всех данных для дашборда
   */
  async getDashboardData(): Promise<DashboardData> {
    try {
      // Кэшируем данные на 5 минут
      const cacheKey = 'dashboardData';
      const cachedData = this.getCachedData<DashboardData>(cacheKey);
      
      if (cachedData) {
        return cachedData;
      }
      
      const response = await api.get<DashboardData>('/dashboard');
      
      // Кэшируем полученные данные
      this.cacheData(cacheKey, response, 5 * 60 * 1000); // 5 минут
      
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Получение базовых статистик для дашборда
   */
  async getStats(): Promise<DashboardStats> {
    try {
      const cacheKey = 'dashboardStats';
      const cachedData = this.getCachedData<DashboardStats>(cacheKey);
      
      if (cachedData) {
        return cachedData;
      }
      
      const response = await api.get<DashboardStats>('/dashboard/stats');
      
      // Кэшируем полученные данные
      this.cacheData(cacheKey, response, 5 * 60 * 1000); // 5 минут
      
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Получение данных графика продаж
   */
  async getSalesChartData(
    timeRange: 'week' | 'month' | 'year' = 'month',
    startDate?: Date,
    endDate?: Date
  ): Promise<SalesChartData[]> {
    try {
      const cacheKey = `salesChart_${timeRange}_${startDate?.toISOString() || ''}_${endDate?.toISOString() || ''}`;
      const cachedData = this.getCachedData<SalesChartData[]>(cacheKey);
      
      if (cachedData) {
        return cachedData;
      }
      
      const params: Record<string, string> = { timeRange };
      
      if (startDate) params.startDate = startDate.toISOString();
      if (endDate) params.endDate = endDate.toISOString();
      
      const response = await api.get<SalesChartData[]>('/dashboard/sales-chart', { params });
      
      // Кэшируем полученные данные
      this.cacheData(cacheKey, response, 5 * 60 * 1000); // 5 минут
      
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Получение данных по категориям услуг
   */
  async getServiceCategoriesData(categoryId?: string): Promise<ServiceCategoryData[]> {
    try {
      const cacheKey = `serviceCategories_${categoryId || 'all'}`;
      const cachedData = this.getCachedData<ServiceCategoryData[]>(cacheKey);
      
      if (cachedData) {
        return cachedData;
      }
      
      const params: Record<string, string> = {};
      if (categoryId) params.categoryId = categoryId;
      
      const response = await api.get<ServiceCategoryData[]>('/dashboard/service-categories', { params });
      
      // Кэшируем полученные данные
      this.cacheData(cacheKey, response, 10 * 60 * 1000); // 10 минут
      
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Получение данных по записям по дням
   */
  async getAppointmentsByDay(
    startDate?: Date,
    endDate?: Date,
    staffId?: number
  ): Promise<AppointmentsByDayData[]> {
    try {
      const cacheKey = `appointmentsByDay_${startDate?.toISOString() || ''}_${endDate?.toISOString() || ''}_${staffId || 'all'}`;
      const cachedData = this.getCachedData<AppointmentsByDayData[]>(cacheKey);
      
      if (cachedData) {
        return cachedData;
      }
      
      const params: Record<string, string> = {};
      
      if (startDate) params.startDate = startDate.toISOString();
      if (endDate) params.endDate = endDate.toISOString();
      if (staffId) params.staffId = staffId.toString();
      
      const response = await api.get<AppointmentsByDayData[]>('/dashboard/appointments-by-day', { params });
      
      // Кэшируем полученные данные
      this.cacheData(cacheKey, response, 5 * 60 * 1000); // 5 минут
      
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Получение данных о недавней активности
   */
  async getRecentActivity(limit: number = 10): Promise<RecentActivity[]> {
    try {
      return await api.get<RecentActivity[]>('/dashboard/recent-activity', {
        params: { limit }
      });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Получение данных о ближайших записях
   */
  async getUpcomingAppointments(staffId?: number, limit: number = 5): Promise<UpcomingAppointment[]> {
    try {
      const params: Record<string, string> = { limit: limit.toString() };
      if (staffId) params.staffId = staffId.toString();
      
      return await api.get<UpcomingAppointment[]>('/dashboard/upcoming-appointments', { params });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Получение данных о последних заказах
   */
  async getRecentOrders(limit: number = 5): Promise<RecentOrder[]> {
    try {
      return await api.get<RecentOrder[]>('/dashboard/recent-orders', {
        params: { limit }
      });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Получение прогноза продаж
   */
  async getSalesForecast(): Promise<SalesForecast[]> {
    try {
      const cacheKey = 'salesForecast';
      const cachedData = this.getCachedData<SalesForecast[]>(cacheKey);
      
      if (cachedData) {
        return cachedData;
      }
      
      const response = await api.get<SalesForecast[]>('/dashboard/sales-forecast');
      
      // Кэшируем полученные данные
      this.cacheData(cacheKey, response, 24 * 60 * 60 * 1000); // 24 часа
      
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Получение доступности персонала
   */
  async getStaffAvailability(date?: Date): Promise<StaffAvailability[]> {
    try {
      const params: Record<string, string> = {};
      if (date) params.date = date.toISOString();
      
      return await api.get<StaffAvailability[]>('/dashboard/staff-availability', { params });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Получение часов работы
   */
  async getBusinessHours(): Promise<BusinessHours> {
    try {
      const cacheKey = 'businessHours';
      const cachedData = this.getCachedData<BusinessHours>(cacheKey);
      
      if (cachedData) {
        return cachedData;
      }
      
      const response = await api.get<BusinessHours>('/dashboard/business-hours');
      
      // Кэшируем полученные данные
      this.cacheData(cacheKey, response, 24 * 60 * 60 * 1000); // 24 часа
      
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Метод для кэширования данных
   */
  cacheData<T>(key: string, data: T, expiresIn: number): void {
    try {
      const item = {
        value: data,
        expires: Date.now() + expiresIn
      };
      localStorage.setItem(`dashboard_cache_${key}`, JSON.stringify(item));
    } catch (e) {
      console.error('Failed to cache data', e);
    }
  },
  
  /**
   * Метод для получения кэшированных данных
   */
  getCachedData<T>(key: string): T | null {
    try {
      const cached = localStorage.getItem(`dashboard_cache_${key}`);
      
      if (!cached) return null;
      
      const item = JSON.parse(cached);
      
      if (Date.now() > item.expires) {
        localStorage.removeItem(`dashboard_cache_${key}`);
        return null;
      }
      
      return item.value as T;
    } catch (e) {
      console.error('Failed to get cached data', e);
      return null;
    }
  },
  
  /**
   * Очистка кэша дашборда
   */
  clearCache(): void {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('dashboard_cache_')) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }
};

/**
 * Преобразование статуса заказа в текстовое представление на русском
 */
export const orderStatusText = (status: string): string => {
  switch (status) {
    case 'paid': return 'Оплачен';
    case 'processing': return 'В обработке';
    case 'shipped': return 'Отправлен';
    case 'delivered': return 'Доставлен';
    case 'cancelled': return 'Отменен';
    case 'pending': return 'Ожидает';
    case 'confirmed': return 'Подтвержден';
    case 'completed': return 'Завершен';
    default: return status;
  }
};

/**
 * Преобразование класса статуса для отображения
 */
export const getStatusClass = (status: string): string => {
  switch (status) {
    case 'paid':
    case 'completed':
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'processing':
    case 'confirmed':
      return 'bg-blue-100 text-blue-800';
    case 'shipped':
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Преобразование относительного времени
 */
export const timeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffSeconds < 60) {
    return 'только что';
  } else if (diffSeconds < 3600) {
    const minutes = Math.floor(diffSeconds / 60);
    return `${minutes} ${getNumEnding(minutes, ['минуту', 'минуты', 'минут'])} назад`;
  } else if (diffSeconds < 86400) {
    const hours = Math.floor(diffSeconds / 3600);
    return `${hours} ${getNumEnding(hours, ['час', 'часа', 'часов'])} назад`;
  } else if (diffSeconds < 2592000) {
    const days = Math.floor(diffSeconds / 86400);
    return `${days} ${getNumEnding(days, ['день', 'дня', 'дней'])} назад`;
  } else {
    return formatDate(dateString);
  }
};

/**
 * Вспомогательная функция для правильного склонения слов
 */
function getNumEnding(number: number, endings: string[]): string {
  const cases = [2, 0, 1, 1, 1, 2];
  const index = (number % 100 > 4 && number % 100 < 20) ? 2 : cases[Math.min(number % 10, 5)];
  return endings[index];
}

/**
 * Форматирование даты
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

/**
 * Форматирование даты и времени
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};