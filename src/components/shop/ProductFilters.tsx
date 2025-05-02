import { useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { productCategories, products } from "@/utils/productData";

interface FilterOption {
  id: string;
  label: string;
}

interface ProductFiltersProps {
  onFilterChange: (filters: any) => void;
  activeFilters: any;
  clearFilters: () => void;
}

const ProductFilters = ({ onFilterChange, activeFilters, clearFilters }: ProductFiltersProps) => {
  // Extract unique brands from products
  const brands = Array.from(new Set(products.map(product => product.brand)));
  
  // Generate price ranges
  const priceRanges = [
    { id: "0-1000", label: "До 1000 ₽" },
    { id: "1000-2000", label: "1000 - 2000 ₽" },
    { id: "2000-5000", label: "2000 - 5000 ₽" },
    { id: "5000+", label: "> 5000 ₽" }
  ];

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    const currentFilters = {...activeFilters};
    
    if (!currentFilters[filterType]) {
      currentFilters[filterType] = [];
    }
    
    const index = currentFilters[filterType].indexOf(value);
    if (index === -1) {
      currentFilters[filterType].push(value);
    } else {
      currentFilters[filterType].splice(index, 1);
    }
    
    onFilterChange(currentFilters);
  };

  const isFilterActive = (filterType: string, value: string) => {
    return activeFilters[filterType]?.includes(value) || false;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Фильтры</h3>
        {Object.keys(activeFilters).some(key => activeFilters[key].length > 0) && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Сбросить
          </Button>
        )}
      </div>
      
      <div className="border-t border-border pt-4">
        <Accordion type="multiple" defaultValue={["categories", "brands", "price"]}>
          <AccordionItem value="categories">
            <AccordionTrigger>Категории</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {productCategories.map(category => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`category-${category.id}`} 
                      checked={isFilterActive('categories', category.id)}
                      onCheckedChange={() => handleFilterChange('categories', category.id)}
                    />
                    <label 
                      htmlFor={`category-${category.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="brands">
            <AccordionTrigger>Бренды</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {brands.map(brand => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`brand-${brand}`}
                      checked={isFilterActive('brands', brand)}
                      onCheckedChange={() => handleFilterChange('brands', brand)}
                    />
                    <label 
                      htmlFor={`brand-${brand}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {brand}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="price">
            <AccordionTrigger>Цена</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {priceRanges.map(range => (
                  <div key={range.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`price-${range.id}`}
                      checked={isFilterActive('price', range.id)}
                      onCheckedChange={() => handleFilterChange('price', range.id)}
                    />
                    <label 
                      htmlFor={`price-${range.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {range.label}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      
      {/* Active filters */}
      {Object.keys(activeFilters).some(key => activeFilters[key].length > 0) && (
        <div className="border-t border-border pt-4">
          <h4 className="text-sm font-medium mb-2">Активные фильтры:</h4>
          <div className="flex flex-wrap gap-2">
            {Object.keys(activeFilters).map(filterType => 
              activeFilters[filterType].map((value: string) => {
                let label = value;
                
                // Format the label based on filter type
                if (filterType === 'categories') {
                  const category = productCategories.find(c => c.id === value);
                  if (category) label = category.name;
                }
                
                if (filterType === 'price') {
                  const range = priceRanges.find(r => r.id === value);
                  if (range) label = range.label;
                }
                
                return (
                  <Button 
                    key={`${filterType}-${value}`} 
                    variant="secondary" 
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => handleFilterChange(filterType, value)}
                  >
                    {label}
                    <X className="h-3 w-3" />
                  </Button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;