import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import { ApiResponse, QuickResponse } from '@/types/support';

export function useQuickResponses() {
  const [quickResponses, setQuickResponses] = useState<QuickResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuickResponses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<ApiResponse<QuickResponse[]>>('/api/v1/quick-responses');
      if (response.data.success) {
        setQuickResponses(response.data.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch quick responses:', err);
      setError(err.response?.data?.detail || 'Failed to fetch quick responses');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuickResponses();
  }, [fetchQuickResponses]);

  const addQuickResponse = async (title: string, content: string): Promise<boolean> => {
    try {
      const response = await apiClient.post<ApiResponse<QuickResponse>>('/api/v1/quick-responses', {
        title,
        content,
      });
      if (response.data.success) {
        await fetchQuickResponses();
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Failed to create quick response:', err);
      return false;
    }
  };

  const deleteQuickResponse = async (id: number): Promise<boolean> => {
    try {
      const response = await apiClient.delete<ApiResponse<{ id: number }>>(`/api/v1/quick-responses/${id}`);
      if (response.data.success) {
        setQuickResponses((prev) => prev.filter((item) => item.id !== id));
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Failed to delete quick response:', err);
      return false;
    }
  };

  return {
    quickResponses,
    isLoading,
    error,
    fetchQuickResponses,
    addQuickResponse,
    deleteQuickResponse,
  };
}
