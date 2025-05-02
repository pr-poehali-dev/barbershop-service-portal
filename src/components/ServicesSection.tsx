import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scissors, Sparkles, Brush, Heart } from "lucide-react";

const services = [
  {
    id: 1,
    title: "Стрижки",
    description: "Профессиональные стрижки для мужчин, женщин и детей любой сложности.",
    icon: Scissors,
    link: "/services/haircut"
  },
  {
    id: 2,
    title: "Окрашивание",
    description: "Современные техники окрашивания волос, включая омбре, балаяж и мелирование.",
    icon: Brush,
    link: "/services/coloring"
  },
  {
    id: 3,
    title: "Укладка",
    description: "Создание повседневных и праздничных причесок, укладок для особых случаев.",
    icon: Sparkles,
    link: "/services/styling"
  },
  {
    id: 4,
    title: "Уход",
    description: "Spa-процедуры для волос, лечебные маски, восстанавливающие программы.",
    icon: Heart,
    link: "/services/treatments"
  }
];

const ServicesSection = () => {
  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary">Наши услуги</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Предлагаем широкий спектр услуг по уходу за волосами, выполняемых опытными мастерами
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">{service.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Link to={service.link} className="w-full">
                  <Button variant="outline" className="w-full">Подробнее</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/services">
            <Button>Все услуги</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;