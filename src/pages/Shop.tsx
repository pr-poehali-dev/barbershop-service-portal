import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/shop/CategoryCard";
import ProductCard from "@/components/shop/ProductCard";
import ProductFilters from "@/components/shop/ProductFilters";
import ProductSort from "@/components/shop/ProductSort";
import { products, productCategories, ProductType } from "@/utils/productData";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, LayoutGrid, List } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const Shop = () => {
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>(products);
  const [activeFilters, setActiveFilters] = useState<any>({
    categories: [],
    brands: [],
    price: []
  });
  const [currentSort, setCurrentSort] = useState("price-asc");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    // Filter products based on active filters
    let result = [...products];
    
    // Apply category filter
    if (activeFilters.categories.length > 0) {
      result = result.filter(product => 
        activeFilters.categories.includes(product.category)
      );
    }
    
    // Apply brand filter
    if (activeFilters.brands.length > 0) {
      result = result.filter(product => 
        activeFilters.brands.includes(product.brand)
      );
    }
    
    // Apply price filter
    if (activeFilters.price.length > 0) {
      result = result.filter(product => {
        return activeFilters.price.some((range: string) => {
          if (range === "0-1000") return product.price < 1000;
          if (range === "1000-2000") return product.price >= 1000 && product.price < 2000;
          if (range === "2000-5000") return product.price >= 2000 && product.price < 5000;
          if (range === "5000+") return product.price >= 5000;
          return false;
        });
      });
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (currentSort === "price-asc") return a.price - b.price;
      if (currentSort === "price-desc") return b.price - a.price;
      if (currentSort === "title-asc") return a.title.localeCompare(b.title);
      if (currentSort === "title-desc") return b.title.localeCompare(a.title);
      return 0;
    });
    
    setFilteredProducts(result);
  }, [activeFilters, currentSort]);

  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters);
  };

  const clearFilters = () => {
    setActiveFilters({
      categories: [],
      brands: [],
      price: []
    });
  };

  const handleSortChange = (value: string) => {
    setCurrentSort(value);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-secondary py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumb className="mb-4">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink as={Link} to="/">Главная</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink as={Link} to="/shop">Магазин</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-primary">Магазин профессиональных средств</h1>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Профессиональные средства для ухода за волосами от ведущих мировых брендов
              </p>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-8 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-6">Категории</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {productCategories.map(category => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-8 bg-background border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h2 className="text-2xl font-bold">Все товары</h2>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-4 md:mt-0">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="md:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {showFilters ? "Скрыть фильтры" : "Показать фильтры"}
                </Button>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant={viewMode === "grid" ? "secondary" : "outline"} 
                    size="icon" 
                    onClick={() => setViewMode("grid")}
                    className="h-8 w-8"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={viewMode === "list" ? "secondary" : "outline"} 
                    size="icon" 
                    onClick={() => setViewMode("list")}
                    className="h-8 w-8"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
                <ProductSort 
                  onSortChange={handleSortChange} 
                  currentSort={currentSort} 
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Filters - Desktop */}
              <div className="hidden md:block w-64 shrink-0">
                <ProductFilters 
                  onFilterChange={handleFilterChange}
                  activeFilters={activeFilters}
                  clearFilters={clearFilters}
                />
              </div>
              
              {/* Filters - Mobile */}
              {showFilters && (
                <div className="md:hidden w-full mb-6">
                  <ProductFilters 
                    onFilterChange={handleFilterChange}
                    activeFilters={activeFilters}
                    clearFilters={clearFilters}
                  />
                </div>
              )}
              
              {/* Products Grid */}
              <div className="flex-1">
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-border rounded-lg">
                    <p className="text-muted-foreground">Товары не найдены. Попробуйте изменить параметры фильтрации.</p>
                    <Button
                      variant="link"
                      onClick={clearFilters}
                      className="mt-2"
                    >
                      Сбросить все фильтры
                    </Button>
                  </div>
                ) : (
                  viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredProducts.map(product => (
                        <div key={product.id} className="flex flex-col sm:flex-row gap-4 p-4 border border-border rounded-lg hover:border-primary transition-colors">
                          <div className="w-full sm:w-1/4 aspect-w-1 aspect-h-1">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="h-48 sm:h-32 w-full object-cover object-center rounded-md"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-medium">{product.title}</h3>
                            <p className="text-primary font-bold my-2">{product.price} ₽</p>
                            <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {product.tags.map(tag => (
                                <span key={tag} className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-semibold">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex sm:flex-col justify-between sm:justify-start gap-2 sm:w-1/6">
                            <Button variant="default" size="sm" className="w-full">
                              В корзину
                            </Button>
                            <Link to={`/shop/${product.category}/${product.id}`} className="w-full">
                              <Button variant="outline" size="sm" className="w-full">
                                Подробнее
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;