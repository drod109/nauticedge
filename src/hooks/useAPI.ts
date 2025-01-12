import { useState, useCallback } from 'react';
import { api, APIResponse } from '../lib/api';

interface UseAPIOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useAPI<T>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(
    async <R>(
      apiCall: () => Promise<APIResponse<R>>,
      options?: UseAPIOptions<R>
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiCall();

        if (response.error) {
          throw new Error(response.error.message);
        }

        if (response.data) {
          setData(response.data as unknown as T);
          options?.onSuccess?.(response.data);
        }

        return response.data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('An error occurred');
        setError(error);
        options?.onError?.(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    data,
    execute,
  };
}

// Specialized hooks for common operations
export function useSurveys() {
  const { loading, error, data, execute } = useAPI();

  const fetchSurveys = useCallback(
    (options?: UseAPIOptions<any>) => {
      return execute(() => api.getSurveys(), options);
    },
    [execute]
  );

  return {
    loading,
    error,
    surveys: data,
    fetchSurveys,
  };
}

export function useAIAnalysis() {
  const { loading, error, data, execute } = useAPI();

  const analyze = useCallback(
    (
      surveyId: string,
      content: string,
      analysisType: 'risk' | 'recommendations' | 'compliance',
      options?: UseAPIOptions<any>
    ) => {
      return execute(
        () => api.analyzeSurvey({ surveyId, content, analysisType }),
        options
      );
    },
    [execute]
  );

  return {
    loading,
    error,
    analysis: data,
    analyze,
  };
}