import { useState, useEffect } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
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
  ChevronDown,
  Loader2
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useApiMutation } from "@/hooks/useApiMutation";
import { 
  Client, 
  ClientFilterParams, 
  CreateClientData, 
  clientService 
} from "@/services/clientService";

const ClientsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Client;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [filterParams, setFilterParams] = useState<ClientFilterParams>({
    page: 1,
    limit: 20
  });
  
  const { toast } = useToast();

  // Получение списка клиентов с использованием хука useApiQuery
  const { 
    data: clientsResponse, 
    isLoading: isLoadingClients, 
    error: clientsError, 
    refetch: refetchClients 
  } = useApiQuery({
    queryFn: () => clientService.getClients(filterParams),
    params: filterParams
  });

  // Хук для создания нового клиента
  const { 
    mutate: createClient, 
    isLoading: isCreatingClient 
  } = useApiMutation({
    mutationFn: (data: CreateClientData) => clientService.createClient(data),
    onSuccess: () => {
      setIsAddClientOpen(false);
      refetchClients();
      setNewClient({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        status: "active",
        notes: ""
      });
    }
  });

  // Хук для удаления клиента
  const { 
    mutate: deleteClient, 
    isLoading: isDeletingClient 
  } = useApiMutation({
    mutationFn: (id: number) => clientService.deleteClient(id),
    onSuccess: () => {
      setIsDetailModalOpen(false);
      refetchClients();
    }
  });

  // Обновляем параметры фильтрации при изменении таба
  useEffect(() => {
    const newFilterParams: ClientFilterParams = {
      ...filterParams,
      status: selectedTab !== "all" ? selectedTab as any : undefined,
      search: searchTerm || undefined,
      page: 1 // Сбрасываем на первую страницу при изменении фильтров
    };
    
    setFilterParams(newFilterParams);
  }, [selectedTab, searchTerm]);

  // Состояние для нового клиента
  const [newClient, setNewClient] = useState<CreateClientData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    status: "active",
    notes: ""
  });

  // Обработчик добавления нового клиента
  const handleAddClient = () => {
    createClient(newClient);
  };

  // Обработчик удаления клиента
  const handleDeleteClient = (id: number) => {
    deleteClient(id);
  };

  // Открыть модальное окно с деталями клиента
  const openClientDetails = (client: Client) => {
    setSelectedClient(client);
    setIsDetailModalOpen(true);
  };

  // Форматирование даты
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-";
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  // Статистика клиентов
  const clientsStats = {
    total: clientsResponse?.meta.total || 0,
    active: clientsResponse?.data.filter(client => client.status === "active").length || 0,
    vip: clientsResponse?.data.filter(client => client.status === "vip").length || 0,
    inactive: clientsResponse?.data.filter(client => client.status === "inactive").length || 0
  };

  // Подготовка клиентов для отображения, включая сортировку
  const prepareClients = () => {
    if (!clientsResponse?.data) return [];
    
    let clients = [...clientsResponse.data];
    
    // Применяем сортировку, если она задана
    if (sortConfig) {
      clients.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return clients;
  };
  
  const clients = prepareClients();

  // Обработчик изменения сортировки
  const handleSort = (key: keyof Client) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
    
    // Обновляем параметры запроса для серверной сортировки
    setFilterParams({
      ...filterParams,
      sortBy: key,
      sortDirection: direction
    });
  };

  // Экспорт клиентов в CSV
  const handleExportClients = async () => {
    try {
      const blob = await clientService.exportClients(filterParams);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'clients.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Экспорт выполнен",
        description: "Список клиентов успешно экспортирован",
        duration: 3000
      });
    } catch (error) {
      console.error("Export error:", error);
    }
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1"
                  onClick={handleExportClients}
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Экспорт</span>
                </Button>
                <Button 
                  className="gap-1" 
                  onClick={() => setIsAddClientOpen(true)}
                >
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
                      {isLoadingClients ? (
                        <Skeleton className="h-8 w-16 mt-1" />
                      ) : (
                        <h3 className="text-2xl font-bold mt-1">{clientsStats.total}</h3>
                      )}
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
                      {isLoadingClients ? (
                        <Skeleton className="h-8 w-16 mt-1" />
                      ) : (
                        <h3 className="text-2xl font-bold mt-1">{clientsStats.active}</h3>
                      )}
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
                    {isLoadingClients ? (
                      <Skeleton className="h-4 w-24" />
                    ) : (
                      <div className="text-green-600">
                        {clientsStats.total > 0 ? 
                          `${Math.round(clientsStats.active / clientsStats.total * 100)}% от общего числа` : 
                          '0% от общего числа'}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">VIP клиенты</p>
                      {isLoadingClients ? (
                        <Skeleton className="h-8 w-16 mt-1" />
                      ) : (
                        <h3 className="text-2xl font-bold mt-1">{clientsStats.vip}</h3>
                      )}
                    </div>
                    <div className="p-2 bg-purple-50 rounded-full">
                      <Star className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between text-xs">
                    {isLoadingClients ? (
                      <Skeleton className="h-4 w-24" />
                    ) : (
                      <div className="text-purple-600">
                        {clientsStats.total > 0 ? 
                          `${Math.round(clientsStats.vip / clientsStats.total * 100)}% от общего числа` : 
                          '0% от общего числа'}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Неактивные клиенты</p>
                      {isLoadingClients ? (
                        <Skeleton className="h-8 w-16 mt-1" />
                      ) : (
                        <h3 className="text-2xl font-bold mt-1">{clientsStats.inactive}</h3>
                      )}
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
                    {isLoadingClients ? (
                      <Skeleton className="h-4 w-24" />
                    ) : (
                      <div className="text-red-600">
                        {clientsStats.total > 0 ? 
                          `${Math.round(clientsStats.inactive / clientsStats.total * 100)}% от общего числа` : 
                          '0% от общего числа'}
                      </div>
                    )}
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
                    <DropdownMenuItem onClick={() => handleSort('firstName')}>
                      По имени {sortConfig?.key === 'firstName' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
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
                {renderClientsTable(clients, isLoadingClients)}
              </TabsContent>
              <TabsContent value="active" className="mt-4">
                {renderClientsTable(clients, isLoadingClients)}
              </TabsContent>
              <TabsContent value="vip" className="mt-4">
                {renderClientsTable(clients, isLoadingClients)}
              </TabsContent>
              <TabsContent value="inactive" className="mt-4">
                {renderClientsTable(clients, isLoadingClients)}
              </TabsContent>
            </Tabs>
            
            {/* Пагинация */}
            {clientsResponse && clientsResponse.meta.lastPage > 1 && (
              <div className="flex justify-center mt-6">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilterParams({ ...filterParams, page: filterParams.page! - 1 })}
                    disabled={filterParams.page === 1 || isLoadingClients}
                  >
                    Назад
                  </Button>
                  {Array.from({ length: clientsResponse.meta.lastPage }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={page === filterParams.page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterParams({ ...filterParams, page })}
                      disabled={isLoadingClients}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilterParams({ ...filterParams, page: filterParams.page! + 1 })}
                    disabled={filterParams.page === clientsResponse.meta.lastPage || isLoadingClients}
                  >
                    Вперед
                  </Button>
                </div>
              </div>
            )}
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
              <Label htmlFor="firstName" className="text-right">
                Имя
              </Label>
              <Input
                id="firstName"
                value={newClient.firstName}
                onChange={(e) => setNewClient({...newClient, firstName: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Фамилия
              </Label>
              <Input
                id="lastName"
                value={newClient.lastName}
                onChange={(e) => setNewClient({...newClient, lastName: e.target.value})}
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
            <Button variant="outline" onClick={() => setIsAddClientOpen(false)} disabled={isCreatingClient}>
              Отмена
            </Button>
            <Button onClick={handleAddClient} disabled={isCreatingClient}>
              {isCreatingClient ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Добавление...
                </>
              ) : "Добавить"}
            </Button>
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
                      <AvatarImage src={selectedClient.avatar} alt={selectedClient.firstName} />
                      <AvatarFallback>
                        {`${selectedClient.firstName[0]}${selectedClient.lastName[0]}`}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold">{`${selectedClient.firstName} ${selectedClient.lastName}`}</h3>
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
                      {/* В реальном приложении здесь будут данные о визитах из API */}
                      <div className="p-3 border rounded-md flex items-center justify-between">
                        <div>
                          <p className="font-medium">Стрижка и окрашивание</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(selectedClient.lastVisit)}
                          </p>
                        </div>
                        <p className="font-medium">3500 ₽</p>
                      </div>
                      <div className="p-3 border rounded-md flex items-center justify-between">
                        <div>
                          <p className="font-medium">Покупка: Шампунь, кондиционер</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(selectedClient.lastVisit)}
                          </p>
                        </div>
                        <p className="font-medium">2150 ₽</p>
                      </div>
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
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="mr-2" 
                    onClick={() => handleDeleteClient(selectedClient.id)}
                    disabled={isDeletingClient}
                  >
                    {isDeletingClient ? (
                      <>
                        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                        Удаление...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Удалить
                      </>
                    )}
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
  function renderClientsTable(clients: Client[], isLoading: boolean) {
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
            {isLoading ? (
              // Скелетон загрузки
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-40" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-center">
                    <Skeleton className="h-4 w-8 mx-auto" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-center">
                    <Skeleton className="h-4 w-20 mx-auto" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-8 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  {clientsError ? (
                    <div className="text-red-500">
                      Ошибка загрузки данных. Пожалуйста, попробуйте позже.
                    </div>
                  ) : (
                    "Клиенты не найдены"
                  )}
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
                <TableRow key={client.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openClientDetails(client)}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={client.avatar} alt={`${client.firstName} ${client.lastName}`} />
                        <AvatarFallback>{`${client.firstName[0]}${client.lastName[0]}`}</AvatarFallback>
                      </Avatar>
                      <div>
                        {`${client.firstName} ${client.lastName}`}
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