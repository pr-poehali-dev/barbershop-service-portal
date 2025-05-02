import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Download, 
  Filter, 
  RefreshCw, 
  Star,
  MailIcon,
  PhoneIcon,
  Calendar,
  ArrowUpDown,
  ChevronDown
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Тип данных клиента
interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  visits: number;
  lastVisit: string;
  totalSpent: number;
  status: 'active' | 'inactive' | 'vip';
  avatar?: string;
  notes?: string;
}

// Моковые данные клиентов
const mockClients: Client[] = [
  {
    id: 1,
    name: "Анна Смирнова",
    email: "anna@example.com",
    phone: "+7 (901) 234-56-78",
    visits: 12,
    lastVisit: "2025-04-25",
    totalSpent: 25600,
    status: "vip",
    avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    notes: "Предпочитает натуральные средства. Аллергия на никель."
  },
  {
    id: 2,
    name: "Иван Петров",
    email: "ivan@example.com",
    phone: "+7 (902) 345-67-89",
    visits: 5,
    lastVisit: "2025-04-20",
    totalSpent: 8700,
    status: "active",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
  },
  {
    id: 3,
    name: "Екатерина Иванова",
    email: "ekaterina@example.com",
    phone: "+7 (903) 456-78-90",
    visits: 8,
    lastVisit: "2025-04-15",
    totalSpent: 12400,
    status: "active",
    avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
  },
  {
    id: 4,
    name: "Дмитрий Соколов",
    email: "dmitriy@example.com",
    phone: "+7 (904) 567-89-01",
    visits: 3,
    lastVisit: "2025-03-28",
    totalSpent: 4500,
    status: "inactive",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
  },
  {
    id: 5,
    name: "Ольга Козлова",
    email: "olga@example.com",
    phone: "+7 (905) 678-90-12",
    visits: 15,
    lastVisit: "2025-05-01",
    totalSpent: 32000,
    status: "vip",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    notes: "Дни рождения детей: 15 мая, 22 июля. Любит разговаривать о путешествиях."
  },
  {
    id: 6,
    name: "Алексей Новиков",
    email: "alexey@example.com",
    phone: "+7 (906) 789-01-23",
    visits: 1,
    lastVisit: "2025-04-10",
    totalSpent: 2100,
    status: "active",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
  },
  {
    id: 7,
    name: "Мария Кузнецова",
    email: "maria@example.com",
    phone: "+7 (907) 890-12-34",
    visits: 6,
    lastVisit: "2025-04-03",
    totalSpent: 9800,
    status: "active",
    avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
  },
  {
    id: 8,
    name: "Сергей Морозов",
    email: "sergey@example.com",
    phone: "+7 (908) 901-23-45",
    visits: 0,
    lastVisit: "-",
    totalSpent: 0,
    status: "inactive",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
  }
];

const ClientsPage = () => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [newClient, setNewClient] = useState<Partial<Client>>({
    name: "",
    email: "",
    phone: "",
    status: "active",
    notes: ""
  });
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Client;
    direction: 'asc' | 'desc';
  } | null>(null);
  
  const { toast } = useToast();

  // Фильтрация клиентов по статусу и поиску
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm);
    
    if (selectedTab === "all") return matchesSearch;
    if (selectedTab === "vip") return client.status === "vip" && matchesSearch;
    if (selectedTab === "active") return client.status === "active" && matchesSearch;
    if (selectedTab === "inactive") return client.status === "inactive" && matchesSearch;
    
    return matchesSearch;
  });

  // Сортировка клиентов
  const sortedClients = [...filteredClients].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const { key, direction } = sortConfig;
    
    if (a[key] < b[key]) {
      return direction === 'asc' ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Обработчик изменения сортировки
  const handleSort = (key: keyof Client) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
  };

  // Обработчик добавления нового клиента
  const handleAddClient = () => {
    const newId = Math.max(...clients.map(client => client.id)) + 1;
    const clientToAdd: Client = {
      id: newId,
      name: newClient.name || "",
      email: newClient.email || "",
      phone: newClient.phone || "",
      visits: 0,
      lastVisit: "-",
      totalSpent: 0,
      status: newClient.status as 'active' | 'inactive' | 'vip' || "active",
      notes: newClient.notes
    };
    
    setClients([...clients, clientToAdd]);
    setNewClient({
      name: "",
      email: "",
      phone: "",
      status: "active",
      notes: ""
    });
    setIsAddClientOpen(false);
    
    toast({
      title: "Клиент добавлен",
      description: `Клиент ${clientToAdd.name} успешно добавлен в систему.`,
      duration: 3000
    });
  };

  // Обработчик удаления клиента
  const handleDeleteClient = (id: number) => {
    const clientToDelete = clients.find(client => client.id === id);
    setClients(clients.filter(client => client.id !== id));
    
    toast({
      title: "Клиент удален",
      description: `Клиент ${clientToDelete?.name} был удален из системы.`,
      duration: 3000
    });
  };

  // Открыть модальное окно с деталями клиента
  const openClientDetails = (client: Client) => {
    setSelectedClient(client);
    setIsDetailModalOpen(true);
  };

  // Статистика клиентов
  const clientsStats = {
    total: clients.length,
    active: clients.filter(client => client.status === "active").length,
    vip: clients.filter(client => client.status === "vip").length,
    inactive: clients.filter(client => client.status === "inactive").length
  };

  // Форматирование даты
  const formatDate = (dateString: string) => {
    if (dateString === "-") return "-";
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader userName="Администратор" userRole="Владелец" />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Заголовок и действия */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">Клиенты</h1>
                <p className="text-muted-foreground">
                  Управление базой клиентов и историей их визитов
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Экспорт</span>
                </Button>
                <Button className="gap-1" onClick={() => setIsAddClientOpen(true)}>
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Добавить клиента</span>
                </Button>
              </div>
            </div>
            
            {/* Карточки статистики */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Всего клиентов</p>
                      <h3 className="text-2xl font-bold mt-1">{clientsStats.total}</h3>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6 text-blue-600"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-xs text-muted-foreground">
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Обновлено: сегодня
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Активные клиенты</p>
                      <h3 className="text-2xl font-bold mt-1">{clientsStats.active}</h3>
                    </div>
                    <div className="p-2 bg-green-50 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6 text-green-600"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between text-xs">
                    <div className="text-green-600">
                      {(clientsStats.active / clientsStats.total * 100).toFixed(0)}% от общего числа
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">VIP клиенты</p>
                      <h3 className="text-2xl font-bold mt-1">{clientsStats.vip}</h3>
                    </div>
                    <div className="p-2 bg-purple-50 rounded-full">
                      <Star className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between text-xs">
                    <div className="text-purple-600">
                      {(clientsStats.vip / clientsStats.total * 100).toFixed(0)}% от общего числа
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Неактивные клиенты</p>
                      <h3 className="text-2xl font-bold mt-1">{clientsStats.inactive}</h3>
                    </div>
                    <div className="p-2 bg-red-50 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6 text-red-600"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between text-xs">
                    <div className="text-red-600">
                      {(clientsStats.inactive / clientsStats.total * 100).toFixed(0)}% от общего числа
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Фильтры и поиск */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-1 max-w-sm relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Поиск клиентов..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Filter className="h-4 w-4" />
                  <span>Фильтры</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1">
                      <ArrowUpDown className="h-4 w-4" />
                      <span>Сортировка</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleSort('name')}>
                      По имени {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSort('visits')}>
                      По визитам {sortConfig?.key === 'visits' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSort('totalSpent')}>
                      По сумме {sortConfig?.key === 'totalSpent' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {/* Табы статусов */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid grid-cols-4 w-full sm:w-auto">
                <TabsTrigger value="all" className="relative">
                  Все
                  <Badge className="ml-1 bg-gray-200 text-gray-900">{clientsStats.total}</Badge>
                </TabsTrigger>
                <TabsTrigger value="active">
                  Активные
                  <Badge className="ml-1 bg-green-100 text-green-800">{clientsStats.active}</Badge>
                </TabsTrigger>
                <TabsTrigger value="vip">
                  VIP
                  <Badge className="ml-1 bg-purple-100 text-purple-800">{clientsStats.vip}</Badge>
                </TabsTrigger>
                <TabsTrigger value="inactive">
                  Неактивные
                  <Badge className="ml-1 bg-red-100 text-red-800">{clientsStats.inactive}</Badge>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-4">
                {renderClientsTable(sortedClients)}
              </TabsContent>
              <TabsContent value="active" className="mt-4">
                {renderClientsTable(sortedClients)}
              </TabsContent>
              <TabsContent value="vip" className="mt-4">
                {renderClientsTable(sortedClients)}
              </TabsContent>
              <TabsContent value="inactive" className="mt-4">
                {renderClientsTable(sortedClients)}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      
      {/* Диалог добавления клиента */}
      <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Добавить нового клиента</DialogTitle>
            <DialogDescription>
              Введите информацию о новом клиенте
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Имя
              </Label>
              <Input
                id="name"
                value={newClient.name}
                onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={newClient.email}
                onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Телефон
              </Label>
              <Input
                id="phone"
                value={newClient.phone}
                onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Статус
              </Label>
              <select
                id="status"
                value={newClient.status}
                onChange={(e) => setNewClient({...newClient, status: e.target.value as any})}
                className="col-span-3 p-2 border rounded-md"
              >
                <option value="active">Активный</option>
                <option value="vip">VIP</option>
                <option value="inactive">Неактивный</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Заметки
              </Label>
              <Textarea
                id="notes"
                value={newClient.notes}
                onChange={(e) => setNewClient({...newClient, notes: e.target.value})}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddClientOpen(false)}>Отмена</Button>
            <Button onClick={handleAddClient}>Добавить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Модальное окно с деталями клиента */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-3xl">
          {selectedClient && (
            <>
              <DialogHeader>
                <DialogTitle>Детальная информация о клиенте</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col md:flex-row gap-6">
                {/* Левая колонка - Информация о клиенте */}
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-6">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedClient.avatar} alt={selectedClient.name} />
                      <AvatarFallback>{selectedClient.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold">{selectedClient.name}</h3>
                      <div className="flex items-center">
                        <StatusBadge status={selectedClient.status} />
                        <span className="ml-2 text-sm text-muted-foreground">
                          ID: {selectedClient.id}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <MailIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{selectedClient.email}</span>
                    </div>
                    <div className="flex items-center">
                      <PhoneIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{selectedClient.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Последний визит: {formatDate(selectedClient.lastVisit)}</span>
                    </div>
                  </div>
                  
                  {selectedClient.notes && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Заметки</h4>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                        {selectedClient.notes}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Правая колонка - Статистика и история */}
                <div className="flex-1">
                  <h4 className="font-medium mb-4">Статистика клиента</h4>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <Card>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">Визиты</p>
                          <p className="text-2xl font-bold">{selectedClient.visits}</p>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-full">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">Потрачено</p>
                          <p className="text-2xl font-bold">{selectedClient.totalSpent} ₽</p>
                        </div>
                        <div className="p-2 bg-green-50 rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5 text-green-600"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="16" />
                            <line x1="8" y1="12" x2="16" y2="12" />
                          </svg>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <h4 className="font-medium mb-4">Последние визиты и покупки</h4>
                  
                  {selectedClient.visits > 0 ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      <div className="p-3 border rounded-md flex items-center justify-between">
                        <div>
                          <p className="font-medium">Стрижка и окрашивание</p>
                          <p className="text-xs text-muted-foreground">25.04.2025</p>
                        </div>
                        <p className="font-medium">3500 ₽</p>
                      </div>
                      <div className="p-3 border rounded-md flex items-center justify-between">
                        <div>
                          <p className="font-medium">Покупка: Шампунь, кондиционер</p>
                          <p className="text-xs text-muted-foreground">25.04.2025</p>
                        </div>
                        <p className="font-medium">2150 ₽</p>
                      </div>
                      {selectedClient.visits > 2 && (
                        <>
                          <div className="p-3 border rounded-md flex items-center justify-between">
                            <div>
                              <p className="font-medium">Укладка волос</p>
                              <p className="text-xs text-muted-foreground">10.04.2025</p>
                            </div>
                            <p className="font-medium">1800 ₽</p>
                          </div>
                          <div className="p-3 border rounded-md flex items-center justify-between">
                            <div>
                              <p className="font-medium">Маникюр</p>
                              <p className="text-xs text-muted-foreground">01.04.2025</p>
                            </div>
                            <p className="font-medium">2000 ₽</p>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-muted-foreground bg-muted rounded-md">
                      У клиента еще нет визитов или покупок
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter className="flex justify-between">
                <div>
                  <Button variant="destructive" size="sm" className="mr-2" onClick={() => {
                    handleDeleteClient(selectedClient.id);
                    setIsDetailModalOpen(false);
                  }}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Удалить
                  </Button>
                </div>
                <div>
                  <Button variant="outline" size="sm" className="mr-2">
                    <Edit className="h-4 w-4 mr-1" />
                    Редактировать
                  </Button>
                  <Button size="sm">
                    Записать на услугу
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
  
  // Вспомогательная функция для отображения таблицы клиентов
  function renderClientsTable(clients: Client[]) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Клиент</TableHead>
              <TableHead className="hidden md:table-cell">Контакты</TableHead>
              <TableHead className="hidden md:table-cell text-center">Визиты</TableHead>
              <TableHead className="hidden md:table-cell">Последний визит</TableHead>
              <TableHead className="hidden lg:table-cell text-center">Сумма</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Клиенты не найдены
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
                <TableRow key={client.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openClientDetails(client)}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={client.avatar} alt={client.name} />
                        <AvatarFallback>{client.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div>
                        {client.name}
                        <div className="flex items-center md:hidden mt-1">
                          <StatusBadge status={client.status} />
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <MailIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                        {client.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <PhoneIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                        {client.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-center">
                    {client.visits}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDate(client.lastVisit)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-center">
                    {client.totalSpent} ₽
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Действия</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openClientDetails(client)}>
                            Просмотр
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Редактировать
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Записать на услугу
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClient(client.id)}>
                            Удалить
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    );
  }
};

// Вспомогательный компонент для отображения статуса клиента
function StatusBadge({ status }: { status: 'active' | 'inactive' | 'vip' }) {
  let badgeClass = '';
  let label = '';
  
  switch (status) {
    case 'active':
      badgeClass = 'bg-green-100 text-green-800';
      label = 'Активный';
      break;
    case 'vip':
      badgeClass = 'bg-purple-100 text-purple-800';
      label = 'VIP';
      break;
    case 'inactive':
      badgeClass = 'bg-red-100 text-red-800';
      label = 'Неактивный';
      break;
  }
  
  return (
    <Badge variant="outline" className={badgeClass}>{label}</Badge>
  );
}

export default ClientsPage;