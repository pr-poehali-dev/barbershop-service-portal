import { useState, useEffect, useCallback } from 'react';
import { useApiQuery } from '@/hooks/useApiQuery';
import { 
  dashboardService,
  DashboardStats,
  SalesChartData,
  ServiceCategoryData,
  AppointmentsByDayData,
  RecentActivity,
  UpcomingAppointment,
  RecentOrder,
  StaffAvailability,
  SalesForecast,
  BusinessHours
} from '@/services/dashboardService';

/**
 * Hook для получения всех данных дашборда
 */
export function useDashboard() {
  // Временной диапазон для графика продаж
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  
  // Автоматическое обновление в реальном времени
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false);
  const [refreshInterval, setRefreshInterval] = useState<number>(60); // в секундах
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  
  // Фильтры
  const [dateFilter, setDateFilter] = useState<[Date | undefined, Date | undefined]>([undefined, undefined]);
  const [staffFilter, setStaffFilter] = useState<number | undefined>(undefined);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  
  // Состояние загрузки и ошибки
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
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

  // Запрос прогноза продаж
  const {
    data: salesForecast,
    isLoading: isSalesForecastLoading,
    error: salesForecastError,
    refetch: refetchSalesForecast
  } = useApiQuery({
    queryFn: () => dashboardService.getSalesForecast(),
    enabled: true
  });

  // Запрос доступности сотрудников
  const {
    data: staffAvailability,
    isLoading: isStaffAvailabilityLoading,
    error: staffAvailabilityError,
    refetch: refetchStaffAvailability
  } = useApiQuery({
    queryFn: () => dashboardService.getStaffAvailability(),
    enabled: true
  });

  // Запрос часов работы
  const {
    data: businessHours,
    isLoading: isBusinessHoursLoading,
    error: businessHoursError,
    refetch: refetchBusinessHours
  } = useApiQuery({
    queryFn: () => dashboardService.getBusinessHours(),
    enabled: true
  });

  // Запрос данных графика продаж
  const { 
    data: salesChart, 
    isLoading: isSalesChartLoading,
    error: salesChartError,
    refetch: refetchSalesChart
  } = useApiQuery({
    queryFn: () => dashboardService.getSalesChartData(timeRange, dateFilter[0], dateFilter[1]),
    params: {
      timeRange,
      startDate: dateFilter[0]?.toISOString(),
      endDate: dateFilter[1]?.toISOString()
    },
    enabled: true
  });

  // Запрос данных категорий услуг
  const { 
    data: serviceCategories, 
    isLoading: isServiceCategoriesLoading,
    error: serviceCategoriesError,
    refetch: refetchServiceCategories
  } = useApiQuery({
    queryFn: () => dashboardService.getServiceCategoriesData(categoryFilter),
    params: { categoryId: categoryFilter },
    enabled: true
  });

  // Запрос данных записей по дням
  const { 
    data: appointmentsByDay, 
    isLoading: isAppointmentsByDayLoading,
    error: appointmentsByDayError,
    refetch: refetchAppointmentsByDay
  } = useApiQuery({
    queryFn: () => dashboardService.getAppointmentsByDay(dateFilter[0], dateFilter[1], staffFilter),
    params: {
      startDate: dateFilter[0]?.toISOString(),
      endDate: dateFilter[1]?.toISOString(),
      staffId: staffFilter
    },
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
    queryFn: () => dashboardService.getUpcomingAppointments(staffFilter),
    params: { staffId: staffFilter },
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

  // Обновление данных графика продаж при изменении временного диапазона или фильтров
  useEffect(() => {
    refetchSalesChart();
  }, [timeRange, dateFilter, refetchSalesChart]);

  // Обновление данных записей при изменении фильтров
  useEffect(() => {
    refetchAppointmentsByDay();
    refetchUpcomingAppointments();
  }, [dateFilter, staffFilter, refetchAppointmentsByDay, refetchUpcomingAppointments]);

  // Обновление данных категорий услуг при изменении фильтра
  useEffect(() => {
    refetchServiceCategories();
  }, [categoryFilter, refetchServiceCategories]);

  // Функция для обновления всех данных
  const refreshAllData = useCallback(() => {
    setIsRefreshing(true);
    
    // Обновляем все данные
    Promise.all([
      refetchStats(),
      refetchSalesChart(),
      refetchServiceCategories(),
      refetchAppointmentsByDay(),
      refetchRecentActivity(),
      refetchUpcomingAppointments(),
      refetchRecentOrders(),
      refetchSalesForecast(),
      refetchStaffAvailability(),
      refetchBusinessHours()
    ]).finally(() => {
      setLastRefreshed(new Date());
      setIsRefreshing(false);
    });
  }, [
    refetchStats,
    refetchSalesChart,
    refetchServiceCategories,
    refetchAppointmentsByDay,
    refetchRecentActivity,
    refetchUpcomingAppointments,
    refetchRecentOrders,
    refetchSalesForecast,
    refetchStaffAvailability,
    refetchBusinessHours
  ]);

  // Автоматическое обновление данных
  useEffect(() => {
    if (!autoRefresh) return;
    
    const intervalId = setInterval(() => {
      refreshAllData();
    }, refreshInterval * 1000);
    
    return () => clearInterval(intervalId);
  }, [autoRefresh, refreshInterval, refreshAllData]);

  // Сброс всех фильтров
  const resetFilters = useCallback(() => {
    setDateFilter([undefined, undefined]);
    setStaffFilter(undefined);
    setCategoryFilter(undefined);
    setTimeRange('month');
  }, []);

  // Обработка ошибок в одном месте
  const hasErrors = statsError || salesChartError || serviceCategoriesError || 
                    appointmentsByDayError || recentActivityError || 
                    upcomingAppointmentsError || recentOrdersError ||
                    salesForecastError || staffAvailabilityError || businessHoursError;

  return {
    // Данные
    stats,
    salesChart,
    serviceCategories,
    appointmentsByDay,
    recentActivity,
    upcomingAppointments,
    recentOrders,
    salesForecast,
    staffAvailability,
    businessHours,
    
    // Загрузка
    isLoading: isStatsLoading || 
               isSalesChartLoading || 
               isServiceCategoriesLoading || 
               isAppointmentsByDayLoading || 
               isRecentActivityLoading || 
               isUpcomingAppointmentsLoading || 
               isRecentOrdersLoading ||
               isSalesForecastLoading ||
               isStaffAvailabilityLoading ||
               isBusinessHoursLoading,
    
    isRefreshing,
    lastRefreshed,
    
    // Отдельные статусы загрузки
    isStatsLoading,
    isSalesChartLoading,
    isServiceCategoriesLoading,
    isAppointmentsByDayLoading,
    isRecentActivityLoading,
    isUpcomingAppointmentsLoading,
    isRecentOrdersLoading,
    isSalesForecastLoading,
    isStaffAvailabilityLoading,
    isBusinessHoursLoading,
    
    // Ошибки
    hasErrors,
    errors: {
      stats: statsError,
      salesChart: salesChartError,
      serviceCategories: serviceCategoriesError,
      appointmentsByDay: appointmentsByDayError,
      recentActivity: recentActivityError,
      upcomingAppointments: upcomingAppointmentsError,
      recentOrders: recentOrdersError,
      salesForecast: salesForecastError,
      staffAvailability: staffAvailabilityError,
      businessHours: businessHoursError
    },
    
    // Управление временным диапазоном и фильтрами
    timeRange,
    setTimeRange,
    dateFilter,
    setDateFilter,
    staffFilter,
    setStaffFilter,
    categoryFilter,
    setCategoryFilter,
    resetFilters,
    
    // Автоматическое обновление
    autoRefresh,
    setAutoRefresh,
    refreshInterval,
    setRefreshInterval,
    
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
      percentChange: 12,
      demographics: {
        ageGroups: [
          { label: "18-24", value: 15 },
          { label: "25-34", value: 35 },
          { label: "35-44", value: 30 },
          { label: "45-54", value: 15 },
          { label: "55+", value: 5 }
        ],
        gender: [
          { label: "Женщины", value: 68 },
          { label: "Мужчины", value: 32 }
        ]
      }
    },
    appointments: {
      total: 56,
      upcoming: 12,
      percentChange: 8,
      completionRate: 92,
      cancellationRate: 5
    },
    products: {
      total: 125,
      inStock: 98,
      percentChange: 5,
      lowStock: 12,
      topSelling: [
        { id: 1, name: "Шампунь премиум", sales: 48 },
        { id: 2, name: "Кондиционер увлажняющий", sales: 42 },
        { id: 3, name: "Маска для волос", sales: 36 }
      ]
    },
    revenue: {
      total: 156000,
      thisMonth: 24500,
      percentChange: 15,
      byService: {
        "Стрижки": 45000,
        "Окрашивание": 65000,
        "Укладка": 25000,
        "Уход": 21000
      },
      byProduct: {
        "Шампуни": 12000,
        "Кондиционеры": 8000,
        "Маски": 5000,
        "Прочее": 4000
      },
      forecast: 28000
    },
    staffPerformance: {
      topStaff: [
        { id: 1, name: "Анна Иванова", appointments: 42, revenue: 45000 },
        { id: 2, name: "Мария Петрова", appointments: 38, revenue: 42000 },
        { id: 3, name: "Иван Сидоров", appointments: 35, revenue: 38000 }
      ],
      averageRating: 4.8
    }
  };

  // Мок данные для прогноза продаж
  const mockSalesForecast: SalesForecast[] = [
    { period: "Май", amount: 28000, trend: "up", percentChange: 12 },
    { period: "Июнь", amount: 32000, trend: "up", percentChange: 15 },
    { period: "Июль", amount: 35000, trend: "up", percentChange: 8 }
  ];

  // Мок данные для доступности сотрудников
  const mockStaffAvailability: StaffAvailability[] = [
    { staffId: 1, staffName: "Анна Иванова", available: true, availableSlots: 12, bookedSlots: 4 },
    { staffId: 2, staffName: "Мария Петрова", available: true, availableSlots: 8, bookedSlots: 6 },
    { staffId: 3, staffName: "Иван Сидоров", available: false, availableSlots: 0, bookedSlots: 8 }
  ];

  // Мок данные для часов работы
  const mockBusinessHours: BusinessHours = {
    "Понедельник": { open: "09:00", close: "20:00" },
    "Вторник": { open: "09:00", close: "20:00" },
    "Среда": { open: "09:00", close: "20:00" },
    "Четверг": { open: "09:00", close: "20:00" },
    "Пятница": { open: "09:00", close: "21:00" },
    "Суббота": { open: "10:00", close: "21:00" },
    "Воскресенье": { open: "10:00", close: "18:00" }
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
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      metadata: {
        appointmentId: 12345,
        clientId: 101,
        services: ["Стрижка", "Окрашивание"]
      },
      user: {
        id: 101,
        name: "Анна Смирнова",
        avatar: "https://randomuser.me/api/portraits/women/12.jpg"
      }
    },
    {
      id: 2,
      type: 'client',
      title: 'Новый клиент',
      description: 'Иван Петров зарегистрировался в системе',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      user: {
        id: 102,
        name: "Иван Петров",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg"
      }
    },
    {
      id: 3,
      type: 'order',
      title: 'Новый заказ',
      description: 'Оформлен заказ №A1205 на сумму 2150 ₽',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      metadata: {
        orderId: "A1205",
        clientId: 103,
        amount: 2150
      },
      user: {
        id: 103,
        name: "Ольга Соколова"
      }
    },
    {
      id: 4,
      type: 'service',
      title: 'Обновление услуги',
      description: 'Изменена цена на услугу "Окрашивание волос"',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      metadata: {
        serviceId: 24,
        oldPrice: 3000,
        newPrice: 3500
      }
    },
    {
      id: 5,
      type: 'review',
      title: 'Новый отзыв',
      description: 'Клиент оставил отзыв о мастере Марии Петровой - 5 звезд',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      metadata: {
        rating: 5,
        staffId: 2,
        clientId: 104
      },
      user: {
        id: 104,
        name: "Елена Козлова",
        avatar: "https://randomuser.me/api/portraits/women/45.jpg"
      }
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
      date: "15 мая",
      staffName: "Мария Петрова",
      status: "confirmed"
    },
    {
      id: 2, 
      clientId: 102,
      clientName: "Иван Петров", 
      service: "Мужская стрижка", 
      time: "11:30", 
      date: "15 мая",
      staffName: "Александр Сидоров",
      status: "pending"
    },
    {
      id: 3, 
      clientId: 103,
      clientName: "Елена Козлова", 
      service: "Укладка", 
      time: "14:00", 
      date: "15 мая",
      staffName: "Анна Иванова",
      status: "confirmed"
    },
    {
      id: 4, 
      clientId: 104,
      clientName: "Дмитрий Иванов", 
      service: "Бритье и оформление бороды", 
      time: "15:30", 
      date: "15 мая",
      staffName: "Александр Сидоров",
      status: "confirmed"
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
    mockRecentOrders,
    mockSalesForecast,
    mockStaffAvailability,
    mockBusinessHours
  };
}