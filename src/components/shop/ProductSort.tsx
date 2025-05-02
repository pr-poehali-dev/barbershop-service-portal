import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface ProductSortProps {
  onSortChange: (value: string) => void;
  currentSort: string;
}

const ProductSort = ({ onSortChange, currentSort }: ProductSortProps) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">Сортировать:</span>
      <Select value={currentSort} onValueChange={onSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Сортировка" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="price-asc">Цена (по возрастанию)</SelectItem>
          <SelectItem value="price-desc">Цена (по убыванию)</SelectItem>
          <SelectItem value="title-asc">Название (А-Я)</SelectItem>
          <SelectItem value="title-desc">Название (Я-А)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProductSort;