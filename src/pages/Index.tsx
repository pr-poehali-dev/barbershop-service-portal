import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";
import ProductsSection from "@/components/ProductsSection";
import TestimonialsSection from "@/components/TestimonialsSection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <ServicesSection />
        <ProductsSection />
        <TestimonialsSection />
        
        {/* CTA Section */}
        <section className="py-12 bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-primary-foreground mb-4">
              Готовы к преображению?
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Запишитесь на консультацию с нашими мастерами и получите
              рекомендации по созданию вашего идеального образа
            </p>
            <a
              href="/appointments"
              className="inline-block bg-white text-primary font-medium py-3 px-6 rounded-md hover:bg-white/90 transition-colors"
            >
              Записаться сейчас
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;