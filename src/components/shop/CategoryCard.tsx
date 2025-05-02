import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CategoryType } from "@/utils/productData";

interface CategoryCardProps {
  category: CategoryType;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
        <img
          src={category.image}
          alt={category.name}
          className="h-48 w-full object-cover object-center"
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{category.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{category.description}</p>
      </CardContent>
      <CardFooter>
        <Link to={`/shop/category/${category.id}`} className="w-full">
          <Button variant="outline" className="w-full">Просмотреть</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CategoryCard;