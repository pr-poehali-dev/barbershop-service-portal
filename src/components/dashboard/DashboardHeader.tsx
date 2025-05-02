import { useState } from "react";
import { Bell, User, Search, MessageSquare, ShoppingBag, Settings, LogOut, Sun, Moon } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuShortcut
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  userName?: string;
  userRole?: string;
  onThemeToggle?: () => void;
  isDarkTheme?: boolean;
}

const DashboardHeader = ({ 
  userName = "Администратор", 
  userRole = "Владелец",
  onThemeToggle,
  isDarkTheme = false
}: DashboardHeaderProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const navigate = useNavigate();
  
  // Имитация поиска
  const handleSearch = (query: string) => {
    setSearchValue(query);
    
    if (query.length > 1) {
      // Здесь в реальном приложении был бы запрос к API
      setSearchResults([
        { type: 'client', id: 1, name: 'Анна Смирнова', path: '/admin/clients/1' },
        { type: 'appointment', id: 123, name: 'Запись #123 (Стрижка)', path: '/admin/appointments/123' },
        { type: 'product', id: 45, name: 'Шампунь для объема', path: '/admin/products/45' }
      ].filter(item => item.name.toLowerCase().includes(query.toLowerCase())));
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };
  
  const handleSearchResultClick = (path: string) => {
    navigate(path);
    setShowSearchResults(false);
    setSearchValue("");
  };
  
  return (
    <header className="h-16 border-b border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-700 flex items-center px-4 lg:px-6 sticky top-0 z-30">
      {/* Search Bar */}
      <div className="md:flex relative flex-1 max-w-md mr-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Поиск клиентов, записей, товаров..."
          className="pl-8"
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
          onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
        />
        
        {/* Search Results Dropdown */}
        {showSearchResults && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg z-50 max-h-64 overflow-auto">
            <div className="p-2 text-xs text-muted-foreground border-b border-slate-200 dark:border-slate-700">
              Найдено результатов: {searchResults.length}
            </div>
            {searchResults.map((result, index) => (
              <div 
                key={index} 
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer flex items-center"
                onClick={() => handleSearchResultClick(result.path)}
              >
                {result.type === 'client' && <User className="h-4 w-4 mr-2 text-blue-500" />}
                {result.type === 'appointment' && <Calendar className="h-4 w-4 mr-2 text-green-500" />}
                {result.type === 'product' && <ShoppingBag className="h-4 w-4 mr-2 text-orange-500" />}
                <span>{result.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Actions */}
      <div className="ml-auto flex items-center space-x-4">
        {/* Theme Toggle */}
        <Button variant="ghost" size="icon" onClick={onThemeToggle} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
          {isDarkTheme ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-0 min-h-0 flex items-center justify-center text-[10px] bg-primary">5</Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Уведомления</span>
              <Badge variant="outline" className="text-xs font-normal">5 новых</Badge>
            </DropdownMenuLabel>
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
              
              <DropdownMenuItem className="p-3 cursor-pointer">
                <div className="flex items-start">
                  <div className="bg-amber-100 text-amber-800 rounded-full h-9 w-9 flex items-center justify-center mr-3">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Напоминание</p>
                    <p className="text-xs text-muted-foreground mt-1">Завтра день рождения у клиента Ирины Петровой.</p>
                    <p className="text-xs text-muted-foreground mt-1">2 часа назад</p>
                  </div>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="p-3 cursor-pointer">
                <div className="flex items-start">
                  <div className="bg-purple-100 text-purple-800 rounded-full h-9 w-9 flex items-center justify-center mr-3">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Новый клиент</p>
                    <p className="text-xs text-muted-foreground mt-1">Сергей Иванов зарегистрировался в системе.</p>
                    <p className="text-xs text-muted-foreground mt-1">3 часа назад</p>
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
            <Button variant="ghost" className="relative h-8 rounded-full flex items-center gap-2 pl-2 pr-3" size="sm">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" />
                <AvatarFallback>{userName.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground">{userRole}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Профиль</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell className="mr-2 h-4 w-4" />
              <span>Уведомления</span>
              <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Настройки</span>
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Выйти</span>
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;