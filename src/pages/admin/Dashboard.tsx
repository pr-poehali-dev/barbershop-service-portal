import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  CircleUser, 
  Calendar, 
  ShoppingBag, 
  Scissors, 
  TrendingUp, 
  DollarSign,
  Clock,
  BarChart3,
  RefreshCw
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
  Cell
} from "recharts";
import { useDashboard, getMockDashboardData } from "@/hooks/useDashboard";
import { orderStatusText, timeAgo } from "@/services/dashboardService";
import { useToast } from "@/components/ui/use-toast";

// Палитра цветов для графиков
const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#ffc658'];

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
    isLoading,
    timeRange,
    setTimeRange,
    refreshAllData,
    errors
  } = useDashboard();

  // Получаем мок-данные для использования при ошибках API или в dev-режиме
  const {
    mockStats,
    mockSalesChart,
    mockServiceCategories,
    mockAppointmentsByDay,
    mockRecentActivity,
    mockUpcomingAppointments,
    mockRecentOrders
  } = getMockDashboardData();

  // Для удобства тестирования, используем мок-данные если API недоступно
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    // Если возникла ошибка API, переключаемся на мок-данные
    if (Object.values(errors).some(err => err !== null)) {
      setUseMockData(true);
      toast({
        title: "Ошибка загрузки данных",
        description: "Используются демонстрационные данные",
        variant: "destructive"
      });
    }
  }, [errors, toast]);

  // Выбираем данные в зависимости от статуса загрузки и наличия ошибок
  const displayStats = useMockData ? mockStats : stats;
  const displaySalesChart = useMockData ? mockSalesChart : salesChart;
  const displayServiceCategories = useMockData ? mockServiceCategories : serviceCategories;
  const displayAppointmentsByDay = useMockData ? mockAppointmentsByDay : appointmentsByDay;
  const displayRecentActivity = useMockData ? mockRecentActivity : recentActivity;
  const displayUpcomingAppointments = useMockData ? mockUpcomingAppointments : upcomingAppointments;
  const displayRecentOrders = useMockData ? mockRecentOrders : recentOrders;

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
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold">Обзор</h1>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    className="flex items-center gap-1"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Обновить</span>
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Карточка статистики клиентов */}
                  <Card>
                    <CardContent className="p-6 flex items-center space-x-4">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <CircleUser className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Клиенты</p>
                        <h3 className="text-2xl font-bold">{displayStats?.clients.total}</h3>
                        {displayStats?.clients.percentChange !== 0 && (
                          <p className={`text-xs ${displayStats?.clients.percentChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {displayStats?.clients.percentChange > 0 ? '+' : ''}{displayStats?.clients.percentChange}% с прошлого месяца
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Карточка статистики записей */}
                  <Card>
                    <CardContent className="p-6 flex items-center space-x-4">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Записи</p>
                        <h3 className="text-2xl font-bold">{displayStats?.appointments.total}</h3>
                        {displayStats?.appointments.percentChange !== 0 && (
                          <p className={`text-xs ${displayStats?.appointments.percentChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {displayStats?.appointments.percentChange > 0 ? '+' : ''}{displayStats?.appointments.percentChange}% с прошлой недели
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Карточка статистики товаров */}
                  <Card>
                    <CardContent className="p-6 flex items-center space-x-4">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <ShoppingBag className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Товары</p>
                        <h3 className="text-2xl font-bold">{displayStats?.products.total}</h3>
                        {displayStats?.products.percentChange !== 0 && (
                          <p className={`text-xs ${displayStats?.products.percentChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {displayStats?.products.percentChange > 0 ? '+' : ''}{displayStats?.products.percentChange}% с прошлого месяца
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Карточка статистики дохода */}
                  <Card>
                    <CardContent className="p-6 flex items-center space-x-4">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <DollarSign className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Доход</p>
                        <h3 className="text-2xl font-bold">{displayStats?.revenue.total.toLocaleString()} ₽</h3>
                        {displayStats?.revenue.percentChange !== 0 && (
                          <p className={`text-xs ${displayStats?.revenue.percentChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {displayStats?.revenue.percentChange > 0 ? '+' : ''}{displayStats?.revenue.percentChange}% с прошлого месяца
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* Графики */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* График продаж */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Продажи</CardTitle>
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
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="services" name="Услуги" stroke="#8884d8" activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="products" name="Товары" stroke="#82ca9d" />
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
                
                {/* Статистика по услугам */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Популярные услуги</CardTitle>
                    <CardDescription>Распределение услуг по категориям</CardDescription>
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
                
                {/* График записей */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Записи по дням недели</CardTitle>
                    <CardDescription>Анализ загруженности</CardDescription>
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
                            <Bar dataKey="appointments" name="Количество записей" fill="#8884d8" />
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
              </div>
              
              {/* Ближайшие записи и последние заказы */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                          <div
                            key={appointment.id}
                            className="flex items-center justify-between p-3 border border-border rounded-md hover:border-primary transition-colors"
                            onClick={() => navigate(`/admin/appointments/${appointment.id}`)}
                            style={{ cursor: 'pointer' }}
                          >
                            <div>
                              <h4 className="font-medium">{appointment.clientName}</h4>
                              <p className="text-sm text-muted-foreground">{appointment.service}</p>
                            </div>
                            <div className="flex items-center text-right">
                              <div className="mr-4">
                                <p className="text-sm font-medium">
                                  {appointment.date}
                                </p>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Clock className="mr-1 h-3 w-3" />
                                  {appointment.time}
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                Детали
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {[1, 2, 3, 4].map((i) => (
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
                          <div
                            key={order.id}
                            className="flex items-center justify-between p-3 border border-border rounded-md hover:border-primary transition-colors"
                            onClick={() => navigate(`/admin/products/orders/${order.id}`)}
                            style={{ cursor: 'pointer' }}
                          >
                            <div>
                              <div className="flex items-center">
                                <h4 className="font-medium">№{order.id}</h4>
                                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                                  order.status === 'paid' ? "bg-green-100 text-green-800" :
                                  order.status === 'processing' ? "bg-blue-100 text-blue-800" :
                                  order.status === 'shipped' ? "bg-yellow-100 text-yellow-800" :
                                  order.status === 'delivered' ? "bg-purple-100 text-purple-800" :
                                  "bg-red-100 text-red-800"
                                }`}>
                                  {orderStatusText(order.status)}
                                </span>
                              </div>
                              <p className="text-sm">{order.clientName}</p>
                              <p className="text-xs text-muted-foreground">{order.products}</p>
                            </div>
                            <div className="flex items-center">
                              <p className="font-medium text-primary mr-4">{order.total} ₽</p>
                              <Button variant="outline" size="sm">
                                Детали
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {[1, 2, 3, 4].map((i) => (
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
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;