import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CircleUser, 
  Calendar, 
  ShoppingBag, 
  Scissors, 
  TrendingUp, 
  DollarSign,
  Clock,
  BarChart3
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

// Данные для графиков
const salesData = [
  { name: 'Янв', Услуги: 4000, Товары: 2400 },
  { name: 'Фев', Услуги: 3000, Товары: 1398 },
  { name: 'Мар', Услуги: 2000, Товары: 9800 },
  { name: 'Апр', Услуги: 2780, Товары: 3908 },
  { name: 'Май', Услуги: 1890, Товары: 4800 },
  { name: 'Июн', Услуги: 2390, Товары: 3800 },
  { name: 'Июл', Услуги: 3490, Товары: 4300 },
];

const serviceCategories = [
  { name: 'Стрижки', value: 45 },
  { name: 'Окрашивание', value: 30 },
  { name: 'Укладка', value: 15 },
  { name: 'Уход', value: 10 },
];

const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d'];

const appointmentsData = [
  { day: 'Пн', appointments: 12 },
  { day: 'Вт', appointments: 19 },
  { day: 'Ср', appointments: 15 },
  { day: 'Чт', appointments: 13 },
  { day: 'Пт', appointments: 25 },
  { day: 'Сб', appointments: 22 },
  { day: 'Вс', appointments: 10 },
];

// Мок данные для ближайших записей
const upcomingAppointments = [
  { id: 1, client: "Анна Смирнова", service: "Стрижка и окрашивание", time: "10:00", date: "15 мая" },
  { id: 2, client: "Иван Петров", service: "Мужская стрижка", time: "11:30", date: "15 мая" },
  { id: 3, client: "Елена Козлова", service: "Укладка", time: "14:00", date: "15 мая" },
  { id: 4, client: "Дмитрий Иванов", service: "Бритье и оформление бороды", time: "15:30", date: "15 мая" }
];

// Мок данные для последних заказов
const recentOrders = [
  { id: "A1205", client: "Ольга Соколова", products: "Шампунь, кондиционер", total: 2150, status: "Оплачен" },
  { id: "A1204", client: "Мария Кузнецова", products: "Маска для волос", total: 1450, status: "Оплачен" },
  { id: "A1203", client: "Андрей Борисов", products: "Гель для укладки", total: 850, status: "В обработке" },
  { id: "A1202", client: "Виктория Павлова", products: "Расческа, спрей для волос", total: 1950, status: "Отправлен" }
];

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState("week");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader userName="Администратор" />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-4">Обзор</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Статистика карточки */}
                <Card>
                  <CardContent className="p-6 flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <CircleUser className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Клиенты</p>
                      <h3 className="text-2xl font-bold">247</h3>
                      <p className="text-xs text-green-500">+12% с прошлого месяца</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Записи</p>
                      <h3 className="text-2xl font-bold">56</h3>
                      <p className="text-xs text-green-500">+8% с прошлой недели</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <ShoppingBag className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Товары</p>
                      <h3 className="text-2xl font-bold">125</h3>
                      <p className="text-xs text-green-500">+5% с прошлого месяца</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <DollarSign className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Доход</p>
                      <h3 className="text-2xl font-bold">156 000 ₽</h3>
                      <p className="text-xs text-green-500">+15% с прошлого месяца</p>
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
                    <Tabs defaultValue={timeRange} onValueChange={setTimeRange} className="w-auto">
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
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={salesData}
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
                        <Line type="monotone" dataKey="Услуги" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="Товары" stroke="#82ca9d" />
                      </LineChart>
                    </ResponsiveContainer>
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
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          dataKey="value"
                          isAnimationActive={true}
                          data={serviceCategories}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {serviceCategories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
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
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={appointmentsData}
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
                  <div className="space-y-6">
                    <div className="flex">
                      <div className="mr-4 flex flex-col items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div className="h-full w-px bg-border" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Новая запись</p>
                        <p className="text-sm text-muted-foreground">Клиент Анна Смирнова записалась на стрижку и окрашивание</p>
                        <p className="text-xs text-muted-foreground">10 минут назад</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="mr-4 flex flex-col items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <CircleUser className="h-5 w-5 text-primary" />
                        </div>
                        <div className="h-full w-px bg-border" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Новый клиент</p>
                        <p className="text-sm text-muted-foreground">Иван Петров зарегистрировался в системе</p>
                        <p className="text-xs text-muted-foreground">2 часа назад</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="mr-4 flex flex-col items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <ShoppingBag className="h-5 w-5 text-primary" />
                        </div>
                        <div className="h-full w-px bg-border" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Новый заказ</p>
                        <p className="text-sm text-muted-foreground">Оформлен заказ №A1205 на сумму 2150 ₽</p>
                        <p className="text-xs text-muted-foreground">3 часа назад</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="mr-4 flex flex-col items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Scissors className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Обновление услуги</p>
                        <p className="text-sm text-muted-foreground">Изменена цена на услугу "Окрашивание волос"</p>
                        <p className="text-xs text-muted-foreground">5 часов назад</p>
                      </div>
                    </div>
                  </div>
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
                  <div className="space-y-2">
                    {upcomingAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-3 border border-border rounded-md hover:border-primary transition-colors"
                      >
                        <div>
                          <h4 className="font-medium">{appointment.client}</h4>
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
                  <div className="space-y-2">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-3 border border-border rounded-md hover:border-primary transition-colors"
                      >
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium">№{order.id}</h4>
                            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                              order.status === "Оплачен" ? "bg-green-100 text-green-800" :
                              order.status === "В обработке" ? "bg-blue-100 text-blue-800" :
                              "bg-yellow-100 text-yellow-800"
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-sm">{order.client}</p>
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
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;