import { api, handleApiError } from "@/lib/api";
import { jwtDecode } from "jwt-decode";

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
  phone?: string;
  acceptTerms?: boolean;
}

export interface ResetPasswordData {
  email: string;
}

export interface SetNewPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailData {
  token: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  avatar?: File;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  avatar?: string;
  emailVerified?: boolean;
  birthDate?: string;
  lastLogin?: string;
  createdAt?: string;
}

export interface JwtPayload {
  sub: string; // subject (user id)
  exp: number; // expiration time
  iat: number; // issued at
  role: string; // user role
  email: string;
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
    const refreshToken = localStorage.getItem('refreshToken');
    
    try {
      if (refreshToken) {
        // Отправляем запрос для инвалидации токена на сервере
        await api.post('/auth/logout', { refreshToken }, {
          showSuccessToast: true,
          successMessage: "Выход выполнен успешно"
        });
      }
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
   * Подтверждение email
   */
  async verifyEmail(data: VerifyEmailData): Promise<void> {
    try {
      await api.post('/auth/verify-email', data, {
        showSuccessToast: true,
        successMessage: "Email успешно подтвержден"
      });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Обновление профиля пользователя
   */
  async updateProfile(data: UpdateProfileData): Promise<User> {
    try {
      let url = '/users/profile';
      let method = 'patch';
      let body: any = data;
      
      // Если есть файл аватара, используем FormData
      if (data.avatar) {
        const formData = new FormData();
        
        // Добавляем все текстовые поля
        Object.entries(data).forEach(([key, value]) => {
          if (key !== 'avatar' && value !== undefined) {
            formData.append(key, String(value));
          }
        });
        
        // Добавляем файл аватара
        formData.append('avatar', data.avatar);
        
        // Обновляем параметры запроса
        body = formData;
      }
      
      const response = await api[method]<User>(url, body, {
        showSuccessToast: true,
        successMessage: "Профиль успешно обновлен"
      });
      
      // Обновляем данные пользователя в локальном хранилище
      const userJson = localStorage.getItem('user');
      if (userJson) {
        const currentUser = JSON.parse(userJson);
        const updatedUser = { ...currentUser, ...response };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Изменение пароля пользователя
   */
  async changePassword(data: ChangePasswordData): Promise<void> {
    try {
      await api.post('/users/change-password', data, {
        showSuccessToast: true,
        successMessage: "Пароль успешно изменен"
      });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Отправка повторного письма для подтверждения email
   */
  async resendVerificationEmail(): Promise<void> {
    try {
      await api.post('/auth/resend-verification-email', {}, {
        showSuccessToast: true,
        successMessage: "Письмо с подтверждением отправлено"
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
      
      const response = await api.post<AuthResponse>('/auth/refresh-token', { refreshToken }, {
        showErrorToast: false
      });
      
      // Обновляем токены в localStorage
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('expiresAt', response.expiresAt);
      
      // Также обновляем данные пользователя
      localStorage.setItem('user', JSON.stringify(response.user));
      
      return response;
    } catch (error) {
      // При ошибке обновления токена, очищаем хранилище
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('expiresAt');
      
      handleApiError(error, false);
      throw error;
    }
  },
  
  /**
   * Проверка аутентификации пользователя
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    
    if (!token) return false;
    
    try {
      // Декодируем JWT-токен для проверки срока действия
      const decodedToken = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000;
      
      // Проверяем, не истек ли срок действия токена
      if (decodedToken.exp < currentTime) {
        // Если токен истек, пытаемся обновить его автоматически
        if (localStorage.getItem('refreshToken')) {
          // Вернем true, но асинхронно попытаемся обновить токен
          setTimeout(() => this.refreshToken().catch(() => {}), 0);
          return true;
        }
        return false;
      }
      
      return true;
    } catch (e) {
      return false;
    }
  },
  
  /**
   * Получение данных пользователя
   */
  getCurrentUser(): User | null {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      return JSON.parse(userJson);
    }
    
    // Если данных пользователя нет, но есть токен, декодируем токен
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        // Извлекаем минимальную информацию из токена
        return {
          id: parseInt(decodedToken.sub),
          email: decodedToken.email,
          role: decodedToken.role,
          firstName: '',
          lastName: ''
        };
      } catch (e) {
        return null;
      }
    }
    
    return null;
  },
  
  /**
   * Проверка роли пользователя
   */
  hasRole(role: string | string[]): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    
    return user.role === role;
  },
  
  /**
   * Получение полных данных пользователя с сервера
   */
  async getFullUserProfile(): Promise<User> {
    try {
      const response = await api.get<User>('/users/profile');
      
      // Обновляем данные пользователя в локальном хранилище
      localStorage.setItem('user', JSON.stringify(response));
      
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Инициализация пользователя при загрузке приложения
   */
  async initializeAuth(): Promise<User | null> {
    if (!this.isAuthenticated()) return null;
    
    try {
      return await this.getFullUserProfile();
    } catch (error) {
      // Если не удалось получить профиль, пытаемся обновить токен
      try {
        const response = await this.refreshToken();
        return response.user;
      } catch (refreshError) {
        // Если не удалось обновить токен, выходим из системы
        this.logout();
        return null;
      }
    }
  }
};
