import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { ProductType } from "@/utils/productData";

interface ProductCardProps {
  product: ProductType;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
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
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{product.description}</p>
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
  );
};

export default ProductCard;