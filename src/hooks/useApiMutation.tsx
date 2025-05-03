import { useState, useCallback } from 'react';
import { ApiError } from '@/lib/api';

interface UseApiMutationProps<T, P> {
  mutationFn: (params: P) => Promise<T>;
  onSuccess?: (data: T, params: P) => void;
  onError?: (error: ApiError, params: P) => void;
}

interface UseApiMutationResult<T, P> {
  data: T | null;
  isLoading: boolean;
  error: ApiError | null;
  mutate: (params: P) => Promise<T | null>;
  reset: () => void;
}

/**
 * Хук для удобного выполнения мутаций (POST, PUT, DELETE) к API
 */
export function useApiMutation<T, P>({
  mutationFn,
  onSuccess,
  onError
}: UseApiMutationProps<T, P>): UseApiMutationResult<T, P> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const mutate = useCallback(
    async (params: P): Promise<T | null> => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await mutationFn(params);
        setData(result);
        
        if (onSuccess) {
          onSuccess(result, params);
        }
        
        return result;
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError);
        
        if (onError) {
          onError(apiError, params);
        }
        
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [mutationFn, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { data, isLoading, error, mutate, reset };
}
