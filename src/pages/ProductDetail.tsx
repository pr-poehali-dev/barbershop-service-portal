import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products, productCategories } from "@/utils/productData";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingBag, ShoppingCart, Star, Truck, RotateCcw } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";

const ProductDetail = () => {
  const { categoryId, productId } = useParams();
  const [quantity, setQuantity] = useState(1);
  
  // Find the product
  const product = products.find(p => p.id === Number(productId) && p.category === categoryId);
  
  // Find the category
  const category = productCategories.find(c => c.id === categoryId);
  
  // Find related products
  const relatedProducts = products
    .filter(p => p.category === categoryId && p.id !== Number(productId))
    .slice(0, 3);
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Товар не найден</h1>
            <p className="text-muted-foreground mb-6">
              Товар, который вы ищете, не существует или был удален.
            </p>
            <Link to="/shop">
              <Button>Вернуться в магазин</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink as={Link} to="/">Главная</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink as={Link} to="/shop">Магазин</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {category && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink as={Link} to={`/shop/category/${category.id}`}>{category.name}</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}
              <BreadcrumbItem>
                <BreadcrumbLink className="font-medium">{product.title}</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Product Image */}
            <div className="rounded-lg overflow-hidden bg-secondary/20 p-4">
              <img 
                src={product.image} 
                alt={product.title} 
                className="w-full h-auto object-contain max-h-[400px]"
              />
            </div>
            
            {/* Product Info */}
            <div>
              <div className="mb-4 flex items-center">
                <span className="text-sm text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                  {category?.name}
                </span>
                <span className="ml-2 text-sm text-muted-foreground">
                  Бренд: <span className="font-medium">{product.brand}</span>
                </span>
              </div>
              
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`h-4 w-4 ${star <= 4 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-muted-foreground">4.0 (12 отзывов)</span>
              </div>
              
              <div className="text-2xl font-bold text-primary mb-4">
                {product.price} ₽
              </div>
              
              <p className="text-muted-foreground mb-6">
                {product.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {product.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="border-t border-border pt-6 mb-6">
                <div className="flex items-center mb-6">
                  <div className="mr-4">
                    <label htmlFor="quantity" className="block text-sm font-medium mb-1">
                      Количество
                    </label>
                    <div className="flex border border-input rounded-md">
                      <button
                        type="button"
                        className="px-3 py-1 text-muted-foreground"
                        onClick={decrementQuantity}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <input
                        type="text"
                        id="quantity"
                        className="w-12 text-center focus:outline-none"
                        value={quantity}
                        readOnly
                      />
                      <button
                        type="button"
                        className="px-3 py-1 text-muted-foreground"
                        onClick={incrementQuantity}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <Button size="lg" className="mr-2">
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      В корзину
                    </Button>
                    <Button variant="outline" size="lg">
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Купить сейчас
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Truck className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium">Доставка</h4>
                      <p className="text-sm text-muted-foreground">
                        Бесплатная доставка при заказе от 3000 ₽
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <RotateCcw className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium">Возврат</h4>
                      <p className="text-sm text-muted-foreground">
                        Возврат в течение 14 дней
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Details Tabs */}
          <Tabs defaultValue="details" className="mb-12">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Детали</TabsTrigger>
              <TabsTrigger value="usage">Применение</TabsTrigger>
              <TabsTrigger value="reviews">Отзывы</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="p-4 border rounded-b-md">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Информация о продукте</h3>
                <p>{product.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <p><span className="font-medium">Бренд:</span> {product.brand}</p>
                    <p><span className="font-medium">Категория:</span> {category?.name}</p>
                  </div>
                  <div className="space-y-2">
                    <p><span className="font-medium">Объем:</span> 250 мл</p>
                    <p><span className="font-medium">Артикул:</span> P{product.id}00{product.category.charAt(0).toUpperCase()}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="usage" className="p-4 border rounded-b-md">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Способ применения</h3>
                <p>Нанесите небольшое количество средства на влажные волосы, вспеньте массирующими движениями, оставьте на несколько минут, затем тщательно смойте теплой водой. Для достижения наилучшего результата используйте в комплексе с другими средствами этой линии.</p>
                <h4 className="font-medium">Рекомендации</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Используйте 2-3 раза в неделю</li>
                  <li>Держите подальше от прямых солнечных лучей</li>
                  <li>Хранить в сухом прохладном месте</li>
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="p-4 border rounded-b-md">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Отзывы клиентов</h3>
                <div className="flex items-center mb-4">
                  <div className="flex mr-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`h-5 w-5 ${star <= 4 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-medium">4.0</span>
                  <span className="ml-2 text-sm text-muted-foreground">(12 отзывов)</span>
                </div>
                
                <div className="space-y-4">
                  {[1, 2, 3].map((review) => (
                    <div key={review} className="border-t border-border pt-4">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">Анна Петрова</h4>
                          <div className="flex items-center">
                            <div className="flex mr-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`h-3 w-3 ${star <= (5 - review) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">10.04.2025</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm mt-2">
                        {review === 1 
                          ? "Отличное средство, волосы после него мягкие и блестящие. Приятный аромат, хватает надолго. Однозначно рекомендую!" 
                          : review === 2 
                            ? "Хороший продукт, но немного завышена цена. В целом довольна результатом, волосы послушные и блестящие."
                            : "Использую уже несколько месяцев, очень довольна результатом. Волосы стали намного здоровее."
                        }
                      </p>
                    </div>
                  ))}
                </div>
                
                <Button className="mt-4">
                  Написать отзыв
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Похожие товары</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map(related => (
                  <ProductCard key={related.id} product={related} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;