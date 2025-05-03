import { api, handleApiError } from "@/lib/api";

/**
 * Типы данных для аутентификации
 */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface SetNewPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    avatar?: string;
  };
  token: string;
  refreshToken: string;
  expiresAt: string;
}

/**
 * Сервис для аутентификации пользователей
 */
export const authService = {
  /**
   * Вход в систему
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials, {
        showSuccessToast: true,
        successMessage: "Вход выполнен успешно"
      });
      
      // Сохраняем токен в localStorage
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      // Если пользователь выбрал "Запомнить меня", сохраняем больше данных
      if (credentials.rememberMe) {
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('expiresAt', response.expiresAt);
      }
      
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Регистрация нового пользователя
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data, {
        showSuccessToast: true,
        successMessage: "Регистрация выполнена успешно"
      });
      
      // Сохраняем токен в localStorage
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('expiresAt', response.expiresAt);
      
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Выход из системы
   */
  async logout(): Promise<void> {
    try {
      // Отправляем запрос для инвалидации токена на сервере
      await api.post('/auth/logout', {}, {
        showSuccessToast: true,
        successMessage: "Выход выполнен успешно"
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Даже если запрос не удался, очищаем локальное хранилище
    } finally {
      // Очищаем локальное хранилище
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('expiresAt');
    }
  },
  
  /**
   * Запрос на сброс пароля
   */
  async requestPasswordReset(data: ResetPasswordData): Promise<void> {
    try {
      await api.post('/auth/forgot-password', data, {
        showSuccessToast: true,
        successMessage: "Инструкции по сбросу пароля отправлены на указанный email"
      });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Установка нового пароля после сброса
   */
  async setNewPassword(data: SetNewPasswordData): Promise<void> {
    try {
      await api.post('/auth/reset-password', data, {
        showSuccessToast: true,
        successMessage: "Пароль успешно изменен"
      });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Обновление токена
   */
  async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        throw new Error('Refresh token not found');
      }
      
      const response = await api.post<AuthResponse>('/auth/refresh-token', { refreshToken });
      
      // Обновляем токены в localStorage
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('expiresAt', response.expiresAt);
      
      return response;
    } catch (error) {
      handleApiError(error, false);
      // Если обновление токена не удалось, выходим из системы
      this.logout();
      throw error;
    }
  },
  
  /**
   * Проверка аутентификации пользователя
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    const expiresAt = localStorage.getItem('expiresAt');
    
    if (!token) return false;
    
    // Если есть срок действия токена, проверяем его
    if (expiresAt) {
      const expirationDate = new Date(expiresAt);
      return expirationDate > new Date();
    }
    
    // Если нет срока действия, просто проверяем наличие токена
    return !!token;
  },
  
  /**
   * Получение данных пользователя
   */
  getCurrentUser() {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }
};
