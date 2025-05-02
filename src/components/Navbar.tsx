import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Scissors, ShoppingBag, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Scissors className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-primary">Стиль</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium hover:border-primary hover:text-primary-foreground transition duration-150"
              >
                Главная
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium hover:border-primary hover:text-primary-foreground transition duration-150"
              >
                Услуги
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium hover:border-primary hover:text-primary-foreground transition duration-150"
              >
                Магазин
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium hover:border-primary hover:text-primary-foreground transition duration-150"
              >
                О нас
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <Link to="/appointments">
              <Button variant="ghost" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Записаться
              </Button>
            </Link>
            <Link to="/shop">
              <Button variant="ghost" size="sm">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Магазин
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="sm">
                <User className="mr-2 h-4 w-4" />
                Войти
              </Button>
            </Link>
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-primary hover:text-primary-foreground hover:bg-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium hover:bg-primary/10 hover:border-primary hover:text-primary transition duration-150"
              onClick={() => setIsMenuOpen(false)}
            >
              Главная
            </Link>
            <Link
              to="/services"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium hover:bg-primary/10 hover:border-primary hover:text-primary transition duration-150"
              onClick={() => setIsMenuOpen(false)}
            >
              Услуги
            </Link>
            <Link
              to="/shop"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium hover:bg-primary/10 hover:border-primary hover:text-primary transition duration-150"
              onClick={() => setIsMenuOpen(false)}
            >
              Магазин
            </Link>
            <Link
              to="/about"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium hover:bg-primary/10 hover:border-primary hover:text-primary transition duration-150"
              onClick={() => setIsMenuOpen(false)}
            >
              О нас
            </Link>
            <Link
              to="/appointments"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium hover:bg-primary/10 hover:border-primary hover:text-primary transition duration-150"
              onClick={() => setIsMenuOpen(false)}
            >
              Записаться
            </Link>
            <Link
              to="/login"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium hover:bg-primary/10 hover:border-primary hover:text-primary transition duration-150"
              onClick={() => setIsMenuOpen(false)}
            >
              Войти
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;