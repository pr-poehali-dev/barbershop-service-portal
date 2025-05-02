import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

const products = [
  {
    id: 1,
    title: "Шампунь для объема",
    price: 1200,
    image: "https://images.unsplash.com/photo-1626766632648-f4ed492cf6c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    category: "shampoo"
  },
  {
    id: 2,
    title: "Кондиционер питательный",
    price: 950,
    image: "https://images.unsplash.com/photo-1617391258031-f8d80b22fb25?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    category: "conditioner"
  },
  {
    id: 3,
    title: "Маска восстанавливающая",
    price: 1450,
    image: "https://images.unsplash.com/photo-1522338564554-8a472966bc8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    category: "masks"
  }
];

const ProductsSection = () => {
  return (
    <section className="py-12 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary">Магазин профессиональных средств</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Купите профессиональные средства, которые мы используем в нашем салоне
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-48 w-full object-cover object-center"
                />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{product.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-primary font-bold">{product.price} ₽</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  В корзину
                </Button>
                <Link to={`/shop/${product.category}/${product.id}`}>
                  <Button variant="ghost" size="sm">Подробнее</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/shop">
            <Button>Перейти в магазин</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;