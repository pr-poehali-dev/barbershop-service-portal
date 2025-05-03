import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, LoginCredentials, RegisterData, ResetPasswordData, SetNewPasswordData } from '@/services/authService';
import { useToast } from '@/components/ui/use-toast';

// Тип данных пользователя
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string;
}

// Контекст для аутентификации
interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (data: ResetPasswordData) => Promise<void>;
  setNewPassword: (data: SetNewPasswordData) => Promise<void>;
}

// Создаем контекст с начальными значениями
const AuthContext = createContext<AuthContextProps>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  requestPasswordReset: async () => {},
  setNewPassword: async () => {}
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Проверяем аутентификацию при загрузке приложения
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      
      try {
        // Проверяем, аутентифицирован ли пользователь
        const isAuth = authService.isAuthenticated();
        
        if (isAuth) {
          // Получаем данные пользователя из локального хранилища
          const userData = authService.getCurrentUser();
          
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // Если токен есть, но данных пользователя нет, пытаемся обновить токен
            try {
              const response = await authService.refreshToken();
              setUser(response.user);
              setIsAuthenticated(true);
            } catch (error) {
              // Если обновление токена не удалось, выходим из системы
              setUser(null);
              setIsAuthenticated(false);
            }
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Authentication check error:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Функция для входа в систему
  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
      
      // Перенаправляем пользователя на главную страницу или панель управления
      if (response.user.role === 'admin' || response.user.role === 'manager') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для регистрации
  const register = async (data: RegisterData) => {
    setIsLoading(true);
    
    try {
      const response = await authService.register(data);
      setUser(response.user);
      setIsAuthenticated(true);
      
      // Перенаправляем пользователя на главную страницу
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для выхода из системы
  const logout = async () => {
    setIsLoading(true);
    
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      
      // Перенаправляем пользователя на страницу входа
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      
      // Даже если запрос не удался, очищаем локальное хранилище
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для запроса сброса пароля
  const requestPasswordReset = async (data: ResetPasswordData) => {
    setIsLoading(true);
    
    try {
      await authService.requestPasswordReset(data);
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для установки нового пароля
  const setNewPassword = async (data: SetNewPasswordData) => {
    setIsLoading(true);
    
    try {
      await authService.setNewPassword(data);
      
      // Перенаправляем пользователя на страницу входа
      toast({
        title: "Пароль успешно изменен",
        description: "Теперь вы можете войти с новым паролем",
        duration: 5000
      });
      
      navigate('/login');
    } catch (error) {
      console.error('Set new password error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Предоставляем контекст для дочерних компонентов
  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    requestPasswordReset,
    setNewPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Хук для использования AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
