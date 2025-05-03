import { toast } from "@/components/ui/use-toast";

/**
 * Базовый URL API
 * В реальном проекте должен быть настроен на основе окружения
 */
export const API_BASE_URL = 'https://api.example.com/v1';

/**
 * Типы ошибок API
 */
export type ApiError = {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
};

/**
 * Опции для запросов API
 */
export interface ApiRequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  successMessage?: string;
}

/**
 * Форматирует URL с учетом параметров запроса
 */
const formatUrl = (path: string, params?: Record<string, string | number | boolean | undefined>): string => {
  let url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  
  if (params) {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    });
    
    const queryString = queryParams.toString();
    if (queryString) {
      url += `${url.includes('?') ? '&' : '?'}${queryString}`;
    }
  }
  
  return url;
};

/**
 * Обрабатывает ответ от сервера
 */
const handleResponse = async <T>(response: Response): Promise<T> => {
  // Если есть тело ответа, парсим его как JSON
  const contentType = response.headers.get('content-type');
  let data: any = null;
  
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    // Для не-JSON ответов (например, blob, текст)
    const text = await response.text();
    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      data = text || {};
    }
  }
  
  // Если ответ не успешен, выбрасываем ошибку
  if (!response.ok) {
    const error: ApiError = {
      status: response.status,
      message: data?.message || response.statusText,
      errors: data?.errors
    };
    
    throw error;
  }
  
  return data as T;
};

/**
 * Обработчик ошибок API запросов
 */
export const handleApiError = (error: unknown, showToast = true): ApiError => {
  let apiError: ApiError;
  
  if (error instanceof Error) {
    console.error('API Error:', error);
    
    if ('status' in error && typeof (error as any).status === 'number') {
      apiError = error as unknown as ApiError;
    } else {
      apiError = {
        status: 500,
        message: error.message || 'Произошла непредвиденная ошибка'
      };
    }
  } else {
    console.error('Unknown API Error:', error);
    
    apiError = {
      status: 500,
      message: 'Произошла непредвиденная ошибка'
    };
  }
  
  if (showToast) {
    toast({
      title: "Ошибка",
      description: apiError.message,
      variant: "destructive"
    });
  }
  
  return apiError;
};

/**
 * Основная функция для выполнения API запросов
 */
export const apiRequest = async <T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> => {
  const {
    params,
    showErrorToast = true,
    showSuccessToast = false,
    successMessage,
    ...requestOptions
  } = options;
  
  try {
    // Получаем текущий токен авторизации
    const token = localStorage.getItem('authToken');
    
    // Настраиваем заголовки запроса
    const headers = new Headers(requestOptions.headers);
    
    if (!headers.has('Content-Type') && !(requestOptions.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    // Выполняем запрос
    const response = await fetch(formatUrl(path, params), {
      ...requestOptions,
      headers
    });
    
    // Обрабатываем ответ
    const data = await handleResponse<T>(response);
    
    // Показываем сообщение об успехе, если нужно
    if (showSuccessToast) {
      toast({
        title: "Успешно",
        description: successMessage || "Операция выполнена успешно",
        variant: "default"
      });
    }
    
    return data;
  } catch (error) {
    // Обрабатываем ошибки
    handleApiError(error, showErrorToast);
    throw error;
  }
};

/**
 * Хелперы для основных типов запросов
 */
export const api = {
  get: <T>(path: string, options?: ApiRequestOptions) => 
    apiRequest<T>(path, { method: 'GET', ...options }),
  
  post: <T>(path: string, data?: any, options?: ApiRequestOptions) => 
    apiRequest<T>(path, { 
      method: 'POST', 
      body: data ? JSON.stringify(data) : undefined,
      ...options 
    }),
  
  put: <T>(path: string, data?: any, options?: ApiRequestOptions) => 
    apiRequest<T>(path, { 
      method: 'PUT', 
      body: data ? JSON.stringify(data) : undefined,
      ...options 
    }),
  
  patch: <T>(path: string, data?: any, options?: ApiRequestOptions) => 
    apiRequest<T>(path, { 
      method: 'PATCH', 
      body: data ? JSON.stringify(data) : undefined,
      ...options 
    }),
  
  delete: <T>(path: string, options?: ApiRequestOptions) => 
    apiRequest<T>(path, { method: 'DELETE', ...options }),
  
  upload: <T>(path: string, formData: FormData, options?: ApiRequestOptions) => 
    apiRequest<T>(path, { 
      method: 'POST', 
      body: formData,
      ...options 
    })
};
