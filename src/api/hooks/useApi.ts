import { useState, useEffect, useCallback, useRef } from 'react';
import type { ApiResponse } from '../types';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiResult<T> extends UseApiState<T> {
  refetch: () => Promise<void>;
  setData: (data: T) => void;
}

/**
 * Hook genérico para consumir la API central
 * Maneja estados de carga, error y datos automáticamente
 */
export function useApi<T>(
  fetcher: () => Promise<ApiResponse<T>>,
  deps: unknown[] = []
): UseApiResult<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetcherRef.current();
      setState({ data: response.data, loading: false, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setState(prev => ({ ...prev, loading: false, error: message }));
    }
  }, deps);

  useEffect(() => {
    execute();
  }, [execute]);

  return {
    ...state,
    refetch: execute,
    setData: (data: T) => setState(prev => ({ ...prev, data })),
  };
}

/**
 * Hook para mutaciones (POST, PUT, DELETE)
 */
export function useMutation<T, R = T>() {
  const [state, setState] = useState<UseApiState<R>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(
    async (mutator: () => Promise<ApiResponse<R>>): Promise<R | null> => {
      setState({ data: null, loading: true, error: null });
      try {
        const response = await mutator();
        setState({ data: response.data, loading: false, error: null });
        return response.data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error desconocido';
        setState(prev => ({ ...prev, loading: false, error: message }));
        return null;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, mutate, reset };
}
