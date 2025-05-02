import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export interface ServiceItem {
  id: number;
  name: string;
  price: number;
  duration: number;
  categoryId: string;
}

interface ServiceSelectionProps {
  services: ServiceItem[];
  selectedServices: ServiceItem[];
  onToggleService: (service: ServiceItem) => void;
}

const ServiceSelection = ({
  services,
  selectedServices,
  onToggleService
}: ServiceSelectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter services based on search query
  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Group services by category
  const categorizedServices = filteredServices.reduce((acc, service) => {
    if (!acc[service.categoryId]) {
      acc[service.categoryId] = [];
    }
    acc[service.categoryId].push(service);
    return acc;
  }, {} as Record<string, ServiceItem[]>);
  
  // Category names mapping
  const categoryNames: Record<string, string> = {
    "haircut": "Стрижки",
    "coloring": "Окрашивание",
    "styling": "Укладка",
    "treatments": "Уход за волосами"
  };
  
  const isServiceSelected = (serviceId: number) => 
    selectedServices.some(s => s.id === serviceId);
  
  // Calculate total price and duration
  const totalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0);
  const totalDuration = selectedServices.reduce((sum, service) => sum + service.duration, 0);
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Выберите услуги</h3>
      
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          type="text"
          placeholder="Поиск услуг..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {selectedServices.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-2">Выбранные услуги</h4>
            <ul className="space-y-2">
              {selectedServices.map(service => (
                <li key={service.id} className="flex justify-between items-center">
                  <div>
                    <span>{service.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">({service.duration} мин)</span>
                  </div>
                  <span className="font-medium">{service.price} ₽</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-border mt-4 pt-4 flex justify-between items-center">
              <div>
                <span className="font-medium">Итого:</span>
                <span className="text-sm text-muted-foreground ml-2">
                  {totalDuration} мин
                </span>
              </div>
              <span className="text-lg font-bold text-primary">{totalPrice} ₽</span>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="space-y-6">
        {Object.keys(categorizedServices).map(categoryId => (
          <div key={categoryId}>
            <h4 className="font-medium mb-3">{categoryNames[categoryId] || categoryId}</h4>
            <div className="space-y-2">
              {categorizedServices[categoryId].map(service => (
                <div key={service.id} className="flex items-center justify-between p-3 border border-border rounded-md hover:border-primary transition-colors">
                  <div className="flex items-center">
                    <Checkbox 
                      id={`service-${service.id}`}
                      checked={isServiceSelected(service.id)}
                      onCheckedChange={() => onToggleService(service)}
                    />
                    <label 
                      htmlFor={`service-${service.id}`}
                      className="ml-2 cursor-pointer flex-1"
                    >
                      <div className="font-medium">{service.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {service.duration} мин
                      </div>
                    </label>
                  </div>
                  <div className="font-bold text-primary">{service.price} ₽</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceSelection;