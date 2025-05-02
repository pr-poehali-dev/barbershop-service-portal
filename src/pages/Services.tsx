import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scissors, Sparkles, Brush, Heart, Clock, User } from "lucide-react";

const serviceCategories = [
  {
    id: "haircut",
    title: "Стрижки",
    description: "Профессиональные стрижки для мужчин, женщин и детей любой сложности.",
    icon: Scissors,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    services: [
      { id: 1, name: "Женская стрижка", price: 2500, duration: 60 },
      { id: 2, name: "Мужская стрижка", price: 1800, duration: 45 },
      { id: 3, name: "Детская стрижка", price: 1200, duration: 30 },
      { id: 4, name: "Стрижка челки", price: 800, duration: 15 },
    ]
  },
  {
    id: "coloring",
    title: "Окрашивание",
    description: "Современные техники окрашивания волос, включая омбре, балаяж и мелирование.",
    icon: Brush,
    image: "https://images.unsplash.com/photo-1554519515-5e8a3ff9ed11?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    services: [
      { id: 5, name: "Однотонное окрашивание", price: 3500, duration: 120 },
      { id: 6, name: "Мелирование", price: 4500, duration: 150 },
      { id: 7, name: "Балаяж", price: 6000, duration: 180 },
      { id: 8, name: "Омбре", price: 6500, duration: 180 },
    ]
  },
  {
    id: "styling",
    title: "Укладка",
    description: "Создание повседневных и праздничных причесок, укладок для особых случаев.",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1595888823472-a7fad1c686a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    services: [
      { id: 9, name: "Повседневная укладка", price: 1500, duration: 40 },
      { id: 10, name: "Праздничная прическа", price: 3000, duration: 90 },
      { id: 11, name: "Свадебная прическа", price: 5000, duration: 120 },
      { id: 12, name: "Плетение кос", price: 2000, duration: 60 },
    ]
  },
  {
    id: "treatments",
    title: "Уход",
    description: "Spa-процедуры для волос, лечебные маски, восстанавливающие программы.",
    icon: Heart,
    image: "https://images.unsplash.com/photo-1525904097878-94fb15835963?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    services: [
      { id: 13, name: "Спа-уход для волос", price: 2500, duration: 60 },
      { id: 14, name: "Восстанавливающая маска", price: 1800, duration: 45 },
      { id: 15, name: "Кератиновое выпрямление", price: 7000, duration: 180 },
      { id: 16, name: "Ботокс для волос", price: 4500, duration: 90 },
    ]
  }
];

const Services = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-secondary py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">Наши услуги</h1>
            <p className="text-lg text-secondary-foreground max-w-2xl mx-auto">
              Мы предлагаем широкий спектр услуг по уходу за волосами. Наши опытные мастера
              помогут вам выбрать идеальный образ и воплотить его в жизнь.
            </p>
          </div>
        </section>

        {/* Service categories */}
        <section className="py-12 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12">
              {serviceCategories.map((category) => (
                <div key={category.id} id={category.id} className="scroll-mt-20">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-full md:w-1/3">
                      <img 
                        src={category.image} 
                        alt={category.title}
                        className="rounded-lg shadow-md w-full h-64 object-cover"
                      />
                    </div>
                    <div className="w-full md:w-2/3">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          <category.icon className="h-5 w-5 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-primary">{category.title}</h2>
                      </div>
                      <p className="text-muted-foreground mb-6">{category.description}</p>
                      
                      <div className="space-y-4">
                        {category.services.map((service) => (
                          <div key={service.id} className="p-4 border border-border rounded-lg hover:border-primary transition-colors">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{service.name}</h3>
                                <div className="text-sm text-muted-foreground flex items-center mt-1">
                                  <Clock className="h-4 w-4 mr-1" />
                                  <span>{service.duration} мин</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-lg text-primary">{service.price} ₽</div>
                                <Link to={`/appointments?service=${service.id}`}>
                                  <Button size="sm" variant="outline" className="mt-2">
                                    <User className="h-4 w-4 mr-1" />
                                    Записаться
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-primary-foreground mb-4">
              Не можете определиться с выбором?
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Запишитесь на бесплатную консультацию с нашим стилистом, и мы поможем
              подобрать услуги, которые идеально подойдут именно вам
            </p>
            <Link to="/appointments">
              <Button 
                variant="secondary" 
                size="lg"
                className="font-medium"
              >
                Записаться на консультацию
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;