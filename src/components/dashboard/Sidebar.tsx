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
  X
} from "lucide-react";

interface SidebarItem {
  title: string;
  path: string;
  icon: React.ElementType;
  children?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Обзор",
    path: "/admin",
    icon: LayoutDashboard
  },
  {
    title: "Клиенты",
    path: "/admin/clients",
    icon: Users
  },
  {
    title: "Записи",
    path: "/admin/appointments",
    icon: Calendar
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
        icon: ShoppingBag
      },
      {
        title: "Заказы",
        path: "/admin/products/orders",
        icon: ShoppingBag
      }
    ]
  },
  {
    title: "Услуги",
    path: "/admin/services",
    icon: Scissors
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
          className="p-2 bg-sidebar text-sidebar-foreground rounded-md focus:outline-none"
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
          fixed top-0 left-0 h-full bg-sidebar text-sidebar-foreground w-64 transition-transform transform z-50 lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:z-0
        `}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-sidebar-border">
            <Link to="/admin" className="flex items-center space-x-2">
              <Scissors className="h-6 w-6 text-sidebar-primary" />
              <span className="text-xl font-bold text-sidebar-primary">Стиль Админ</span>
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
                          ${isChildActive(item) ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent/50'}
                        `}
                      >
                        <div className="flex items-center">
                          <item.icon className="mr-2 h-4 w-4" />
                          <span>{item.title}</span>
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
                                  flex items-center px-3 py-2 rounded-md text-sm transition-colors
                                  ${isActive(child.path) ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : 'hover:bg-sidebar-accent/50 text-sidebar-foreground/70'}
                                `}
                              >
                                <child.icon className="mr-2 h-4 w-4" />
                                <span>{child.title}</span>
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
                        flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                        ${isActive(item.path) ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent/50'}
                      `}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border mt-auto">
            <Link
              to="/login"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
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