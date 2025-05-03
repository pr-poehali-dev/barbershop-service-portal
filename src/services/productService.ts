import { api, handleApiError } from "@/lib/api";

/**
 * Типы данных для товаров
 */
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  categoryId: number;
  category: {
    id: number;
    name: string;
  };
  sku: string;
  stock: number;
  images: string[];
  features?: string[];
  usage?: string;
  ingredients?: string;
  brand?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  description?: string;
  image?: string;
  productsCount: number;
  parentId?: number;
  children?: ProductCategory[];
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  categoryId: number;
  sku: string;
  stock: number;
  features?: string[];
  usage?: string;
  ingredients?: string;
  brand?: string;
  isActive?: boolean;
}

export interface UpdateProductData extends Partial<CreateProductData> {}

export interface ProductFilterParams {
  search?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  brand?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    currentPage: number;
    lastPage: number;
    perPage: number;
    from: number;
    to: number;
  };
}

export interface Order {
  id: number;
  orderNumber: string;
  clientId: number;
  client: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  items: {
    id: number;
    productId: number;
    product: {
      id: number;
      name: string;
      price: number;
      images: string[];
    };
    quantity: number;
    price: number;
    subtotal: number;
  }[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod: string;
  shippingMethod: string;
  shippingAddress?: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Сервис для работы с товарами
 */
export const productService = {
  /**
   * Получение списка товаров с фильтрацией и пагинацией
   */
  async getProducts(params: ProductFilterParams = {}): Promise<PaginatedResponse<Product>> {
    try {
      return await api.get<PaginatedResponse<Product>>('/products', { params });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Получение информации о конкретном товаре
   */
  async getProduct(id: number): Promise<Product> {
    try {
      return await api.get<Product>(`/products/${id}`);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Создание нового товара
   */
  async createProduct(data: CreateProductData): Promise<Product> {
    try {
      return await api.post<Product>('/products', data, {
        showSuccessToast: true,
        successMessage: "Товар успешно добавлен"
      });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Обновление информации о товаре
   */
  async updateProduct(id: number, data: UpdateProductData): Promise<Product> {
    try {
      return await api.put<Product>(`/products/${id}`, data, {
        showSuccessToast: true,
        successMessage: "Информация о товаре обновлена"
      });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Удаление товара
   */
  async deleteProduct(id: number): Promise<void> {
    try {
      await api.delete(`/products/${id}`, {
        showSuccessToast: true,
        successMessage: "Товар успешно удален"
      });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Загрузка изображения товара
   */
  async uploadProductImage(id: number, file: File): Promise<{ imageUrl: string }> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      return await api.upload<{ imageUrl: string }>(`/products/${id}/images`, formData, {
        showSuccessToast: true,
        successMessage: "Изображение товара загружено"
      });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Получение списка категорий товаров
   */
  async getCategories(): Promise<ProductCategory[]> {
    try {
      return await api.get<ProductCategory[]>('/products/categories');
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Создание новой категории товаров
   */
  async createCategory(data: { name: string, description?: string, parentId?: number }): Promise<ProductCategory> {
    try {
      return await api.post<ProductCategory>('/products/categories', data, {
        showSuccessToast: true,
        successMessage: "Категория успешно создана"
      });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Обновление запасов товара
   */
  async updateStock(id: number, quantity: number): Promise<Product> {
    try {
      return await api.patch<Product>(`/products/${id}/stock`, { quantity }, {
        showSuccessToast: true,
        successMessage: "Запас товара обновлен"
      });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Получение списка заказов
   */
  async getOrders(params: { status?: string, page?: number, limit?: number } = {}): Promise<PaginatedResponse<Order>> {
    try {
      return await api.get<PaginatedResponse<Order>>('/orders', { params });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Получение информации о конкретном заказе
   */
  async getOrder(id: number): Promise<Order> {
    try {
      return await api.get<Order>(`/orders/${id}`);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Обновление статуса заказа
   */
  async updateOrderStatus(id: number, status: string): Promise<Order> {
    try {
      return await api.patch<Order>(`/orders/${id}/status`, { status }, {
        showSuccessToast: true,
        successMessage: "Статус заказа обновлен"
      });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
};
