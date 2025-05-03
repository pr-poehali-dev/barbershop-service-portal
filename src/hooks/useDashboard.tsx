import { useState, useEffect } from 'react';
import { useApiQuery } from '@/hooks/useApiQuery';
import { 
  dashboardService,
  DashboardStats,
  SalesChartData,
  ServiceCategoryData,
  AppointmentsByDayData,
  RecentActivity,
  UpcomingAppointment,
  RecentOrder
} from '@/services/dashboardService';

/**
 * Hook для получения всех данных дашборда
 */
export function useDashboard() {
  // Временной диапазон для графика продаж
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  
  // Запрос статистики
  const { 
    data: stats, 
    isLoading: isStatsLoading,
    error: statsError,
    refetch: refetchStats
  } = useApiQuery({
    queryFn: () => dashboardService.getStats(),
    enabled: true
  });

  // Запрос данных графика продаж
  const { 
    data: salesChart, 
    isLoading: isSalesChartLoading,
    error: salesChartError,
    refetch: refetchSalesChart
  } = useApiQuery({
    queryFn: () => dashboardService.getSalesChartData(timeRange),
    params: timeRange,
    enabled: true
  });

  // Запрос данных категорий услуг
  const { 
    data: serviceCategories, 
    isLoading: isServiceCategoriesLoading,
    error: serviceCategoriesError,
    refetch: refetchServiceCategories
  } = useApiQuery({
    queryFn: () => dashboardService.getServiceCategoriesData(),
    enabled: true
  });

  // Запрос данных записей по дням
  const { 
    data: appointmentsByDay, 
    isLoading: isAppointmentsByDayLoading,
    error: appointmentsByDayError,
    refetch: refetchAppointmentsByDay
  } = useApiQuery({
    queryFn: () => dashboardService.getAppointmentsByDay(),
    enabled: true
  });

  // Запрос данных недавней активности
  const { 
    data: recentActivity, 
    isLoading: isRecentActivityLoading,
    error: recentActivityError,
    refetch: refetchRecentActivity
  } = useApiQuery({
    queryFn: () => dashboardService.getRecentActivity(),
    enabled: true
  });

  // Запрос данных ближайших записей
  const { 
    data: upcomingAppointments, 
    isLoading: isUpcomingAppointmentsLoading,
    error: upcomingAppointmentsError,
    refetch: refetchUpcomingAppointments
  } = useApiQuery({
    queryFn: () => dashboardService.getUpcomingAppointments(),
    enabled: true
  });

  // Запрос данных последних заказов
  const { 
    data: recentOrders, 
    isLoading: isRecentOrdersLoading,
    error: recentOrdersError,
    refetch: refetchRecentOrders
  } = useApiQuery({
    queryFn: () => dashboardService.getRecentOrders(),
    enabled: true
  });

  // Обновление данных графика продаж при изменении временного диапазона
  useEffect(() => {
    refetchSalesChart();
  }, [timeRange, refetchSalesChart]);

  // Функция для обновления всех данных
  const refreshAllData = () => {
    refetchStats();
    refetchSalesChart();
    refetchServiceCategories();
    refetchAppointmentsByDay();
    refetchRecentActivity();
    refetchUpcomingAppointments();
    refetchRecentOrders();
  };

  return {
    // Данные
    stats,
    salesChart,
    serviceCategories,
    appointmentsByDay,
    recentActivity,
    upcomingAppointments,
    recentOrders,
    
    // Загрузка
    isLoading: isStatsLoading || 
               isSalesChartLoading || 
               isServiceCategoriesLoading || 
               isAppointmentsByDayLoading || 
               isRecentActivityLoading || 
               isUpcomingAppointmentsLoading || 
               isRecentOrdersLoading,
    
    // Отдельные статусы загрузки
    isStatsLoading,
    isSalesChartLoading,
    isServiceCategoriesLoading,
    isAppointmentsByDayLoading,
    isRecentActivityLoading,
    isUpcomingAppointmentsLoading,
    isRecentOrdersLoading,
    
    // Ошибки
    errors: {
      stats: statsError,
      salesChart: salesChartError,
      serviceCategories: serviceCategoriesError,
      appointmentsByDay: appointmentsByDayError,
      recentActivity: recentActivityError,
      upcomingAppointments: upcomingAppointmentsError,
      recentOrders: recentOrdersError
    },
    
    // Управление временным диапазоном
    timeRange,
    setTimeRange,
    
    // Обновление данных
    refreshAllData
  };
}

/**
 * Функция для получения фиктивных (мок) данных дашборда для оффлайн режима
 */
export function getMockDashboardData() {
  // Мок данные для статистики
  const mockStats: DashboardStats = {
    clients: {
      total: 247,
      newThisMonth: 15,
      percentChange: 12
    },
    appointments: {
      total: 56,
      upcoming: 12,
      percentChange: 8
    },
    products: {
      total: 125,
      inStock: 98,
      percentChange: 5
    },
    revenue: {
      total: 156000,
      thisMonth: 24500,
      percentChange: 15
    }
  };

  // Мок данные для графика продаж
  const mockSalesChart: SalesChartData[] = [
    { name: 'Янв', services: 4000, products: 2400 },
    { name: 'Фев', services: 3000, products: 1398 },
    { name: 'Мар', services: 2000, products: 9800 },
    { name: 'Апр', services: 2780, products: 3908 },
    { name: 'Май', services: 1890, products: 4800 },
    { name: 'Июн', services: 2390, products: 3800 },
    { name: 'Июл', services: 3490, products: 4300 }
  ];

  // Мок данные для категорий услуг
  const mockServiceCategories: ServiceCategoryData[] = [
    { name: 'Стрижки', value: 45 },
    { name: 'Окрашивание', value: 30 },
    { name: 'Укладка', value: 15 },
    { name: 'Уход', value: 10 }
  ];

  // Мок данные для записей по дням
  const mockAppointmentsByDay: AppointmentsByDayData[] = [
    { day: 'Пн', appointments: 12 },
    { day: 'Вт', appointments: 19 },
    { day: 'Ср', appointments: 15 },
    { day: 'Чт', appointments: 13 },
    { day: 'Пт', appointments: 25 },
    { day: 'Сб', appointments: 22 },
    { day: 'Вс', appointments: 10 }
  ];

  // Мок данные для недавней активности
  const mockRecentActivity: RecentActivity[] = [
    {
      id: 1,
      type: 'appointment',
      title: 'Новая запись',
      description: 'Клиент Анна Смирнова записалась на стрижку и окрашивание',
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      type: 'client',
      title: 'Новый клиент',
      description: 'Иван Петров зарегистрировался в системе',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 3,
      type: 'order',
      title: 'Новый заказ',
      description: 'Оформлен заказ №A1205 на сумму 2150 ₽',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 4,
      type: 'service',
      title: 'Обновление услуги',
      description: 'Изменена цена на услугу "Окрашивание волос"',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Мок данные для ближайших записей
  const mockUpcomingAppointments: UpcomingAppointment[] = [
    {
      id: 1, 
      clientId: 101,
      clientName: "Анна Смирнова", 
      service: "Стрижка и окрашивание", 
      time: "10:00", 
      date: "15 мая"
    },
    {
      id: 2, 
      clientId: 102,
      clientName: "Иван Петров", 
      service: "Мужская стрижка", 
      time: "11:30", 
      date: "15 мая"
    },
    {
      id: 3, 
      clientId: 103,
      clientName: "Елена Козлова", 
      service: "Укладка", 
      time: "14:00", 
      date: "15 мая"
    },
    {
      id: 4, 
      clientId: 104,
      clientName: "Дмитрий Иванов", 
      service: "Бритье и оформление бороды", 
      time: "15:30", 
      date: "15 мая"
    }
  ];

  // Мок данные для последних заказов
  const mockRecentOrders: RecentOrder[] = [
    {
      id: "A1205", 
      clientName: "Ольга Соколова", 
      products: "Шампунь, кондиционер", 
      total: 2150, 
      status: 'paid',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "A1204", 
      clientName: "Мария Кузнецова", 
      products: "Маска для волос", 
      total: 1450, 
      status: 'paid',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "A1203", 
      clientName: "Андрей Борисов", 
      products: "Гель для укладки", 
      total: 850, 
      status: 'processing',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "A1202", 
      clientName: "Виктория Павлова", 
      products: "Расческа, спрей для волос", 
      total: 1950, 
      status: 'shipped',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
    }
  ];

  return {
    mockStats,
    mockSalesChart,
    mockServiceCategories,
    mockAppointmentsByDay,
    mockRecentActivity,
    mockUpcomingAppointments,
    mockRecentOrders
  };
}
