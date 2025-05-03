import { api, handleApiError } from "@/lib/api";

/**
 * Типы данных для дашборда
 */
export interface DashboardStats {
  clients: {
    total: number;
    newThisMonth: number;
    percentChange: number;
  };
  appointments: {
    total: number;
    upcoming: number;
    percentChange: number;
  };
  products: {
    total: number;
    inStock: number;
    percentChange: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
    percentChange: number;
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
  type: 'appointment' | 'client' | 'order' | 'service' | 'product';
  title: string;
  description: string;
  timestamp: string;
  relatedId?: number;
}

export interface UpcomingAppointment {
  id: number;
  clientId: number;
  clientName: string;
  service: string;
  time: string;
  date: string;
  staffName?: string;
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

/**
 * Сервис для получения данных для дашборда
 */
export const dashboardService = {
  /**
   * Получение всех данных для дашборда
   */
  async getDashboardData(): Promise<DashboardData> {
    try {
      return await api.get<DashboardData>('/dashboard');
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
      return await api.get<DashboardStats>('/dashboard/stats');
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Получение данных графика продаж
   */
  async getSalesChartData(timeRange: 'week' | 'month' | 'year' = 'month'): Promise<SalesChartData[]> {
    try {
      return await api.get<SalesChartData[]>('/dashboard/sales-chart', {
        params: { timeRange }
      });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Получение данных по категориям услуг
   */
  async getServiceCategoriesData(): Promise<ServiceCategoryData[]> {
    try {
      return await api.get<ServiceCategoryData[]>('/dashboard/service-categories');
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Получение данных по записям по дням недели
   */
  async getAppointmentsByDay(): Promise<AppointmentsByDayData[]> {
    try {
      return await api.get<AppointmentsByDayData[]>('/dashboard/appointments-by-day');
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Получение данных о последних активностях
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
  async getUpcomingAppointments(limit: number = 5): Promise<UpcomingAppointment[]> {
    try {
      return await api.get<UpcomingAppointment[]>('/dashboard/upcoming-appointments', {
        params: { limit }
      });
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
    default: return status;
  }
};

/**
 * Преобразование даты в читаемый формат
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long'
  }).format(date);
};

/**
 * Преобразование времени в формат "ЧЧ:ММ"
 */
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

/**
 * Получение относительного времени
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
