import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import DashboardFilters from "@/components/dashboard/DashboardFilters";
import { 
  DashboardPreviewCard,
  SalesForecastCard,
  StaffAvailabilityCard,
  BusinessHoursCard,
  TopSellingProductsCard,
  UpcomingAppointmentCard,
  RecentOrderCard,
  LowStockItem
} from "@/components/dashboard/DashboardPreview";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  CircleUser, 
  Calendar, 
  ShoppingBag, 
  BarChart3,
  DollarSign,
  Clock,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  ReferenceLine
} from "recharts";
import { useDashboard, getMockDashboardData } from "@/hooks/useDashboard";
import { orderStatusText, timeAgo, getStatusClass } from "@/services/dashboardService";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Палитра цветов для графиков
const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#ffc658'];
const GENDER_COLORS = ['#ff80ab', '#82b1ff'];

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Используем хук для получения данных дашборда
  const {
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
    isLoading,
    isRefreshing,
    lastRefreshed,
    hasErrors,
    timeRange,
    setTimeRange,
    dateFilter,
    setDateFilter,
    staffFilter,
    setStaffFilter,
    categoryFilter,
    setCategoryFilter,
    autoRefresh,
    setAutoRefresh,
    refreshInterval,
    setRefreshInterval,
    resetFilters,
    refreshAllData
  } = useDashboard();

  // Получаем мок-данные для использования при ошибках API или в dev-режиме
  const {
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
  } = getMockDashboardData();

  // Для удобства тестирования, используем мок-данные если API недоступно
  const [useMockData, setUseMockData] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Если возникла ошибка API, переключаемся на мок-данные
    if (hasErrors) {
      setUseMockData(true);
      toast({
        title: "Ошибка загрузки данных",
        description: "Используются демонстрационные данные",
        variant: "destructive"
      });
    }
  }, [hasErrors, toast]);

  // Выбираем данные в зависимости от статуса загрузки и наличия ошибок
  const displayStats = useMockData ? mockStats : stats;
  const displaySalesChart = useMockData ? mockSalesChart : salesChart;
  const displayServiceCategories = useMockData ? mockServiceCategories : serviceCategories;
  const displayAppointmentsByDay = useMockData ? mockAppointmentsByDay : appointmentsByDay;
  const displayRecentActivity = useMockData ? mockRecentActivity : recentActivity;
  const displayUpcomingAppointments = useMockData ? mockUpcomingAppointments : upcomingAppointments;
  const displayRecentOrders = useMockData ? mockRecentOrders : recentOrders;
  const displaySalesForecast = useMockData ? mockSalesForecast : salesForecast;
  const displayStaffAvailability = useMockData ? mockStaffAvailability : staffAvailability;
  const displayBusinessHours = useMockData ? mockBusinessHours : businessHours;

  // Обработчик обновления данных
  const handleRefresh = () => {
    refreshAllData();
    
    if (useMockData) {
      setUseMockData(false);
      toast({
        title: "Обновление данных",
        description: "Попытка подключения к API..."
      });
    } else {
      toast({
        title: "Данные обновлены",
        description: "Данные дашборда успешно обновлены"
      });
    }
  };

  // Список сотрудников для фильтра
  const staffMembers = [
    { id: 1, name: "Анна Иванова" },
    { id: 2, name: "Мария Петрова" },
    { id: 3, name: "Иван Сидоров" }
  ];

  // Список категорий для фильтра
  const categories = [
    { id: "haircut", name: "Стрижки" },
    { id: "coloring", name: "Окрашивание" },
    { id: "styling", name: "Укладка" },
    { id: "care", name: "Уход" }
  ];

  // Получаем сумму всех продаж для расчета процентов
  const totalProductSales = displayStats?.products?.topSelling
    ? displayStats.products.topSelling.reduce((sum, product) => sum + product.sales, 0)
    : 0;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader 
          userName="Администратор" 
          userRole="Владелец" 
          onRefresh={handleRefresh}
        />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {isLoading && !displayStats ? (
            <DashboardSkeleton />
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Панель управления</h1>
                
                <Tabs 
                  defaultValue={activeTab} 
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-auto"
                >
                  <TabsList className="h-9">
                    <TabsTrigger value="overview" className="px-4">Обзор</TabsTrigger>
                    <TabsTrigger value="sales" className="px-4">Продажи</TabsTrigger>
                    <TabsTrigger value="clients" className="px-4">Клиенты</TabsTrigger>
                    <TabsTrigger value="staff" className="px-4">Персонал</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              {/* Фильтры */}
              <DashboardFilters
                staffFilter={staffFilter}
                setStaffFilter={setStaffFilter}
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                autoRefresh={autoRefresh}
                setAutoRefresh={setAutoRefresh}
                refreshInterval={refreshInterval}
                setRefreshInterval={setRefreshInterval}
                onRefresh={handleRefresh}
                resetFilters={resetFilters}
                isRefreshing={isRefreshing}
                lastRefreshed={lastRefreshed}
                staffMembers={staffMembers}
                categories={categories}
              />
              
              {useMockData && (
                <Alert variant="warning" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Демонстрационные данные</AlertTitle>
                  <AlertDescription>
                    Используются тестовые данные. Нажмите "Обновить", чтобы попробовать загрузить реальные данные.
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Вкладка Обзор */}
              <TabsContent value="overview" className="mt-0 space-y-6">
                {/* Статистика */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Карточка статистики клиентов */}
                  <DashboardPreviewCard
                    title="Клиенты"
                    value={displayStats?.clients.total}
                    icon={<CircleUser className="h-6 w-6 text-primary" />}
                    trend={{
                      value: displayStats?.clients.percentChange || 0,
                      isPositive: (displayStats?.clients.percentChange || 0) > 0,
                      label: "с прошлого месяца"
                    }}
                    footer={
                      <div className="text-xs">
                        <span className="font-medium">{displayStats?.clients.newThisMonth}</span> новых в этом месяце
                      </div>
                    }
                  />
                  
                  {/* Карточка статистики записей */}
                  <DashboardPreviewCard
                    title="Записи"
                    value={displayStats?.appointments.total}
                    icon={<Calendar className="h-6 w-6 text-primary" />}
                    trend={{
                      value: displayStats?.appointments.percentChange || 0,
                      isPositive: (displayStats?.appointments.percentChange || 0) > 0,
                      label: "с прошлой недели"
                    }}
                    footer={
                      <div className="text-xs">
                        <span className="font-medium">{displayStats?.appointments.upcoming}</span> предстоящих записей
                      </div>
                    }
                  />
                  
                  {/* Карточка статистики товаров */}
                  <DashboardPreviewCard
                    title="Товары"
                    value={displayStats?.products.total}
                    icon={<ShoppingBag className="h-6 w-6 text-primary" />}
                    trend={{
                      value: displayStats?.products.percentChange || 0,
                      isPositive: (displayStats?.products.percentChange || 0) > 0,
                      label: "с прошлого месяца"
                    }}
                    footer={
                      <div className="text-xs">
                        <span className="font-medium">{displayStats?.products.inStock}</span> товаров в наличии
                        {displayStats?.products.lowStock && (
                          <span className="ml-2 text-yellow-600">
                            ({displayStats.products.lowStock} заканчиваются)
                          </span>
                        )}
                      </div>
                    }
                  />
                  
                  {/* Карточка статистики дохода */}
                  <DashboardPreviewCard
                    title="Доход"
                    value={`${displayStats?.revenue.total.toLocaleString()} ₽`}
                    icon={<DollarSign className="h-6 w-6 text-primary" />}
                    trend={{
                      value: displayStats?.revenue.percentChange || 0,
                      isPositive: (displayStats?.revenue.percentChange || 0) > 0,
                      label: "с прошлого месяца"
                    }}
                    footer={
                      <div className="text-xs">
                        <span className="font-medium">{displayStats?.revenue.thisMonth.toLocaleString()} ₽</span> в этом месяце
                      </div>
                    }
                  />
                </div>
                
                {/* Графики и данные */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* График продаж */}
                  <Card className="lg:col-span-2">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Динамика продаж</CardTitle>
                        <Tabs 
                          defaultValue={timeRange} 
                          value={timeRange} 
                          onValueChange={(value) => setTimeRange(value as 'week' | 'month' | 'year')} 
                          className="w-auto"
                        >
                          <TabsList className="h-8">
                            <TabsTrigger value="week" className="text-xs px-3">Неделя</TabsTrigger>
                            <TabsTrigger value="month" className="text-xs px-3">Месяц</TabsTrigger>
                            <TabsTrigger value="year" className="text-xs px-3">Год</TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </div>
                      <CardDescription>Сравнение дохода от услуг и товаров</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="h-80">
                        {displaySalesChart ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={displaySalesChart}
                              margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                              }}
                            >
                              <defs>
                                <linearGradient id="colorServices" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                                </linearGradient>
                                <linearGradient id="colorProducts" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                              <XAxis 
                                dataKey="name" 
                                stroke="#999" 
                                fontSize={12}
                              />
                              <YAxis 
                                stroke="#999" 
                                fontSize={12}
                                tickFormatter={(value) => `${value / 1000}K`}
                              />
                              <Tooltip 
                                formatter={(value) => [`${value.toLocaleString()} ₽`, undefined]}
                                contentStyle={{ 
                                  borderRadius: '4px',
                                  border: '1px solid #e0e0e0',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}
                              />
                              <Legend />
                              <Area 
                                type="monotone" 
                                dataKey="services" 
                                name="Услуги" 
                                stroke="#8884d8" 
                                fillOpacity={1} 
                                fill="url(#colorServices)" 
                              />
                              <Area 
                                type="monotone" 
                                dataKey="products" 
                                name="Товары" 
                                stroke="#82ca9d" 
                                fillOpacity={1} 
                                fill="url(#colorProducts)" 
                              />
                              {displayStats?.revenue.forecast && (
                                <ReferenceLine 
                                  y={displayStats.revenue.forecast} 
                                  stroke="#ff7300" 
                                  strokeDasharray="3 3"
                                  label={{ 
                                    value: 'Прогноз', 
                                    fill: '#ff7300', 
                                    fontSize: 10,
                                    position: 'insideBottomRight'
                                  }}
                                />
                              )}
                            </AreaChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <Skeleton className="h-64 w-full" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Прогноз продаж */}
                  {displaySalesForecast ? (
                    <SalesForecastCard forecasts={displaySalesForecast} />
                  ) : (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Прогноз продаж</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="space-y-4">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex justify-between items-center">
                              <Skeleton className="h-6 w-20" />
                              <Skeleton className="h-6 w-24" />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                {/* Активность и записи */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Активность */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Активность</CardTitle>
                      <CardDescription>Последние события в системе</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2 h-80 overflow-auto">
                      {displayRecentActivity ? (
                        <div className="space-y-6">
                          {displayRecentActivity.map((activity) => (
                            <div className="flex" key={activity.id}>
                              <div className="mr-4 flex flex-col items-center">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                  {activity.type === 'appointment' && <Calendar className="h-5 w-5 text-primary" />}
                                  {activity.type === 'client' && <CircleUser className="h-5 w-5 text-primary" />}
                                  {activity.type === 'order' && <ShoppingBag className="h-5 w-5 text-primary" />}
                                  {activity.type === 'service' && <Scissors className="h-5 w-5 text-primary" />}
                                  {activity.type === 'product' && <ShoppingBag className="h-5 w-5 text-primary" />}
                                  {activity.type === 'review' && <BarChart3 className="h-5 w-5 text-primary" />}
                                </div>
                                <div className="h-full w-px bg-border" />
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">{activity.title}</p>
                                <p className="text-sm text-muted-foreground">{activity.description}</p>
                                <p className="text-xs text-muted-foreground">{timeAgo(activity.timestamp)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {[1, 2, 3, 4].map((i) => (
                            <div className="flex" key={i}>
                              <div className="mr-4 flex flex-col items-center">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="h-full w-px bg-border" />
                              </div>
                              <div className="space-y-1">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-56" />
                                <Skeleton className="h-3 w-20" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Ближайшие записи */}
                  <div className="space-y-6">
                    {/* Ближайшие записи */}
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">Ближайшие записи</CardTitle>
                          <Button variant="link" size="sm" onClick={() => navigate("/admin/appointments")}>
                            Все записи
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2">
                        {displayUpcomingAppointments ? (
                          <div className="space-y-2">
                            {displayUpcomingAppointments.map((appointment) => (
                              <UpcomingAppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                                onClick={() => navigate(`/admin/appointments/${appointment.id}`)}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="p-3 border border-border rounded-md">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-4 w-40 mt-1" />
                                  </div>
                                  <div className="flex items-center">
                                    <div className="mr-4">
                                      <Skeleton className="h-4 w-20" />
                                      <Skeleton className="h-3 w-16 mt-1" />
                                    </div>
                                    <Skeleton className="h-9 w-16" />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    {/* Последние заказы */}
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">Последние заказы</CardTitle>
                          <Button variant="link" size="sm" onClick={() => navigate("/admin/products/orders")}>
                            Все заказы
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2">
                        {displayRecentOrders ? (
                          <div className="space-y-2">
                            {displayRecentOrders.map((order) => (
                              <RecentOrderCard
                                key={order.id}
                                order={order}
                                onClick={() => navigate(`/admin/products/orders/${order.id}`)}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="p-3 border border-border rounded-md">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="flex items-center">
                                      <Skeleton className="h-5 w-16" />
                                      <Skeleton className="h-4 w-24 ml-2" />
                                    </div>
                                    <Skeleton className="h-4 w-32 mt-1" />
                                    <Skeleton className="h-3 w-40 mt-1" />
                                  </div>
                                  <div className="flex items-center">
                                    <Skeleton className="h-5 w-16 mr-4" />
                                    <Skeleton className="h-9 w-16" />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              {/* Вкладка продаж */}
              <TabsContent value="sales" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <DashboardPreviewCard
                    title="Доход этого месяца"
                    value={`${displayStats?.revenue.thisMonth.toLocaleString()} ₽`}
                    icon={<DollarSign className="h-6 w-6 text-primary" />}
                    trend={{
                      value: displayStats?.revenue.percentChange || 0,
                      isPositive: (displayStats?.revenue.percentChange || 0) > 0,
                      label: "прирост"
                    }}
                  />
                  
                  <DashboardPreviewCard
                    title="Заказов в этом месяце"
                    value={displayRecentOrders?.length || 0}
                    icon={<ShoppingBag className="h-6 w-6 text-primary" />}
                    trend={{
                      value: 8,
                      isPositive: true,
                      label: "прирост"
                    }}
                  />
                  
                  <DashboardPreviewCard
                    title="Средний чек"
                    value={`${Math.round(displayStats?.revenue.thisMonth / 
                      (displayRecentOrders?.length || 1)).toLocaleString()} ₽`}
                    icon={<BarChart3 className="h-6 w-6 text-primary" />}
                    trend={{
                      value: 3,
                      isPositive: true,
                      label: "прирост"
                    }}
                  />
                </div>
                
                {/* Распределение дохода */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Доход по услугам */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Структура дохода по услугам</CardTitle>
                      <CardDescription>Распределение дохода по категориям услуг</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="h-80">
                        {displayStats?.revenue.byService ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                dataKey="value"
                                nameKey="name"
                                isAnimationActive={true}
                                data={Object.entries(displayStats.revenue.byService).map(([name, value]) => ({ name, value }))}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {Object.entries(displayStats.revenue.byService).map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip 
                                formatter={(value) => [`${value.toLocaleString()} ₽`, undefined]}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <Skeleton className="h-64 w-64 rounded-full" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Доход по товарам */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Структура дохода по товарам</CardTitle>
                      <CardDescription>Распределение дохода по категориям товаров</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="h-80">
                        {displayStats?.revenue.byProduct ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                dataKey="value"
                                nameKey="name"
                                isAnimationActive={true}
                                data={Object.entries(displayStats.revenue.byProduct).map(([name, value]) => ({ name, value }))}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {Object.entries(displayStats.revenue.byProduct).map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip 
                                formatter={(value) => [`${value.toLocaleString()} ₽`, undefined]}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <Skeleton className="h-64 w-64 rounded-full" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Прогноз продаж */}
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Тренд продаж</CardTitle>
                        <CardDescription>Прогноз на основе исторических данных</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="h-80">
                          {displaySalesChart ? (
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={displaySalesChart}
                                margin={{
                                  top: 5,
                                  right: 30,
                                  left: 20,
                                  bottom: 5,
                                }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip 
                                  formatter={(value) => [`${value.toLocaleString()} ₽`, undefined]}
                                />
                                <Legend />
                                <Line 
                                  type="monotone" 
                                  dataKey="services" 
                                  name="Услуги" 
                                  stroke="#8884d8" 
                                  strokeWidth={2}
                                  dot={{ r: 4 }}
                                  activeDot={{ r: 8 }}
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="products" 
                                  name="Товары" 
                                  stroke="#82ca9d"
                                  strokeWidth={2}
                                  dot={{ r: 4 }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          ) : (
                            <div className="h-full flex items-center justify-center">
                              <Skeleton className="h-64 w-full" />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Популярные товары */}
                  {displayStats?.products.topSelling ? (
                    <TopSellingProductsCard
                      products={displayStats.products.topSelling}
                      totalSales={totalProductSales}
                      onViewAll={() => navigate("/admin/products")}
                    />
                  ) : (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Популярные товары</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="space-y-4">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-16" />
                              </div>
                              <Skeleton className="h-2 w-full" />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
              
              {/* Вкладка клиентов */}
              <TabsContent value="clients" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <DashboardPreviewCard
                    title="Всего клиентов"
                    value={displayStats?.clients.total || 0}
                    icon={<CircleUser className="h-6 w-6 text-primary" />}
                    trend={{
                      value: displayStats?.clients.percentChange || 0,
                      isPositive: (displayStats?.clients.percentChange || 0) > 0,
                      label: "прирост"
                    }}
                  />
                  
                  <DashboardPreviewCard
                    title="Новых клиентов"
                    value={displayStats?.clients.newThisMonth || 0}
                    icon={<CircleUser className="h-6 w-6 text-primary" />}
                    trend={{
                      value: 15,
                      isPositive: true,
                      label: "с прошлого месяца"
                    }}
                  />
                  
                  <DashboardPreviewCard
                    title="Средний чек клиента"
                    value={`${Math.round(displayStats?.revenue.total / 
                      (displayStats?.clients.total || 1)).toLocaleString()} ₽`}
                    icon={<DollarSign className="h-6 w-6 text-primary" />}
                    trend={{
                      value: 5,
                      isPositive: true,
                      label: "прирост"
                    }}
                  />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Демография клиентов: возраст */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Возрастные группы клиентов</CardTitle>
                      <CardDescription>Распределение клиентов по возрасту</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="h-80">
                        {displayStats?.clients.demographics?.ageGroups ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={displayStats.clients.demographics.ageGroups}
                              margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="label" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar 
                                dataKey="value" 
                                name="Количество клиентов" 
                                fill="#8884d8" 
                                radius={[4, 4, 0, 0]}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <Skeleton className="h-64 w-full" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Демография клиентов: пол */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Гендерное распределение</CardTitle>
                      <CardDescription>Распределение клиентов по полу</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="h-80">
                        {displayStats?.clients.demographics?.gender ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                dataKey="value"
                                nameKey="label"
                                isAnimationActive={true}
                                data={displayStats.clients.demographics.gender}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                label={({ label, percent }) => `${label} ${(percent * 100).toFixed(0)}%`}
                              >
                                {displayStats.clients.demographics.gender.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <Skeleton className="h-64 w-64 rounded-full" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Активные клиенты и популярные услуги */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Популярные услуги */}
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">Популярность услуг</CardTitle>
                        <Button variant="link" size="sm" onClick={() => navigate("/admin/services")}>
                          Все услуги
                        </Button>
                      </div>
                      <CardDescription>Распределение услуг по популярности</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="h-80 flex items-center justify-center">
                        {displayServiceCategories ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                dataKey="value"
                                isAnimationActive={true}
                                data={displayServiceCategories}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {displayServiceCategories.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <Skeleton className="h-64 w-64 rounded-full" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Статистика записей */}
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">Загруженность по дням недели</CardTitle>
                        <Button variant="link" size="sm" onClick={() => navigate("/admin/appointments")}>
                          График записей
                        </Button>
                      </div>
                      <CardDescription>Анализ загруженности по дням недели</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="h-80">
                        {displayAppointmentsByDay ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={displayAppointmentsByDay}
                              margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="day" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar 
                                dataKey="appointments" 
                                name="Количество записей" 
                                fill="#8884d8" 
                                radius={[4, 4, 0, 0]}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <Skeleton className="h-64 w-full" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Вкладка персонала */}
              <TabsContent value="staff" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <DashboardPreviewCard
                    title="Средний рейтинг"
                    value={displayStats?.staffPerformance?.averageRating.toFixed(1) || "0.0"}
                    icon={<BarChart3 className="h-6 w-6 text-primary" />}
                    trend={{
                      value: 0.2,
                      isPositive: true,
                      label: "прирост"
                    }}
                  />
                  
                  <DashboardPreviewCard
                    title="Записей на сегодня"
                    value={displayUpcomingAppointments?.filter(a => a.date.includes("сегодня")).length || 0}
                    icon={<Calendar className="h-6 w-6 text-primary" />}
                  />
                  
                  <DashboardPreviewCard
                    title="Завершение записей"
                    value={`${displayStats?.appointments.completionRate || 0}%`}
                    icon={<CheckCircle className="h-6 w-6 text-primary" />}
                    trend={{
                      value: 3,
                      isPositive: true,
                      label: "прирост"
                    }}
                  />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Топ сотрудников */}
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Эффективность мастеров</CardTitle>
                        <CardDescription>Производительность по записям и доходу</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="h-80">
                          {displayStats?.staffPerformance?.topStaff ? (
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={displayStats.staffPerformance.topStaff}
                                margin={{
                                  top: 20,
                                  right: 30,
                                  left: 20,
                                  bottom: 5,
                                }}
                                layout="vertical"
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="name" />
                                <Tooltip formatter={(value, name) => {
                                  if (name === "revenue") return [`${value.toLocaleString()} ₽`, "Доход"];
                                  return [value, "Записи"];
                                }} />
                                <Legend />
                                <Bar 
                                  dataKey="appointments" 
                                  name="Записи" 
                                  fill="#8884d8" 
                                  radius={[0, 4, 4, 0]}
                                />
                                <Bar 
                                  dataKey="revenue" 
                                  name="Доход" 
                                  fill="#82ca9d" 
                                  radius={[0, 4, 4, 0]}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          ) : (
                            <div className="h-full flex items-center justify-center">
                              <Skeleton className="h-64 w-full" />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Доступность мастеров */}
                  {displayStaffAvailability ? (
                    <StaffAvailabilityCard
                      staff={displayStaffAvailability}
                      onViewAll={() => navigate("/admin/appointments/schedule")}
                    />
                  ) : (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Доступность мастеров</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="space-y-4">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex justify-between items-center">
                              <div className="flex items-center">
                                <Skeleton className="h-2 w-2 rounded-full mr-2" />
                                <div>
                                  <Skeleton className="h-5 w-32" />
                                  <Skeleton className="h-3 w-20 mt-1" />
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Skeleton className="h-6 w-16" />
                                <Skeleton className="h-6 w-16" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Товары с низким запасом */}
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Товары с низким запасом</CardTitle>
                        <CardDescription>Товары, которые скоро закончатся</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-2">
                        {displayStats?.products?.lowStock ? (
                          <div className="space-y-4">
                            {[
                              { name: "Шампунь Kerastase", currentStock: 5, totalStock: 50 },
                              { name: "Маска для волос Olaplex", currentStock: 3, totalStock: 30 },
                              { name: "Кондиционер Redken", currentStock: 2, totalStock: 25 },
                              { name: "Средство для укладки", currentStock: 4, totalStock: 40 }
                            ].map((item, index) => (
                              <LowStockItem
                                key={index}
                                name={item.name}
                                currentStock={item.currentStock}
                                totalStock={item.totalStock}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {[1, 2, 3, 4].map((i) => (
                              <div key={i} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <Skeleton className="h-4 w-32" />
                                  <Skeleton className="h-4 w-16" />
                                </div>
                                <Skeleton className="h-2 w-full" />
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="border-t py-3">
                        <Button variant="outline" size="sm" className="ml-auto" onClick={() => navigate("/admin/products/inventory")}>
                          Управление запасами
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                  
                  {/* Часы работы */}
                  {displayBusinessHours ? (
                    <BusinessHoursCard hours={displayBusinessHours} />
                  ) : (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Часы работы</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="space-y-2">
                          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                            <div key={i} className="flex justify-between items-center p-2">
                              <Skeleton className="h-5 w-32" />
                              <Skeleton className="h-5 w-24" />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;