import { useState } from "react";
import { Bell, User, Search, MessageSquare } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
  userName?: string;
}

const DashboardHeader = ({ userName = "Администратор" }: DashboardHeaderProps) => {
  const [searchValue, setSearchValue] = useState("");
  
  return (
    <header className="h-16 border-b border-border bg-background flex items-center px-4 lg:px-6">
      {/* Search Bar */}
      <div className="hidden md:flex relative flex-1 max-w-sm mr-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Поиск..."
          className="pl-8"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      
      {/* Actions */}
      <div className="ml-auto flex items-center space-x-2">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-0 min-h-0 flex items-center justify-center text-[10px]">3</Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Уведомления</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {/* Notification Items */}
            <div className="max-h-[300px] overflow-y-auto">
              <DropdownMenuItem className="p-3 cursor-pointer">
                <div className="flex items-start">
                  <Avatar className="h-9 w-9 mr-3">
                    <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" />
                    <AvatarFallback>АС</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Новая запись</p>
                    <p className="text-xs text-muted-foreground mt-1">Анна Смирнова записалась на стрижку и окрашивание.</p>
                    <p className="text-xs text-muted-foreground mt-1">2 минуты назад</p>
                  </div>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="p-3 cursor-pointer">
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-800 rounded-full h-9 w-9 flex items-center justify-center mr-3">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Новый отзыв</p>
                    <p className="text-xs text-muted-foreground mt-1">Оставлен новый отзыв о работе мастера Елены.</p>
                    <p className="text-xs text-muted-foreground mt-1">45 минут назад</p>
                  </div>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="p-3 cursor-pointer">
                <div className="flex items-start">
                  <div className="bg-green-100 text-green-800 rounded-full h-9 w-9 flex items-center justify-center mr-3">
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Новый заказ</p>
                    <p className="text-xs text-muted-foreground mt-1">Оформлен заказ №A125 на сумму 3500 ₽.</p>
                    <p className="text-xs text-muted-foreground mt-1">1 час назад</p>
                  </div>
                </div>
              </DropdownMenuItem>
            </div>
            
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center cursor-pointer">
              <span className="text-sm text-primary">Посмотреть все уведомления</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 rounded-full" size="icon">
              <Avatar>
                <AvatarImage src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" />
                <AvatarFallback>{userName.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Профиль</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Настройки</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Выйти</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;