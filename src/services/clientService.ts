import { api, handleApiError } from "@/lib/api";

/**
 * Типы данных для клиентов
 */
export interface Client {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
  avatar?: string;
  status: 'active' | 'inactive' | 'vip';
  notes?: string;
  visits: number;
  lastVisit?: string;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClientFilterParams {
  search?: string;
  status?: 'active' | 'inactive' | 'vip';
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CreateClientData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
  status?: 'active' | 'inactive' | 'vip';
  notes?: string;
}

export interface UpdateClientData extends Partial<CreateClientData> {}

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

export interface ClientVisit {
  id: number;
  date: string;
  services: {
    id: number;
    name: string;
    price: number;
  }[];
  products: {
    id: number;
    name: string;
    price: number;
    quantity: number;
  }[];
  totalAmount: number;
  status: 'completed' | 'cancelled' | 'no-show';
  staffMember: {
    id: number;
    name: string;
  };
}

/**
 * Сервис для работы с клиентами
 */
export const clientService = {
  /**
   * Получение списка клиентов с фильтрацией и пагинацией
   */
  async getClients(params: ClientFilterParams = {}): Promise<PaginatedResponse<Client>> {
    try {
      return await api.get<PaginatedResponse<Client>>('/clients', { params });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Получение информации о конкретном клиенте
   */
  async getClient(id: number): Promise<Client> {
    try {
      return await api.get<Client>(`/clients/${id}`);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Создание нового клиента
   */
  async createClient(data: CreateClientData): Promise<Client> {
    try {
      return await api.post<Client>('/clients', data, {
        showSuccessToast: true,
        successMessage: "Клиент успешно добавлен"
      });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Обновление информации о клиенте
   */
  async updateClient(id: number, data: UpdateClientData): Promise<Client> {
    try {
      return await api.put<Client>(`/clients/${id}`, data, {
        showSuccessToast: true,
        successMessage: "Информация о клиенте обновлена"
      });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Удаление клиента
   */
  async deleteClient(id: number): Promise<void> {
    try {
      await api.delete(`/clients/${id}`, {
        showSuccessToast: true,
        successMessage: "Клиент успешно удален"
      });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Получение истории визитов клиента
   */
  async getClientVisits(id: number): Promise<ClientVisit[]> {
    try {
      return await api.get<ClientVisit[]>(`/clients/${id}/visits`);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Загрузка аватара клиента
   */
  async uploadAvatar(id: number, file: File): Promise<{ avatarUrl: string }> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      return await api.upload<{ avatarUrl: string }>(`/clients/${id}/avatar`, formData, {
        showSuccessToast: true,
        successMessage: "Фото клиента загружено"
      });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Экспорт списка клиентов в CSV
   */
  async exportClients(params: ClientFilterParams = {}): Promise<Blob> {
    try {
      const response = await fetch(`/api/clients/export`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to export clients');
      }
      
      return await response.blob();
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
};
