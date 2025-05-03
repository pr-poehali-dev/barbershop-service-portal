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
    rating?: number;
    specialization?: string[];
  };
  services: {
    id: number;
    name: string;
    duration: number;
    price: number;
    categoryId?: string;
  }[];
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  totalAmount: number;
  totalDuration: number;
  createdAt: string;
  updatedAt: string;
  isPaid: boolean;
  paymentMethod?: string;
  paymentDate?: string;
}

export interface StaffMember {
  id: number;
  name: string;
  position: string;
  avatar?: string;
  bio?: string;
  experience?: number;
  rating?: number;
  schedule?: {
    day: string;
    start: string;
    end: string;
  }[];
  specialization?: string[];
  serviceIds?: number[];
}

export interface ServiceItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  duration: number;
  categoryId: string;
  image?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  image?: string;
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
   * Получение записей клиента
   */
  async getClientAppointments(clientId: number, status?: string): Promise<Appointment[]> {
    try {
      return await api.get<Appointment[]>(`/clients/${clientId}/appointments`, {
        params: { status }
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
  },
  
  /**
   * Подтверждение записи администратором
   */
  async confirmAppointment(id: number): Promise<Appointment> {
    try {
      return await api.post<Appointment>(`/appointments/${id}/confirm`, {}, {
        showSuccessToast: true,
        successMessage: "Запись подтверждена"
      });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Оплата записи онлайн
   */
  async payAppointment(id: number, paymentMethod: string): Promise<Appointment> {
    try {
      return await api.post<Appointment>(`/appointments/${id}/pay`, { paymentMethod }, {
        showSuccessToast: true,
        successMessage: "Запись успешно оплачена"
      });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Получение списка мастеров
   */
  async getStaff(): Promise<StaffMember[]> {
    try {
      return await api.get<StaffMember[]>('/staff');
    } catch (error) {
      handleApiError(error);
      // Возвращаем мок-данные для тестирования
      return [
        {
          id: 1,
          name: "Анна Иванова",
          position: "Стилист-парикмахер",
          avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&h=200&auto=format&fit=crop",
          experience: 5,
          rating: 4.8,
          specialization: ["стрижки", "окрашивание"],
          serviceIds: [1, 2, 5, 6]
        },
        {
          id: 2,
          name: "Мария Петрова",
          position: "Колорист",
          avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=200&h=200&auto=format&fit=crop",
          experience: 7,
          rating: 4.9,
          specialization: ["окрашивание", "мелирование"],
          serviceIds: [5, 6, 7, 8]
        },
        {
          id: 3,
          name: "Александр Смирнов",
          position: "Мастер мужских стрижек",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&auto=format&fit=crop",
          experience: 4,
          rating: 4.7,
          specialization: ["мужские стрижки", "бритье"],
          serviceIds: [2]
        }
      ];
    }
  },
  
  /**
   * Получение списка услуг
   */
  async getServices(): Promise<ServiceItem[]> {
    try {
      return await api.get<ServiceItem[]>('/services');
    } catch (error) {
      handleApiError(error);
      // Возвращаем мок-данные для тестирования
      return [
        { id: 1, name: "Женская стрижка", price: 2500, duration: 60, categoryId: "haircut" },
        { id: 2, name: "Мужская стрижка", price: 1800, duration: 45, categoryId: "haircut" },
        { id: 3, name: "Детская стрижка", price: 1200, duration: 30, categoryId: "haircut" },
        { id: 4, name: "Стрижка челки", price: 800, duration: 15, categoryId: "haircut" },
        { id: 5, name: "Однотонное окрашивание", price: 3500, duration: 120, categoryId: "coloring" },
        { id: 6, name: "Мелирование", price: 4500, duration: 150, categoryId: "coloring" },
        { id: 7, name: "Балаяж", price: 6000, duration: 180, categoryId: "coloring" },
        { id: 8, name: "Омбре", price: 6500, duration: 180, categoryId: "coloring" },
        { id: 9, name: "Повседневная укладка", price: 1500, duration: 40, categoryId: "styling" },
        { id: 10, name: "Праздничная прическа", price: 3000, duration: 90, categoryId: "styling" },
        { id: 11, name: "Свадебная прическа", price: 5000, duration: 120, categoryId: "styling" },
        { id: 12, name: "Плетение кос", price: 2000, duration: 60, categoryId: "styling" },
        { id: 13, name: "Спа-уход для волос", price: 2500, duration: 60, categoryId: "treatments" },
        { id: 14, name: "Восстанавливающая маска", price: 1800, duration: 45, categoryId: "treatments" },
        { id: 15, name: "Кератиновое выпрямление", price: 7000, duration: 180, categoryId: "treatments" },
        { id: 16, name: "Ботокс для волос", price: 4500, duration: 90, categoryId: "treatments" }
      ];
    }
  },
  
  /**
   * Получение категорий услуг
   */
  async getServiceCategories(): Promise<ServiceCategory[]> {
    try {
      return await api.get<ServiceCategory[]>('/service-categories');
    } catch (error) {
      handleApiError(error);
      // Возвращаем мок-данные для тестирования
      return [
        { id: "haircut", name: "Стрижки", image: "https://images.unsplash.com/photo-1560869713-da86bd4362da?q=80&w=200&auto=format&fit=crop" },
        { id: "coloring", name: "Окрашивание", image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=200&auto=format&fit=crop" },
        { id: "styling", name: "Укладки", image: "https://images.unsplash.com/photo-1522337094846-8a812e3colliding?q=80&w=200&auto=format&fit=crop" },
        { id: "treatments", name: "Уходовые процедуры", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=200&auto=format&fit=crop" }
      ];
    }
  },
  
  /**
   * Получение информации о загруженности мастеров
   */
  async getStaffAvailability(date: string): Promise<{staffId: number, availableSlots: number}[]> {
    try {
      return await api.get<{staffId: number, availableSlots: number}[]>('/staff/availability', {
        params: { date }
      });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Получение информации о популярных временных слотах
   */
  async getPopularTimeSlots(): Promise<{time: string, popularity: number}[]> {
    try {
      return await api.get<{time: string, popularity: number}[]>('/appointments/popular-slots');
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
};

// Вспомогательные функции для форматирования данных
export const getStatusText = (status: string): string => {
  switch (status) {
    case 'pending': return 'Ожидает подтверждения';
    case 'confirmed': return 'Подтверждена';
    case 'completed': return 'Завершена';
    case 'cancelled': return 'Отменена';
    case 'no-show': return 'Неявка';
    default: return status;
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'confirmed': return 'bg-blue-100 text-blue-800';
    case 'completed': return 'bg-green-100 text-green-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    case 'no-show': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Форматирование времени для отображения
export const formatDisplayTime = (time: string): string => {
  if (!time) return '';
  return time.substring(0, 5);
};

// Рассчет окончания времени услуги на основе начального времени и продолжительности
export const calculateEndTime = (startTime: string, durationMinutes: number): string => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const newHours = Math.floor(totalMinutes / 60);
  const newMinutes = totalMinutes % 60;
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
};
