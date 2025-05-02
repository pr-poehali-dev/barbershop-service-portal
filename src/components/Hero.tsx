import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-secondary to-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 py-8 sm:py-16 md:py-20 lg:py-28 lg:max-w-2xl lg:w-full">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-primary sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                <span className="block">Откройте новый</span>
                <span className="block text-accent">стиль для себя</span>
              </h1>
              <p className="mt-3 text-base text-secondary-foreground sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Наши мастера создадут идеальный образ, который подчеркнет вашу индивидуальность и красоту.
                Доверьтесь профессионалам с многолетним опытом.
              </p>
              <div className="mt-8 sm:flex sm:justify-center lg:justify-start gap-4">
                <Link to="/appointments">
                  <Button size="lg" className="w-full sm:w-auto">
                    Записаться сейчас
                  </Button>
                </Link>
                <Link to="/services">
                  <Button variant="outline" size="lg" className="w-full mt-3 sm:mt-0 sm:w-auto">
                    Наши услуги
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80"
          alt="Салон красоты"
        />
      </div>
    </div>
  );
};

export default Hero;