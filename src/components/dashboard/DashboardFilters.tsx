import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Check, Filter, RefreshCw, X } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface DashboardFiltersProps {
  staffFilter: number | undefined;
  setStaffFilter: (value: number | undefined) => void;
  dateFilter: [Date | undefined, Date | undefined];
  setDateFilter: (value: [Date | undefined, Date | undefined]) => void;
  categoryFilter: string | undefined;
  setCategoryFilter: (value: string | undefined) => void;
  autoRefresh: boolean;
  setAutoRefresh: (value: boolean) => void;
  refreshInterval: number;
  setRefreshInterval: (value: number) => void;
  onRefresh: () => void;
  resetFilters: () => void;
  isRefreshing: boolean;
  lastRefreshed: Date;
  staffMembers?: { id: number; name: string }[];
  categories?: { id: string; name: string }[];
}

const DashboardFilters = ({
  staffFilter,
  setStaffFilter,
  dateFilter,
  setDateFilter,
  categoryFilter,
  setCategoryFilter,
  autoRefresh,
  setAutoRefresh,
  refreshInterval,
  setRefreshInterval,
  onRefresh,
  resetFilters,
  isRefreshing,
  lastRefreshed,
  staffMembers = [],
  categories = []
}: DashboardFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>(dateFilter);
  
  // Подсчет количества активных фильтров
  const getActiveFiltersCount = () => {
    let count = 0;
    if (staffFilter !== undefined) count++;
    if (dateFilter[0] !== undefined || dateFilter[1] !== undefined) count++;
    if (categoryFilter !== undefined) count++;
    return count;
  };
  
  const activeFiltersCount = getActiveFiltersCount();
  
  const handleApplyFilters = () => {
    setDateFilter(dateRange);
    setIsOpen(false);
  };
  
  const handleResetFilters = () => {
    setDateRange([undefined, undefined]);
    resetFilters();
    setIsOpen(false);
  };
  
  const formatDateRange = () => {
    if (dateFilter[0] && dateFilter[1]) {
      return `${format(dateFilter[0], 'dd.MM.yyyy', { locale: ru })} - ${format(dateFilter[1], 'dd.MM.yyyy', { locale: ru })}`;
    }
    if (dateFilter[0]) {
      return `От ${format(dateFilter[0], 'dd.MM.yyyy', { locale: ru })}`;
    }
    if (dateFilter[1]) {
      return `До ${format(dateFilter[1], 'dd.MM.yyyy', { locale: ru })}`;
    }
    return "Все даты";
  };
  
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1"
      >
        <Filter className="h-4 w-4" />
        <span className="hidden sm:inline">Фильтры</span>
        {activeFiltersCount > 0 && (
          <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
            {activeFiltersCount}
          </Badge>
        )}
      </Button>
      
      {staffFilter !== undefined && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Сотрудник: {staffMembers.find(s => s.id === staffFilter)?.name || staffFilter}
          <button 
            className="ml-1" 
            onClick={() => setStaffFilter(undefined)}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}
      
      {(dateFilter[0] !== undefined || dateFilter[1] !== undefined) && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Даты: {formatDateRange()}
          <button 
            className="ml-1" 
            onClick={() => setDateFilter([undefined, undefined])}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}
      
      {categoryFilter !== undefined && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Категория: {categories.find(c => c.id === categoryFilter)?.name || categoryFilter}
          <button 
            className="ml-1" 
            onClick={() => setCategoryFilter(undefined)}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}
      
      <div className="ml-auto flex items-center gap-2">
        <div className="text-xs text-muted-foreground hidden sm:block">
          Обновлено: {lastRefreshed.toLocaleTimeString()}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Обновить</span>
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" title="Настройки автообновления">
              <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'text-primary' : ''}`} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72">
            <div className="space-y-3">
              <h4 className="font-medium">Настройки обновления</h4>
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-refresh">Автообновление</Label>
                <Switch
                  id="auto-refresh" 
                  checked={autoRefresh}
                  onCheckedChange={setAutoRefresh}
                />
              </div>
              {autoRefresh && (
                <div>
                  <Label>Интервал обновления</Label>
                  <Select
                    value={refreshInterval.toString()}
                    onValueChange={(value) => setRefreshInterval(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите интервал" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 секунд</SelectItem>
                      <SelectItem value="60">1 минута</SelectItem>
                      <SelectItem value="300">5 минут</SelectItem>
                      <SelectItem value="600">10 минут</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Панель фильтров */}
      {isOpen && (
        <Card className="w-full mt-2">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Сотрудник</Label>
                <Select
                  value={staffFilter?.toString() || ""}
                  onValueChange={(value) => setStaffFilter(value ? parseInt(value) : undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Все сотрудники" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Все сотрудники</SelectItem>
                    {staffMembers.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id.toString()}>
                        {staff.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Категория</Label>
                <Select
                  value={categoryFilter || ""}
                  onValueChange={(value) => setCategoryFilter(value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Все категории" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Все категории</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Период</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange[0] || dateRange[1] ? (
                        <>
                          {dateRange[0] ? format(dateRange[0], 'PPP', { locale: ru }) : 'От начала'} -
                          {dateRange[1] ? format(dateRange[1], 'PPP', { locale: ru }) : 'До конца'}
                        </>
                      ) : (
                        <span>Выберите даты</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange[0] || new Date()}
                      selected={{ from: dateRange[0], to: dateRange[1] }}
                      onSelect={(range) => setDateRange([range?.from, range?.to])}
                      numberOfMonths={2}
                      locale={ru}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button variant="outline" size="sm" onClick={handleResetFilters} className="mr-2">
                Сбросить
              </Button>
              <Button size="sm" onClick={handleApplyFilters}>
                <Check className="mr-2 h-4 w-4" />
                Применить
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardFilters;