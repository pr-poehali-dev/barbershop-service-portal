import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Анна Смирнова",
    role: "Постоянный клиент",
    content: "Я всегда получаю замечательные результаты! Мастера знают, как подчеркнуть индивидуальность каждого клиента. Очень довольна сервисом и атмосферой.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    id: 2,
    name: "Иван Петров",
    role: "Новый клиент",
    content: "Пришел по рекомендации друга и остался очень доволен. Профессиональный подход, внимание к деталям и отличный результат. Буду рекомендовать всем знакомым.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    id: 3,
    name: "Елена Кузнецова",
    role: "Постоянный клиент",
    content: "Хожу в этот салон уже больше года и всегда выхожу в отличном настроении. Мой мастер всегда предлагает интересные решения, учитывая мои пожелания.",
    rating: 4,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary">Отзывы клиентов</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Что говорят о нас наши клиенты
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="transition-all hover:shadow-md">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <img
                      className="h-12 w-12 rounded-full mr-4"
                      src={testimonial.image}
                      alt={testimonial.name}
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;