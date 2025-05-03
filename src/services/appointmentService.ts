import { api, handleApiError } from "@/lib/api";

/**
 * Типы данных для записей на услуги
 */
export interface Appointment {
  id: number;
  clientId: number;
  client: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  staffId: number;
  staff: {
    id: number;
    name: string;
    position: string;
    avatar?: string;
  };
  services: {
    id: number;
    name: string;
    duration: number;
    price: number;
  }[];
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentData {
  clientId: number;
  staffId: number;
  serviceIds: number[];
  date: string;
  startTime: string;
  notes?: string;
}

export interface UpdateAppointmentData {
  staffId?: number;
  serviceIds?: number[];
  date?: string;
  startTime?: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
}

export interface AppointmentFilterParams {
  search?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  staffId?: number;
  clientId?: number;
  page?: number;
  limit?: number;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
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

/**
 * Сервис для работы с записями на услуги
 */
export const appointmentService = {
  /**
   * Получение списка записей с фильтрацией и пагинацией
   */
  async getAppointments(params: AppointmentFilterParams = {}): Promise<PaginatedResponse<Appointment>> {
    try {
      return await api.get<PaginatedResponse<Appointment>>('/appointments', { params });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Получение информации о конкретной записи
   */
  async getAppointment(id: number): Promise<Appointment> {
    try {
      return await api.get<Appointment>(`/appointments/${id}`);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Создание новой записи
   */
  async createAppointment(data: CreateAppointmentData): Promise<Appointment> {
    try {
      return await api.post<Appointment>('/appointments', data, {
        showSuccessToast: true,
        successMessage: "Запись успешно создана"
      });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Обновление информации о записи
   */
  async updateAppointment(id: number, data: UpdateAppointmentData): Promise<Appointment> {
    try {
      return await api.put<Appointment>(`/appointments/${id}`, data, {
        showSuccessToast: true,
        successMessage: "Запись успешно обновлена"
      });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Отмена записи
   */
  async cancelAppointment(id: number, reason?: string): Promise<Appointment> {
    try {
      return await api.post<Appointment>(`/appointments/${id}/cancel`, { reason }, {
        showSuccessToast: true,
        successMessage: "Запись успешно отменена"
      });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Получение доступных временных слотов для записи
   */
  async getAvailableTimeSlots(date: string, serviceIds: number[], staffId?: number): Promise<TimeSlot[]> {
    try {
      return await api.get<TimeSlot[]>('/appointments/available-slots', {
        params: {
          date,
          serviceIds: serviceIds.join(','),
          staffId
        }
      });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Завершение записи и оплата услуг
   */
  async completeAppointment(id: number, paymentData: { method: string, amount: number }): Promise<Appointment> {
    try {
      return await api.post<Appointment>(`/appointments/${id}/complete`, paymentData, {
        showSuccessToast: true,
        successMessage: "Запись завершена и оплачена"
      });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Получение записей на сегодня
   */
  async getTodayAppointments(): Promise<Appointment[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await api.get<PaginatedResponse<Appointment>>('/appointments', {
        params: {
          startDate: today,
          endDate: today,
          limit: 100
        }
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
};
