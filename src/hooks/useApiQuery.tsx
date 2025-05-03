import { useState, useEffect, useCallback } from 'react';
import { ApiError } from '@/lib/api';

interface UseApiQueryProps<T, P = {}> {
  queryFn: (params?: P) => Promise<T>;
  params?: P;
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
}

interface UseApiQueryResult<T> {
  data: T | null;
  isLoading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
}

/**
 * Хук для удобного выполнения GET запросов к API
 */
export function useApiQuery<T, P = {}>({
  queryFn,
  params,
  enabled = true,
  onSuccess,
  onError
}: UseApiQueryProps<T, P>): UseApiQueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await queryFn(params);
      setData(result);
      
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      
      if (onError) {
        onError(apiError);
      }
    } finally {
      setIsLoading(false);
    }
  }, [queryFn, params, onSuccess, onError]);

  // Выполняем запрос при монтировании компонента и при изменении зависимостей
  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled, fetchData]);

  // Функция для повторного выполнения запроса
  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch };
}
