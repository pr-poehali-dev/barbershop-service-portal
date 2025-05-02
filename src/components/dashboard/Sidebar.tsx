import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  ShoppingBag, 
  Scissors, 
  Settings, 
  LogOut, 
  ChevronDown,
  Menu,
  X,
  BarChart4,
  BadgeDollarSign,
  ClipboardList,
  Tags,
  MessageCircle,
  Bell,
  Target
} from "lucide-react";

interface SidebarItem {
  title: string;
  path: string;
  icon: React.ElementType;
  children?: SidebarItem[];
  badge?: number;
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Обзор",
    path: "/admin",
    icon: LayoutDashboard
  },
  {
    title: "Аналитика",
    path: "/admin/analytics",
    icon: BarChart4
  },
  {
    title: "Клиенты",
    path: "/admin/clients",
    icon: Users,
    badge: 2
  },
  {
    title: "Записи",
    path: "/admin/appointments",
    icon: Calendar,
    badge: 5,
    children: [
      {
        title: "Все записи",
        path: "/admin/appointments",
        icon: ClipboardList
      },
      {
        title: "Календарь",
        path: "/admin/appointments/calendar",
        icon: Calendar
      },
      {
        title: "Мастера",
        path: "/admin/appointments/staff",
        icon: Scissors
      }
    ]
  },
  {
    title: "Товары",
    path: "/admin/products",
    icon: ShoppingBag,
    children: [
      {
        title: "Все товары",
        path: "/admin/products",
        icon: ShoppingBag
      },
      {
        title: "Категории",
        path: "/admin/products/categories",
        icon: Tags
      },
      {
        title: "Заказы",
        path: "/admin/products/orders",
        icon: ClipboardList,
        badge: 3
      }
    ]
  },
  {
    title: "Услуги",
    path: "/admin/services",
    icon: Scissors
  },
  {
    title: "Финансы",
    path: "/admin/finance",
    icon: BadgeDollarSign
  },
  {
    title: "Маркетинг",
    path: "/admin/marketing",
    icon: Target,
    children: [
      {
        title: "Акции",
        path: "/admin/marketing/promotions",
        icon: Target
      },
      {
        title: "Отзывы",
        path: "/admin/marketing/reviews",
        icon: MessageCircle
      },
      {
        title: "Рассылки",
        path: "/admin/marketing/newsletters",
        icon: Bell
      }
    ]
  },
  {
    title: "Настройки",
    path: "/admin/settings",
    icon: Settings
  }
];

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
  // Автоматически раскрываем подменю для активной страницы
  useState(() => {
    const activeParent = sidebarItems.find(item => 
      item.children && item.children.some(child => location.pathname === child.path)
    );
    
    if (activeParent && !expandedItems.includes(activeParent.title)) {
      setExpandedItems(prev => [...prev, activeParent.title]);
    }
  });
  
  const toggleExpand = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title) 
        : [...prev, title]
    );
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const isChildActive = (item: SidebarItem) => {
    if (isActive(item.path)) return true;
    if (item.children) {
      return item.children.some(child => isActive(child.path));
    }
    return false;
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 p-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-primary text-primary-foreground rounded-md focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-slate-900 text-white w-64 transition-transform transform z-50 lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:z-0
        `}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-700">
            <Link to="/admin" className="flex items-center space-x-2">
              <Scissors className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-white">Стиль Админ</span>
            </Link>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {sidebarItems.map((item) => (
                <li key={item.title}>
                  {item.children ? (
                    <div>
                      <button
                        onClick={() => toggleExpand(item.title)}
                        className={`
                          w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors
                          ${isChildActive(item) ? 'bg-slate-800 text-primary' : 'hover:bg-slate-800 text-slate-300 hover:text-white'}
                        `}
                      >
                        <div className="flex items-center">
                          <item.icon className="mr-2 h-4 w-4" />
                          <span>{item.title}</span>
                          {item.badge && (
                            <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-primary text-white">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <ChevronDown 
                          className={`h-4 w-4 transition-transform ${expandedItems.includes(item.title) ? 'rotate-180' : ''}`} 
                        />
                      </button>
                      
                      {expandedItems.includes(item.title) && (
                        <ul className="pl-6 pt-1 space-y-1">
                          {item.children.map((child) => (
                            <li key={child.title}>
                              <Link
                                to={child.path}
                                className={`
                                  flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors
                                  ${isActive(child.path) ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}
                                `}
                              >
                                <div className="flex items-center">
                                  <child.icon className="mr-2 h-4 w-4" />
                                  <span>{child.title}</span>
                                </div>
                                {child.badge && (
                                  <span className="px-1.5 py-0.5 text-xs rounded-full bg-primary text-white">
                                    {child.badge}
                                  </span>
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className={`
                        flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors
                        ${isActive(item.path) ? 'bg-primary/20 text-primary' : 'hover:bg-slate-800 text-slate-300 hover:text-white'}
                      `}
                    >
                      <div className="flex items-center">
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 text-xs rounded-full bg-primary text-white">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-slate-700 mt-auto">
            <Link
              to="/login"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Выйти</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;