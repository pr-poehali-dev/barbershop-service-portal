import { Link } from "react-router-dom";
import { Scissors, Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <Scissors className="h-6 w-6 text-primary" />
              <span className="ml-2 text-xl font-bold text-primary">Стиль</span>
            </div>
            <p className="text-sm">
              Мы создаем индивидуальный образ для каждого клиента, подчеркивая вашу уникальную красоту.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-secondary-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-secondary-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-secondary-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-4">Услуги</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services/haircut" className="text-sm hover:text-primary">
                  Стрижки
                </Link>
              </li>
              <li>
                <Link to="/services/coloring" className="text-sm hover:text-primary">
                  Окрашивание
                </Link>
              </li>
              <li>
                <Link to="/services/styling" className="text-sm hover:text-primary">
                  Укладка
                </Link>
              </li>
              <li>
                <Link to="/services/treatments" className="text-sm hover:text-primary">
                  Уход за волосами
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-4">Магазин</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop/shampoo" className="text-sm hover:text-primary">
                  Шампуни
                </Link>
              </li>
              <li>
                <Link to="/shop/conditioner" className="text-sm hover:text-primary">
                  Кондиционеры
                </Link>
              </li>
              <li>
                <Link to="/shop/styling" className="text-sm hover:text-primary">
                  Средства для укладки
                </Link>
              </li>
              <li>
                <Link to="/shop/tools" className="text-sm hover:text-primary">
                  Инструменты
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-4">Информация</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm hover:text-primary">
                  О салоне
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-primary">
                  Контакты
                </Link>
              </li>
              <li>
                <Link to="/appointments" className="text-sm hover:text-primary">
                  Запись на услуги
                </Link>
              </li>
              <li>
                <Link to="/policy" className="text-sm hover:text-primary">
                  Политика конфиденциальности
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 md:flex md:items-center md:justify-between">
          <p className="text-sm text-secondary-foreground">&copy; {new Date().getFullYear()} Стиль. Все права защищены.</p>
          <div className="mt-4 md:mt-0">
            <Link to="/terms" className="text-sm hover:text-primary mr-4">
              Условия использования
            </Link>
            <Link to="/privacy" className="text-sm hover:text-primary">
              Конфиденциальность
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;