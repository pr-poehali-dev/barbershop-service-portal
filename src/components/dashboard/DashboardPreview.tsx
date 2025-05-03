import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SalesForecast, StaffAvailability, BusinessHours, getStatusClass } from "@/services/dashboardService";
import { CircleUser, TrendingUp, TrendingDown, ShoppingBag, Clock, Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardPreviewCardProps {
  title: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  footer?: React.ReactNode;
}

export const DashboardPreviewCard = ({ title, value, icon, trend, footer }: DashboardPreviewCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="font-medium text-muted-foreground">{title}</div>
          <div className="p-2 bg-primary/10 rounded-full">{icon}</div>
        </div>
        <div className="text-3xl font-bold mb-2">{value}</div>
        {trend && (
          <div className={`flex items-center text-sm ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {trend.isPositive ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            <span>{trend.isPositive ? '+' : ''}{trend.value}% {trend.label}</span>
          </div>
        )}
      </CardContent>
      {footer && <CardFooter className="px-6 py-3 bg-muted/30 border-t">{footer}</CardFooter>}
    </Card>
  );
};

interface LowStockItemProps {
  name: string;
  currentStock: number;
  totalStock: number;
}

export const LowStockItem = ({ name, currentStock, totalStock }: LowStockItemProps) => {
  const percentage = Math.floor((currentStock / totalStock) * 100);
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{name}</span>
        <span className="text-muted-foreground">{currentStock}/{totalStock}</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
};

interface SalesForecastCardProps {
  forecasts: SalesForecast[];
}

export const SalesForecastCard = ({ forecasts }: SalesForecastCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-primary" />
          Прогноз продаж
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-4">
          {forecasts.map((forecast, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <div className="font-medium">{forecast.period}</div>
                <div className="text-sm text-muted-foreground">Прогноз</div>
              </div>
              <div className="text-right">
                <div className="font-bold">{forecast.amount.toLocaleString()} ₽</div>
                <div className={`text-sm flex items-center ${
                  forecast.trend === 'up' ? 'text-green-500' : 
                  forecast.trend === 'down' ? 'text-red-500' : 'text-yellow-500'
                }`}>
                  {forecast.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : 
                   forecast.trend === 'down' ? <TrendingDown className="h-3 w-3 mr-1" /> : null}
                  {forecast.trend === 'up' ? '+' : forecast.trend === 'down' ? '-' : ''}
                  {Math.abs(forecast.percentChange)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface StaffAvailabilityCardProps {
  staff: StaffAvailability[];
  onViewAll?: () => void;
}

export const StaffAvailabilityCard = ({ staff, onViewAll }: StaffAvailabilityCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <CircleUser className="h-5 w-5 mr-2 text-primary" />
            Доступность мастеров
          </CardTitle>
          {onViewAll && (
            <Button variant="ghost" size="sm" onClick={onViewAll} className="h-8 gap-1">
              Все
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-4">
          {staff.map((member) => (
            <div key={member.staffId} className="flex justify-between items-center">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${member.available ? 'bg-green-500' : 'bg-red-500'}`} />
                <div>
                  <div className="font-medium">{member.staffName}</div>
                  <div className="text-xs text-muted-foreground">
                    {member.available ? 'Доступен' : 'Занят'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant={member.availableSlots > 0 ? "outline" : "secondary"} className="mr-1">
                        {member.availableSlots} слот.
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Доступные слоты</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="secondary">
                        {member.bookedSlots} зап.
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Забронированные записи</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface UpcomingAppointmentCardProps {
  appointment: {
    id: number;
    clientName: string;
    service: string;
    time: string;
    date: string;
    staffName?: string;
    status: string;
  };
  onClick?: () => void;
}

export const UpcomingAppointmentCard = ({ appointment, onClick }: UpcomingAppointmentCardProps) => {
  return (
    <div 
      className="p-3 border rounded-md hover:border-primary transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium">{appointment.clientName}</div>
          <div className="text-sm text-muted-foreground">{appointment.service}</div>
          {appointment.staffName && (
            <div className="text-xs text-muted-foreground mt-1">Мастер: {appointment.staffName}</div>
          )}
        </div>
        <div className="text-right">
          <Badge variant="outline" className={getStatusClass(appointment.status)}>
            {appointment.status}
          </Badge>
          <div className="flex items-center mt-1 text-sm">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{appointment.date}</span>
          </div>
          <div className="flex items-center mt-1 text-sm">
            <Clock className="h-3 w-3 mr-1" />
            <span>{appointment.time}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface RecentOrderCardProps {
  order: {
    id: string;
    clientName: string;
    products: string;
    total: number;
    status: string;
    timestamp: string;
  };
  onClick?: () => void;
}

export const RecentOrderCard = ({ order, onClick }: RecentOrderCardProps) => {
  return (
    <div 
      className="p-3 border rounded-md hover:border-primary transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center">
            <div className="font-medium">№{order.id}</div>
            <Badge className={`ml-2 ${getStatusClass(order.status)}`}>
              {order.status}
            </Badge>
          </div>
          <div className="text-sm mt-1">{order.clientName}</div>
          <div className="text-xs text-muted-foreground mt-1">{order.products}</div>
        </div>
        <div className="text-right">
          <div className="font-bold text-primary">{order.total} ₽</div>
        </div>
      </div>
    </div>
  );
};

interface BusinessHoursCardProps {
  hours: BusinessHours;
}

export const BusinessHoursCard = ({ hours }: BusinessHoursCardProps) => {
  const today = new Date().toLocaleDateString('ru-RU', { weekday: 'long' });
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Clock className="h-5 w-5 mr-2 text-primary" />
          Часы работы
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-2">
          {Object.entries(hours).map(([day, time]) => (
            <div 
              key={day} 
              className={`flex justify-between items-center p-2 rounded-md ${
                capitalizeFirstLetter(today) === day ? 'bg-primary/10' : ''
              }`}
            >
              <div className="font-medium">{day}</div>
              <div>
                {time ? (
                  <span>{time.open} - {time.close}</span>
                ) : (
                  <span className="text-muted-foreground">Выходной</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface TopSellingProductsCardProps {
  products: { id: number; name: string; sales: number }[];
  totalSales: number;
  onViewAll?: () => void;
}

export const TopSellingProductsCard = ({ products, totalSales, onViewAll }: TopSellingProductsCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <ShoppingBag className="h-5 w-5 mr-2 text-primary" />
            Популярные товары
          </CardTitle>
          {onViewAll && (
            <Button variant="ghost" size="sm" onClick={onViewAll} className="h-8 gap-1">
              Все
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{product.name}</span>
                <span className="text-muted-foreground">{product.sales} шт.</span>
              </div>
              <Progress value={(product.sales / totalSales) * 100} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
