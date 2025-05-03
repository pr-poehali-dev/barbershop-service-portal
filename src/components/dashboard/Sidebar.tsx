import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Calendar,
  Users,
  ShoppingBag,
  Scissors,
  BarChart3,
  Settings,
  Menu,
  X,
  BookOpen,
  MessageSquare
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

interface SidebarItem {
  title: string;
  icon: React.ReactNode;
  href: string;
  active?: boolean;
  children?: Omit<SidebarItem, 'children'>[];
}

const Sidebar = ({ className }: SidebarProps) => {
  const [expanded, setExpanded] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  
  // Проверяем размер экрана при монтировании и изменении
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      if (!mobile && collapsed) {
        setCollapsed(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [collapsed]);
  
  // Закрываем меню при переходе на мобильных устройствах
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [location.pathname, isMobile]);

  // Элементы бокового меню
  const sidebarItems: SidebarItem[] = [
    {
      title: "Дашборд",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/admin",
      active: location.pathname === "/admin"
    },
    {
      title: "Записи",
      icon: <Calendar className="h-5 w-5" />,
      href: "/admin/appointments",
      active: location.pathname.startsWith("/admin/appointments")
    },
    {
      title: "Клиенты",
      icon: <Users className="h-5 w-5" />,
      href: "/admin/clients",
      active: location.pathname.startsWith("/admin/clients")
    },
    {
      title: "Товары",
      icon: <ShoppingBag className="h-5 w-5" />,
      href: "/admin/products",
      active: location.pathname.startsWith("/admin/products"),
      children: [
        {
          title: "Список товаров",
          icon: <ShoppingBag className="h-4 w-4" />,
          href: "/admin/products",
          active: location.pathname === "/admin/products"
        },
        {
          title: "Категории",
          icon: <BookOpen className="h-4 w-4" />,
          href: "/admin/products/categories",
          active: location.pathname === "/admin/products/categories"
        },
        {
          title: "Заказы",
          icon: <ShoppingBag className="h-4 w-4" />,
          href: "/admin/products/orders",
          active: location.pathname === "/admin/products/orders"
        }
      ]
    },
    {
      title: "Услуги",
      icon: <Scissors className="h-5 w-5" />,
      href: "/admin/services",
      active: location.pathname.startsWith("/admin/services")
    },
    {
      title: "Аналитика",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/admin/analytics",
      active: location.pathname.startsWith("/admin/analytics")
    },
    {
      title: "Сообщения",
      icon: <MessageSquare className="h-5 w-5" />,
      href: "/admin/messages",
      active: location.pathname.startsWith("/admin/messages")
    },
    {
      title: "Настройки",
      icon: <Settings className="h-5 w-5" />,
      href: "/admin/settings",
      active: location.pathname.startsWith("/admin/settings")
    }
  ];

  // Переключение состояния мобильного меню
  const toggleMobileMenu = () => {
    setCollapsed(!collapsed);
  };

  // Если меню скрыто на мобильном устройстве, показываем только кнопку меню
  if (isMobile && collapsed) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="default"
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg"
          onClick={toggleMobileMenu}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "relative min-h-screen bg-background border-r flex flex-col transition-all duration-300",
        expanded ? "w-64" : "w-16",
        isMobile ? "fixed inset-y-0 left-0 z-50 shadow-lg" : "",
        className
      )}
    >
      {/* Заголовок с логотипом и кнопкой закрытия на мобильных */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        <Link to="/admin" className="flex items-center">
          {!expanded ? (
            <div className="p-2 bg-primary/10 rounded-full">
              <Scissors className="h-6 w-6 text-primary" />
            </div>
          ) : (
            <h1 className="text-lg font-semibold">Стиль</h1>
          )}
        </Link>
        
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={toggleMobileMenu}
          >
            <X className="h-5 w-5" />
          </Button>
        )}
        
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setExpanded(!expanded)}
            className="ml-auto"
          >
            {expanded ? (
              <Menu className="h-5 w-5 rotate-180" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        )}
      </div>
      
      {/* Навигационные элементы */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {sidebarItems.map((item, index) => (
            <div key={index}>
              <Link
                to={item.href}
                className={cn(
                  "flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  item.active 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                {item.icon}
                {expanded && <span>{item.title}</span>}
              </Link>
              
              {/* Подпункты меню */}
              {expanded && item.children && item.active && (
                <div className="pl-4 mt-1 space-y-1">
                  {item.children.map((child, childIndex) => (
                    <Link
                      key={childIndex}
                      to={child.href}
                      className={cn(
                        "flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        child.active 
                          ? "bg-primary/10 text-primary" 
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      {child.icon}
                      <span>{child.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
      
      {/* Область внизу сайдбара */}
      <div className="p-4 border-t">
        <div className="rounded-md bg-muted py-2 px-3 text-center">
          {expanded ? (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Версия 1.0.0
              </p>
              <p className="text-xs text-muted-foreground">
                © 2025 Студия "Стиль"
              </p>
            </div>
          ) : (
            <span className="text-xs font-medium text-muted-foreground">v1.0</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;